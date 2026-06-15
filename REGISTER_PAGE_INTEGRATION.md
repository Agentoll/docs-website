# Register page integration (agentoll.net)

Publisher onboarding at `/register` posts to the hosted middleware API and shows both layers of setup.

## Registration form fields

| Field | Required | Notes |
|-------|----------|-------|
| Domain | Yes | Hostname only (no `https://`, paths, or `www.`) |
| Wallet address | Yes | `0x` + 40 hex — payout attribution |
| Email | No | Support / recovery only |

Do **not** collect alternate origin URLs, DNS proxy records, or DNS setup instructions.

## API

```http
POST https://agentoll-middleware-p5aon.ondigitalocean.app/v1/publishers/register
Content-Type: application/json

{"walletAddress":"0x...","domain":"example.com","email":"ops@example.com"}
```

## Success screen (in order)

1. **Publisher ID** — `pub_…`
2. **API key** — `atk_…` (shown once; copy + “save now” warning)
3. **Browser embed** — script tag:

```html
<script
  src="https://agentoll-middleware-p5aon.ondigitalocean.app/v1/agent-toll.js"
  data-publisher-id="pub_xxxx"
  async
></script>
```

4. **Server gate** — always shown:

```bash
npm install agentoll
```

```js
const { createGate } = require('agentoll');
app.use(createGate({ apiKey: 'atk_...' }).express());
```

Link: [setup/integration](setup/integration.html) · [agentoll on npm](https://www.npmjs.com/package/agentoll)

## Registration errors

| `errorReason` | User message |
|---------------|--------------|
| `wallet_and_domain_required` | Domain and wallet are required |
| `invalid_wallet` | Enter a valid Base wallet address |
| `invalid_domain` | Enter a valid domain |
| `domain_already_registered` | This domain is already registered |
| `registration_unavailable` | Registration is temporarily unavailable — try again |

## Implementation

Static page: [register/index.html](register/index.html).
