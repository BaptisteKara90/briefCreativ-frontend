/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "ibb.co",
      'res.cloudinary.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/profil/:username',
        destination: '/profils/:username',
      },
    ];
  },
};

module.exports = nextConfig;
