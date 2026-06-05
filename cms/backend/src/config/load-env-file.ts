import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/** Production/live uses `.env`; local development uses `.env.local`. */
export function isProductionRuntime(): boolean {
  return (process.env.NODE_ENV ?? '').toLowerCase() === 'production';
}

export function getEnvFileName(): '.env' | '.env.local' {
  return isProductionRuntime() ? '.env' : '.env.local';
}

export function getEnvFilePath(rootDir = join(__dirname, '../..')): string {
  return join(rootDir, getEnvFileName());
}

export function loadEnvFile(rootDir = join(__dirname, '../..')): string {
  const path = getEnvFilePath(rootDir);

  if (!existsSync(path)) {
    throw new Error(
      `Env file not found: ${path}. NODE_ENV=${process.env.NODE_ENV ?? '(unset)'} → expected ${getEnvFileName()}`,
    );
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
