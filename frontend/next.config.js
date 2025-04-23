/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'res.cloudinary.com', // Allow Cloudinary images
      'thecakeheaven.com',
      'images.unsplash.com',
      'loremflickr.com',
      'picsum.photos',
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        // Rewrite API requests to the backend server
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL ?
          `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` :
          'http://localhost:5000/api/:path*', // Default for development
      },
    ];
  },
};

module.exports = nextConfig;
