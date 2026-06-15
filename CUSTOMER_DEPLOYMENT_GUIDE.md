# Agentoll — publisher deployment

v3 is **hosted script-tag SaaS**. Optional **server gate** via the `agentoll` npm package. No self-hosted middleware or DNS setup for publishers.

## Script only (default)

1. **[Register](https://agentoll.net/register)** — domain + Base wallet (+ optional email).
2. **Embed** — paste the snippet into `<head>` on your registered hostname.
3. **Verify** — human traffic passes through; bot traffic triggers payment on Base.

Full guide: [setup/script.html](setup/script.html)

## Script + server gate (optional)

Same registration and embed, plus:

```bash
npm install agentoll
```

See [setup/server-gate.html](setup/server-gate.html).

## Requirements

- HTTPS on your site (recommended for production)
- Registered domain must match the hostname serving the script
- Save your `apiKey` at registration (shown once)

## Stats API

```bash
curl -H "X-Publisher-Key: atk_..." \
  "https://agentoll-middleware-p5aon.ondigitalocean.app/v1/publishers/me/stats"
```

See [setup/stats.html](setup/stats.html).

## Operator / platform deployment

If you run the Agent Toll API (not a typical publisher task), see the **agent-toll** repo: [server/README.md](https://github.com/agent-toll/agent-toll/blob/main/server/README.md).
