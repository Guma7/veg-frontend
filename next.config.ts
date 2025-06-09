import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'vegworld.onrender.com', 'veg-backend-rth1.onrender.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'vegworld.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'veg-backend-rth1.onrender.com',
        pathname: '/media/**',
      },
    ],
  },
  compiler: {
    styledComponents: true
  }
};

export default nextConfig;
