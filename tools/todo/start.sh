#!/bin/bash
# start.sh — launch the Todo Dashboard server and open it in your browser
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "  Starting Todo Dashboard..."
echo ""

# Kill any existing server on port 7001
if lsof -ti:7001 &>/dev/null; then
  echo "  Stopping existing server on :7001"
  lsof -ti:7001 | xargs kill -9 2>/dev/null || true
  sleep 0.5
fi

# Open browser after short delay
(sleep 1 && open http://localhost:7001) &

# Start server
python3 "$SCRIPT_DIR/server.py"
