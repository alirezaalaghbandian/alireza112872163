/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@opscore/domain'],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
