import json
import os
from http.server import BaseHTTPRequestHandler
from anvil.server import call, connect


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Extract data from body
        length = int(self.headers.get("content-length", 0))
        raw = self.rfile.read(length).decode("utf-8") if length else ""
        data = json.loads(raw) if raw else {}

        # Connect to Anvil
        key = os.getenv("uplink_client_development")
        connect(key)

        # Call Anvil server function
        result = call("echo", data=data)

        # Respond
        result = json.dumps(result).encode("utf-8")
        self.send_response(200)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(result)))
        self.end_headers()
        self.wfile.write(result)
