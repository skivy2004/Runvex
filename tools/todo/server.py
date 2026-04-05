#!/usr/bin/env python3
"""
Runvex Control Dashboard — local web server
Run:  python3 tools/todo/server.py
Open: http://localhost:7001
"""
import json, os, uuid, datetime, re, threading, subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
try:
    from urllib.request import urlopen, Request
except ImportError:
    pass

BASE              = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT      = os.path.dirname(os.path.dirname(BASE))
TASKS_FILE        = os.path.join(BASE, 'tasks.json')
LOG_FILE          = os.path.join(BASE, 'tasks.log')
HTML_FILE         = os.path.join(BASE, 'index.html')
MEMORY_DIR        = os.path.expanduser('~/.claude/projects/-Users-jeremy-lead-automation/memory')
AGENT_MEMORY_DIR  = os.path.join(BASE, 'agent_memory')
CONV_DIR          = os.path.join(BASE, 'conversations')
PORT              = 7001

os.makedirs(AGENT_MEMORY_DIR, exist_ok=True)
os.makedirs(CONV_DIR, exist_ok=True)

# Agent jobs: {job_id: {...}}
AGENT_JOBS = {}
LATEST_JOB_BY_AGENT = {}

ALL_AGENTS = ['frontend', 'backend', 'marketing', 'fullstack', 'review']

AGENT_PROMPTS = {
    'frontend': (
        "Je bent de Frontend Agent voor het Runvex project (/Users/jeremy/lead-automation). "
        "Stack: Next.js 15 App Router, Tailwind CSS, dark theme (#0A0B0F bg, #5B6EF5 accent). "
        "Componenten in app/components/. Alles in het Nederlands."
    ),
    'backend': (
        "Je bent de Backend Agent voor het Runvex project (/Users/jeremy/lead-automation). "
        "Stack: Next.js API routes, Supabase (postgres), Resend (e-mail), n8n (automation), Anthropic Claude API. "
        "API routes in app/api/. Supabase tabellen: leads, settings."
    ),
    'marketing': (
        "Je bent de Marketing Agent voor Runvex — AI lead automation voor het Nederlandse MKB. "
        "Doelgroep: bedrijven 1-50 medewerkers. USP: setup in 10 min, Claude AI scoring. "
        "Schrijf in het Nederlands, direct en concreet, geen buzzwords."
    ),
    'fullstack': (
        "Je bent de Fullstack Agent voor het Runvex project (/Users/jeremy/lead-automation). "
        "Stack: Next.js 15, Supabase, n8n op Railway, Resend, Anthropic, Vercel (auto-deploy via GitHub main). "
        "Je overspant frontend én backend."
    ),
    'review': (
        "Je bent de Review Agent voor het Runvex project. "
        "Analyseer code op: security (OWASP), performance, TypeScript types, mobiel, toegankelijkheid. "
        "Geef bevindingen met bestandsnaam + regelnummer."
    ),
    'orchestrator': (
        "Je bent de Hoofd Agent (Orchestrator) voor het Runvex project. "
        "Je kunt taken delegeren aan: frontend, backend, marketing, fullstack, review agents. "
        "Je ziet alle agent memories en kunt sub-agents aansturen. "
        "Als je taken wilt uitbesteden, gebruik dan dit formaat EXACT aan het einde van je antwoord:\n"
        "DISPATCH:\n"
        '[{"agent":"frontend","instruction":"..."},{"agent":"backend","instruction":"..."}]\n'
        "Gebruik DISPATCH alleen als je daadwerkelijk sub-agents wilt activeren."
    ),
}


# ── Storage: tasks ────────────────────────────────────────────────────────────

def load_tasks():
    if not os.path.exists(TASKS_FILE): return []
    with open(TASKS_FILE, encoding='utf-8') as f: return json.load(f)

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


# ── Storage: agent private memory ────────────────────────────────────────────

