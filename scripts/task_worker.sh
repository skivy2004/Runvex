#!/bin/bash
# task_worker.sh
# Hourly cron worker. Picks the highest-priority pending task and
# delegates it to Claude Code for autonomous execution.
# Usage: ./scripts/task_worker.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TASKS_FILE="$SCRIPT_DIR/../tools/todo/tasks.json"
LOG_FILE="$SCRIPT_DIR/../tools/todo/tasks.log"

log() {
  local ts
  ts=$(date +%Y-%m-%dT%H:%M:%S)
  echo "[$ts] $1" >> "$LOG_FILE"
  echo "[$ts] $1"
}

if [[ ! -f "$TASKS_FILE" ]]; then
  log "WORKER   tasks.json not found, skipping"
  exit 0
fi

python3 - "$TASKS_FILE" "$LOG_FILE" "$SCRIPT_DIR" << 'PYEOF'
import json, sys, os, uuid, datetime, subprocess

tasks_file = sys.argv[1]
log_file   = sys.argv[2]
script_dir = sys.argv[3]

def now_iso():
    return datetime.datetime.now().isoformat(timespec='seconds')

def log(msg):
    ts = now_iso()
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f"[{ts}] {msg}\n")

def save(tasks):
    tmp = tasks_file + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(tasks, f, indent=2, ensure_ascii=False)
    os.replace(tmp, tasks_file)

with open(tasks_file, encoding='utf-8') as f:
    tasks = json.load(f)

# Find highest priority pending task
pending = [t for t in tasks if t['status'] == 'pending']
if not pending:
    log("WORKER   no pending tasks — nothing to do")
    sys.exit(0)

task = min(pending, key=lambda t: t['priority'])

log(f"WORKER   picked [P{task['priority']}] {task['title']}  (id:{task['id']})")

# Mark in_progress
for t in tasks:
    if t['id'] == task['id']:
        t['status'] = 'in_progress'
        t['updated'] = now_iso()
        break
save(tasks)

# Build prompt for Claude
prompt = f"""You are an autonomous task worker. Complete the following task and report what you did.

Task: {task['title']}
Priority: P{task['priority']}
Description: {task.get('description', '(none)')}

Working directory: {os.path.dirname(script_dir)}

Instructions:
1. Complete the task using available tools
2. After completion, call the todo API to mark it done:
   curl -s -X PUT http://localhost:7001/api/tasks/{task['id']} \\
     -H 'Content-Type: application/json' \\
     -d '{{"status":"complete","work_log":"<one-line summary of what you did>"}}'
3. If you cannot complete it, mark it failed:
   curl -s -X PUT http://localhost:7001/api/tasks/{task['id']} \\
     -H 'Content-Type: application/json' \\
     -d '{{"status":"failed","work_log":"<reason>"}}'

Begin."""

log(f"WORKER   invoking Claude for task {task['id']}")

# Write prompt to temp file
prompt_file = f"/tmp/task_prompt_{task['id']}.txt"
with open(prompt_file, 'w') as f:
    f.write(prompt)

try:
    result = subprocess.run(
        ['claude', '--print', '--dangerously-skip-permissions', f'@{prompt_file}'],
        capture_output=True, text=True, timeout=300,
        cwd=os.path.dirname(script_dir)
    )
    output = result.stdout.strip()
    if output:
        # Log first 200 chars of Claude's response
        summary = output[:200].replace('\n', ' ')
        log(f"WORKER   Claude response: {summary}")
    if result.returncode != 0:
        log(f"WORKER   Claude exited {result.returncode}: {result.stderr[:200]}")
        # Mark failed if API not already updated
        with open(tasks_file, encoding='utf-8') as f:
            tasks2 = json.load(f)
        for t in tasks2:
            if t['id'] == task['id'] and t['status'] == 'in_progress':
                t['status'] = 'failed'
                t['work_log'] = f'claude exited {result.returncode}'
                t['updated'] = now_iso()
                break
        save(tasks2)
except subprocess.TimeoutExpired:
    log(f"WORKER   timeout after 5 min for task {task['id']}")
    with open(tasks_file, encoding='utf-8') as f:
        tasks2 = json.load(f)
    for t in tasks2:
        if t['id'] == task['id'] and t['status'] == 'in_progress':
            t['status'] = 'failed'
            t['work_log'] = 'timeout after 5 minutes'
            t['updated'] = now_iso()
            break
    save(tasks2)
except FileNotFoundError:
    log("WORKER   'claude' CLI not found — is it in PATH?")
    with open(tasks_file, encoding='utf-8') as f:
        tasks2 = json.load(f)
    for t in tasks2:
        if t['id'] == task['id'] and t['status'] == 'in_progress':
            t['status'] = 'pending'  # reset so it retries next hour
            t['updated'] = now_iso()
            break
    save(tasks2)
finally:
    if os.path.exists(prompt_file):
        os.unlink(prompt_file)

PYEOF
