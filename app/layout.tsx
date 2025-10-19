import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "图片处理工具 - 在线图片压缩、抠图、识别、AI生图",
  description: "专业的在线图片处理工具，提供图片压缩、智能抠图去背景、图片识别、AI生图等功能",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
