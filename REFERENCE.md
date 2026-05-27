# Reference

Documentation for **Agentoll** script-tag SaaS.

## Start here

| Doc | Purpose |
|-----|---------|
| **[agentoll.net/register](https://agentoll.net/register)** | Register domain + wallet; get embed snippet |
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | Register → embed → live |
| **[index.html](index.html)** | Homepage and embed attribute reference |

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
