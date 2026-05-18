# agent-toll

Middleware that charges AI agents for access to your content. Humans pass through free.

## Quickstart

```bash
npm install agent-toll
```

```js
const express = require(‘express’);
const { agentToll } = require(‘agent-toll’);

const app = express();

// With your wallet — you receive 95% of each agent payment:
app.use(agentToll({ wallet: ‘0xYourWallet’ }));

// Or without a wallet — platform operator receives 100%:
// app.use(agentToll());

app.get(‘/article/:id’, (req, res) => {
  res.json({ content: ‘your protected content’ });
});

app.listen(3000);
```

That’s it. Agents hitting your routes get a `402 Payment Required` with USDC payment instructions. Once paid, they receive a signed receipt and can access freely until it expires.

---

## Runtime compatibility

Use the entrypoint that matches your runtime:

- `agentToll()` for Express-compatible middleware (`req`, `res`, `next`).
- `agentTollFetch()` for Fetch runtimes (`Request -> Response | null`) like Next.js middleware, SvelteKit hooks, Cloudflare Workers, and Bun.

If you are protecting a static Vercel site with an API function, wrap `agentToll()` inside an Express app (see `guides/vercel-static-gate-template/`).

## Recommended setup flow

Use this sequence in docs and onboarding:

1. Next.js
2. Express
3. Static site gate (Vercel)
4. Fetch runtimes (SvelteKit, Cloudflare Workers, Bun)
5. Local throwaway test server

## ESM and CommonJS

`agent-toll` supports both import styles:

```js
// CommonJS
const { agentToll, agentTollFetch } = require('agent-toll');

// ESM
import { agentToll, agentTollFetch } from 'agent-toll';
```

---

## Who this is for

| Role | What you use |
|------|----------------|
| **Publishers** | `npm install agent-toll` — protect your routes in minutes |
| **Agent developers** | `npm install agent-toll-sdk` — automatic payment handling |

## Documentation

- **Full setup guide:** [`CUSTOMER_DEPLOYMENT_GUIDE.md`](./CUSTOMER_DEPLOYMENT_GUIDE.md) (env vars, Docker, platform, security).

## Public SDK (agents)

```bash
npm install agent-toll-sdk
```

```js
const { AgentClient } = require('agent-toll-sdk');

const client = new AgentClient({
  wallet: process.env.AGENT_PRIVATE_KEY,
  baseUrl: process.env.BASE_URL
});

await client.get('/article/123');
```

Source in this repo: `sdk/` (publish with `npm publish` from `sdk/`). The root `agent-toll-sdk.js` file mirrors the published package for local development and tests.

### Maintainer: publish the SDK

```bash
cd sdk
npm publish --access=public
```

If the name `agent-toll-sdk` is already taken on npm, use a scoped name (e.g. `@yourcompany/agent-toll-sdk`) in `sdk/package.json`.

## Private operator layout (Docker / hidden backend)

These pieces are for **operators** who distribute pre-built images and keep backend implementation private:

- Private backend core: `agent-toll-core/` (package `@yourorg/agent-toll-core` — replace scope when you publish)
- Middleware container: `middleware/`
- Platform container: `platform/`
- Compose: `docker-compose.private.yml`
- Installer: `scripts/install-private-beta.sh`

```bash
docker build -t yourorg/agent-toll-middleware:beta ./middleware
docker build -t yourorg/agent-toll-platform:beta ./platform
cp .env.publisher.example .env.publisher
cp .env.platform.example .env.platform
docker compose -f docker-compose.private.yml up -d
```

## What is included

- `index.js`: `agentToll()` middleware
  - human bypass
  - agent detection
  - `402` challenge flow
  - on-chain USDC verification on Base
  - scoped/expiring/replay-protected receipts
  - persistent file-backed receipt storage
  - structured logging, metrics, rate limiting, spend caps
- **`agent-toll-sdk` (npm)** / root `agent-toll-sdk.js`: `AgentClient`
  - `get/post/put/patch`
  - automatic `402 -> pay -> retry`
  - retry with exponential backoff
  - receipt cache per scope
- `server.js`: local deployment entrypoint for middleware API routes
- `dashboard/index.html` + `dashboard/app.jsx`: React-based publisher dashboard UI
- `platform/server.js`: central multi-publisher aggregation service
- `platform/dashboard/*`: central platform dashboard UI
- `tests/e2e.test.js`: unit + integration coverage with local end-to-end flow

## Install

```bash
npm install
```

## Environment variables

### Publisher middleware (`npm start` / `server.js`)

**Minimum for payouts:** set `PUBLISHER_WALLET` (or use `agentToll({ wallet: '0x...' })`). Everything else is optional.

