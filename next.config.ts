import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['veg-backend-rth1.onrender.com'],
    remotePatterns: [
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
