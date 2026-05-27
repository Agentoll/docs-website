# agent-toll-docs

Marketing site and publisher documentation for **Agentoll** — [https://agentoll.net](https://agentoll.net).

## Publisher docs

| Doc | Purpose |
|-----|---------|
| [register/index.html](register/index.html) | Register at `/register`, get embed snippet |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Register → embed → live |
| [index.html](index.html) | Homepage |
| [REFERENCE.md](REFERENCE.md) | URLs and embed attributes |

## Related

| Role | URL |
|------|-----|
| API + script CDN | https://agentoll-middleware-p5aon.ondigitalocean.app |
| API repo | `agent-toll` (DigitalOcean App Platform) |

## Local preview

```bash
npm run dev
```

`/get-started` redirects to `/register` (see [vercel.json](vercel.json)).

## Maintenance

Grep for obsolete hosts before deploy: `api.agentoll.net`, `cdn.agent-toll.sh`, `npm install agent-toll` as a publisher path.

See [PACKAGE_SOURCES.md](PACKAGE_SOURCES.md).
