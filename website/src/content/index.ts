/**
 * @deprecated Content is served by the CMS API. JSON files in this folder are used only for database seeding.
 * Use `getSiteContent()` from `@/lib/cms-loader` (server) or `useContent()` from `@/lib/content-client` (client).
 */
throw new Error(
  'Static content bundle is disabled. All content is loaded from the CMS API.',
);