def get_agent_memory(agent_type):
    path = os.path.join(AGENT_MEMORY_DIR, agent_type + '.md')
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f: return f.read()
    return f'# {agent_type} memory\n\n*Nog leeg.*'

def set_agent_memory(agent_type, content):
    path = os.path.join(AGENT_MEMORY_DIR, agent_type + '.md')
    with open(path, 'w', encoding='utf-8') as f: f.write(content)

def append_agent_memory(agent_type, note):
    current = get_agent_memory(agent_type)
    ts = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    updated = current.rstrip() + f'\n\n## {ts}\n{note.strip()}'
    set_agent_memory(agent_type, updated)


# ── Storage: conversation history ─────────────────────────────────────────────

def get_conversation(agent_type):
    path = os.path.join(CONV_DIR, agent_type + '.json')
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f: return json.load(f)
    return []

def save_conversation(agent_type, messages):
    path = os.path.join(CONV_DIR, agent_type + '.json')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(messages, f, indent=2, ensure_ascii=False)

def clear_conversation(agent_type):
    path = os.path.join(CONV_DIR, agent_type + '.json')
    if os.path.exists(path): os.remove(path)


# ── Project memory context ────────────────────────────────────────────────────

def build_project_memory():
    if not os.path.exists(MEMORY_DIR): return ''
    parts = []
    priority = ['user_jeremy.md', 'project_runvex.md', 'project_design_system.md',
                'feedback_workflow.md', 'feedback_n8n.md']
    files = sorted(os.listdir(MEMORY_DIR), key=lambda f: (0 if f in priority else 1, f))
    for fn in files:
        if not fn.endswith('.md') or fn == 'MEMORY.md': continue
        path = os.path.join(MEMORY_DIR, fn)
        with open(path, encoding='utf-8') as f: content = f.read()
        body = re.sub(r'^---\n.*?\n---\n?', '', content, flags=re.DOTALL).strip()
        if body:
            label = fn.replace('.md','').replace('_',' ').upper()
            parts.append(f'## {label}\n{body}')
    if not parts: return ''
    return '# PROJECT MEMORY\n\n' + '\n\n---\n\n'.join(parts)


# ── Build full prompt ─────────────────────────────────────────────────────────

def build_prompt(agent_type, instruction):
    sections = []

    # 1. Project memory (shared)
    pm = build_project_memory()
    if pm:
        sections.append(pm)

    # 2. Agent's private memory
    am = get_agent_memory(agent_type)
    sections.append(f'# JOUW PRIVÉ MEMORY ({agent_type})\n{am}')

    # 3. For orchestrator: all sub-agent memories
    if agent_type == 'orchestrator':
        sub_mems = []
        for a in ALL_AGENTS:
            m = get_agent_memory(a)
            sub_mems.append(f'### {a}\n{m}')
        sections.append('# SUB-AGENT MEMORIES\n\n' + '\n\n'.join(sub_mems))

    # 4. Agent role
    sections.append(f'# JOUW ROL\n{AGENT_PROMPTS.get(agent_type,"")}')

    # 5. Conversation history
    history = get_conversation(agent_type)
    if history:
        hist_lines = []
        for msg in history[-10:]:  # last 10 exchanges
            role = 'Gebruiker' if msg['role'] == 'user' else agent_type.capitalize()
            hist_lines.append(f'{role}: {msg["content"]}')
        sections.append('# GESPREKSGESCHIEDENIS\n' + '\n\n'.join(hist_lines))

    # 6. Memory update instruction
    sections.append(
        '# MEMORY INSTRUCTIE\n'
        'Als je iets wilt onthouden voor toekomstige gesprekken, voeg dan aan het EINDE van je antwoord toe:\n'
        'MEMORY_UPDATE:\n'
        '{wat je wilt onthouden — kort en feitelijk}'
    )

    # 7. Current task
    sections.append(f'# HUIDIGE OPDRACHT\n{instruction}')

    return '\n\n---\n\n'.join(sections)


