/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add API proxy configuration for development
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/:path*` : '/api/proxy',
      },
    ];
  },
}

export default nextConfig
