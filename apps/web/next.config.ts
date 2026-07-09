import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sales-crm/shared", "@sales-crm/database", "@sales-crm/auth", "@sales-crm/ui"],
};

export default nextConfig;
