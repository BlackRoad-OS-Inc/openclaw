# INTEGRATION — openclaw

> How this fork connects to the rest of BlackRoad OS

## Node Assignment

| Property | Value |
|----------|-------|
| **Primary Node** | Octavia (.101) |
| **Fork Of** | Custom |
| **RoundTrip Agent** | OpenClaw Agent |
| **NLP Intents** | 'ask openclaw' / 'assistant' |
| **NATS Subject** | `blackroad.openclaw.>` |
| **GuardRail Monitor** | `https://guard.blackroad.io/status/openclaw` |

## Deployment

Deploy via blackroad-operator:

```bash
# From blackroad-operator
cd ~/blackroad-operator
./scripts/deploy/deploy-openclaw.sh

# Or via fleet coordinator
./fleet-coordinator.sh deploy openclaw

# Manual deploy to Octavia (.101)
ssh blackroad@$(echo "Octavia (.101)" | grep -oP '[0-9.]+' || echo "Octavia (.101)") \
  "cd /opt/blackroad/openclaw && git pull && sudo systemctl restart openclaw"
```

## Systemd Service

```ini
[Unit]
Description=BlackRoad openclaw (Custom fork)
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=blackroad
WorkingDirectory=/opt/blackroad/openclaw
ExecStart=/opt/blackroad/openclaw/start.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## NATS Integration (CarPool)

```bash
# Subscribe to openclaw events
nats sub "blackroad.openclaw.>" --server nats://192.168.4.101:4222

# Publish status
nats pub "blackroad.openclaw.status" '{"node":"Octavia (.101)","status":"running"}' \
  --server nats://192.168.4.101:4222
```

## RoundTrip Agent

The **OpenClaw Agent** manages this service via RoundTrip:

```bash
# Check agent status
curl -s https://roundtrip.blackroad.io/api/agents | jq '.[] | select(.name=="OpenClaw Agent")'

# Send command to agent
curl -X POST https://roundtrip.blackroad.io/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"agent":"OpenClaw Agent","message":"status","channel":"fleet"}'
```

## GuardRail Monitoring

Add to Uptime Kuma (Alice :3001):

| Check | URL/Command | Interval |
|-------|------------|----------|
| HTTP Health | `http://Octavia (.101):PORT/health` | 30s |
| Process | `systemctl is-active openclaw` | 60s |
| NATS Heartbeat | `blackroad.openclaw.heartbeat` | 60s |

## Memory System Integration

```bash
# Log actions
~/blackroad-operator/scripts/memory/memory-system.sh log deploy openclaw "Deployed to Octavia (.101)"

# Add solutions to Codex
~/blackroad-operator/scripts/memory/memory-codex.sh add-solution "openclaw" "How to restart" \
  "sudo systemctl restart openclaw"

# Broadcast learnings
~/blackroad-operator/scripts/memory/memory-til-broadcast.sh broadcast "openclaw" "Config change: ..."
```

## Related Components

| Component | Role | Connection |
|-----------|------|-----------|
| **TollBooth** (WireGuard) | VPN mesh | All traffic between nodes |
| **CarPool** (NATS) | Messaging | Event pub/sub on `blackroad.openclaw.>` |
| **GuardRail** (Uptime Kuma) | Monitoring | Health checks every 30s |
| **RoadMem** (Mem0) | Memory | Persistent agent state |
| **OneWay** (Caddy) | TLS Edge | HTTPS termination on Gematria |
| **RearView** (Qdrant) | Vector Search | Semantic search over openclaw logs |
| **BackRoad** (Portainer) | Containers | Docker management if containerized |
| **PitStop** (Pi-hole) | DNS | Internal `openclaw.blackroad.local` resolution |
