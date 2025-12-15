"""
test/anvil_.py

python test/anvil_.py
"""

import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from anvil.server import call, connect as _connect

UTF_8 = "utf-8"
CONTENT_LENGTH = "content-length"


key = json.loads(
    ((Path(__file__).resolve().parent).parent / "secrets.json").read_text(
        encoding="utf-8"
    )
)["development"]["client"]


connected = {}


def connect():
    """Connect to Anvil, if not already connected."""
    if not connected.get("connected"):
        _connect(key)
        connected["connected"] = True


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Only handle the exact prod path
        if urlparse(self.path).path != "/api/anvil":
            self.send_response(404)
            self.end_headers()
            return

        qs = parse_qs(urlparse(self.path).query)
        name = (qs.get("name") or [None])[0]
        submission_raw = (qs.get("submission") or [None])[0]
        submission = int(submission_raw) if submission_raw is not None else None

        length = int(self.headers.get(CONTENT_LENGTH, 0))
        raw = self.rfile.read(length).decode(UTF_8) if length else ""
        data = json.loads(raw) if raw else {}

        connect()
        result = call(name, data=data, submission=submission)

        payload = json.dumps(result).encode(UTF_8)
        self.send_response(200)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header(CONTENT_LENGTH, str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)


def main():
    server = HTTPServer(("127.0.0.1", 8000), handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
