# Package Sources

This docs site references production URLs and the v3 publisher integration path.

## Production (script-tag SaaS)

| Role | URL |
|------|-----|
| Marketing + setup | https://agentoll.net |
| Register | https://agentoll.net/register |
| API + embed script | https://agentoll-middleware-p5aon.ondigitalocean.app/v1/agent-toll.js |
| API health | https://agentoll-middleware-p5aon.ondigitalocean.app/health |

## npm (publishers)

| Package | Use |
|---------|-----|
| `agentoll` | Optional server gate (Node/Express HTTP 402) — https://www.npmjs.com/package/agentoll |

Publisher onboarding uses the hosted script tag. Optional server gate: the `agentoll` npm package.

## Obsolete (audit before deploy)

Remove legacy API hosts, legacy CDN hosts, self-hosted middleware install paths, DNS proxy setup, and old middleware helpers from publisher docs.

## GitHub repositories

- `agent-toll`: https://github.com/agent-toll/agent-toll
- `agent-toll-docs`: this repo