# ── Parse agent output ────────────────────────────────────────────────────────

def parse_output(agent_type, raw_output, instruction):
    """Extract memory updates and dispatch commands from agent output."""
    clean = raw_output

    # Parse MEMORY_UPDATE:
    mem_match = re.search(r'MEMORY_UPDATE:\n(.*?)(?=\n---|\nDISPATCH:|\Z)', raw_output, re.DOTALL)
    if mem_match:
        note = mem_match.group(1).strip()
        if note:
            append_agent_memory(agent_type, note)
        clean = raw_output[:mem_match.start()].rstrip()

    # Parse DISPATCH: (orchestrator only)
    dispatches = []
    dispatch_match = re.search(r'DISPATCH:\n(\[.*?\])', raw_output, re.DOTALL)
    if dispatch_match:
        try:
            dispatches = json.loads(dispatch_match.group(1))
        except Exception:
            pass
        clean = clean[:dispatch_match.start()].rstrip() if dispatch_match.start() < len(clean) else clean

    return clean, dispatches


# ── Agent runner ──────────────────────────────────────────────────────────────

def run_agent_bg(job_id, agent_type, instruction):
    AGENT_JOBS[job_id]['status'] = 'running'
    LATEST_JOB_BY_AGENT[agent_type] = job_id

    # Build conversation entry
    history = get_conversation(agent_type)
    history.append({'role': 'user', 'content': instruction, 'ts': now_iso()})

    full_prompt = build_prompt(agent_type, instruction)

    try:
        result = subprocess.run(
            ['claude', '-p', full_prompt],
            capture_output=True, text=True, timeout=300,
            cwd=PROJECT_ROOT,
        )
        raw = result.stdout.strip()
        clean, dispatches = parse_output(agent_type, raw, instruction)

        AGENT_JOBS[job_id]['output']     = clean
        AGENT_JOBS[job_id]['error']      = result.stderr.strip()
        AGENT_JOBS[job_id]['dispatches'] = dispatches
        AGENT_JOBS[job_id]['status']     = 'done' if result.returncode == 0 else 'failed'

        # Save to conversation
        history.append({'role': 'assistant', 'content': clean, 'ts': now_iso()})
        save_conversation(agent_type, history)

        # Auto-dispatch sub-agents (orchestrator)
        for d in dispatches:
            sub_agent = d.get('agent')
            sub_instr = d.get('instruction', '')
            if sub_agent in ALL_AGENTS and sub_instr:
                sub_id = str(uuid.uuid4())[:8]
                AGENT_JOBS[sub_id] = {
                    'id': sub_id, 'agent': sub_agent, 'prompt': sub_instr,
                    'status': 'pending', 'output': '', 'error': '',
                    'dispatches': [], 'started': now_iso(), 'finished': None,
                    'dispatched_by': 'orchestrator',
                }
                t = threading.Thread(target=run_agent_bg, args=(sub_id, sub_agent, sub_instr), daemon=True)
                t.start()
                log_event(f"DISPATCH [{sub_agent}] via orchestrator — {sub_instr[:50]}")

    except subprocess.TimeoutExpired:
        AGENT_JOBS[job_id]['status'] = 'failed'
        AGENT_JOBS[job_id]['error']  = 'Timeout na 5 minuten'
    except FileNotFoundError:
        AGENT_JOBS[job_id]['status'] = 'failed'
        AGENT_JOBS[job_id]['error']  = '`claude` CLI niet gevonden.'
    except Exception as e:
        AGENT_JOBS[job_id]['status'] = 'failed'
        AGENT_JOBS[job_id]['error']  = str(e)

    AGENT_JOBS[job_id]['finished'] = now_iso()
    log_event(f"AGENT    [{agent_type}] {AGENT_JOBS[job_id]['status']} — {instruction[:50]}")


# ── Health check ──────────────────────────────────────────────────────────────

