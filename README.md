# agentoll-docs

Marketing site and publisher documentation for **Agentoll** — [https://agentoll.net](https://agentoll.net).

## Publisher docs (v3)

| Doc | Purpose |
|-----|---------|
| [setup/index.html](setup/index.html) | Setup overview — `/setup` |
| [setup/integration.html](setup/integration.html) | Browser embed + server gate — `/setup/integration` |
| [setup/embed.html](setup/embed.html) | Embed attributes + framework examples |
| [setup/faq.html](setup/faq.html) | FAQ |
| [setup/troubleshooting.html](setup/troubleshooting.html) | Troubleshooting |
| [setup/stats.html](setup/stats.html) | Stats API |
| [register/index.html](register/index.html) | Register at `/register` |
| [REGISTER_PAGE_INTEGRATION.md](REGISTER_PAGE_INTEGRATION.md) | Register page API contract |
| [index.html](index.html) | Homepage |

## Related

| Role | URL |
|------|-----|
| API + script CDN | https://agentoll-middleware-p5aon.ondigitalocean.app |
| API repo | [agentoll](https://github.com/agent-toll/agent-toll) |

## Local preview

```bash
npm run dev
```

`/get-started` redirects to `/register` (see [vercel.json](vercel.json)).

## Maintenance

Before deploy, search publisher-facing pages for obsolete integration paths (legacy API/CDN hosts, self-hosted middleware, DNS proxy setup). See [PACKAGE_SOURCES.md](PACKAGE_SOURCES.md).
