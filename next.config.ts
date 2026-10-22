import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev resources (HMR WebSocket, _next/static, etc.) from LAN, WAN, and tunnel origins
  allowedDevOrigins: [
    // ngrok tunnels (all free and paid subdomains, .app, .dev, and .io)
    "*.ngrok-free.app",
    "**.ngrok-free.app",
    "ngrok-free.app",
    "*.ngrok-free.dev",
    "**.ngrok-free.dev",
    "ngrok-free.dev",
    "madyson-rhinological-ciera.ngrok-free.dev",
    "*.ngrok.app",
    "**.ngrok.app",
    "ngrok.app",
    "*.ngrok.dev",
    "**.ngrok.dev",
    "ngrok.dev",
    "*.ngrok.io",
    "**.ngrok.io",
    "ngrok.io",
    // Alternative tunnels
    "*.trycloudflare.com",
    "**.trycloudflare.com",
    "*.loca.lt",
    "**.loca.lt",
    // LAN & WAN IPv4 ranges (wildcards match any IPv4 address)
    "192.168.*.*",
    "10.*.*.*",
    "172.*.*.*",
    "*.*.*.*",
    // Localhost, mDNS, and local networks
    "*.local",
    "**.local",
    "*.lan",
    "**.lan",
    "localhost",
    "*.localhost",
    "**.localhost",
  ],

  // Allow Server Actions from external origins
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.ngrok-free.app",
        "*.ngrok-free.dev",
        "ngrok-free.dev",
        "madyson-rhinological-ciera.ngrok-free.dev",
        "*.ngrok.app",
        "*.ngrok.dev",
        "*.ngrok.io",
        "*.trycloudflare.com",
        "*.loca.lt",
        "192.168.*.*",
        "10.*.*.*",
        "172.*.*.*",
        "*.*.*.*",
        "*.local",
        "*.lan",
        "localhost:3000",
        "localhost",
      ],
    },
  },

  // CORS headers for incoming API requests across LAN, WAN, and ngrok
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS, PATCH" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization, X-Requested-With, Accept, ngrok-skip-browser-warning" },
          { key: "Access-Control-Max-Age", value: "86400" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
