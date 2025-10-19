import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 解决字体加载超时问题
  experimental: {
    optimizeServerReact: true,
  },
  // 忽略字体加载错误
  typescript: {
    ignoreBuildErrors: false,
  },
  // 处理字体加载超时
  images: {
    domains: ['fonts.googleapis.com'],
  },
};

export default nextConfig;
