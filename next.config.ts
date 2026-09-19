import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Car images are expected to be served from the WordPress backend.
    // Confirm the real image host from the API response, then adjust/add hosts here.
    remotePatterns: [
      { protocol: "https", hostname: "yellow-kudu-942759.hostingersite.com" },
    ],
  },
};

export default nextConfig;
