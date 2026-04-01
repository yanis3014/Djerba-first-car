/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Images hébergées sur Cloudinary (next-cloudinary) + démos Unsplash
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
