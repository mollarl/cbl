import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  async headers() {
    return [{
      source: "/admin/:path*",
      headers: [
        { key: "Cache-Control", value: "private, no-store" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
      ],
    }];
  },
};

export default nextConfig;
