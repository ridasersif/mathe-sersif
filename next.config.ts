import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from any source for the about page avatar
  images: { unoptimized: true },
  // Suppress the Tailwind postcss warning since we're using vanilla CSS
  experimental: {},
};

export default nextConfig;
