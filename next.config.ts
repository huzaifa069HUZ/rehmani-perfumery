import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Cloudinary — uploaded product images
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        // Firebase Storage (if used later)
        protocol: 'https',
        hostname: '*.firebasestorage.googleapis.com',
        pathname: '/**',
      },
    ],
    // Enable modern image formats for better performance
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 30 days
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
