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

  async redirects() {
    return [
      // One address for the site. Vercel may already fold www into the apex at
      // the edge, in which case this never fires; it is here so the preference
      // holds even if that domain setting is changed or re-added later.
      //
      // It cannot loop: after the redirect the host is netsacv.com, which no
      // longer matches the condition.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.netsacv.com' }],
        destination: 'https://netsacv.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
