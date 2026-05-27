# Agentoll — publisher deployment

Agentoll is **script-tag only**. There is no self-hosted middleware path for publishers.

## Steps

1. **[Register](https://agentoll.net/register)** — domain + Base wallet (+ optional email).
2. **Embed** — paste the snippet into `<head>` on your registered hostname.
3. **Verify** — human traffic passes through; bot traffic triggers payment on Base.

## Requirements

- HTTPS on your site (recommended for production)
- Registered domain must match the hostname serving the script
- Save your `apiKey` at registration (shown once)

## Stats API

```bash
curl -H "X-Publisher-Key: atk_..." \
  "https://agentoll-middleware-p5aon.ondigitalocean.app/v1/publishers/me/stats"
```

## Operator / platform deployment

If you run the Agent Toll API (not a typical publisher task), see the **agent-toll** repo: `server/README.md` and `.env.example`.
