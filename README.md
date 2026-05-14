# Atelier Dashboard

Operational overview of all Atelier-hosted sites — uptime, deploys, traffic at a glance. Single dashboard, partner-shareable.

Deployed at `dashboard.atelierworks.co`.

## Stack

- **Next.js 16** App Router · TypeScript strict · Tailwind v4
- **Clerk** for auth (single Atelier org, partners as members)
- **Vercel** hosting
- Data sources: Cloudflare API · GitHub API · PostHog API
- Site registry: `config/sites.json` (file-based; v2 may move to DB if list grows past ~10 sites)

## Local development

```bash
pnpm install
cp .env.local.example .env.local
# fill in the Clerk keys from https://dashboard.clerk.com
pnpm dev
```

Open <http://localhost:3000>. The middleware redirects to `/sign-in` if you're not authenticated.

## Configuration

### Adding a new site

Edit [`config/sites.json`](./config/sites.json) and add an entry:

```json
{
  "slug": "client-x-site",
  "name": "Client X — Brand Site",
  "description": "Short one-liner about what this site is.",
  "url": "https://clientx.com",
  "github": { "owner": "atelierworks", "repo": "client-x-site", "branch": "main" },
  "cloudflare": { "zoneId": "abc123..." },
  "posthog": { "projectId": "98765" }
}
```

Push to main, Vercel redeploys, the new site appears on the home dashboard.

### Environment variables

See [`.env.local.example`](./.env.local.example) for the full list. Clerk keys are required to even sign in; CF / GitHub / PostHog tokens get wired in starting in S2.

## Build phases

| Session | What ships |
|---|---|
| **S1** (current) | Scaffold · Clerk auth · empty site grid · site detail shell · ready-to-deploy |
| **S2** | Cloudflare uptime + GitHub last-deploy on each card |
| **S3** | PostHog 7-day pageviews + sparkline + site detail charts |
| **S4** | Polish + visual-regression baseline |

## Deployment notes

1. Create a Clerk app at <https://dashboard.clerk.com>, copy publishable + secret keys
2. Push repo to GitHub (under whichever Atelier owner you've settled on)
3. `vercel link` → connect to a new Vercel project named `atelier-dashboard`
4. Add the Clerk env vars in Vercel
5. Vercel domain settings → add `dashboard.atelierworks.co`
6. Cloudflare DNS → CNAME `dashboard` → `cname.vercel-dns.com` (proxy: DNS only)

Once `dashboard.atelierworks.co` resolves, sign in and you're live.

## Project layout

```
atelier-dashboard/
├── config/
│   └── sites.json           # site registry — edit to add tracked sites
├── src/
│   ├── app/
│   │   ├── layout.tsx       # ClerkProvider wrapper
│   │   ├── page.tsx         # dashboard home (site grid)
│   │   ├── sign-in/         # Clerk-hosted sign-in
│   │   ├── sign-up/         # Clerk-hosted sign-up
│   │   └── sites/[slug]/    # per-site detail
│   ├── components/
│   │   ├── Header.tsx
│   │   └── SiteCard.tsx
│   ├── lib/
│   │   └── sites.ts         # site registry accessor
│   └── proxy.ts             # Clerk auth gate (everything except /sign-in, /sign-up)
└── .env.local.example
```
