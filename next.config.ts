// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables configuration
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
  },
  // Ensure server-side environment variables are properly handled
  serverRuntimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  },
  // Public runtime configuration (empty as ANTHROPIC_API_KEY should not be public)
  publicRuntimeConfig: {},
  // Additional security headers
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'",
        },
      ],
    },
  ],
};

export default nextConfig;