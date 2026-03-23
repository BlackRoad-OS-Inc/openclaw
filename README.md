# openclaw

> Lucidia — Personal AI assistant by BlackRoad OS. Fork of OpenClaw. Multi-channel (WhatsApp, Telegram, Slack, Discord, 20+). Local Ollama inference. Proprietary.

Part of the [BlackRoad OS](https://blackroad.io) ecosystem — [BlackRoad-OS-Inc](https://github.com/BlackRoad-OS-Inc)

---

# Lucidia — Personal AI Assistant by BlackRoad OS

> Forked from [OpenClaw](https://github.com/openclaw/openclaw). Rebranded and customized for BlackRoad OS infrastructure.

**Lucidia** is your personal AI assistant that runs on your own devices. Connect it to WhatsApp, Telegram, Slack, Discord, Signal, iMessage, and 20+ channels. Powered by local Ollama inference on your Pi fleet — no cloud API keys needed.

## Why Lucidia?

- **Sovereign** — runs on YOUR hardware (Raspberry Pi, Mac, Linux)
- **Private** — your conversations never leave your network
- **Multi-channel** — WhatsApp, Telegram, Slack, Discord, Signal, iMessage, IRC, Matrix, and more
- **Local AI** — powered by Ollama (llama3.2, mistral, gemma2, deepseek-r1)
- **Persistent memory** — remembers your conversations across sessions
- **35 AI agents** — each with unique personality and skills

## Quick Start

```bash
# Clone
git clone https://github.com/BlackRoad-OS-Inc/openclaw.git lucidia
cd lucidia

# Install
npm install  # or pnpm install

# Configure
cp .env.example .env
# Edit .env — set OLLAMA_URL=http://192.168.4.96:11434 (or your Ollama)

# Run
npm start
```

## BlackRoad Integration

- **Ollama**: Points to Cecilia (192.168.4.96) or any fleet node running Ollama
- **Memory**: Uses RoadMem for persistent agent memory
- **RoundTrip**: Connects to roundtrip.blackroad.io for fleet agent coordination
- **Auth**: Uses auth.blackroad.io for user authentication

## Original Project

This is a fork of [OpenClaw](https://github.com/openclaw/openclaw) — MIT licensed.
All BlackRoad customizations are proprietary. © 2026 BlackRoad OS, Inc.

---

**BlackRoad OS — Pave Tomorrow.**
