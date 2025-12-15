from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_GET(self):

        result = dict(ping=42)

        self.send_response(200)
        self.send_header("content-type", "application/json")
        self.end_headers()

        self.wfile.write(result.encode("utf-8"))


# curl https://rolloh.vercel.app/api/ping