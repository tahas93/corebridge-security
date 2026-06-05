# Migration Guide: Static JSON → CMS

## What changed

| Before | After |
|--------|-------|
| `website/src/content/*.json` | CMS `ContentEntry` + API `/api/content/bundle` |
| Static routes (`/about`, `/services`) | Dynamic `[[...slug]]` from CMS `Page` records |
| `import { content } from '@/lib/content'` | `getSiteContent()` / `useContent()` from CMS |
| `lib/data.tsx` sync arrays | `getServices()`, `getSolutions()`, etc. via API |

JSON files remain in `website/src/content/` **only for seeding** the database.

## Steps

1. Start PostgreSQL and run `npm run db:migrate` and `npm run db:seed` from repo root.
2. Copy `website/.env.example` → `website/.env.local` with `CMS_API_URL`.
3. Verify website at http://localhost:3000 loads home page sections from CMS.
4. Log into CMS Admin and edit content; confirm changes appear after revalidation (default 60s).
5. Create new pages in Admin with slug e.g. `services/managed-soc` — no code deploy needed.

## Component updates

- **Server components:** `await getSiteContent()` or `await cmsApi.getX()`.
- **Client components:** wrap in layout provider, use `useContent()` from `@/lib/content-client`.
- **Icons:** still mapped in `lib/data.tsx` by `icon` string from CMS entities.

## Rollback

Point `CMS_API_URL` to a stale environment or re-seed from JSON. Do not re-enable `src/content/index.ts` in production.
