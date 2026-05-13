import type { NextConfig } from "next";

const rawApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const apiUrl = new URL(rawApiUrl.replace(/\/+$/, ""));

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        ...(apiUrl.port ? { port: apiUrl.port } : {}),
        pathname: "/storage/**",
      },
    ],
  },
  async rewrites() {
    const laravelBaseUrl =
      process.env.LARAVEL_BACKEND_URL ?? "http://localhost:8000";
    return [
      {
        source: "/backend/:path*",
        destination: `${laravelBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;