import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Remove .js from import specifiers, because
    // Next.js and webpack do not yet support
    // TypeScript-style module resolution out of the box
    // https://github.com/webpack/webpack/issues/13252#issuecomment-1171080020
    // https://github.com/vercel/next.js/pull/45423
    // https://github.com/vercel/next.js/issues/58805
    // https://github.com/vercel/next.js/issues/54550
    extensionAlias: {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".jsx": [".tsx", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    },
  },
};

export default nextConfig;
