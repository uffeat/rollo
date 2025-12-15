import json
import os
from http.server import BaseHTTPRequestHandler
from anvil.server import call, connect


class handler(BaseHTTPRequestHandler):
    def do_GET(self):

        key = os.getenv("uplink_client")
        connect(key)

        result = call("echo", data=dict(foo=42))
       

        self.send_response(200)
        self.send_header("content-type", "application/json")
        self.end_headers()

        self.wfile.write(result.encode("utf-8"))
