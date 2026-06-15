# Agentoll — publisher deployment

v3 is **browser embed + server gate** on the hosted API. No self-hosted middleware or DNS setup.

## Full setup (Node / Express)

1. **[Register](https://agentoll.net/register)** — domain + Base wallet; save API key.
2. **Browser embed** — paste script into `<head>`.
3. **Server gate** — `npm install agentoll` and mount middleware before routes.

Guides: [setup/integration.html](setup/integration.html)

## Static / hosted HTML

Use the browser embed. Add the server gate when you run a Node backend.

## Requirements

- HTTPS recommended
- Registered domain must match page origin
- API key shown once at registration — required for server gate

## Stats API

```bash
curl -H "X-Publisher-Key: atk_..." \
  "https://agentoll-middleware-p5aon.ondigitalocean.app/v1/publishers/me/stats"
```

## Operator deployment

See [server/README.md](https://github.com/agent-toll/agent-toll/blob/main/server/README.md) in the Agentoll repo.
