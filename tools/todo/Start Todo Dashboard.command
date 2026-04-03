#!/bin/bash
cd "$(dirname "$0")"

# Kill any existing server on port 7001
if lsof -ti:7001 &>/dev/null; then
  echo "  Stopping existing server on :7001"
  lsof -ti:7001 | xargs kill -9 2>/dev/null || true
  sleep 0.5
fi

echo ""
echo "  Todo Dashboard  →  http://localhost:7001"
echo "  Ctrl+C to stop"
echo ""

(sleep 1 && open http://localhost:7001) &
python3 server.py