- `BASE_RPC_URL`: optional — defaults to `https://mainnet.base.org`. Use a dedicated provider for production throughput.
- `RECEIPT_SIGNER_PRIVATE_KEY`: optional — omit to auto-create `.agent-toll-signer.json` on first run (persistent disk). For serverless without a stable local key, use **remote signing** (operator): `AGENT_TOLL_RECEIPT_SIGNING_URL`, `AGENT_TOLL_RECEIPT_SIGNING_TOKEN`, and optionally `AGENT_TOLL_RECEIPT_SIGNER_ADDRESS`.
- `PUBLISHER_WALLET`: USDC payout address (or pass `wallet` in code).

### SDK-side (agents)

- `AGENT_PRIVATE_KEY`: agent wallet private key
- `BASE_URL`: middleware server URL (recommended default env name across examples)
- `AGENT_TOLL_BASE_URL`: supported alias for legacy scripts
- `BASE_RPC_URL`: optional — the SDK uses the `network` field from the `402` challenge when unset

### Other optional middleware env vars

- `PORT` (default `3000`)
- `RECEIPT_STORE_PATH` (default `./.agent-toll-receipts.json`)
- `RECEIPT_TTL_SECONDS` (default `300`)
- `MIDDLEWARE_LOGGING` (`true`/`false`, default `true`)
- `MIDDLEWARE_METRICS` (`true`/`false`, default `true`)
- `METRICS_PATH` (default `/metrics`)
- `MAX_REQUESTS_PER_WINDOW`
- `MAX_REQUESTS_PER_MINUTE` (preferred alias for beta controls)
- `MAX_AGENT_REQUESTS_PER_MINUTE` (supported alias)
- `RATE_LIMIT_WINDOW_SECONDS` (default `60`)
- `MAX_SPEND_PER_SCOPE` (USDC string, e.g. `0.00001`)
- `MAX_SPEND_TOTAL` (USDC string)
- `MAX_AGENT_SPEND_PER_SCOPE` (preferred alias)
- `MAX_AGENT_SPEND_TOTAL` (preferred alias)
- `FACILITATOR_PRIVATE_KEY` — private key of the wallet that submits on-chain TXs on behalf of agents (required in production; needs ETH on Base for gas)
- `MOCK_PAYMENT_PROVIDER` (`true`/`false`) for local non-chain testing
- `DASHBOARD_API_KEY` optional API key for `/dashboard/*` endpoints
- `PUBLISHER_API_KEY` optional API key for `/agent-toll/*` publisher reporting endpoints
- `PUBLISHER_ID` publisher identifier for central platform aggregation
- `COMMISSION_WALLET` — **not an env var**. The commission wallet is hardcoded in the middleware binary by the platform operator. Publishers cannot configure or override it.

## Run middleware locally

```bash
PUBLISHER_WALLET=0xYourPublisherWallet npm start
```

Optional: `BASE_RPC_URL`, `RECEIPT_SIGNER_PRIVATE_KEY`, or remote signing vars — see above.

Server starts at `http://localhost:3000`.

Protected endpoint examples:

- `GET /article/123`
- `POST /article/123/feedback`

Metrics endpoint (if enabled): `GET /metrics`

Dashboard endpoints:

- `GET /dashboard` (UI)
- `GET /dashboard/agents`
- `GET /dashboard/receipts`
- `GET /dashboard/payments`
- `GET /dashboard/metrics`

If `DASHBOARD_API_KEY` is set, send it as `x-dashboard-api-key` or `Authorization: Bearer ...`.

Publisher reporting endpoints (for central platform pull model):

- `POST /agent-toll/metrics`
- `GET /agent-toll/payments?since=<unixTimestamp>`

If `PUBLISHER_API_KEY` (or `DASHBOARD_API_KEY`) is set, provide `x-dashboard-api-key`.

## Publisher dashboard

Start the server, then open:

- `http://localhost:3000/dashboard`

Dashboard shows:

- agent wallets + total spend
- issued receipts and used status
- verified payments and tx hashes
- middleware counters (402, rate-limit blocks, spend-limit blocks)
- charts for spend per agent and spend per scope

## End-to-end agent flow test (real SDK + local middleware)

Use the provided integration example:

```bash
AGENT_PRIVATE_KEY=0x... \
BASE_URL=http://localhost:3000 \
node example-integration.js
```

Optional: `BASE_RPC_URL` if you want a specific RPC; otherwise the SDK follows the challenge `network`.

Expected flow:

1. SDK requests `/article/123`
2. Middleware returns `402` with x402 challenge if no valid receipt
3. SDK signs EIP-3009 authorizations and retries with `X-PAYMENT` header
4. Middleware verifies signatures, submits TXs via facilitator, issues receipt in `X-PAYMENT-RESPONSE`
5. SDK caches receipt and reuses on second call — no re-payment

## Automated tests

