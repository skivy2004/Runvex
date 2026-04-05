#!/usr/bin/env python3
"""
Runvex Control Dashboard — local web server
Run:  python3 tools/todo/server.py
Open: http://localhost:7001
"""
import json, os, uuid, datetime, re, threading, subprocess, base64, tempfile
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
        "Je bent de Hoofd Agent (Orchestrator) voor het Runvex project (/Users/jeremy/lead-automation).\n\n"
        "AGENT ROUTING — kies de juiste specialist:\n"
        "  frontend  → React/Next.js components, Tailwind CSS, UI/UX, animaties, app/components/\n"
        "  backend   → API routes (app/api/), Supabase, n8n workflows, Resend, server-side logica\n"
        "  marketing → copy, SEO, blogposts, teksten, content strategie\n"
        "  review    → security audits, OWASP, code review, TypeScript, performance\n"
        "  fullstack → taken die meerdere lagen raken, of niet duidelijk één laag\n\n"
        "Bij AUTO-TAAK: dispatch ALTIJD direct zonder bevestiging. Zet in de agent-instructie:\n"
        "  1. De volledige taakomschrijving + context\n"
        "  2. Het TAAK_ID zodat de agent de taak kan afronden\n"
        "  3. De curl-commando's om de taak als complete of needs_human te markeren\n\n"
        "DISPATCH formaat (EXACT, aan het einde van je antwoord):\n"
        "DISPATCH:\n"
        '[{"agent":"backend","instruction":"Voer uit: ...\\n\\nTAAK_ID: abc123\\nMarkeer af: curl -X PUT http://localhost:7001/api/tasks/abc123 -H \'Content-Type: application/json\' -d \'{\\"status\\":\\"complete\\",\\"work_log\\":\\"...\\"}\' "}]\n'
        "Gebruik DISPATCH ook als je wilt delegeren bij manuele verzoeken."
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

    # 6. Task management API
    tasks = load_tasks()
    open_tasks = [t for t in tasks if t['status'] in ('pending', 'in_progress')]
    task_list = '\n'.join(
        f"- id:{t['id']}  [{t['status']}]  P{t['priority']}  {t['title']}"
        for t in open_tasks[:20]
    ) or '(geen open taken)'
    sections.append(
        '# TAKENBEHEER\n'
        f'Openstaande taken in het systeem:\n{task_list}\n\n'
        'Je kunt taken beheren via curl naar http://localhost:7001:\n'
        '  Aanmaken:     curl -s -X POST http://localhost:7001/api/tasks -H \'Content-Type: application/json\' -d \'{"title":"...", "description":"...", "priority":2}\'\n'
        '                priority: 1=kritiek, 2=hoog, 3=normaal, 4=laag, 5=later\n'
        '  Starten:      curl -s -X PUT http://localhost:7001/api/tasks/TASK_ID -H \'Content-Type: application/json\' -d \'{"status":"in_progress"}\'\n'
        '  Afronden:     curl -s -X PUT http://localhost:7001/api/tasks/TASK_ID -H \'Content-Type: application/json\' -d \'{"status":"complete","work_log":"wat je gedaan hebt"}\'\n'
        '  Mislukt:      curl -s -X PUT http://localhost:7001/api/tasks/TASK_ID -H \'Content-Type: application/json\' -d \'{"status":"failed","work_log":"reden"}\'\n'
        '  Mens vereist: curl -s -X PUT http://localhost:7001/api/tasks/TASK_ID -H \'Content-Type: application/json\' -d \'{"status":"needs_human","work_log":"waarom Jeremy dit zelf moet doen"}\'\n\n'
        'Gebruik "needs_human" als de taak echte credentials vereist, inloggen op externe services, '
        'of handmatige browser-acties die buiten jouw bereik liggen.\n'
        'Maak nieuwe taken aan als je tijdens je werk vervolgstappen of problemen ontdekt die apart opgepakt moeten worden.\n'
        'Als de opdracht een specifieke taak-id vermeldt: markeer die taak als in_progress zodra je begint '
        'en als complete (of failed of needs_human) zodra je klaar bent.'
    )

    # 7. Memory update instruction
    sections.append(
        '# MEMORY INSTRUCTIE\n'
        'Als je iets wilt onthouden voor toekomstige gesprekken, voeg dan aan het EINDE van je antwoord toe:\n'
        'MEMORY_UPDATE:\n'
        '{wat je wilt onthouden — kort en feitelijk}'
    )

    # 8. Current task
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


