# 🔄 Loop Agent

**Autonomous AI Agent that continuously creates and deploys AI infrastructure projects**

## Overview

Loop Agent is an autonomous agent that runs in a continuous **Plan → Build → Push** loop, creating production-ready AI infrastructure projects and deploying them to GitHub automatically.

## Features

- 🔄 **Continuous Loop** - Runs indefinitely creating projects
- 🎯 **10 MVP Projects** - Complete AI infrastructure stack
- 🚀 **Auto-Deploy** - Pushes to GitHub automatically
- 📊 **Real-time Dashboards** - Terminal and Web UI monitoring
- 🛡️ **Safe Mode** - Dry-run testing before live deployment
- 📈 **Progress Tracking** - Logs and statistics

## Quick Start

### Installation

```bash
git clone https://github.com/yksanjo/loop-agent.git
cd loop-agent
npm install
```

### Usage

```bash
# Test run (dry-run)
npm run loop -- --dry-run

# Live run (creates actual repos)
npm run loop -- --live

# View dashboard
npm run dashboard

# Web dashboard
npm run serve
```

## The Loop

```
┌─────────────┐
│   PLAN      │  Select next MVP project
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   BUILD     │  Create complete project structure
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   PUSH      │  Deploy to GitHub
└──────┬──────┘
       │
       ▼
   (Repeat)
```

## 10 MVP Projects

| # | Project | Language | Description |
|---|---------|----------|-------------|
| 1 | agent-waf | TypeScript | Web Application Firewall |
| 2 | agent-observability | Go | Monitoring & Tracing |
| 3 | agent-gateway | Rust | API Gateway |
| 4 | agent-memory-store | Python | Distributed Memory |
| 5 | agent-orchestrator | TypeScript | Workflow Engine |
| 6 | agent-registry | Go | Service Discovery |
| 7 | agent-policy-engine | Rust | Policy Enforcement |
| 8 | agent-cache | Python | Intelligent Caching |
| 9 | agent-queue | TypeScript | Message Queue |
| 10 | agent-config | Go | Configuration Mgmt |

## Commands

```bash
# Run loop
npm run loop              # Auto-detect auth
npm run loop -- --live    # Force live mode
npm run loop -- --dry-run # Test mode

# Visualization
npm run dashboard         # Terminal dashboard
npm run dashboard -- -w   # Watch mode
npm run serve             # Web dashboard (port 3456)
npm run serve -- -p 8080  # Custom port

# Help
npm run help
```

## Requirements

- Node.js v18+
- GitHub CLI (`gh`)
- Git configured

## Setup

```bash
# Install dependencies
npm install

# Authenticate with GitHub
gh auth login

# Verify
gh auth status
```

## Configuration

Edit `loop.js` to customize:

- Project list
- GitHub organization
- Batch size
- Delays
- Templates

## Dashboard

### Terminal Dashboard

```bash
npm run dashboard
```

Shows:
- Progress bar
- Project status
- Success rate
- Statistics

### Web Dashboard

```bash
npm run serve
```

Opens at http://localhost:3456

Features:
- Real-time updates
- Project cards
- Activity log
- GitHub links

## Logs

- **JSON**: `~/agent-infra-loop-log.json`
- **Text**: `~/agent-infra-loop.log`
- **Web**: `logs.json`

## Example Output

```
══════════════════════════════════════════════════════════
║  🚀 AI INFRASTRUCTURE LOOP - DASHBOARD                 ║
║  Target: github.com/yksanjo                            ║
╠════════════════════════════════════════════════════════╣
║  OVERALL PROGRESS                                      ║
║  ████████████████████████████████████████ 100%         ║
║  Completed: 10/10  |  Success: 10                       ║
╚════════════════════════════════════════════════════════╝
```

## Troubleshooting

### Not authenticated
```bash
gh auth login
```

### Port in use
```bash
lsof -ti:3456 | xargs kill -9
```

### Rate limits
Increase delay between iterations in config.

## License

MIT - Yoshi Kondo

## Links

- **GitHub**: https://github.com/yksanjo/loop-agent
- **Moltbook**: https://moltbook.com/u/AgentIngra
- **Agent Infrastructure**: https://github.com/yksanjo/agent-infrastructure
