# CoreBridge Security Platform

Monorepo containing a **headless CMS** and the **Sentinel Cyber Security** marketing website. Non-technical users manage all public content through the CMS admin UI—no React code changes required.

## Structure

```
project-root/
├── website/          # Next.js 14 public site (CMS-driven)
├── cms/
│   ├── backend/      # NestJS + Prisma + PostgreSQL + Redis
│   └── admin/        # React + MUI admin dashboard
├── shared/           # Shared TypeScript types & RBAC constants
└── docker/           # docker-compose + Dockerfiles + Nginx
```

## Quick start (local)

### 1. Install dependencies

```bash
npm install
```

### 2. Start infrastructure

```bash
npm run docker:up
```

Or run PostgreSQL and Redis locally and copy `cms/backend/.env.example` to `cms/backend/.env`.

### 3. Database

```bash
cd cms/backend
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4. Run all apps

```bash
npm run dev
```

| Service     | URL                          |
|------------|------------------------------|
| Website    | http://localhost:3000        |
| CMS API    | http://localhost:4000/api    |
| API Docs   | http://localhost:4000/api/docs |
| CMS Admin  | http://localhost:5173        |

**Default admin:** `admin@corebridge.security` / `ChangeMe!Secure123` (set via `SEED_ADMIN_*` in `.env`).

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database schema](docs/DATABASE.md)
- [Migration guide (JSON → CMS)](docs/MIGRATION.md)
- [Security](docs/SECURITY.md)

## CMS API (public)

- `GET /api/content/bundle` — full content tree for the website
- `GET /api/pages/{slug}` — page + sections
- `GET /api/menu/header` · `GET /api/menu/footer`
- `GET /api/settings` · `GET /api/services` · `GET /api/solutions`
- `GET /api/blogs` · `GET /api/case-studies`

Preview: `GET /api/pages/{slug}?preview=true&id={pageId}` → website `/preview/{id}`

## Production

```bash
docker compose -f docker/docker-compose.yml up --build
```

See `docs/ARCHITECTURE.md` for scaling, caching, and security hardening.
