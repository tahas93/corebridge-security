import { getSiteContent } from './cms-loader';

export type ContentKey = string;

/** Server-side content access — fetches from CMS */
export async function getContent<T = unknown>(
  key: string,
  fallback?: T,
): Promise<T | undefined> {
  const content = await getSiteContent();
  const value = key.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, content);

  if (value === undefined) return fallback;
  return value as T;
}

export { getSiteContent };
