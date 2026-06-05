# Database Schema

PostgreSQL schema managed by Prisma (`cms/backend/prisma/schema.prisma`).

## Core entities

| Model | Purpose |
|-------|---------|
| `User` | CMS users, MFA, password hash |
| `Role` / `Permission` / `UserRole` / `RolePermission` | RBAC |
| `RefreshToken` | Refresh token rotation |
| `AuditLog` | Security audit trail |
| `SiteSettings` | Global company/contact/SEO settings |
| `ContentEntry` | Key-value JSON content (`home.hero`, `pages.about`, etc.) |
| `Page` / `PageSection` / `PageRevision` | Dynamic pages + section builder + versioning |
| `ReusableSection` | Saved section templates |
| `Menu` / `MenuItem` | Header/footer/multi-level navigation |
| `MediaAsset` / `MediaFolder` | Media library |
| `Service` / `Solution` / `ComplianceFramework` | Cyber security modules |
| `CaseStudy` / `BlogPost` / `Resource` | Marketing content |

## Roles

- `SUPER_ADMIN` — full access
- `CONTENT_MANAGER` — pages, menus, media, publish
- `MARKETING_EDITOR` — blogs, landing pages, SEO content
- `VIEWER` — read-only

See `shared/constants/roles.ts` for permission mapping.

## Migrations

```bash
cd cms/backend
npx prisma migrate dev
npm run prisma:seed
```

Seed imports existing `website/src/content/*.json` into `ContentEntry`, menus, services, solutions, and default pages.
