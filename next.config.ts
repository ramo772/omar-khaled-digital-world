import type { NextConfig } from 'next';

// Static export: `npm run build` writes a complete static site to dist/client
// (HTML, JS, CSS, assets). No server, API routes or database are needed, so it
// can be hosted on any static host (Cloudflare Pages, GitHub Pages, Netlify…).
const nextConfig: NextConfig = {
  output: 'export',
  // Cloudflare Pages serves files only. Bypass Next's runtime image optimizer
  // so every image resolves directly from the exported public/ assets.
  images: { unoptimized: true },
};

export default nextConfig;
