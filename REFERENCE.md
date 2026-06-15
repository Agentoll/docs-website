# Reference

Documentation for **Agentoll** v3 — hosted script-tag SaaS + optional `agentoll` server gate.

## Start here

| Doc | Purpose |
|-----|---------|
| **[agentoll.net/setup](https://agentoll.net/setup)** | Overview and setup hub |
| **[agentoll.net/setup/script](https://agentoll.net/setup/script)** | Default quickstart (3 steps) |
| **[agentoll.net/setup/server-gate](https://agentoll.net/setup/server-gate)** | Optional Node/Express HTTP 402 |
| **[agentoll.net/register](https://agentoll.net/register)** | Register domain + wallet; get embed snippet |
| **[setup/faq.html](setup/faq.html)** | FAQ |
| **[setup/troubleshooting.html](setup/troubleshooting.html)** | Troubleshooting |

## Embed attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `src` | Yes | `https://agentoll-middleware-p5aon.ondigitalocean.app/v1/agent-toll.js` |
| `data-publisher-id` | Yes | `pub_…` from registration |
| `data-api-base` | No | API origin; defaults to script origin |

## Publisher API (stats)

- Header: `X-Publisher-Key` with your `atk_…` key
- `GET /v1/publishers/me/stats`
- `GET /v1/publishers/me/payments`

Base URL: https://agentoll-middleware-p5aon.ondigitalocean.app

## API contract

See the [agent-toll E2E spec](https://github.com/agent-toll/agent-toll/blob/main/docs/E2E_SEPOLIA_SPEC.md) in the API repo for full request/response shapes.

## Operator deployment

Platform operators (not typical publishers): [agent-toll server/README.md](https://github.com/agent-toll/agent-toll/blob/main/server/README.md).
