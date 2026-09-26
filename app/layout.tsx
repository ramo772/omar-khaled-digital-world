import type { Metadata, Viewport } from 'next';
import { themeInitScript } from '@/src/theme/theme';
import { ThemeProvider } from '@/src/theme/ThemeProvider';
import { identity } from '@/src/content/portfolio';
import './globals.css';

/**
 * Deployment origin, set at build time (e.g. VITE_SITE_URL=https://omar.pages.dev).
 * Without it, metadata stays relative and the site is not indexed.
 * VITE_SITE_INDEX=true opts in to search indexing for a public launch.
 */
const siteUrl = import.meta.env.VITE_SITE_URL as string | undefined;
const indexable = import.meta.env.VITE_SITE_INDEX === 'true';
const title = `${identity.name} — ${identity.currentRole}`;
const description = `${identity.name}: ${identity.currentRole} at ${identity.currentOrganization}, working on ${identity.currentProject}. ${identity.focus}. A small, explorable digital engineering world.`;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: '/' } } : {}),
  title,
  description,
  robots: { index: indexable, follow: indexable },
  icons: { icon: '/favicon.svg' },
  // Social images need an absolute URL, so they are only emitted when the origin is known.
  openGraph: {
    title,
    description,
    type: 'website',
    ...(siteUrl
      ? {
          url: siteUrl,
          images: [{ url: '/og.jpg', width: 1200, height: 630, alt: `${identity.name}’s small digital engineering world` }],
        }
      : {}),
  },
  twitter: { card: 'summary_large_image', title, description, ...(siteUrl ? { images: ['/og.jpg'] } : {}) },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3efe6' },
    { media: '(prefers-color-scheme: dark)', color: '#121824' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set by the inline script before first paint, so React must not warn about it.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
