/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Headers for caching
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
        ],
      },
      {
        source: "/(noticias|legislacao|relatorios)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=120, stale-while-revalidate=600" },
        ],
      },
    ];
  },
};

export default nextConfig;
