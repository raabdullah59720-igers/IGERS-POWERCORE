#!/usr/bin/env python3
"""
IGERS POWERCORE — Bangladesh Air Traffic Live Relay

Purpose:
  Serve the static IGERS app and provide /api/airtraffic from Airplanes.live.
  The browser talks to the same origin, which avoids browser-side CORS issues.

This is a public/read-only ADS-B visualization relay. It does not control aircraft,
radar, ATC, weapons, or restricted systems.
"""
from __future__ import annotations

import json
import math
import mimetypes
import os
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
HOST = os.environ.get("IGERS_HOST", "127.0.0.1")
PORT = int(os.environ.get("IGERS_PORT", "8765"))
AIRPLANES_URL = "https://api.airplanes.live/v2/point/23.8103/90.4125/250"
TIMEOUT = 12

BD_POLY = [
    (20.73, 88.03), (21.65, 88.02), (22.35, 88.20), (22.91, 88.47),
    (23.50, 88.55), (24.05, 88.72), (24.48, 88.86), (24.95, 88.72),
    (25.35, 89.00), (25.88, 89.40), (26.35, 89.75), (26.63, 90.10),
    (26.72, 90.72), (26.66, 91.30), (26.48, 91.72), (26.08, 92.08),
    (25.52, 92.15), (25.07, 92.30), (24.55, 92.27), (24.10, 92.02),
    (23.70, 92.40), (23.20, 92.35), (22.72, 92.25), (22.20, 92.05),
    (21.74, 91.88), (21.20, 91.62), (20.88, 91.15), (20.73, 90.55),
    (20.69, 89.78), (20.72, 89.15),
]


def in_bd(lat: float, lon: float) -> bool:
    inside = False
    j = len(BD_POLY) - 1
    for i, (yi, xi) in enumerate(BD_POLY):
        yj, xj = BD_POLY[j]
        if ((xi > lon) != (xj > lon)) and (lat < (yj - yi) * (lon - xi) / (xj - xi) + yi):
            inside = not inside
        j = i
    return inside


def normalize(raw: dict) -> dict:
    out = []
    for a in raw.get("ac", []) or []:
        try:
            lat = float(a.get("lat"))
            lon = float(a.get("lon"))
        except (TypeError, ValueError):
            continue
        if not (math.isfinite(lat) and math.isfinite(lon) and in_bd(lat, lon)):
            continue
        hex_id = str(a.get("hex") or "").strip().lower()
        if not hex_id:
            continue
        def num(key):
            try:
                v = float(a.get(key))
                return v if math.isfinite(v) else None
            except (TypeError, ValueError):
                return None
        out.append({
            "hex": hex_id,
            "flight": str(a.get("flight") or hex_id).strip(),
            "lat": lat,
            "lon": lon,
            "alt": num("alt_baro"),
            "gs": num("gs"),
            "track": num("track"),
            "seen": num("seen_pos"),
            "source": "Airplanes.live",
            "scope": "BANGLADESH",
            "updated": int(time.time() * 1000),
        })
    return out


def fetch_live():
    req = Request(AIRPLANES_URL, headers={
        "User-Agent": "IGERS-Powercore-AirTraffic/1.0",
        "Accept": "application/json",
    })
    started = time.perf_counter()
    with urlopen(req, timeout=TIMEOUT) as resp:
        if resp.status != 200:
            raise RuntimeError(f"upstream HTTP {resp.status}")
        data = json.loads(resp.read().decode("utf-8"))
    rows = normalize(data)
    return {
        "source": "Airplanes.live",
        "scope": "BANGLADESH",
        "status": "LIVE",
        "timestamp": int(time.time() * 1000),
        "latencyMs": round((time.perf_counter() - started) * 1000),
        "received": len(data.get("ac", []) or []),
        "accepted": len(rows),
        "filtered": max(0, len(data.get("ac", []) or []) - len(rows)),
        "ac": rows,
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "IGERSAirRelay/1.0"

    def _send(self, status: int, payload, content_type="application/json; charset=utf-8"):
        body = payload if isinstance(payload, bytes) else json.dumps(payload, separators=(",", ":")).encode()
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/health":
            self._send(200, {"ok": True, "service": "IGERS Air Traffic Relay", "time": int(time.time() * 1000)})
            return
        if path == "/api/airtraffic":
            try:
                self._send(200, fetch_live())
            except Exception as exc:
                self._send(502, {
                    "source": "Airplanes.live",
                    "scope": "BANGLADESH",
                    "status": "OFFLINE",
                    "timestamp": int(time.time() * 1000),
                    "error": str(exc),
                    "ac": [],
                })
            return
        if path == "/":
            path = "/index.html"
        file_path = (ROOT / path.lstrip("/"))
        try:
            file_path = file_path.resolve()
            if not str(file_path).startswith(str(ROOT.resolve())) or not file_path.is_file():
                raise FileNotFoundError
            data = file_path.read_bytes()
            ctype = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
            self._send(200, data, ctype)
        except FileNotFoundError:
            self._send(404, {"error": "not found"})

    def log_message(self, fmt, *args):
        print(f"[{self.log_date_time_string()}] {self.client_address[0]} {fmt % args}")


if __name__ == "__main__":
    print(f"IGERS Air Traffic Relay: http://{HOST}:{PORT}")
    print("Press Ctrl+C to stop.")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
