# Getting started with Agentoll

**Two layers:** browser embed + server gate. Full guide: [agentoll.net/setup](https://agentoll.net/setup).

- **Site:** [agentoll.net](https://agentoll.net)
- **Register:** [agentoll.net/register](https://agentoll.net/register)

---

## 1. Register

Go to [agentoll.net/register](https://agentoll.net/register) and submit:

- **Domain** — hostname only (must match where you embed the script)
- **Wallet** — Base `0x…` address for revenue attribution
- **Email** — optional

You receive `publisherId`, `apiKey` (shown once), embed snippet, and server gate instructions.

## 2. Browser embed (Layer 1)

```html
<script
  src="https://agentoll-middleware-p5aon.ondigitalocean.app/v1/agent-toll.js"
  data-publisher-id="pub_xxxxxxxx"
  async
></script>
```

Paste in `<head>`. Human detection and in-browser payment wall.

## 3. Server gate (Layer 2)

```bash
npm install agentoll
```

```js
const { createGate } = require('agentoll');
app.use(createGate({ apiKey: process.env.AGENTOLL_API_KEY }).express());
```

HTTP 402 for curl and unpaid agents. See [setup/server-gate.html](setup/server-gate.html).

---

## Production URLs

| Role | URL |
|------|-----|
| Register | https://agentoll.net/register |
| Setup | https://agentoll.net/setup |
| API + script | https://agentoll-middleware-p5aon.ondigitalocean.app |
| Health | https://agentoll-middleware-p5aon.ondigitalocean.app/health |
