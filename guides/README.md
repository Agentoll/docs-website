# Agent-Toll: Add It To Your Website

**What it does:** AI bots and crawlers that hit your site get charged a tiny USDC fee (0.000002 USDC ≈ $0.000002) before they can read your content. Regular humans pass through for free, automatically.

**What you need:** An Ethereum wallet address on the Base network. That's it.

---

## Pick your setup

| I use... | Go to |
|----------|-------|
| Next.js | [Next.js](#nextjs) |
| Express / Node.js | [Express](#expressjs) |
| Plain HTML / static site on Vercel | [Static Site (Vercel)](#static-site-vercel) |
| SvelteKit / Cloudflare Workers / Bun | [Fetch Runtimes](#fetch-runtimes-sveltekit-cloudflare-workers-bun) |
| Just want to test locally | [Local Test](#local-test-no-website-needed) |

---

## Choose the right API shape

- Use `agentToll()` when your runtime is Express-style middleware (`req`, `res`, `next`).
- Use `agentTollFetch()` when your runtime is Fetch-based (`Request -> Response | null`), including Next.js middleware, SvelteKit hooks, Cloudflare Workers, and Bun.

If you are on static Vercel and need to protect every URL, use an Express wrapper in `api/gate.js` (template included in `guides/vercel-static-gate-template/`).

## Recommended setup order

Use this order for fastest time-to-value:

1. Next.js
2. Express
3. Static Site (Vercel)
4. Fetch runtimes (SvelteKit / Cloudflare Workers / Bun)
5. Local test

---

## Before You Start

You need a wallet address on Base to receive payments. If you don't have one:

1. Install [MetaMask](https://metamask.io) or [Coinbase Wallet](https://www.coinbase.com/wallet)
2. Add the **Base** network (it's in the network list — search "Base")
3. Copy your wallet address (starts with `0x`)

> **No wallet?** You can skip this and still use agent-toll — payments will go 100% to the platform operator instead of you. Good for testing.

---

## Static Site (Vercel)

Your site is plain HTML/CSS/JS on Vercel and you want every URL behind the toll.

Use the official template in `guides/vercel-static-gate-template/`.

**Step 1: Build static output into `.gate-build/`**

```
your-project/
  api/
    gate.js         ← copy from template
  .gate-build/      ← your static build output
    index.html
  vercel.json       ← copy from template
```

**Step 2: Copy `api/gate.js` + `vercel.json` from the template**

`api/gate.js` in the template includes:

- Express wrapper for `agentToll()` compatibility (`req.get`, `req.path`, `res.status().json()`).
- Rewrite path restoration using `__site_path`, so toll scope and file lookup use the original URL.
- Safe static file resolution with traversal protection.
- Extensionless route fallback order: exact file -> `.html` -> `/index.html`.
- Optional `AGENT_TOLL_WALLET` env support.

**Step 3: Install**

```bash
npm install agent-toll
```

**Step 4: Deploy**

```bash
vercel deploy
```

**Step 5: Test all common URL forms**

```bash
# Bot-like traffic should get 402:
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/about
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/about/
curl -H "User-Agent: GPTBot" "https://your-site.vercel.app/docs?a=1"

# Browser-like traffic should pass:
curl -A "Mozilla/5.0" https://your-site.vercel.app/
```

> Important: If Vercel serves static output directly before your function, toll checks are bypassed. The template avoids this by bundling `.gate-build/**` inside `api/gate.js` and routing all paths through the function.

---

## Next.js

**Step 1: Install**

```bash
npm install agent-toll
```

**Step 2: Create `middleware.js` at your project root**

```javascript
import { agentTollFetch } from 'agent-toll';
import { NextResponse } from 'next/server';

const toll = agentTollFetch({
  wallet: '0xYourWalletAddress'   // paste your wallet here
});

export async function middleware(request) {
  const response = await toll(request);
  if (response) return response;   // agent blocked with 402
  return NextResponse.next();       // human passes through
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)']
};
```

**Step 3: Deploy**

```bash
npm run build && vercel deploy
```

**Step 4: Test**

```bash
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/
# → 402 Payment Required
```

---

## Express.js

**Step 1: Install**

```bash
npm install agent-toll
```

**Step 2: Add one line to your server**

```javascript
const express = require('express');
const { agentToll } = require('agent-toll');

const app = express();

// Add this line — that's it:
app.use(agentToll({ wallet: '0xYourWalletAddress' }));

// Your existing routes stay exactly the same:
app.get('/', (req, res) => res.send('Hello world'));
app.get('/article/:id', (req, res) => res.json({ id: req.params.id }));

app.listen(3000);
```

**Protect only specific routes** (instead of everything):

```javascript
const { agentToll } = require('agent-toll');
const toll = agentToll({ wallet: '0xYourWalletAddress' });

app.get('/api/data', toll, (req, res) => {
  res.json({ secret: 'agents paid for this' });
});
```

**Test:**
```bash
curl -H "User-Agent: GPTBot" http://localhost:3000/
# → 402 Payment Required

curl http://localhost:3000/
# → Hello world
```

---

## Fetch Runtimes (SvelteKit / Cloudflare Workers / Bun)

All three runtimes use the same Fetch pattern:

```javascript
import { agentTollFetch } from 'agent-toll';

const toll = agentTollFetch({ wallet: '0xYourWalletAddress' });

const response = await toll(request);
if (response) return response;
```

Then wire it into your runtime-specific handler below.

### SvelteKit

**Step 1: Install**

```bash
npm install agent-toll
```

**Step 2: Create or edit `src/hooks.server.js`**

```javascript
import { agentTollFetch } from 'agent-toll';

const toll = agentTollFetch({
  wallet: '0xYourWalletAddress'   // paste your wallet here
});

export async function handle({ event, resolve }) {
  const response = await toll(event.request);
  if (response) return response;   // agent blocked with 402
  return resolve(event);            // human passes through
}
```

**Test:**
```bash
curl -H "User-Agent: GPTBot" http://localhost:5173/
# → 402 Payment Required
```

---

### Cloudflare Workers

**Step 1: Install**

```bash
npm install agent-toll
```

**Step 2: Edit your worker**

```javascript
import { agentTollFetch } from 'agent-toll';

const toll = agentTollFetch({
  wallet: '0xYourWalletAddress'   // paste your wallet here
});

export default {
  async fetch(request, env, ctx) {
    const response = await toll(request);
    if (response) return response;   // agent blocked with 402
    return fetch(request);            // human passes through
  }
};
```

**Deploy:**
```bash
wrangler deploy
```

---

### Bun

**Step 1: Install**

```bash
bun add agent-toll
```

**Step 2: Add to your server**

```javascript
import { agentTollFetch } from 'agent-toll';

const toll = agentTollFetch({ wallet: '0xYourWalletAddress' });

Bun.serve({
  async fetch(request) {
    const response = await toll(request);
    if (response) return response;

    return new Response('Hello world');
  }
});
```

---

## Local Test (No Website Needed)

Just want to see it working? Run this in a new folder:

```bash
mkdir toll-test && cd toll-test
npm init -y
npm install agent-toll express
```

Create `server.js`:

```javascript
const express = require('express');
const { agentToll } = require('agent-toll');

const app = express();
app.use(agentToll());   // no wallet = operator gets 100%

app.get('/', (req, res) => res.send('Hello human!'));

app.listen(3000, () => console.log('Running on http://localhost:3000'));
```

Run it:

```bash
node server.js
```

In another terminal:

```bash
# Bot gets blocked:
curl -H "User-Agent: GPTBot" http://localhost:3000/
# → 402 Payment Required

# Human gets through:
curl -A "Mozilla/5.0" http://localhost:3000/
# → Hello human!
```

---

## Options Reference

```javascript
agentToll({
  wallet: '0xYourWallet',          // your Base wallet address (omit → operator gets 100%)
  receiptTtlSeconds: 300,          // how long a paid receipt lasts (default: 5 minutes)
  maxRequestsPerMinute: 60,        // rate limit per agent wallet
  maxSpendPerScope: '1.0',         // USDC cap per agent per route
  maxSpendTotal: '10.0',           // USDC cap per agent total
  metrics: true,                   // enable /metrics endpoint (Prometheus)
  metricsPath: '/metrics',         // where metrics live
})
```

Same options work for `agentTollFetch()`.

---

## What the 402 Response Looks Like

When an AI bot hits your site without paying, they get an x402 challenge:

```json
{
  "version": 1,
  "accepts": [{
    "scheme": "exact",
    "network": "base-mainnet",
    "maxAmountRequired": "1",
    "payTo": "0xYourWallet",
    "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "extra": {
      "publisher_amount": "1",
      "commission_amount": "1",
      "commission_recipient": "0x...",
      "signer_address": "0x..."
    }
  }],
  "error": "X-PAYMENT header is required"
}
```

An agent using the `agent-toll-sdk` handles this automatically — it signs EIP-3009 authorizations and retries without any extra code on your end.

---

## FAQ

**Q: Do I need to set up a blockchain node or RPC?**
No. The package connects to Base mainnet automatically. You can optionally provide your own RPC URL via `BASE_RPC_URL` for better reliability.

**Q: Do I need a receipt signer private key?**
No for normal Node with disk — one is auto-created as `.agent-toll-signer.json`. For serverless, use your operator’s **remote receipt signing** API (`AGENT_TOLL_RECEIPT_SIGNING_*`) so you never hold the signing key.

**Q: What if I don't have a wallet?**
You can still use agent-toll — just omit the `wallet` option. Payments go 100% to the platform operator. Good for testing.

**Q: Does this affect Google SEO crawlers?**
Yes — Googlebot would be blocked. To allow specific bots through, don't apply the middleware to routes you want indexed, or check the user-agent in your route handler.

**Q: What about legitimate API clients?**
Any HTTP client that sends normal browser headers (Accept-Language, sec-ch-ua) passes through as a "human." Only clients that look like bots/agents get blocked.

**Q: How do agents pay?**
Agents using `agent-toll-sdk` handle payment automatically. Other agents need to implement the x402 payment flow — sign EIP-3009 `transferWithAuthorization` authorizations for publisher + commission, base64-encode them, and retry with the `X-PAYMENT` header. The publisher's middleware submits the on-chain transactions via its facilitator wallet.

**Q: What's the fee split?**
- With your wallet: you get 95%, platform operator gets 5%
- Without your wallet: platform operator gets 100%

**Q: Where do receipts get stored?**
By default, in memory (resets on restart). For persistent storage on a Node.js server, set `RECEIPT_STORE_PATH=/path/to/receipts.json`. For serverless/edge, receipts reset per cold start — agents may need to re-pay occasionally.

---

## Troubleshooting

**Humans are getting blocked**
The middleware uses browser fingerprinting (accept-language, sec-ch-ua headers). Make sure your frontend sends standard browser headers. If testing with curl, add `-A "Mozilla/5.0 (Macintosh; Intel Mac OS X)"`.

**Everyone is passing through (no 402)**
Check that `agentToll()` is added before your routes, not after.

**`req.get` / `req.path` / `res.status(...).json(...)` errors on serverless**
`agentToll()` is Express-shaped middleware. Wrap it in an Express app (see `guides/vercel-static-gate-template/api/gate.js`) or use `agentTollFetch()` in Fetch runtimes.

**Static Vercel routes bypass toll checks**
Do not rely on direct static output routing if you want global tolling. Route all paths through `api/gate`, forward `__site_path`, and include `.gate-build/**` in your function bundle.

**`/about` or `/docs` returns 404 but `/about.html` works**
Your gate resolver needs extensionless fallback: exact file, then `.html`, then `/index.html`. Use the template resolver to avoid this class of issue.

**ESM import errors in Vite / `"type": "module"` projects**
Use native ESM import syntax: `import { agentToll, agentTollFetch } from 'agent-toll';`

**`Cannot find module 'agent-toll'`**
Run `npm install agent-toll` in your project folder.

**Payments aren't being verified (MOCK mode)**
If you see `MOCK_PAYMENT_PROVIDER=true` in your environment, remove it. That's for local dev only.

**No publisher wallet set**
Set `AGENT_TOLL_WALLET` (or pass `wallet` in code) to receive payouts. If omitted, operator fallback behavior applies.