# ── Live streaming helpers ────────────────────────────────────────────────────

TOOL_ICONS = {
    'Read': ('📄', '#5B6EF5'), 'Bash': ('⚡', '#ECB22E'), 'Edit': ('✏️', '#3ECF8E'),
    'Write': ('📝', '#3ECF8E'), 'Grep': ('🔍', '#9B6EF5'), 'Glob': ('📁', '#8A8FA8'),
    'WebSearch': ('🌐', '#5B6EF5'), 'WebFetch': ('🌐', '#5B6EF5'),
    'Agent': ('🤖', '#E8507A'), 'Task': ('📋', '#ECB22E'),
}

def _format_tool_event(name, inp):
    icon, color = TOOL_ICONS.get(name, ('🔧', '#8A8FA8'))
    if name == 'Read':
        path = inp.get('file_path', '')
        label = os.path.relpath(path, PROJECT_ROOT) if (path and path.startswith(PROJECT_ROOT)) else path
        return {'icon': icon, 'color': color, 'tool': name, 'label': label}
    elif name == 'Bash':
        cmd = inp.get('command', '')
        # Truncate long pipes
        label = cmd[:120] + ('…' if len(cmd) > 120 else '')
        return {'icon': icon, 'color': color, 'tool': name, 'label': label}
    elif name in ('Edit', 'Write'):
        path = inp.get('file_path', '')
        label = os.path.relpath(path, PROJECT_ROOT) if (path and path.startswith(PROJECT_ROOT)) else path
        return {'icon': icon, 'color': color, 'tool': name, 'label': label}
    elif name == 'Grep':
        pattern = inp.get('pattern', '')
        path = inp.get('path', '') or inp.get('glob', '')
        label = f"'{pattern}'" + (f'  in {path}' if path else '')
        return {'icon': icon, 'color': color, 'tool': name, 'label': label}
    elif name == 'Glob':
        return {'icon': icon, 'color': color, 'tool': name, 'label': inp.get('pattern', '')}
    elif name in ('WebSearch', 'WebFetch'):
        label = inp.get('query', inp.get('url', ''))[:100]
        return {'icon': icon, 'color': color, 'tool': name, 'label': label}
    else:
        first_val = next((str(v) for v in inp.values() if v), '') if inp else ''
        return {'icon': icon, 'color': color, 'tool': name, 'label': first_val[:100]}

def _process_stream_line(line, job_id):
    try:
        event = json.loads(line)
    except json.JSONDecodeError:
        return
    etype = event.get('type')
    if etype == 'assistant':
        for block in event.get('message', {}).get('content', []):
            if block.get('type') == 'tool_use':
                entry = _format_tool_event(block.get('name', ''), block.get('input', {}))
                AGENT_JOBS[job_id]['live_log'].append(entry)
            elif block.get('type') == 'thinking':
                t = block.get('thinking', '').strip()
                if t:
                    AGENT_JOBS[job_id]['live_log'].append({
                        'icon': '💭', 'color': '#8A8FA8', 'tool': 'thinking',
                        'label': t[:150] + ('…' if len(t) > 150 else ''),
                    })

def _extract_final_text(raw_lines):
    # Prefer the top-level result event
    for line in reversed(raw_lines):
        try:
            ev = json.loads(line)
            if ev.get('type') == 'result' and ev.get('subtype') == 'success':
                return ev.get('result', '')
        except Exception:
            pass
    # Fallback: concatenate all assistant text blocks
    texts = []
    for line in raw_lines:
        try:
            ev = json.loads(line)
            if ev.get('type') == 'assistant':
                for block in ev.get('message', {}).get('content', []):
                    if block.get('type') == 'text':
                        texts.append(block['text'])
        except Exception:
            pass
    return ''.join(texts)


# ── Model routing ────────────────────────────────────────────────────────────

