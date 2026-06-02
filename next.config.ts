import type { NextConfig } from 'next';

// Static export for Cloudflare Pages free tier (unlimited bandwidth).
// All pages pre-rendered at build time. No server functions.
// Headers and redirects live in public/_headers and public/_redirects.

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
