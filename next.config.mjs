/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["downloads.intercomcdn.com"],
  },
  experimental: {
    ppr: "incremental",
  },
};

export default nextConfig;
