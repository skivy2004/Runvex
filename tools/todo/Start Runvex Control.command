#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# Runvex Control — start alles op met één klik
# Dubbelklik dit bestand in Finder om te starten.
# ──────────────────────────────────────────────────────────────────────────────
cd "$(dirname "$0")"

echo ""
echo "  ██████╗ ██╗   ██╗███╗   ██╗██╗   ██╗███████╗██╗  ██╗"
echo "  ██╔══██╗██║   ██║████╗  ██║██║   ██║██╔════╝╚██╗██╔╝"
echo "  ██████╔╝██║   ██║██╔██╗ ██║██║   ██║█████╗   ╚███╔╝ "
echo "  ██╔══██╗██║   ██║██║╚██╗██║╚██╗ ██╔╝██╔══╝   ██╔██╗ "
echo "  ██║  ██║╚██████╔╝██║ ╚████║ ╚████╔╝ ███████╗██╔╝ ██╗"
echo "  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝"
echo ""
echo "  Runvex Control  —  Gemma 4 (Ollama)"
echo ""

# ── Stap 1: Stop eventueel bestaande server op poort 7001 ──────────────────
if lsof -ti:7001 &>/dev/null; then
  echo "  ⚡ Bestaande server op :7001 stoppen..."
  lsof -ti:7001 | xargs kill -9 2>/dev/null || true
  sleep 0.5
fi

# ── Stap 2: Controleer of Ollama geïnstalleerd is ─────────────────────────
if ! command -v ollama &>/dev/null; then
  echo ""
  echo "  ❌ Ollama niet gevonden!"
  echo "  Installeer via: https://ollama.com/download"
  echo ""
  read -p "  Druk op Enter om te sluiten..."
  exit 1
fi

# ── Stap 3: Start Ollama als het niet draait ──────────────────────────────
if ! curl -s http://localhost:11434/api/tags &>/dev/null; then
  echo "  🚀 Ollama opstarten (2 parallel requests)..."
  OLLAMA_NUM_PARALLEL=2 ollama serve &>/tmp/ollama.log &
  OLLAMA_PID=$!

  # Wacht tot Ollama klaar is (max 15 seconden)
  for i in $(seq 1 15); do
    sleep 1
    if curl -s http://localhost:11434/api/tags &>/dev/null; then
      echo "  ✅ Ollama gestart"
      break
    fi
    echo "  ⏳ Wachten op Ollama... ($i/15)"
  done

  if ! curl -s http://localhost:11434/api/tags &>/dev/null; then
    echo "  ❌ Ollama kon niet opstarten. Check /tmp/ollama.log"
    read -p "  Druk op Enter om te sluiten..."
    exit 1
  fi
else
  echo "  ✅ Ollama draait al"
fi

# ── Stap 4: Zorg dat de modellen beschikbaar zijn ─────────────────────────
echo ""
echo "  📦 Modellen controleren..."

# Klein model (sub-agents)
if ollama list | grep -q "gemma4:latest"; then
  echo "  ✅ gemma4:latest (sub-agents) beschikbaar"
else
  echo "  ⬇️  gemma4 downloaden (sub-agents, ~9.6 GB)..."
  ollama pull gemma4
  echo "  ✅ gemma4 klaar"
fi

# Groot model (orchestrator)
if ollama list | grep -q "gemma3:27b"; then
  echo "  ✅ gemma3:27b (27B) beschikbaar"
else
  echo "  ⬇️  gemma3:27b downloaden (orchestrator, ~17 GB)..."
  ollama pull gemma3:27b
  echo "  ✅ gemma3:27b klaar"
fi

# ── Stap 5: Open browser na korte vertraging ─────────────────────────────
echo ""
echo "  🌐 Browser openen op http://localhost:7001..."
(sleep 1.5 && open http://localhost:7001) &

# ── Stap 6: Start Runvex Control server ──────────────────────────────────
echo ""
echo "  ✅ Runvex Control  →  http://localhost:7001"
echo "  🤖 Orchestrator    →  Gemma 3 27B (ollama)"
echo "  🤖 Sub-agents      →  Gemma 4 9B  (ollama)"
echo ""
echo "  Ctrl+C om te stoppen"
echo ""

python3 server.py
