from http.server import BaseHTTPRequestHandler
import json
import os


class handler(BaseHTTPRequestHandler):
    def do_GET(self):

        key = os.getenv("uplink_client_development")

        result = dict(key=key)
        result = json.dumps(result).encode("utf-8")

        self.send_response(200)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(result)))
        self.end_headers()

        self.wfile.write(result)


# curl https://rolloh.vercel.app/api/ping