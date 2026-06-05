# Hosting Guide

How to run CoreBridge Web App locally vs on demo/production hosting.

## Environment files

The CMS backend uses **two separate env files** (not one file with `_LOCAL` / `_PROD` suffixes):

| File | When loaded | Purpose |
|------|-------------|---------|
| **`.env.local`** | `NODE_ENV` is **not** `production` | Local development |
| **`.env`** | `NODE_ENV=production` | Live / demo hosting (optional if the host injects env vars, e.g. Render) |

Selection is automatic in:

- NestJS API (`src/config/load-env-file.ts` → imported at startup)
- Prisma CLI (`scripts/prisma-with-env.mjs`)
- Seed script (`prisma/seed.ts`)

Templates:

- `.env.local.example` → copy to `.env.local`
- `.env.example` → copy to `.env` on your server

Both real env files are gitignored.

### Local `.env.local` (example)

```env
NODE_ENV=development
DATABASE_URL=postgresql://cms:cms_secret@localhost:5432/corebridge_cms?schema=public
REDIS_URL=redis://localhost:6379
```

### Production `.env` (example)

```env
NODE_ENV=production
DATABASE_URL=postgresql://...@neon.tech/neondb?sslmode=require
REDIS_URL=rediss://default:...@....upstash.io:6379
```

---

## Local development

### 1. Create local env

```bash
cd cms/backend
copy .env.local.example .env.local
```

### 2. Start infrastructure

```bash
npm run docker:up
```

From repo root — starts local Postgres and Redis.

### 3. Migrate and seed (uses `.env.local`)

```bash
cd cms/backend
npm run prisma:migrate:dev
npm run prisma:seed
```

### 4. Run apps

```bash
# From repo root
npm run dev
```

`npm run dev -w @corebridge/cms-backend` sets `NODE_ENV=development` → loads `.env.local`.

| Service    | URL |
|-----------|-----|
| Website   | http://localhost:3000 |
| CMS API   | http://localhost:4000/api |
| Admin UI  | http://localhost:5173 |

---

## Render (CMS API)

Deploy the NestJS API as a **Web Service** from the **repository root** (not `cms/backend`). The backend depends on the `@corebridge/shared` workspace.

| Setting | Value |
|---------|--------|
| **Root Directory** | *(leave empty — repo root)* |
| **Build Command** | `npm install && npm run build:cms-api` |
| **Start Command** | `npm run prisma:migrate -w @corebridge/cms-backend && npm run start:prod -w @corebridge/cms-backend` |

Set environment variables in the Render dashboard (from `cms/backend/.env.example`). At minimum: `NODE_ENV=production`, `DATABASE_URL`, `REDIS_URL`, JWT secrets, and `CORS_ORIGINS`. You do **not** need to create a `.env` file on Render — the dashboard values are injected into `process.env`.

The repo includes a root `.npmrc` with `production=false` so devDependencies (`@nestjs/cli`, `typescript`, `prisma`, etc.) are installed during Render’s build even when `NODE_ENV=production`.

If you still see `nest: command not found` (exit code 127), set **`NPM_CONFIG_PRODUCTION=false`** in Render environment variables, or change the build command to:

```bash
npm install --include=dev && npm run build:cms-api
```

---

## Demo / production hosting

### 1. Create production env on the host

Copy `.env.example` → `.env` and fill in Neon + Upstash URLs and secrets.

Ensure `NODE_ENV=production` is set in `.env` **or** by the process manager.

### 2. Migrate and seed (uses `.env`)

```bash
cd cms/backend
npm run prisma:migrate
npm run prisma:seed:prod
```

These scripts set `NODE_ENV=production` automatically.

### 3. Start CMS API

```bash
npm run start:prod -w @corebridge/cms-backend
```

Or on the host:

```bash
NODE_ENV=production node dist/main.js
```

### 4. CMS admin

Build with production API URL:

```bash
VITE_API_URL=https://corebridge-cms-api.onrender.com/api npm run build -w @corebridge/cms-admin
```

### 5. Website (Next.js)

```env
CMS_API_URL=https://corebridge-cms-api.onrender.com/api
NEXT_PUBLIC_CMS_API_URL=https://corebridge-cms-api.onrender.com/api
```

```bash
npm run build -w website
```

---

## Command cheat sheet

| Task | Command | Env file used |
|------|---------|---------------|
| API dev server | `npm run dev -w @corebridge/cms-backend` | `.env.local` |
| API production | `npm run start:prod -w @corebridge/cms-backend` | `.env` |
| Migrate local DB | `npm run prisma:migrate:dev` | `.env.local` |
| Migrate Neon | `npm run prisma:migrate` | `.env` |
| Seed local | `npm run prisma:seed` | `.env.local` |
| Seed Neon | `npm run prisma:seed:prod` | `.env` |
| Prisma Studio local | `npm run prisma:studio` | `.env.local` |
| Prisma Studio prod | `npm run prisma:studio:prod` | `.env` |

---

## Security checklist (production)

- [ ] `.env` on host only — never commit
- [ ] `NODE_ENV=production` on live CMS process
- [ ] Rotate JWT secrets and admin password
- [ ] Restrict `CORS_ORIGINS` to real domains
- [ ] Enable MFA for admin accounts
- [ ] TLS on all public endpoints

---

## Troubleshooting

**`Env file not found: .env.local`**

Create it from `.env.local.example` before running dev commands.

**`Env file not found: .env`**

On Render and similar hosts, set variables in the dashboard instead of creating `.env`. Locally or on a VPS, create `.env` on the server from `.env.example` before `start:prod` or `prisma:migrate`.

**Wrong database connected**

Check `NODE_ENV`. Development scripts force `NODE_ENV=development`; production scripts force `NODE_ENV=production`.

**Website shows empty content**

Confirm CMS API is running, env URLs are correct, and Neon has been migrated + seeded with `npm run prisma:seed:prod`.
