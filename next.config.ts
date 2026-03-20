import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yginjzlfezyalgosdjtl.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/reservations",
        destination: "/book",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
