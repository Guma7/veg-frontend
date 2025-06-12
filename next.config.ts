import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'veg-backend-rth1.onrender.com',
      'res.cloudinary.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'veg-backend-rth1.onrender.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', 
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
