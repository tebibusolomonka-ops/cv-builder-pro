import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Chromium ships a real binary; bundling it breaks the executable path the
  // PDF route resolves at runtime. Both must stay external to the server build.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],

  // Marking it external is not enough on its own. Tracing still relocates the
  // package to a hashed directory (@sparticuz/chromium-<hash>), while the
  // library resolves its binaries at the canonical
  // node_modules/@sparticuz/chromium/bin -- which then does not exist, and the
  // route fails at runtime with exactly that message. Copying bin/ in at the
  // path it expects is what makes the deployed function able to launch.
  outputFileTracingIncludes: {
    '/api/export': ['./node_modules/@sparticuz/chromium/bin/**'],
  },
};

export default nextConfig;
