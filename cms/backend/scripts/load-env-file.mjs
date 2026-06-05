import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

export function isProductionRuntime() {
  return (process.env.NODE_ENV ?? '').toLowerCase() === 'production';
}

export function getEnvFileName() {
  return isProductionRuntime() ? '.env' : '.env.local';
}

export function loadEnvFile(rootDir = backendRoot) {
  const path = join(rootDir, getEnvFileName());

  if (!existsSync(path)) {
    console.error(
      `Error: Env file not found: ${path} (NODE_ENV=${process.env.NODE_ENV ?? 'unset'})`,
    );
    process.exit(1);
  }

  const raw = readFileSync(path, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }

  return path;
}
