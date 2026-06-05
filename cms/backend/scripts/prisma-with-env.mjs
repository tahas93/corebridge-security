/**
 * Runs Prisma CLI with env from `.env.local` (dev) or `.env` (production).
 * Usage: node scripts/prisma-with-env.mjs migrate deploy
 */
import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { loadEnvFile } from './load-env-file.mjs';

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

loadEnvFile(backendRoot);

const prismaArgs = process.argv.slice(2);
if (!prismaArgs.length) {
  console.error('Usage: node scripts/prisma-with-env.mjs <prisma-command> [args...]');
  process.exit(1);
}

const result = spawnSync('npx', ['prisma', ...prismaArgs], {
  cwd: backendRoot,
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
