import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
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
