# Getting started with Agentoll

**Default path:** register → embed → done (script only). Full guide: **[setup/script.html](setup/script.html)** on the site or [agentoll.net/setup/script](https://agentoll.net/setup/script).

- **Site:** [agentoll.net](https://agentoll.net)
- **Register:** [agentoll.net/register](https://agentoll.net/register)
- **Setup hub:** [agentoll.net/setup](https://agentoll.net/setup)

---

## 1. Register

Go to [agentoll.net/register](https://agentoll.net/register) and submit:

- **Domain** — hostname only (must match where you embed the script)
- **Wallet** — Base `0x…` address for revenue attribution
- **Email** — optional

You receive `publisherId`, `apiKey` (shown once), and an embed snippet.

## 2. Embed

```html
<script
  src="https://agentoll-middleware-p5aon.ondigitalocean.app/v1/agent-toll.js"
  data-publisher-id="pub_xxxxxxxx"
  async
></script>
```

`data-api-base` is optional when the script is loaded from the same API origin.

## 3. Done

- **Human browsers** — pass through free; no payment.
- **Bots / agents** — classify → payment wall → USDC on Base → session token.

Save your API key for optional [stats API](setup/stats.html) or [server gate](setup/server-gate.html). It is not needed in HTML for script-only.

---

## Optional: server gate

For Node / Express sites that need HTTP 402 for curl: [setup/server-gate.html](setup/server-gate.html).

```bash
npm install agentoll
```

---

## Production URLs

| Role | URL |
|------|-----|
| Register | https://agentoll.net/register |
| Setup | https://agentoll.net/setup |
| API + script | https://agentoll-middleware-p5aon.ondigitalocean.app |
| Health | https://agentoll-middleware-p5aon.ondigitalocean.app/health |
