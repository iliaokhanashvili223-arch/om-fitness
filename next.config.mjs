/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We ship our own service worker in /public/sw.js, so no PWA plugin is needed.
  eslint: {
    // Keep production builds green even if lint rules trip; lint locally with `npm run lint`.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
