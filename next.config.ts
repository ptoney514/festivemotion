import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "festivemotion.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
