import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Omar Khaled — A Small Digital World',
  description:
    'A small, explorable engineering world by Omar Khaled. Phase 1 foundation: an original 3D workshop, human avatar, and AI learning lab.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Omar Khaled — A Small Digital World',
    description:
      'Software engineering. A little world of building and curiosity.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omar Khaled — A Small Digital World',
    description:
      'Software engineering. A little world of building and curiosity.',
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
