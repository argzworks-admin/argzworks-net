#!/usr/bin/env python3
"""
ARGZWORKS — Servidor de Desarrollo Local con Live-Reload
======================================================
Servidor HTTP ligero para previsualización local en Google Chrome.
Incluye recarga automática (Live-Reload) mediante Server-Sent Events (SSE)
sin dependencias externas de Node.js o pip.

Uso:
    python3 dev_server.py [puerto]
"""

import http.server
import mimetypes
import os
import sys
import threading
import time
from urllib.parse import urlparse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Asegurar tipos MIME comunes
mimetypes.add_type("text/html; charset=utf-8", ".html")
mimetypes.add_type("text/css; charset=utf-8", ".css")
mimetypes.add_type("application/javascript; charset=utf-8", ".js")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/png", ".png")
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("application/json; charset=utf-8", ".json")

LIVERELOAD_SCRIPT = """
<!-- ARGZWORKS Local Dev Live-Reload -->
<script>
(function() {
  let source;
  function connect() {
    source = new EventSource('/__livereload');
    source.onmessage = function(event) {
      if (event.data === 'reload') {
        console.log('[ARGZWORKS LiveReload] Cambio detectado en el proyecto. Recargando página...');
        location.reload();
      }
    };
    source.onerror = function() {
      source.close();
      setTimeout(connect, 1500);
    };
  }
  connect();
})();
</script>
"""

# Estado del watcher de archivos
change_event = threading.Event()
last_mtime = 0.0

def get_latest_mtime():
    latest = 0.0
    for root, dirs, files in os.walk(DIRECTORY):
        # Ignorar .git y caches
        if ".git" in root or "__pycache__" in root:
            continue
        for f in files:
            if f == "dev_server.py" or f.endswith(".tmp") or f.endswith(".log"):
                continue
            path = os.path.join(root, f)
            try:
                mt = os.path.getmtime(path)
                if mt > latest:
                    latest = mt
            except OSError:
                pass
    return latest

def file_watcher():
    global last_mtime
    last_mtime = get_latest_mtime()
    while True:
        time.sleep(0.5)
        current = get_latest_mtime()
        if current > last_mtime:
            last_mtime = current
            # Disparar evento de recarga
            change_event.set()
            # Dejar breve pausa antes de limpiar el evento
            time.sleep(0.2)
            change_event.clear()

class DevHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Filtrar peticiones continuas de livereload para mantener el log limpio
        if "/__livereload" not in args[0]:
            sys.stdout.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]}\n")
            sys.stdout.flush()

    def end_headers(self):
        # Desactivar cache para desarrollo en tiempo real
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # Endpoint SSE de recarga automática
        if path == "/__livereload":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.end_headers()

            # Enviar saludo inicial
            try:
                self.wfile.write(b": connected\n\n")
                self.wfile.flush()
            except Exception:
                return

            # Mantener conexión y escuchar eventos de cambio
            while True:
                triggered = change_event.wait(timeout=25.0)
                try:
                    if triggered:
                        self.wfile.write(b"data: reload\n\n")
                        self.wfile.flush()
                    else:
                        # Keep-alive heartbeat
                        self.wfile.write(b": ping\n\n")
                        self.wfile.flush()
                except (BrokenPipeError, ConnectionResetError):
                    break
            return

        # Servir index.html en raíz
        if path == "/" or path == "/index.html":
            file_path = os.path.join(DIRECTORY, "index.html")
            if os.path.isfile(file_path):
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    # Inyectar script de LiveReload antes de </body>
                    if "</body>" in content:
                        content = content.replace("</body>", f"{LIVERELOAD_SCRIPT}\n</body>")
                    else:
                        content += LIVERELOAD_SCRIPT
                    
                    encoded = content.encode("utf-8")
                    self.send_response(200)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.send_header("Content-Length", str(len(encoded)))
                    self.end_headers()
                    self.wfile.write(encoded)
                    return
                except Exception as e:
                    self.send_error(500, f"Error leyendo index.html: {e}")
                    return

        # Servir archivos estáticos normales
        super().do_GET()

def run_server():
    watcher_thread = threading.Thread(target=file_watcher, daemon=True)
    watcher_thread.start()

    server_address = ("127.0.0.1", PORT)
    try:
        httpd = http.server.ThreadingHTTPServer(server_address, DevHandler)
    except OSError:
        # Fallback a 8080 si 3000 estuviese ocupado
        fallback_port = 8080
        httpd = http.server.ThreadingHTTPServer(("127.0.0.1", fallback_port), DevHandler)
        print(f"Puerto {PORT} ocupado. Iniciado en http://localhost:{fallback_port}")

    actual_port = httpd.server_port
    print("\n" + "=" * 65)
    print("  ARGZWORKS — Servidor Local de Desarrollo con Live-Reload")
    print("=" * 65)
    print(f"  Dirección local:    http://localhost:{actual_port}")
    print(f"  Dirección IP:       http://127.0.0.1:{actual_port}")
    print("  Live-Reload:        Activo (recarga automática al guardar)")
    print("  Cache del browser:  Deshabilitada para desarrollo")
    print("=" * 65)
    print("  Presiona Ctrl+C en cualquier momento para detener.\n")
    sys.stdout.flush()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido correctamente.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
