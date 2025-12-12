from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_GET(self):

        result = "ping"

        self.send_response(200)
        self.send_header("content-type", "text/plain")
        self.end_headers()

        self.wfile.write(result.encode("utf-8"))
