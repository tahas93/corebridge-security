import type { Metadata, Viewport } from "next";

export const dynamic = "force-dynamic";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/layout/PageLoader";
import ScrollReveal from "@/components/layout/ScrollReveal";
import { CmsContentProvider } from "@/providers/CmsContentProvider";
import { getHeaderMenu, getSiteContent, getSiteSettings } from "@/lib/cms-loader";
import { getCmsPath } from "@/lib/cms-path";
import { getSiteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  const content = await getSiteContent();
  const seo = getCmsPath<Record<string, unknown>>(content, "site.seo");

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s · ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: seo.keywords as string[] | undefined,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    applicationName: siteConfig.name,
    category: seo.category as string | undefined,
    openGraph: {
      type: "website",
      url: siteConfig.url,
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: "/og.svg",
          width: 1200,
          height: 630,
          alt: String(seo.ogImageAlt ?? siteConfig.name),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${siteConfig.tagline}`,
      description: siteConfig.description,
      images: ["/og.svg"],
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: ["/favicon.svg"],
      apple: [{ url: "/favicon.svg" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const content = await getSiteContent();
  const seo = getCmsPath<Record<string, unknown>>(content, "site.seo");
  return {
    themeColor: seo.themeColor as string | undefined,
    colorScheme: seo.colorScheme as Viewport["colorScheme"],
    width: "device-width",
    initialScale: 1,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, settings, headerMenu] = await Promise.all([
    getSiteContent(),
    getSiteSettings(),
    getHeaderMenu(),
  ]);

  const language = getCmsPath<string>(content, "common.language") ?? "en";
  const skipToContent = getCmsPath<string>(content, "common.skipToContent") ?? "Skip to content";

  return (
    <html
      lang={language}
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-surface-100 font-sans text-ink-900 antialiased">
        <CmsContentProvider
          value={{
            content: content as Record<string, unknown>,
            settings: settings as Record<string, unknown>,
            headerMenu: headerMenu as {
              items: { label: string; href: string; description?: string }[];
            },
          }}
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-blue focus:px-4 focus:py-2 focus:text-white"
          >
            {skipToContent}
          </a>
          <PageLoader />
          <ScrollReveal />
          <div className="relative isolate flex min-h-screen flex-col">
            <Navbar />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </CmsContentProvider>
      </body>
    </html>
  );
}
