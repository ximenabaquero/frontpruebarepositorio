import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Dev convenience: proxy PHP endpoints under /php/* to a local PHP server.
    // Start PHP server so that register_patient.php is served at the root, e.g.:
    //   C:\xampp\php\php.exe -S localhost:8000 -t php
    // Then /php/register_patient.php will work from http://localhost:3000.
    const phpBaseUrl = process.env.PHP_BACKEND_URL ?? "http://localhost:8000";
    return [
      {
        source: "/php/:path*",
        destination: `${phpBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