MODEL_MAP = {
    'haiku':  'claude-haiku-4-5-20251001',
    'sonnet': 'claude-sonnet-4-6',
    'opus':   'claude-opus-4-6',
}
MODEL_COLORS = {
    'haiku':  '#3ECF8E',   # green  — goedkoop
    'sonnet': '#5B6EF5',   # blauw  — standaard
    'opus':   '#ECB22E',   # amber  — krachtig
}

def select_model(instruction, agent_type):
    """Roep Haiku aan om te beslissen welk model de hoofdtaak het beste uitvoert."""
    routing_prompt = (
        "Je bent een AI model router. Kies het meest geschikte Claude model voor deze taak.\n\n"
        f"Agent: {agent_type}\n"
        f"Taak: {instruction[:600]}\n\n"
        "Opties:\n"
        "- haiku:  eenvoudige taken — tekst schrijven, uitleg geven, copy, korte lookups, simpele vragen\n"
        "- sonnet: standaard codeer- en bouwtaken — features, bugfixes, componenten, API routes, refactors\n"
        "- opus:   complexe taken — grote architectuurbeslissingen, uitgebreide security-audits, "
        "kritieke multi-file refactors, alles waarbij fouten grote gevolgen hebben\n\n"
        'Antwoord ALLEEN met geldig JSON op één regel: {"model":"haiku|sonnet|opus","reason":"één zin in het Nederlands"}'
    )
    try:
        res = subprocess.run(
            ['claude', '-p', routing_prompt, '--model', MODEL_MAP['haiku']],
            capture_output=True, text=True, timeout=20, cwd=PROJECT_ROOT,
        )
        text = res.stdout.strip()
        m = re.search(r'\{[^{}]+\}', text)
        if m:
            data = json.loads(m.group())
            key = data.get('model', 'sonnet')
            if key not in MODEL_MAP:
                key = 'sonnet'
            return key, data.get('reason', '')
    except Exception:
        pass
    return 'sonnet', 'Fallback naar standaard model'


def route_task_agent(task):
    """
    Haiku-call die bepaalt welke agent een taak moet uitvoeren.
    Geeft (agent_key, needs_human: bool, reason) terug.
    """
    routing_prompt = (
        "Je bent een taak-router voor een Next.js / Supabase / n8n project.\n"
        "Bepaal welke specialist-agent deze taak moet uitvoeren, OF dat een mens het moet doen.\n\n"
        "AGENTS:\n"
        "  frontend  — React/Next.js components, Tailwind CSS, UI, animaties, app/components/\n"
        "  backend   — API routes (app/api/), Supabase, n8n, Resend, server-side code\n"
        "  marketing — copy, SEO, blogposts, content, teksten\n"
        "  review    — security audits, code review, OWASP, TypeScript, performance\n"
        "  fullstack — taken die meerdere lagen raken, of niet duidelijk één laag\n"
        "  human     — vereist inloggen op externe service, browser-actie, echte credentials,\n"
        "              handmatige stappen buiten de codebase (Calendly, Slack webhook, DNS, etc.)\n\n"
        f"Taak titel: {task['title']}\n"
        f"Beschrijving: {(task.get('description') or '')[:400]}\n\n"
        'Antwoord ALLEEN met geldig JSON op één regel:\n'
        '{"agent":"frontend|backend|marketing|review|fullstack|human","reason":"één zin"}'
    )
    try:
        res = subprocess.run(
            ['claude', '-p', routing_prompt, '--model', MODEL_MAP['haiku']],
            capture_output=True, text=True, timeout=25, cwd=PROJECT_ROOT,
        )
        m = re.search(r'\{[^{}]+\}', res.stdout.strip())
        if m:
            data   = json.loads(m.group())
            agent  = data.get('agent', 'fullstack')
            reason = data.get('reason', '')
            if agent == 'human':
                return 'human', True, reason
            if agent not in ('frontend', 'backend', 'marketing', 'review', 'fullstack'):
                agent = 'fullstack'
            return agent, False, reason
    except Exception:
        pass
    return 'fullstack', False, 'Fallback naar fullstack agent'


# ── Agent runner ──────────────────────────────────────────────────────────────

