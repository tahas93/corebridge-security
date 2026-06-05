'use client';

import { useCmsContent } from '@/providers/CmsContentProvider';

/** Client-side hook — returns CMS content tree (same shape as legacy JSON bundle). */
export function useContent(): Record<string, unknown> {
  return useCmsContent().content;
}
