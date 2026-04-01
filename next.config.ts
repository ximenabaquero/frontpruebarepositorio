import type { NextConfig } from "next";

const rawApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const apiUrl = new URL(rawApiUrl.replace(/\/+$/, ""));

const nextConfig: NextConfig = {
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
    // Dev convenience: proxy Laravel endpoints under /backend/* to a local Laravel server.
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
