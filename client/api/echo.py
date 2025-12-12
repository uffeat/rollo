import json
import os
from http.server import BaseHTTPRequestHandler
from anvil.server import call, connect


class handler(BaseHTTPRequestHandler):
    def do_GET(self):

        key = os.getenv("anvil_uplink_client")
        connect(key)

        result = call("echo", data=dict(foo=42))
        result = json.dumps(result)

        self.send_response(200)
        self.send_header("content-type", "text/plain")
        self.end_headers()

        self.wfile.write(result.encode("utf-8"))
