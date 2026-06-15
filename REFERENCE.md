# Reference

Documentation for **Agentoll** v3 — browser embed + `agentoll` server gate.

## Start here

| Doc | Purpose |
|-----|---------|
| **[agentoll.net/setup](https://agentoll.net/setup)** | Overview — two layers of protection |
| **[agentoll.net/setup/integration](https://agentoll.net/setup/integration)** | Browser embed + server gate |
| **[agentoll.net/register](https://agentoll.net/register)** | Register domain + wallet |
| **[setup/faq.html](setup/faq.html)** | FAQ |
| **[setup/troubleshooting.html](setup/troubleshooting.html)** | Troubleshooting |

## Embed attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `src` | Yes | `https://agentoll-middleware-p5aon.ondigitalocean.app/v1/agent-toll.js` |
| `data-publisher-id` | Yes | `pub_…` from registration |
| `data-api-base` | No | API origin; defaults to script origin |

## Server gate

- Package: `agentoll` — https://www.npmjs.com/package/agentoll
- API key (`atk_…`) required in `createGate({ apiKey })`

## Publisher API (stats)

- Header: `X-Publisher-Key` with your `atk_…` key
- `GET /v1/publishers/me/stats`
- `GET /v1/publishers/me/payments`

Base URL: https://agentoll-middleware-p5aon.ondigitalocean.app

## API contract

See the [Agentoll E2E spec](https://github.com/agent-toll/agent-toll/blob/main/docs/E2E_SEPOLIA_SPEC.md).

## Operator deployment

Platform operators: [server/README.md](https://github.com/agent-toll/agent-toll/blob/main/server/README.md).