def check_site_health():
    results = []
    checks = [
        ('runvex.app', 'https://runvex.app'),
        ('API health', 'https://runvex.app/api/health'),
        ('Dashboard',  'https://runvex.app/demos/lead-automation/dashboard'),
        ('Contact',    'https://runvex.app/demos/lead-automation/contact'),
    ]
    for name, url in checks:
        try:
            req  = Request(url, headers={'User-Agent': 'RunvexDashboard/1.0'})
            resp = urlopen(req, timeout=8)
            results.append({'name': name, 'url': url, 'status': resp.getcode(), 'ok': True})
        except Exception as e:
            results.append({'name': name, 'url': url, 'status': 0, 'ok': False, 'error': str(e)[:80]})
    return results


# ── Claude memory (shared project) ───────────────────────────────────────────

def read_project_memory():
    if not os.path.exists(MEMORY_DIR): return []
    files = []
    for fn in sorted(os.listdir(MEMORY_DIR)):
        if not fn.endswith('.md'): continue
        path = os.path.join(MEMORY_DIR, fn)
        with open(path, encoding='utf-8') as f: content = f.read()
        name, description, mtype = fn, '', ''
        fm = re.match(r'^---\n(.*?)\n---\n?(.*)', content, re.DOTALL)
        if fm:
            for line in fm.group(1).splitlines():
                if line.startswith('name:'): name = line[5:].strip()
                elif line.startswith('description:'): description = line[12:].strip()
                elif line.startswith('type:'): mtype = line[5:].strip()
            body = fm.group(2).strip()
        else:
            body = content.strip()
        files.append({'file': fn, 'name': name, 'description': description, 'type': mtype, 'body': body})
    return files


