import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chromium ships a real binary; bundling it breaks the executable path the
  // PDF route resolves at runtime. Both must stay external to the server build.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
};

export default nextConfig;
