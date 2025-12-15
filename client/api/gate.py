"""
api/gate.py
Gateway to Anvil server functions.
"""

import json

from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from anvil.server import call, connect as _connect

UTF_8 = "utf-8"
CONTENT_LENGTH = "content-length"

if __name__ == "__main__":
    from pathlib import Path

    key = (json.loads((Path.cwd() / "secrets.json").read_text(encoding="utf-8")))[
        "development"
    ]["client"]

   
else:
    import os
    key = os.getenv("uplink_client_development")

connected = {}


def connect():
    """Connect to Anvil, if not already connected."""
    if not connected.get("connected"):
        _connect(key)
        connected["connected"] = True


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Extract name and submission from query
        qs = parse_qs(urlparse(self.path).query)
        name = (qs.get("name") or [None])[0]
        submission_raw = (qs.get("submission") or [None])[0]
        submission = int(submission_raw) if submission_raw is not None else None

        # Extract data from body
        length = int(self.headers.get(CONTENT_LENGTH, 0))
        raw = self.rfile.read(length).decode(UTF_8) if length else ""
        data = json.loads(raw) if raw else {}

        # Connect to Anvil
        connect()

        # Call Anvil server function
        result = call(name, data=data, submission=submission)

        # Respond
        result = json.dumps(result).encode(UTF_8)
        self.send_response(200)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header(CONTENT_LENGTH, str(len(result)))
        self.end_headers()
        self.wfile.write(result)


if __name__ == "__main__":
    from http.server import HTTPServer
    server = HTTPServer(("127.0.0.1", 8000), handler)
    server.serve_forever()

