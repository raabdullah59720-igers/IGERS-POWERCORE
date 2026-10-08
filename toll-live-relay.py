#!/usr/bin/env python3
"""IGERS POWERCORE read-only toll/traffic relay.

Set IGERS_TOLL_FEED_URL to an operator-authorized JSON endpoint.
The browser can then read http://127.0.0.1:8765/api/tollplazas without cross-origin browser fetches.
No private CCTV, telecom interception, payment credentials, or protected-system access is performed.
"""
from __future__ import annotations
import json, os, time, mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parent
HOST=os.getenv("IGERS_HOST","127.0.0.1")
PORT=int(os.getenv("IGERS_PORT","8765"))
FEED=os.getenv("IGERS_TOLL_FEED_URL","").strip()
TIMEOUT=12

def live_payload():
    if not FEED:
        return {"status":"REFERENCE","source":"RHD/BBA reference registry","updatedAt":int(time.time()*1000),"tollPlazas":[]}
    req=Request(FEED,headers={"User-Agent":"IGERS-Powercore-TollRelay/1.0","Accept":"application/json"})
    with urlopen(req,timeout=TIMEOUT) as r:
        data=json.loads(r.read().decode("utf-8"))
    rows=data.get("tollPlazas") if isinstance(data,dict) else data
    return {"status":"LIVE","source":str(data.get("source","AUTHORIZED TOLL/ITS") if isinstance(data,dict) else "AUTHORIZED TOLL/ITS"),"updatedAt":int(time.time()*1000),"tollPlazas":rows if isinstance(rows,list) else []}

class Handler(BaseHTTPRequestHandler):
    server_version="IGERS-TollRelay/1.0"
    def j(self,code,payload):
        b=json.dumps(payload,separators=(",",":")).encode()
        self.send_response(code);self.send_header("Content-Type","application/json; charset=utf-8");self.send_header("Cache-Control","no-store");self.send_header("Access-Control-Allow-Origin","*");self.send_header("Content-Length",str(len(b)));self.end_headers();self.wfile.write(b)
    def do_GET(self):
        path=self.path.split("?",1)[0]
        if path=="/api/health":
            self.j(200,{"ok":True,"service":"IGERS Toll/Traffic Relay","configured":bool(FEED),"time":int(time.time()*1000)});return
        if path=="/api/tollplazas":
            try:self.j(200,live_payload())
            except Exception as e:self.j(502,{"status":"OFFLINE","source":"AUTHORIZED TOLL/ITS","updatedAt":int(time.time()*1000),"error":str(e),"tollPlazas":[]})
            return
        if path=="/":path="/index.html"
        fp=(ROOT/path.lstrip("/")).resolve()
        if str(fp).startswith(str(ROOT.resolve())) and fp.is_file():
            b=fp.read_bytes();self.send_response(200);self.send_header("Content-Type",mimetypes.guess_type(fp.name)[0] or "application/octet-stream");self.send_header("Content-Length",str(len(b)));self.end_headers();self.wfile.write(b);return
        self.j(404,{"error":"not found"})
    def log_message(self,fmt,*args): print(f"[{self.log_date_time_string()}] {fmt%args}")

if __name__=="__main__":
    print(f"IGERS Toll relay: http://{HOST}:{PORT}/")
    print("Authorized feed configured:",bool(FEED))
    ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
