import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["nostr-tools", "@noble/curves", "@noble/hashes", "@scure/base"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "wcrgbcxewqqbnjvelwrp.supabase.co" },
    ],
  },
};

export default nextConfig;
