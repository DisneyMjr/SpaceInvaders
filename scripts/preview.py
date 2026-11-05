"""Local single-player preview, without downloading dependencies."""
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse, webbrowser

class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.mjs':'text/javascript', '.glb':'model/gltf-binary'}
    def do_GET(self):
        if self.path == '/server-info':
            self.send_response(204); self.end_headers(); return
        super().do_GET()
    def end_headers(self):
        self.send_header('Cache-Control','no-cache')
        super().end_headers()

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port',type=int,default=8788)
    parser.add_argument('--no-browser',action='store_true')
    args=parser.parse_args()
    root=Path(__file__).resolve().parents[1]/'web'
    server=ThreadingHTTPServer(('127.0.0.1',args.port),partial(Handler,directory=str(root)))
    url=f'http://127.0.0.1:{args.port}/'
    print(f'SpaceInvaders: {url}\nHangar: {url}galeria.html\nPrévia local: campanha e escaramuça. Multiplayer requer o servidor Node.js.\nFeche esta janela ou use Ctrl+C para encerrar.',flush=True)
    if not args.no_browser:webbrowser.open(url)
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()
