/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    // Car images are served from the WordPress backend. The API currently returns
    // http:// image URLs; protocol is omitted so both http and https are allowed.
    remotePatterns: [{ hostname: "arobasedesigns.in" }],
  },
};

export default nextConfig;
