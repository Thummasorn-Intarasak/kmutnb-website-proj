import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.igdb.com",
        port: "",
        pathname: "/igdb/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "cdn.akamai.steamstatic.com",
        port: "",
        pathname: "/steam/apps/**",
      },
      {
        protocol: "https",
        hostname: "steamcdn-a.akamaihd.net",
        port: "",
        pathname: "/steam/apps/**",
      },
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com",
        port: "",
        pathname: "/steam/apps/**",
      },
    ],
  },
};

export default nextConfig;
