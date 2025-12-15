import json
import os
from http.server import BaseHTTPRequestHandler
from anvil.server import call, connect


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 1) Read + parse JSON body
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length).decode("utf-8") if length else ""
        try:
            data = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            self.send_response(400)
            msg = b'{"error":"Invalid JSON"}'
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(msg)))
            self.end_headers()
            self.wfile.write(msg)
            return

        # 2) Connect to Anvil (from env var)
        key = os.getenv("uplink_client_development")
        connect(key)

        # 3) Call Anvil server function
        result = call("echo", data=data)

        # 4) Respond with JSON
        payload = json.dumps(result).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
