#!/usr/bin/env python3
"""
Todo Dashboard — local web server
Run:  python3 tools/todo/server.py
Open: http://localhost:7001
"""
import json, os, uuid, datetime, re
from http.server import HTTPServer, BaseHTTPRequestHandler

BASE       = os.path.dirname(os.path.abspath(__file__))
TASKS_FILE = os.path.join(BASE, 'tasks.json')
LOG_FILE   = os.path.join(BASE, 'tasks.log')
HTML_FILE  = os.path.join(BASE, 'index.html')
PORT       = 7001


# ── Storage helpers ───────────────────────────────────────────────────────────

def load_tasks():
    if not os.path.exists(TASKS_FILE):
        return []
    with open(TASKS_FILE, encoding='utf-8') as f:
        return json.load(f)

def save_tasks(tasks):
    tmp = TASKS_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, indent=2, ensure_ascii=False)
    os.replace(tmp, TASKS_FILE)

def log_event(msg):
    ts = datetime.datetime.now().isoformat(timespec='seconds')
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(f"[{ts}] {msg}\n")

def now_iso():
    return datetime.datetime.now().isoformat(timespec='seconds')


# ── HTTP handler ──────────────────────────────────────────────────────────────

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass  # silence default access log

    # ── helpers ──

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def read_body(self):
        n = int(self.headers.get('Content-Length', 0))
        return self.rfile.read(n).decode('utf-8')

    # ── routing ──

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path in ('/', '/index.html'):
            with open(HTML_FILE, 'rb') as f:
                body = f.read()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        elif self.path == '/api/tasks':
            self.send_json(load_tasks())

        elif self.path == '/api/log':
            if os.path.exists(LOG_FILE):
                with open(LOG_FILE, encoding='utf-8') as f:
                    lines = f.readlines()
            else:
                lines = []
            self.send_json({'lines': lines[-100:]})

        else:
            self.send_error(404)

    def do_POST(self):
        if self.path != '/api/tasks':
            self.send_error(404)
            return
        data  = json.loads(self.read_body())
        title = data.get('title', '').strip()
        if not title:
            self.send_json({'error': 'title required'}, 400)
            return
        tasks = load_tasks()
        task  = {
            'id':          str(uuid.uuid4())[:8],
            'title':       title,
            'description': data.get('description', '').strip(),
            'priority':    max(1, min(5, int(data.get('priority', 3)))),
            'status':      'pending',
            'created':     now_iso(),
            'updated':     now_iso(),
            'completed':   None,
            'work_log':    None,
        }
        tasks.append(task)
        save_tasks(tasks)
        log_event(f"ADDED    [P{task['priority']}] {task['title']}  (id:{task['id']})")
        self.send_json(task, 201)

    def do_PUT(self):
        m = re.match(r'^/api/tasks/([a-zA-Z0-9]+)$', self.path)
        if not m:
            self.send_error(404)
            return
        task_id = m.group(1)
        data    = json.loads(self.read_body())
        tasks   = load_tasks()
        for task in tasks:
            if task['id'] != task_id:
                continue
            if 'title'       in data: task['title']       = data['title'].strip()
            if 'description' in data: task['description'] = data['description'].strip()
            if 'priority'    in data: task['priority']    = max(1, min(5, int(data['priority'])))
            if 'status'      in data: task['status']      = data['status']
            if 'work_log'    in data: task['work_log']    = data['work_log']
            task['updated'] = now_iso()
            if task['status'] == 'complete' and not task['completed']:
                task['completed'] = now_iso()
            save_tasks(tasks)
            log_event(f"UPDATED  [P{task['priority']}] {task['title']}  status:{task['status']}")
            self.send_json(task)
            return
        self.send_error(404)

    def do_DELETE(self):
        m = re.match(r'^/api/tasks/([a-zA-Z0-9]+)$', self.path)
        if not m:
            self.send_error(404)
            return
        task_id = m.group(1)
        tasks   = load_tasks()
        match   = next((t for t in tasks if t['id'] == task_id), None)
        if not match:
            self.send_error(404)
            return
        save_tasks([t for t in tasks if t['id'] != task_id])
        log_event(f"DELETED  [P{match['priority']}] {match['title']}  (id:{task_id})")
        self.send_json({'ok': True})


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    server = HTTPServer(('localhost', PORT), Handler)
    print(f"  Todo Dashboard  →  http://localhost:{PORT}")
    print(f"  Tasks file      →  {TASKS_FILE}")
    print(f"  Log file        →  {LOG_FILE}")
    print(f"  Ctrl+C to stop\n")
    log_event(f"SERVER   started on port {PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log_event("SERVER   stopped")
        print("\nStopped.")