def run_agent_bg(job_id, agent_type, instruction, uploaded_files=None):
    AGENT_JOBS[job_id]['status']   = 'running'
    AGENT_JOBS[job_id]['live_log'] = []
    LATEST_JOB_BY_AGENT[agent_type] = job_id

    # Write uploaded files to temp dir and append paths to instruction
    temp_paths = []
    if uploaded_files:
        for f in uploaded_files:
            try:
                name     = f.get('name', 'upload')
                data_url = f.get('data', '')
                if ',' in data_url:
                    _, b64 = data_url.split(',', 1)
                else:
                    b64 = data_url
                raw  = base64.b64decode(b64)
                ext  = os.path.splitext(name)[1] or ''
                tmp  = tempfile.NamedTemporaryFile(delete=False, suffix=ext, prefix=f'runvex-{job_id}-')
                tmp.write(raw)
                tmp.close()
                temp_paths.append((name, tmp.name))
            except Exception as e:
                pass  # skip bad file silently
        if temp_paths:
            note = '\n\nBijgevoegde bestanden (gebruik je Read tool om ze te lezen):\n'
            note += '\n'.join(f'- {orig} → {path}' for orig, path in temp_paths)
            instruction = instruction + note

    history = get_conversation(agent_type)
    history.append({'role': 'user', 'content': instruction, 'ts': now_iso()})
    full_prompt = build_prompt(agent_type, instruction)

    # ── Model routing ──
    model_key, model_reason = select_model(instruction, agent_type)
    model_id = MODEL_MAP[model_key]
    AGENT_JOBS[job_id]['model']        = model_key
    AGENT_JOBS[job_id]['model_reason'] = model_reason
    AGENT_JOBS[job_id]['live_log'].append({
        'icon': '🧩', 'color': MODEL_COLORS[model_key], 'tool': model_key,
        'label': model_reason,
    })
    log_event(f"MODEL    [{agent_type}] → {model_key} — {model_reason[:60]}")

    try:
        proc = subprocess.Popen(
            ['claude', '-p', full_prompt, '--output-format', 'stream-json', '--verbose',
             '--model', model_id],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            text=True, bufsize=1, cwd=PROJECT_ROOT,
        )

        raw_lines = []
        for line in proc.stdout:
            line = line.rstrip('\n')
            if not line:
                continue
            raw_lines.append(line)
            _process_stream_line(line, job_id)

        proc.wait(timeout=300)
        stderr_out = proc.stderr.read().strip()

        raw = _extract_final_text(raw_lines)
        clean, dispatches = parse_output(agent_type, raw, instruction)

        AGENT_JOBS[job_id]['output']     = clean
        AGENT_JOBS[job_id]['error']      = stderr_out
        AGENT_JOBS[job_id]['dispatches'] = dispatches
        AGENT_JOBS[job_id]['status']     = 'done' if proc.returncode == 0 else 'failed'

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
                    'live_log': [], 'dispatches': [],
                    'started': now_iso(), 'finished': None,
                    'dispatched_by': 'orchestrator',
                }
                t = threading.Thread(target=run_agent_bg, args=(sub_id, sub_agent, sub_instr), daemon=True)
                t.start()
                log_event(f"DISPATCH [{sub_agent}] via orchestrator — {sub_instr[:50]}")

    except subprocess.TimeoutExpired:
        proc.kill()
        AGENT_JOBS[job_id]['status'] = 'failed'
        AGENT_JOBS[job_id]['error']  = 'Timeout na 5 minuten'
    except FileNotFoundError:
        AGENT_JOBS[job_id]['status'] = 'failed'
        AGENT_JOBS[job_id]['error']  = '`claude` CLI niet gevonden.'
    except Exception as e:
        AGENT_JOBS[job_id]['status'] = 'failed'
        AGENT_JOBS[job_id]['error']  = str(e)

    # Cleanup temp files
    for _, path in temp_paths:
        try: os.unlink(path)
        except: pass

    AGENT_JOBS[job_id]['finished'] = now_iso()
    log_event(f"AGENT    [{agent_type}] {AGENT_JOBS[job_id]['status']} — {instruction[:50]}")


# ── Auto task runner ──────────────────────────────────────────────────────────

AUTO_RUNNER_STATUS = {'running': False, 'current_task_id': None, 'current_task_title': None}

