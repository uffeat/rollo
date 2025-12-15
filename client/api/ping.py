import json
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_GET(self):

        result = dict(ping=42)
        result = json.dumps(result).encode("utf-8")

        self.send_response(200)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(result)))
        self.end_headers()

        self.wfile.write(result)


# curl https://rolloh.vercel.app/api/ping