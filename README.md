# CoreBridge Web App

Monorepo containing a **headless CMS** and the **CoreBridge Web App** marketing website. Non-technical users manage all public content through the CMS admin UI—no React code changes required.

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

### 2. Configure environment

```bash
cd cms/backend
copy .env.local.example .env.local   # local dev
copy .env.example .env               # production (on host only)
```

- **Dev** (`NODE_ENV=development`) → loads **`.env.local`**
- **Live** (`NODE_ENV=production`) → loads **`.env`**

See [docs/HOSTING.md](docs/HOSTING.md) for full hosting steps.

### 3. Start infrastructure (local)

```bash
npm run docker:up
```

### 4. Database

```bash
cd cms/backend
npm run prisma:migrate:dev   # uses .env.local
npm run prisma:seed
```

### 5. Run all apps

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
- [Hosting & environments (local vs Neon)](docs/HOSTING.md)
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
