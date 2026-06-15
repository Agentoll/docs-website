# Register page integration (agentoll.net)

Publisher onboarding at `/register` posts to the hosted middleware API and shows credentials once.

## Registration form fields

| Field | Required | Notes |
|-------|----------|-------|
| Domain | Yes | Hostname only (no `https://`, paths, or `www.`) |
| Wallet address | Yes | `0x` + 40 hex — payout attribution |
| Email | No | Support / recovery only |
| Tier | No (UI only) | **Script only** or **Script + server gate** — same API; gate tier shows extra instructions after signup |

Do **not** collect alternate origin URLs, DNS proxy records, or DNS setup instructions.

## API

```http
POST https://agentoll-middleware-p5aon.ondigitalocean.app/v1/publishers/register
Content-Type: application/json

{"walletAddress":"0x...","domain":"example.com","email":"ops@example.com"}
```

- Override API base for local dev: `?api=http://localhost:8787` or `<meta name="agent-toll-api-base" …>`.
- CORS must allow the docs origin (`REGISTRATION_CORS_ORIGINS` on the API).

## Success screen (in order)

1. **Publisher ID** — `pub_…`
2. **API key** — `atk_…` (shown once; copy + “save now” warning)
3. **Embed snippet** — script tag (no `data-api-base` when script is served from the API origin):

```html
<script
  src="https://agentoll-middleware-p5aon.ondigitalocean.app/v1/agent-toll.js"
  data-publisher-id="pub_xxxx"
  async
></script>
```

4. **Server gate** (only if user chose “Script + server gate”):

```bash
npm install agentoll
```

```js
const { createGate } = require('agentoll');
app.use(createGate({ apiKey: 'atk_...' }).express());
```

See [agentoll on npm](https://www.npmjs.com/package/agentoll) for package docs.

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
