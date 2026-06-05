'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { getCmsPath } from '@/lib/cms-path';

export type CmsContentContextValue = {
  content: Record<string, unknown>;
  settings: Record<string, unknown>;
  headerMenu: { items: { label: string; href: string; description?: string; children?: unknown[] }[] };
};

const CmsContentContext = createContext<CmsContentContextValue | null>(null);

export function CmsContentProvider({
  value,
  children,
}: {
  value: CmsContentContextValue;
  children: ReactNode;
}) {
  return <CmsContentContext.Provider value={value}>{children}</CmsContentContext.Provider>;
}

export function useCmsContent() {
  const ctx = useContext(CmsContentContext);
  if (!ctx) throw new Error('useCmsContent must be used within CmsContentProvider');
  return ctx;
}

export function useCmsPath<T = unknown>(path: string): T {
  const { content } = useCmsContent();
  return getCmsPath<T>(content, path);
}

/** Client hook — returns CMS content tree */
export function useContent() {
  const { content } = useCmsContent();
  return content;
}
