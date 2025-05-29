import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["fastly.picsum.photos"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};


module.exports = nextConfig;


export default nextConfig;
