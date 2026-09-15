import type { MetadataRoute } from 'next'
import { DISALLOWED_PATHS, absoluteUrl } from '@/lib/site'

/** Serves /robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