def auto_task_runner():
    """
    Background thread:
    1. Haiku-call bepaalt welke agent de taak uitvoert (of needs_human).
    2. De gekozen agent voert de taak direct uit — orchestrator wordt NIET gebruikt.
    3. Wacht op de taak-status (niet job-status) voor de volgende taak.
    """
    import time
    time.sleep(15)
    while True:
        try:
            tasks = load_tasks()
            runnable = sorted(
                [t for t in tasks if not t.get('human_only') and t['status'] == 'pending'],
                key=lambda t: (t.get('priority', 3), t.get('created', ''))
            )
            if runnable:
                task = runnable[0]
                tid  = task['id']

                # ── Stap 1: Haiku bepaalt de agent (snel, goedkoop) ──
                agent, is_human, reason = route_task_agent(task)
                log_event(f"ROUTE    taak {tid[:6]} → {agent} ({reason[:60]})")

                if is_human:
                    # Meteen markeren als needs_human, geen agent starten
                    fresh = load_tasks()
                    for t2 in fresh:
                        if t2['id'] == tid:
                            t2['status']   = 'needs_human'
                            t2['work_log'] = reason
                            t2['updated']  = now_iso()
                            break
                    save_tasks(fresh)
                    log_event(f"AUTO     taak {tid[:6]} → needs_human (routing)")
                    time.sleep(5)
                    continue

                # ── Stap 2: wacht als de agent al bezig is ──
                existing_id  = LATEST_JOB_BY_AGENT.get(agent)
                existing_job = AGENT_JOBS.get(existing_id) if existing_id else None
                if existing_job and existing_job.get('status') in ('pending', 'running'):
                    time.sleep(20)
                    continue

                # ── Stap 3: markeer in_progress zodat loop hem niet dubbel pakt ──
                fresh = load_tasks()
                for t2 in fresh:
                    if t2['id'] == tid:
                        t2['status']         = 'in_progress'
                        t2['suggested_agent'] = agent
                        t2['updated']        = now_iso()
                        break
                save_tasks(fresh)

                AUTO_RUNNER_STATUS['running']            = True
                AUTO_RUNNER_STATUS['current_task_id']    = tid
                AUTO_RUNNER_STATUS['current_task_title'] = task['title']

                # ── Stap 4: bouw instructie voor de gekozen agent ──
                instruction = (
                    f"Voer de volgende taak volledig uit.\n\n"
                    f"Taak ID : {tid}\n"
                    f"Prioriteit: P{task.get('priority', 3)}\n"
                    f"Titel   : {task['title']}\n"
                    f"Beschrijving:\n{task.get('description', '(geen beschrijving)')}\n\n"
                    f"Begin direct — geen bevestiging nodig.\n\n"
                    f"Wanneer klaar:\n"
                    f"  curl -s -X PUT http://localhost:7001/api/tasks/{tid} "
                    f"-H 'Content-Type: application/json' "
                    f"-d '{{\"status\":\"complete\",\"work_log\":\"<wat je gedaan hebt>\"}}'\n\n"
                    f"Als je het NIET kunt uitvoeren (externe toegang, echte credentials, browser):\n"
                    f"  curl -s -X PUT http://localhost:7001/api/tasks/{tid} "
                    f"-H 'Content-Type: application/json' "
                    f"-d '{{\"status\":\"needs_human\",\"work_log\":\"<reden>\"}}'  "
                )

                job_id = str(uuid.uuid4())[:8]
                AGENT_JOBS[job_id] = {
                    'id': job_id, 'agent': agent, 'prompt': instruction,
                    'status': 'pending', 'output': '', 'error': '',
                    'live_log': [], 'dispatches': [],
                    'started': now_iso(), 'finished': None,
                    'auto_task_id': tid,
                }
                threading.Thread(
                    target=run_agent_bg, args=(job_id, agent, instruction), daemon=True
                ).start()
                log_event(f"AUTO     [{agent}] taak {tid[:6]}: {task['title'][:40]}")

                # ── Stap 5: wacht tot taak-status terminaal is ──
                for _ in range(120):  # max 10 minuten
                    time.sleep(5)
                    current = next((t for t in load_tasks() if t['id'] == tid), None)
                    if current and current['status'] not in ('pending', 'in_progress'):
                        log_event(f"AUTO     taak {tid[:6]} → {current['status']}")
                        break

                AUTO_RUNNER_STATUS['running']            = False
                AUTO_RUNNER_STATUS['current_task_id']    = None
                AUTO_RUNNER_STATUS['current_task_title'] = None

        except Exception as e:
            AUTO_RUNNER_STATUS['running'] = False
            log_event(f"AUTO-ERR {e}")

        time.sleep(20)


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

        elif p == '/logo.png':
            logo_path = os.path.join(BASE, 'logo.png')
            if os.path.exists(logo_path):
                with open(logo_path, 'rb') as f: body = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'image/png')
                self.send_header('Content-Length', str(len(body)))
                self.send_header('Cache-Control', 'public, max-age=86400')
                self.end_headers()
                self.wfile.write(body)
            else:
                self.send_error(404)

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
                'total':        len(tasks),
                'pending':      sum(1 for t in tasks if t['status'] == 'pending'),
                'in_progress':  sum(1 for t in tasks if t['status'] == 'in_progress'),
                'complete':     sum(1 for t in tasks if t['status'] == 'complete'),
                'failed':       sum(1 for t in tasks if t['status'] == 'failed'),
                'needs_human':  sum(1 for t in tasks if t['status'] == 'needs_human'),
            })

        elif p == '/api/auto-runner':
            self.send_json(AUTO_RUNNER_STATUS)

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

        # Agent: all current states (for cross-tab sync)
        elif p == '/api/agent/states':
            result = {}
            for a in ALL_AGENTS + ['orchestrator']:
                job_id = LATEST_JOB_BY_AGENT.get(a)
                job = AGENT_JOBS.get(job_id) if job_id else None
                result[a] = {
                    'status':       job['status']                if job else 'idle',
                    'job_id':       job_id,
                    'live_log':     job.get('live_log', [])      if job else [],
                    'prompt':       job.get('prompt', '')        if job else '',
                    'started':      job.get('started', '')       if job else '',
                    'model':        job.get('model', '')         if job else '',
                    'model_reason': job.get('model_reason', '')  if job else '',
                }
            self.send_json(result)

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
            files       = data.get('files', [])
            if not instruction:
                self.send_json({'error': 'instruction required'}, 400); return

            # Reject if this agent is already running (prevents double-runs from multiple tabs)
            existing_id  = LATEST_JOB_BY_AGENT.get(agent_type)
            existing_job = AGENT_JOBS.get(existing_id) if existing_id else None
            if existing_job and existing_job.get('status') in ('pending', 'running'):
                self.send_json({'already_running': True, 'job_id': existing_id}, 409); return

            job_id = str(uuid.uuid4())[:8]
            AGENT_JOBS[job_id] = {
                'id': job_id, 'agent': agent_type, 'prompt': instruction,
                'status': 'pending', 'output': '', 'error': '',
                'live_log': [], 'dispatches': [],
                'started': now_iso(), 'finished': None,
            }
            t = threading.Thread(target=run_agent_bg, args=(job_id, agent_type, instruction, files), daemon=True)
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
            if 'title'          in data: task['title']          = data['title'].strip()
            if 'description'    in data: task['description']    = data['description'].strip()
            if 'priority'       in data: task['priority']       = max(1, min(5, int(data['priority'])))
            if 'status'         in data: task['status']         = data['status']
            if 'work_log'       in data: task['work_log']       = data['work_log']
            if 'human_only'     in data: task['human_only']     = bool(data['human_only'])
            if 'agent_runnable' in data: task['agent_runnable'] = bool(data['agent_runnable'])
            if 'suggested_agent'in data: task['suggested_agent']= data['suggested_agent']
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
    # Start background threads
    threading.Thread(target=auto_task_runner, daemon=True).start()

    server = HTTPServer(('localhost', PORT), Handler)
    print(f"  Runvex Dashboard  →  http://localhost:{PORT}")
    print(f"  Project memory    →  {MEMORY_DIR}")
    print(f"  Agent memory      →  {AGENT_MEMORY_DIR}")
    print(f"  Conversations     →  {CONV_DIR}")
    print(f"  Auto-executor     →  aan (controleert elke 20s)")
    print(f"  Ctrl+C to stop\n")
    log_event(f"SERVER   started on port {PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        log_event("SERVER   stopped")
        print("\nStopped.")
