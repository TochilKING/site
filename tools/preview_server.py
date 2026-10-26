import http.server
import os
import posixpath
import socketserver
import sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8123


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        path = path.split('?', 1)[0].split('#', 1)[0]
        path = posixpath.normpath(path)
        if path == '/site':
            path = '/'
        elif path.startswith('/site/'):
            path = path[len('/site'):]
        return super().translate_path(path)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *args):
        pass


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


with Server(('127.0.0.1', PORT), Handler) as httpd:
    print(f'serving {ROOT} on http://127.0.0.1:{PORT}/site/', flush=True)
    httpd.serve_forever()
