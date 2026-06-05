import { loadEnvFile } from './load-env-file';

/** Load `.env.local` (dev) or `.env` (production) before Prisma / NestJS bootstrap. */
loadEnvFile();
