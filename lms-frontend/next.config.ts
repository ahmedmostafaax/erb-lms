import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ضروري عشان Docker image يبقى خفيف
};

export default nextConfig;
