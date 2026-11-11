import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // painted media: cache for a week. When an asset's bytes change, give it a new file/dir name.
  async headers() {
    const media = "public, max-age=604800, stale-while-revalidate=86400";
    return ["/seq/:path*", "/video/:path*", "/scenes/:path*", "/img/:path*"].map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: media }],
    }));
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
