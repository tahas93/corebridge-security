export function getCmsPath<T = unknown>(root: Record<string, unknown>, path: string): T {
  const value = path.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, root);
  return value as T;
}