Run all unit + integration tests:

```bash
npm test
```

Covered scenarios:

- agent/human detection
- receipt parse and cache behavior
- full `402 -> payment -> receipt -> cached retry`
- per-agent rate limiting (`429`)
- spend cap enforcement (`402`)
- concurrent multi-agent access
- metrics exposure assertions

## Testing rate limits and spend limits manually

Start server with limits:

```bash
PUBLISHER_WALLET=0xYourPublisherWallet \
MAX_REQUESTS_PER_WINDOW=2 \
RATE_LIMIT_WINDOW_SECONDS=60 \
MAX_SPEND_TOTAL=0.00001 \
npm start
```

- Exceed request window from same agent wallet to get `402` with `beta_limit_exceeded`
- Exceed spend limit for fresh scopes to get `402` with `beta_limit_exceeded`

## Deploy options

### Node server (quickest)

Deploy `server.js` to any Node host (Render, Railway, Fly, EC2, etc.) with the env vars above.

## Central platform aggregation (multi-publisher)

The platform polls **each** publisher’s middleware (`POST /agent-toll/metrics`, `GET /agent-toll/payments`) using the API keys you configure. Add one JSON object per publisher deployment:

```bash
PUBLISHERS_JSON='[
  {"id":"news-site","name":"News Site","baseUrl":"https://api.news.example","apiKey":"secret-news"},
  {"id":"docs-site","name":"Docs Site","baseUrl":"https://api.docs.example","apiKey":"secret-docs"},
  {"id":"shop-site","name":"Shop Site","baseUrl":"https://api.shop.example","apiKey":"secret-shop"}
]' \
npm run start:platform
```

Use **`docker-compose.yml`** or **`.env.platform`** for the same `PUBLISHERS_JSON` pattern (see `.env.platform.example`).

Central platform URLs:

- `GET /` dashboard UI
- `GET /docs` developer-facing HTML guide
- `GET /api/platform/aggregate` aggregated metrics, spend, commission, and payouts across all publishers
- `GET /api/platform/snapshots` raw per-publisher snapshots

## Payment flow (x402 / EIP-3009)

1. Agent hits a protected route → `402` with an x402 challenge (amount, recipient, commission details)
2. SDK signs EIP-3009 `transferWithAuthorization` authorizations locally — no on-chain TX from the agent
3. SDK retries with signed authorizations in `X-PAYMENT` header
4. Middleware verifies signatures off-chain, submits TXs via its facilitator wallet, issues a signed receipt in `X-PAYMENT-RESPONSE`
5. SDK caches the receipt per scope and reuses it until TTL expires

**Commission split:** The x402 challenge includes `commission_amount` and `commission_recipient` (platform wallet, **5% fixed**, not configurable). The SDK signs both authorizations (publisher + commission) in the same `X-PAYMENT` header.

### Vercel / AWS Lambda / Cloudflare Worker

- Keep `agentToll()` as the core middleware logic.
- Wrap framework-specific request handlers around it.
- For static Vercel sites, use the official template in `guides/vercel-static-gate-template/` with:
  - rewrite path forwarding via `__site_path`
  - static bundle inclusion (`.gate-build/**`) in function config
  - extensionless fallback (`exact -> .html -> /index.html`)
- Use a durable shared store (Redis/managed DB) instead of local file storage in distributed/serverless environments.
- Optionally set `BASE_RPC_URL` / `paymentRpcUrl` for a dedicated RPC; otherwise the public Base endpoint is used by default.
- For stable receipts without a local signer key, configure **remote receipt signing** (`AGENT_TOLL_RECEIPT_SIGNING_*`) against an operator-hosted platform — see `CODEBASE_CONTEXT.md`.

#### Static Vercel smoke test matrix

Use these checks after deployment:

```bash
# Bot-like request should get 402 on every URL form:
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/about
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/about/
curl -H "User-Agent: GPTBot" "https://your-site.vercel.app/docs?a=1"

# Browser-like request should pass:
curl -A "Mozilla/5.0" https://your-site.vercel.app/
```

Wallet fallback expectation:

- `AGENT_TOLL_WALLET` set -> normal publisher split applies.
- `AGENT_TOLL_WALLET` unset -> operator fallback behavior applies.

## Notes for production

- File-based receipt storage is durable per instance, but not shared across replicas.
- For horizontal scaling, swap to a shared backend (Redis/Postgres/SQLite service).
- Keep `AGENT_PRIVATE_KEY` only on trusted agent runtimes, never in browser code.

## Beta notice

- Receipts are off-chain and signed by each publisher’s middleware.
- Default beta limits (spend/request caps) may change; configure limits explicitly for production.
- No SLA is implied; review `CUSTOMER_DEPLOYMENT_GUIDE.md` for security and operations.
