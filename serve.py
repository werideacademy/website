"""Server locale per provare il sito: python3 serve.py → http://localhost:5173
Disattiva la cache del browser, così ogni ricarica mostra le ultime modifiche."""
import http.server
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


http.server.ThreadingHTTPServer(("", 5173), NoCacheHandler).serve_forever()