# ── HTTP handler ──────────────────────────────────────────────────────────────

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_): pass

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

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        p = self.path.split('?')[0]

        if p in ('/', '/index.html'):
            with open(HTML_FILE, 'rb') as f: body = f.read()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        elif p == '/api/tasks':
            self.send_json(load_tasks())

        elif p == '/api/log':
            lines = []
            if os.path.exists(LOG_FILE):
                with open(LOG_FILE, encoding='utf-8') as f: lines = f.readlines()
            self.send_json({'lines': lines[-100:]})

        elif p == '/api/stats':
            tasks = load_tasks()
            self.send_json({
                'total': len(tasks),
                'pending':     sum(1 for t in tasks if t['status'] == 'pending'),
                'in_progress': sum(1 for t in tasks if t['status'] == 'in_progress'),
                'complete':    sum(1 for t in tasks if t['status'] == 'complete'),
                'failed':      sum(1 for t in tasks if t['status'] == 'failed'),
            })

        elif p == '/api/memory':
            self.send_json(read_project_memory())

        elif p == '/api/site-health':
            self.send_json(check_site_health())

        # Agent: all jobs
        elif p == '/api/agents':
            jobs = sorted(AGENT_JOBS.values(), key=lambda j: j.get('started',''), reverse=True)
            self.send_json(jobs[:30])

        # Agent: private memory
        elif p.startswith('/api/agent/memory/'):
            agent_type = p.split('/')[-1]
            self.send_json({'agent': agent_type, 'content': get_agent_memory(agent_type)})

        # Agent: all memories (orchestrator view)
        elif p == '/api/agent/memories':
            result = {}
            for a in ALL_AGENTS + ['orchestrator']:
                result[a] = get_agent_memory(a)
            self.send_json(result)

        # Agent: conversation history
        elif p.startswith('/api/agent/conversation/'):
            agent_type = p.split('/')[-1]
            self.send_json(get_conversation(agent_type))

        # Agent: latest job by type
        elif p.startswith('/api/agent/latest/'):
            agent_type = p.split('/')[-1]
            job_id = LATEST_JOB_BY_AGENT.get(agent_type)
            job = AGENT_JOBS.get(job_id) if job_id else None
            self.send_json(job or {'status': 'idle'})

        # Agent: specific job
        elif p.startswith('/api/agent/'):
            job_id = p.split('/')[-1]
            job = AGENT_JOBS.get(job_id)
            if not job: self.send_error(404); return
            self.send_json(job)

        else:
            self.send_error(404)

    def do_POST(self):
        p = self.path

        # Add task
        if p == '/api/tasks':
            data  = json.loads(self.read_body())
            title = data.get('title', '').strip()
            if not title:
                self.send_json({'error': 'title required'}, 400); return
            tasks = load_tasks()
            task  = {
                'id': str(uuid.uuid4())[:8], 'title': title,
                'description': data.get('description','').strip(),
                'priority': max(1, min(5, int(data.get('priority', 3)))),
                'status': 'pending', 'created': now_iso(), 'updated': now_iso(),
                'completed': None, 'work_log': None,
            }
            tasks.append(task)
            save_tasks(tasks)
            log_event(f"ADDED    [P{task['priority']}] {task['title']}  (id:{task['id']})")
            self.send_json(task, 201)

        # Run agent (or orchestrator)
        elif p == '/api/agent/run':
            data        = json.loads(self.read_body())
            agent_type  = data.get('agent', 'fullstack')
            instruction = data.get('instruction', '').strip()
            if not instruction:
                self.send_json({'error': 'instruction required'}, 400); return
            job_id = str(uuid.uuid4())[:8]
            AGENT_JOBS[job_id] = {
                'id': job_id, 'agent': agent_type, 'prompt': instruction,
                'status': 'pending', 'output': '', 'error': '',
                'dispatches': [], 'started': now_iso(), 'finished': None,
            }
            t = threading.Thread(target=run_agent_bg, args=(job_id, agent_type, instruction), daemon=True)
            t.start()
            log_event(f"AGENT    [{agent_type}] started — {instruction[:50]}")
            self.send_json({'job_id': job_id}, 201)

        # Update agent memory
        elif p.startswith('/api/agent/memory/'):
            agent_type = p.split('/')[-1]
            data = json.loads(self.read_body())
            set_agent_memory(agent_type, data.get('content', ''))
            self.send_json({'ok': True})

        # Clear conversation
        elif p.startswith('/api/agent/conversation/clear/'):
            agent_type = p.split('/')[-1]
            clear_conversation(agent_type)
            self.send_json({'ok': True})

        else:
            self.send_error(404)

    def do_PUT(self):
        m = re.match(r'^/api/tasks/([a-zA-Z0-9]+)$', self.path)
        if not m: self.send_error(404); return
        task_id = m.group(1)
        data    = json.loads(self.read_body())
        tasks   = load_tasks()
        for task in tasks:
            if task['id'] != task_id: continue
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
            self.send_json(task); return
        self.send_error(404)

    def do_DELETE(self):
        m = re.match(r'^/api/tasks/([a-zA-Z0-9]+)$', self.path)
        if not m: self.send_error(404); return
        task_id = m.group(1)
        tasks   = load_tasks()
        match   = next((t for t in tasks if t['id'] == task_id), None)
        if not match: self.send_error(404); return
        save_tasks([t for t in tasks if t['id'] != task_id])
        log_event(f"DELETED  [P{match['priority']}] {match['title']}  (id:{task_id})")
        self.send_json({'ok': True})


if __name__ == '__main__':
    server = HTTPServer(('localhost', PORT), Handler)
    print(f"  Runvex Dashboard  →  http://localhost:{PORT}")
    print(f"  Project memory    →  {MEMORY_DIR}")
    print(f"  Agent memory      →  {AGENT_MEMORY_DIR}")
    print(f"  Conversations     →  {CONV_DIR}")
    print(f"  Ctrl+C to stop\n")
    log_event(f"SERVER   started on port {PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log_event("SERVER   stopped")
        print("\nStopped.")
