# Security Architecture

## Authentication

- **JWT** access tokens (short-lived, configurable `JWT_ACCESS_EXPIRES`).
- **Refresh tokens** stored hashed (SHA-256) in PostgreSQL with revocation support.
- **MFA** TOTP optional per user (`POST /api/auth/mfa/setup`, `/mfa/enable`).
- Password policy: minimum 12 characters, upper/lower/digit required.

## Authorization

- **RBAC** enforced via global `PermissionsGuard` and `@RequirePermissions()` decorator.
- Four default roles seeded with least-privilege mappings.

## API hardening

- **Helmet** security headers.
- **Rate limiting** (Throttler: 120 req/min default).
- **ValidationPipe** whitelist + forbid unknown properties.
- **CORS** restricted to configured origins.
- **SQL injection** mitigated via Prisma parameterized queries.
- **XSS** mitigated via React escaping; rich text should use sanitization before `dangerouslySetInnerHTML` in production.

## File uploads

- MIME allowlist (images, PDF, MP4, plain text).
- Max size from `MAX_UPLOAD_MB`.
- Randomized filenames; served from dedicated upload path.

## Audit

All sensitive actions logged: login, publish, user changes, permission changes, media operations.

## Production checklist

- [ ] Rotate `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `WEBSITE_PREVIEW_SECRET`
- [ ] Use TLS everywhere (Nginx termination)
- [ ] Enable MFA for all admin accounts
- [ ] Restrict Admin UI to VPN or IP allowlist
- [ ] Enable CSRF for cookie-based sessions if added
- [ ] Add WAF / rate limits at edge
- [ ] Encrypt PostgreSQL at rest
- [ ] Scan uploads with AV
- [ ] Set strong `SEED_ADMIN_PASSWORD` and disable default after first login

## Sensitive data

- Passwords: bcrypt cost 12.
- MFA secrets: stored per user; protect DB access.
- Refresh tokens: hashed at rest.
