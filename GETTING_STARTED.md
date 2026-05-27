# Getting started with Agentoll

Register your site, paste one script tag in `<head>`, and go live. No npm install, facilitator keys, or RPC configuration.

- **Site:** [agentoll.net](https://agentoll.net)
- **Register:** [agentoll.net/register](https://agentoll.net/register)

---

## 1. Register

Submit:

- **Domain** — hostname only (must match where you embed the script)
- **Wallet** — Base `0x…` address for revenue attribution
- **Email** — optional

You receive `publisherId`, `apiKey` (shown once), and an embed snippet.

## 2. Embed

```html
<script
  src="https://agentoll-middleware-p5aon.ondigitalocean.app/v1/agent-toll.js"
  data-publisher-id="pub_xxxxxxxx"
  data-api-base="https://agentoll-middleware-p5aon.ondigitalocean.app"
  async
></script>
```

`data-api-base` is optional when the script is loaded from the same API origin.

## 3. Done

- **Human browsers** — script exits; no payment.
- **Bots / agents** — classify → payment wall → USDC on Base → session JWT.

Use your API key with `X-Publisher-Key` for `GET /v1/publishers/me/stats` and `/v1/publishers/me/payments`.

---

## Production URLs

| Role | URL |
|------|-----|
| Register | https://agentoll.net/register |
| API + script | https://agentoll-middleware-p5aon.ondigitalocean.app |
