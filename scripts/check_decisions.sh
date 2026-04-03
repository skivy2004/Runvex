#!/bin/bash
# check_decisions.sh
# Runs daily via cron. Flags any decisions whose review_date has passed.
# Usage: ./scripts/check_decisions.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CSV="$SCRIPT_DIR/../memory/decisions.csv"

if [[ ! -f "$CSV" ]]; then
  echo "ERROR: decisions.csv not found at $CSV" >&2
  exit 1
fi

python3 - "$CSV" << 'PYEOF'
import csv, sys, os
from datetime import date

csv_path = sys.argv[1]
today = date.today().isoformat()
rows = []
flagged = 0

with open(csv_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        review = row.get('review_date', '').strip()
        status = row.get('status', '').strip()
        if review and review <= today and status not in ('REVIEW DUE', 'REVIEWED'):
            row['status'] = 'REVIEW DUE'
            flagged += 1
        rows.append(row)

# Rewrite only if something changed
if flagged:
    tmp = csv_path + '.tmp'
    with open(tmp, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    os.replace(tmp, csv_path)
    print(f"[{today}] Flagged {flagged} decision(s) as REVIEW DUE in {csv_path}")
else:
    print(f"[{today}] No decisions due for review.")
PYEOF
