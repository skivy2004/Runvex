#!/usr/bin/env bash
# Verwerkt frontend/index.html en vult N8N_WEBHOOK_URL in vanuit .env
# Gebruik: ./build.sh
# Output: dist/index.html

set -euo pipefail

ENV_FILE="$(dirname "$0")/.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "Fout: .env bestand niet gevonden op $ENV_FILE" >&2
  exit 1
fi

# Laad .env (sla commentaarregels en lege regels over)
set -a
# shellcheck source=.env
source "$ENV_FILE"
set +a

mkdir -p "$(dirname "$0")/dist"

envsubst '${N8N_WEBHOOK_URL}' \
  < "$(dirname "$0")/frontend/index.html" \
  > "$(dirname "$0")/dist/index.html"

echo "Gebouwd: dist/index.html (webhook: $N8N_WEBHOOK_URL)"
