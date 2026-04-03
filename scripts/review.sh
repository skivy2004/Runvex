#!/bin/bash
# review.sh
# Surfaces all decisions flagged as REVIEW DUE.
# Usage: ./scripts/review.sh [--all] [--mark-reviewed <row_number>]
#   --all               Show all decisions, not just flagged ones
#   --mark-reviewed N   Mark decision number N as REVIEWED

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CSV="$SCRIPT_DIR/../memory/decisions.csv"
MODE="flagged"
MARK_ROW=""

for arg in "$@"; do
  case "$arg" in
    --all) MODE="all" ;;
    --mark-reviewed) MARK_ROW="${2:-}" ; shift ;;
    [0-9]*) MARK_ROW="$arg" ;;
  esac
done

if [[ ! -f "$CSV" ]]; then
  echo "ERROR: decisions.csv not found at $CSV" >&2
  exit 1
fi

python3 - "$CSV" "$MODE" "$MARK_ROW" << 'PYEOF'
import csv, sys, os
from datetime import date

csv_path = sys.argv[1]
mode     = sys.argv[2]   # "flagged" or "all"
mark_row = sys.argv[3]   # row number to mark reviewed, or ""

# ANSI colours
RED    = '\033[0;31m'
YELLOW = '\033[1;33m'
GREEN  = '\033[0;32m'
CYAN   = '\033[0;36m'
BOLD   = '\033[1m'
DIM    = '\033[2m'
RESET  = '\033[0m'

rows = []
with open(csv_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        rows.append(row)

# Mark reviewed if requested
if mark_row:
    idx = int(mark_row) - 1
    if 0 <= idx < len(rows):
        rows[idx]['status'] = 'REVIEWED'
        tmp = csv_path + '.tmp'
        with open(tmp, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        os.replace(tmp, csv_path)
        print(f"{GREEN}✓ Decision #{mark_row} marked as REVIEWED{RESET}")
    else:
        print(f"{RED}ERROR: No decision #{mark_row}{RESET}", file=sys.stderr)
    sys.exit(0)

# Filter
if mode == "flagged":
    display = [(i+1, r) for i, r in enumerate(rows) if r.get('status', '').strip() == 'REVIEW DUE']
else:
    display = [(i+1, r) for i, r in enumerate(rows)]

if not display:
    if mode == "flagged":
        print(f"{GREEN}✓ No decisions are due for review.{RESET}")
    else:
        print(f"{DIM}No decisions logged yet.{RESET}")
    sys.exit(0)

today = date.today().isoformat()
header = "DECISIONS DUE FOR REVIEW" if mode == "flagged" else "ALL DECISIONS"
overdue_count = sum(1 for _, r in display if r.get('status','').strip() == 'REVIEW DUE')

print()
print(f"{BOLD}{CYAN}{'─'*60}{RESET}")
print(f"{BOLD}{CYAN}  {header}{RESET}")
if mode == "flagged":
    print(f"{BOLD}{CYAN}  {overdue_count} item(s) — run today: {today}{RESET}")
print(f"{BOLD}{CYAN}{'─'*60}{RESET}")

for num, row in display:
    status = row.get('status', '').strip()
    if status == 'REVIEW DUE':
        status_label = f"{RED}● REVIEW DUE{RESET}"
    elif status == 'REVIEWED':
        status_label = f"{GREEN}✓ REVIEWED{RESET}"
    else:
        status_label = f"{DIM}○ pending{RESET}"

    print()
    print(f"  {BOLD}#{num}  {row['decision']}{RESET}  {status_label}")
    print(f"  {DIM}Logged:{RESET}    {row['date']}   {DIM}Review by:{RESET}  {row['review_date']}")
    print(f"  {DIM}Reasoning:{RESET} {row['reasoning']}")
    print(f"  {DIM}Expected:{RESET}  {row['expected_outcome']}")
    if status == 'REVIEW DUE':
        print(f"  {YELLOW}→ Mark resolved: ./scripts/review.sh --mark-reviewed {num}{RESET}")

print()
print(f"{BOLD}{CYAN}{'─'*60}{RESET}")
print(f"  {DIM}./scripts/review.sh --all | --mark-reviewed <#>{RESET}")
print(f"{BOLD}{CYAN}{'─'*60}{RESET}")
print()
PYEOF
