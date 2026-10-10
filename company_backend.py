#!/usr/bin/env python3
"""IGERS POWERCORE optional secure company/telemetry API (Python stdlib only).

Run with `python company_backend.py`. Configure secrets via environment variables;
never commit credentials to the GitHub Pages repository.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import math
import os
import re
import sqlite3
import threading
import time
from contextlib import contextmanager
from datetime import datetime, timezone, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

SERVICE_NAME = "IGERS POWERCORE Company API"
ALLOWED_KINDS = {
    "projects", "assets", "sites", "commissioning", "procurement",
    "workOrders", "incidents", "revisions", "teamTasks", "clients", "economics", "safetyChecks",
}
MAX_BODY_BYTES = 128 * 1024
TOKEN_TTL_SECONDS = 8 * 60 * 60
LOGIN_LOCK = threading.Lock()
LOGIN_ATTEMPTS: dict[str, list[float]] = {}

MEASUREMENT_LIMITS = {
    "voltage_v": (0, 1_000_000),
    "current_a": (-1_000_000, 1_000_000),
    "power_w": (-1_000_000_000, 1_000_000_000),
    "energy_wh_total": (0, 1e15),
    "temperature_c": (-100, 2000),
    "state_of_charge_pct": (0, 100),
    "flow_m3_s": (0, 1e7),
    "head_m": (0, 100_000),
    "irradiance_w_m2": (0, 3000),
    "wind_m_s": (0, 150),
    "vibration_mm_s": (0, 100_000),
    "frequency_hz": (0, 100_000),
}


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def iso_now() -> str:
    return utc_now().isoformat(timespec="seconds").replace("+00:00", "Z")


def db_path() -> Path:
    return Path(os.getenv("IGERS_DB_PATH", "./data/igers-company.sqlite3")).expanduser()


def connect_db() -> sqlite3.Connection:
    path = db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path), timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA busy_timeout=10000")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


@contextmanager
def db_session():
    """Commit or rollback each SQLite unit of work and always close the connection."""
    conn = connect_db()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    with db_session() as conn:
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("""CREATE TABLE IF NOT EXISTS company_records (
            kind TEXT NOT NULL,
            record_id TEXT NOT NULL,
            data_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            updated_by TEXT NOT NULL,
            PRIMARY KEY (kind, record_id)
        )""")
        conn.execute("""CREATE TABLE IF NOT EXISTS device_telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT NOT NULL,
            observed_at TEXT NOT NULL,
            received_at TEXT NOT NULL,
            measurements_json TEXT NOT NULL,
            source TEXT NOT NULL,
            calibration_id TEXT,
            quality_status TEXT NOT NULL
        )""")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_telemetry_time ON device_telemetry(observed_at DESC)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_telemetry_device_time ON device_telemetry(device_id, observed_at DESC)")


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def create_token(username: str) -> tuple[str, int]:
    secret = os.getenv("IGERS_AUTH_SECRET", "")
    if len(secret) < 32:
        raise RuntimeError("IGERS_AUTH_SECRET must be configured with at least 32 characters.")
    expires = int(time.time()) + TOKEN_TTL_SECONDS
    payload = {"sub": username, "role": "admin", "exp": expires, "iat": int(time.time()), "iss": "igers-company-api"}
    body = b64url(json.dumps(payload, separators=(",", ":"), allow_nan=False).encode())
    signature = b64url(hmac.new(secret.encode(), body.encode(), hashlib.sha256).digest())
    return f"{body}.{signature}", expires


def verify_token(token: str) -> str | None:
    secret = os.getenv("IGERS_AUTH_SECRET", "")
    if len(secret) < 32 or not token or len(token) > 4096:
        return None
    try:
        body, signature = token.split(".", 1)
        expected = b64url(hmac.new(secret.encode(), body.encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(signature, expected):
            return None
        raw = base64.urlsafe_b64decode(body + "=" * (-len(body) % 4))
        payload = json.loads(raw)
        if payload.get("iss") != "igers-company-api" or payload.get("role") != "admin":
            return None
        if int(payload.get("exp", 0)) <= int(time.time()):
            return None
        username = str(payload.get("sub", ""))
        return username if username else None
    except (ValueError, TypeError, json.JSONDecodeError, base64.binascii.Error):
        return None


def parse_datetime(value: object) -> datetime | None:
    if not isinstance(value, str) or len(value) > 80:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            return None
        return parsed.astimezone(timezone.utc)
    except ValueError:
        return None


def origin_allowlist() -> set[str]:
    return {value.strip().rstrip("/") for value in os.getenv("IGERS_ALLOWED_ORIGINS", "").split(",") if value.strip()}


def health_payload() -> dict:
    path = db_path()
    storage_mode = os.getenv("IGERS_STORAGE_MODE", "local-disk")
    return {
        "status": "ok",
        "service": SERVICE_NAME,
        "time": iso_now(),
        "authenticationConfigured": bool(os.getenv("IGERS_ADMIN_USERNAME") and os.getenv("IGERS_ADMIN_PASSWORD") and len(os.getenv("IGERS_AUTH_SECRET", "")) >= 32),
        "deviceIngestConfigured": bool(os.getenv("IGERS_DEVICE_TOKEN")),
        "storageMode": storage_mode,
        "persistentPathConfigured": str(path).startswith("/var/data/"),
        "measurements": "device-reported; sensor calibration is not independently verified",
    }


class CompanyAPIHandler(BaseHTTPRequestHandler):
    server_version = "IGERSCompanyAPI/1.0"
    sys_version = ""

    def log_message(self, fmt: str, *args) -> None:
        # Do not log request bodies, tokens, passwords or query values.
        print(f"{self.address_string()} - {fmt % args}")

    def _cors_headers(self) -> dict[str, str]:
        headers = {"Vary": "Origin", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer"}
        origin = self.headers.get("Origin", "").rstrip("/")
        if origin and origin in origin_allowlist():
            headers["Access-Control-Allow-Origin"] = origin
            headers["Access-Control-Allow-Credentials"] = "false"
            headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept"
            headers["Access-Control-Allow-Methods"] = "GET, POST, DELETE, OPTIONS"
            headers["Access-Control-Max-Age"] = "600"
        return headers

    def _send(self, status: int, payload: dict | list, extra_headers: dict | None = None) -> None:
        body = json.dumps(payload, ensure_ascii=False, allow_nan=False, separators=(",", ":")).encode("utf-8")
        headers = self._cors_headers()
        if extra_headers:
            headers.update(extra_headers)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        for key, value in headers.items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(body)

    def _error(self, status: int, message: str) -> None:
        self._send(status, {"error": message, "time": iso_now()})

    def _read_json(self) -> dict:
        content_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
        if content_type != "application/json":
            raise ValueError("Content-Type must be application/json.")
        length_text = self.headers.get("Content-Length", "0")
        try:
            length = int(length_text)
        except ValueError as exc:
            raise ValueError("Invalid Content-Length.") from exc
        if length < 1 or length > MAX_BODY_BYTES:
            raise ValueError(f"Request body must be between 1 and {MAX_BODY_BYTES} bytes.")
        raw = self.rfile.read(length)
        try:
            data = json.loads(raw.decode("utf-8"), parse_constant=lambda value: (_ for _ in ()).throw(ValueError(f"Invalid numeric constant: {value}")))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise ValueError("Request body is not valid JSON.") from exc
        if not isinstance(data, dict):
            raise ValueError("JSON body must be an object.")
        return data

    def _bearer(self) -> str:
        value = self.headers.get("Authorization", "")
        if not value.startswith("Bearer "):
            return ""
        return value[7:].strip()

    def _admin(self) -> str | None:
        return verify_token(self._bearer())

    def _device_authenticated(self) -> bool:
        expected = os.getenv("IGERS_DEVICE_TOKEN", "")
        supplied = self._bearer()
        return bool(expected and supplied and hmac.compare_digest(expected, supplied))

    def _origin_allowed(self) -> bool:
        origin = self.headers.get("Origin", "").rstrip("/")
        return not origin or origin in origin_allowlist()

    def do_OPTIONS(self) -> None:
        if not self._origin_allowed():
            self._error(403, "Origin is not allowed by IGERS_ALLOWED_ORIGINS.")
            return
        self.send_response(204)
        for key, value in self._cors_headers().items():
            self.send_header(key, value)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:
        if not self._origin_allowed():
            self._error(403, "Origin is not allowed by IGERS_ALLOWED_ORIGINS.")
            return
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            self._send(200, health_payload())
            return
        if parsed.path == "/api/v1/records":
            username = self._admin()
            if not username:
                self._error(401, "Authenticated administrator session required.")
                return
            query = parse_qs(parsed.query)
            kind = query.get("kind", [""])[0]
            if kind not in ALLOWED_KINDS:
                self._error(400, "Unknown record kind.")
                return
            try:
                limit = max(1, min(500, int(query.get("limit", ["200"])[0])))
            except ValueError:
                limit = 200
            with db_session() as conn:
                rows = conn.execute("SELECT data_json, updated_at FROM company_records WHERE kind=? ORDER BY updated_at DESC LIMIT ?", (kind, limit)).fetchall()
            items = []
            for row in rows:
                try:
                    item = json.loads(row["data_json"])
                    if isinstance(item, dict):
                        items.append(item)
                except json.JSONDecodeError:
                    continue
            self._send(200, {"kind": kind, "count": len(items), "items": items, "retrieved_at": iso_now()})
            return
        if parsed.path == "/api/v1/telemetry":
            username = self._admin()
            if not username:
                self._error(401, "Authenticated administrator session required.")
                return
            query = parse_qs(parsed.query)
            device_id = query.get("device_id", [""])[0][:100]
            try:
                limit = max(1, min(500, int(query.get("limit", ["100"])[0])))
            except ValueError:
                limit = 100
            with db_session() as conn:
                if device_id:
                    rows = conn.execute("SELECT * FROM device_telemetry WHERE device_id=? ORDER BY observed_at DESC LIMIT ?", (device_id, limit)).fetchall()
                else:
                    rows = conn.execute("SELECT * FROM device_telemetry ORDER BY observed_at DESC LIMIT ?", (limit,)).fetchall()
            items = [{
                "id": row["id"], "device_id": row["device_id"], "observed_at": row["observed_at"],
                "received_at": row["received_at"], "measurements": json.loads(row["measurements_json"]),
                "source": row["source"], "calibration_id": row["calibration_id"], "quality_status": row["quality_status"],
            } for row in rows]
            self._send(200, {"count": len(items), "items": items, "retrieved_at": iso_now()})
            return
        self._error(404, "Route not found.")

    def do_POST(self) -> None:
        if not self._origin_allowed():
            self._error(403, "Origin is not allowed by IGERS_ALLOWED_ORIGINS.")
            return
        parsed = urlparse(self.path)
        try:
            data = self._read_json()
        except ValueError as exc:
            self._error(400, str(exc))
            return
        if parsed.path == "/api/v1/auth/session":
            self._handle_login(data)
        elif parsed.path == "/api/v1/records":
            self._handle_record_upsert(data)
        elif parsed.path == "/api/v1/telemetry":
            self._handle_telemetry(data)
        else:
            self._error(404, "Route not found.")

    def _handle_login(self, data: dict) -> None:
        username = os.getenv("IGERS_ADMIN_USERNAME", "")
        password = os.getenv("IGERS_ADMIN_PASSWORD", "")
        secret = os.getenv("IGERS_AUTH_SECRET", "")
        if not username or not password or len(secret) < 32:
            self._error(503, "Admin authentication is not configured on the backend.")
            return
        ip = self.client_address[0]
        moment = time.time()
        with LOGIN_LOCK:
            attempts = [stamp for stamp in LOGIN_ATTEMPTS.get(ip, []) if moment - stamp < 600]
            if len(attempts) >= 10:
                LOGIN_ATTEMPTS[ip] = attempts
                self._error(429, "Too many sign-in attempts. Try again later.")
                return
            if not (hmac.compare_digest(str(data.get("username", "")), username) and hmac.compare_digest(str(data.get("password", "")), password)):
                attempts.append(moment)
                LOGIN_ATTEMPTS[ip] = attempts
                self._error(401, "Invalid administrator credentials.")
                return
            LOGIN_ATTEMPTS.pop(ip, None)
        try:
            token, expires = create_token(username)
        except RuntimeError as exc:
            self._error(503, str(exc))
            return
        self._send(200, {"token": token, "token_type": "Bearer", "expires_at_ms": expires * 1000, "expires_at": datetime.fromtimestamp(expires, timezone.utc).isoformat(), "role": "admin"})

    def _handle_record_upsert(self, data: dict) -> None:
        username = self._admin()
        if not username:
            self._error(401, "Authenticated administrator session required.")
            return
        kind = data.get("kind")
        record = data.get("record")
        if kind not in ALLOWED_KINDS or not isinstance(record, dict):
            self._error(400, "A supported kind and record object are required.")
            return
        record_id = record.get("id")
        if not isinstance(record_id, str) or not re.fullmatch(r"[A-Za-z0-9._:-]{1,128}", record_id):
            self._error(400, "Record id must be 1–128 safe characters.")
            return
        try:
            encoded = json.dumps(record, ensure_ascii=False, allow_nan=False, separators=(",", ":"))
        except (TypeError, ValueError):
            self._error(400, "Record contains unsupported values.")
            return
        if len(encoded.encode("utf-8")) > 48 * 1024:
            self._error(413, "Individual record exceeds 48 KB.")
            return
        now = iso_now()
        created_at = str(record.get("createdAt") or now)[:80]
        updated_at = str(record.get("updatedAt") or now)[:80]
        # Only accept a parseable, bounded ISO time for ordering; default to server time otherwise.
        if parse_datetime(updated_at) is None:
            updated_at = now
            record["updatedAt"] = now
            encoded = json.dumps(record, ensure_ascii=False, allow_nan=False, separators=(",", ":"))
        with db_session() as conn:
            conn.execute("""INSERT INTO company_records(kind, record_id, data_json, created_at, updated_at, updated_by)
                VALUES(?,?,?,?,?,?) ON CONFLICT(kind, record_id) DO UPDATE SET
                data_json=excluded.data_json, updated_at=excluded.updated_at, updated_by=excluded.updated_by""",
                (kind, record_id, encoded, created_at, updated_at, username))
        self._send(201, {"kind": kind, "record": record, "stored_at": now})

    def _handle_telemetry(self, data: dict) -> None:
        if not self._device_authenticated():
            self._error(401, "Valid device bearer token required. The device token must remain on the gateway, never in frontend code.")
            return
        device_id = data.get("device_id")
        if not isinstance(device_id, str) or not re.fullmatch(r"[A-Za-z0-9._:-]{1,100}", device_id):
            self._error(400, "device_id is required and must use 1–100 safe characters.")
            return
        observed = parse_datetime(data.get("observed_at"))
        if observed is None:
            self._error(400, "observed_at must be ISO-8601 with timezone, for example 2026-10-10T05:00:00Z.")
            return
        if observed > utc_now() + timedelta(minutes=5):
            self._error(400, "observed_at is too far in the future; check device clock synchronisation.")
            return
        measurements = data.get("measurements")
        if not isinstance(measurements, dict) or not measurements:
            self._error(400, "A non-empty measurements object is required.")
            return
        if len(measurements) > len(MEASUREMENT_LIMITS):
            self._error(400, "Too many measurement fields.")
            return
        clean: dict[str, float] = {}
        for name, value in measurements.items():
            if name not in MEASUREMENT_LIMITS or isinstance(value, bool) or not isinstance(value, (int, float)):
                self._error(400, f"Unsupported measurement field or non-numeric value: {str(name)[:60]}.")
                return
            number = float(value)
            low, high = MEASUREMENT_LIMITS[name]
            if not math.isfinite(number) or number < low or number > high:
                self._error(400, f"Measurement {name} is outside accepted bounds.")
                return
            clean[name] = number
        source = str(data.get("source", "device"))[:40]
        calibration_id = data.get("calibration_id")
        if calibration_id is not None:
            calibration_id = str(calibration_id)[:120]
        # Never let the sender self-assert that measurement accuracy has been certified.
        quality_status = "DEVICE_REPORTED_UNVERIFIED"
        received = iso_now()
        with db_session() as conn:
            cursor = conn.execute("INSERT INTO device_telemetry(device_id, observed_at, received_at, measurements_json, source, calibration_id, quality_status) VALUES(?,?,?,?,?,?,?)",
                (device_id, observed.isoformat().replace("+00:00", "Z"), received, json.dumps(clean, allow_nan=False, separators=(",", ":")), source, calibration_id, quality_status))
            record_id = cursor.lastrowid
            # Bound storage growth: retain newest 50,000 records.
            conn.execute("DELETE FROM device_telemetry WHERE id NOT IN (SELECT id FROM device_telemetry ORDER BY id DESC LIMIT 50000)")
        self._send(201, {"id": record_id, "device_id": device_id, "observed_at": observed.isoformat().replace("+00:00", "Z"), "received_at": received, "measurements": clean, "source": source, "calibration_id": calibration_id, "quality_status": quality_status})

    def do_DELETE(self) -> None:
        if not self._origin_allowed():
            self._error(403, "Origin is not allowed by IGERS_ALLOWED_ORIGINS.")
            return
        username = self._admin()
        if not username:
            self._error(401, "Authenticated administrator session required.")
            return
        parsed = urlparse(self.path)
        if parsed.path != "/api/v1/records":
            self._error(404, "Route not found.")
            return
        query = parse_qs(parsed.query)
        kind = query.get("kind", [""])[0]
        record_id = query.get("id", [""])[0]
        if kind not in ALLOWED_KINDS or not re.fullmatch(r"[A-Za-z0-9._:-]{1,128}", record_id):
            self._error(400, "Supported kind and valid record id required.")
            return
        with db_session() as conn:
            cursor = conn.execute("DELETE FROM company_records WHERE kind=? AND record_id=?", (kind, record_id))
        self._send(200, {"deleted": cursor.rowcount == 1, "kind": kind, "id": record_id, "time": iso_now()})


def make_server(host: str = "127.0.0.1", port: int = 0) -> ThreadingHTTPServer:
    init_db()
    server = ThreadingHTTPServer((host, port), CompanyAPIHandler)
    server.daemon_threads = True
    return server


def main() -> None:
    init_db()
    port_text = os.getenv("PORT", "10000")
    try:
        port = int(port_text)
    except ValueError:
        raise SystemExit("PORT must be an integer.")
    host = os.getenv("HOST", "0.0.0.0")
    server = ThreadingHTTPServer((host, port), CompanyAPIHandler)
    server.daemon_threads = True
    print(f"{SERVICE_NAME} listening on {host}:{port}; database={db_path()}; authConfigured={health_payload()['authenticationConfigured']}")
    try:
        server.serve_forever(poll_interval=0.5)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
