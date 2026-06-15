# Package Sources

Production URLs and v3 publisher integration (browser embed + server gate).

## Production

| Role | URL |
|------|-----|
| Marketing + setup | https://agentoll.net |
| Register | https://agentoll.net/register |
| API + embed script | https://agentoll-middleware-p5aon.ondigitalocean.app/v1/agent-toll.js |
| API health | https://agentoll-middleware-p5aon.ondigitalocean.app/health |

## npm (publishers)

| Package | Use |
|---------|-----|
| `agentoll` | Server gate — Layer 2 (Node/Express HTTP 402) — https://www.npmjs.com/package/agentoll |

Publisher setup: hosted browser embed + `agentoll` server gate.

## GitHub repositories

- `agent-toll`: https://github.com/agent-toll/agent-toll
- `agent-toll-docs`: this repo
