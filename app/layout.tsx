import type { Metadata } from 'next';
import './globals.css';

// Trusted origin returned by Sites; never derive social URLs from forwarded headers.
const siteOrigin = new URL(
  'https://omar-khaled-small-digital-world.omarkhaledibraheem.chatgpt.site',
);
const socialImage = new URL('/og.png', siteOrigin).href;
export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: 'Omar Khaled — A Small Digital World',
  description:
    'A small, explorable engineering world by Omar Khaled. Phase 1 foundation: an original 3D workshop, human avatar, and AI learning lab.',
  alternates: { canonical: siteOrigin.href },
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Omar Khaled — A Small Digital World',
    description:
      'Software engineering. A little world of building and curiosity.',
    type: 'website',
    url: siteOrigin.href,
    images: [
      {
        url: socialImage,
        width: 1730,
        height: 909,
        alt: "Omar Khaled's small digital engineering world",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Khaled — A Small Digital World',
    description:
      'Software engineering. A little world of building and curiosity.',
    images: [socialImage],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
