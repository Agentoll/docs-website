# Vercel Static Gate Template

Use this template when your site is static (Vite/HTML/CSS/JS) and you want every URL to pass through `agent-toll`.

## Why this template exists

- `agentToll()` is Express-shaped middleware (`req.get`, `req.path`, `res.status().json()`), so the handler is wrapped in Express.
- Rewrites preserve original paths by forwarding `__site_path=/$1`.
- Static files are bundled from `.gate-build/**` into the function, preventing direct static-serving bypass.
- Extensionless URLs resolve in order: exact file, `.html`, then `/index.html`.

## Expected project layout

```text
your-project/
  api/
    gate.js
  .gate-build/
    index.html
    about.html
    docs/
      index.html
  vercel.json
```

## Required steps

1. Copy `api/gate.js` and `vercel.json` from this template.
2. Build your static site output into `.gate-build/`.
3. Set `AGENT_TOLL_WALLET` in your deployment environment if you want publisher payouts.
4. Keep your Vercel output directory pointed to a placeholder (or empty dir) so static files are not served ahead of `/api/gate`.

## Test checklist

```bash
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/            # expect 402
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/about       # expect 402
curl -H "User-Agent: GPTBot" https://your-site.vercel.app/about/      # expect 402
curl -H "User-Agent: GPTBot" "https://your-site.vercel.app/docs?a=1"  # expect 402

curl -A "Mozilla/5.0" https://your-site.vercel.app/                   # expect 200
```
