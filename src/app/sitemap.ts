import type { MetadataRoute } from 'next'
import { PUBLIC_ROUTES, absoluteUrl } from '@/lib/site'

/**
 * Serves /sitemap.xml.
 *
 * The list of pages lives in one place (src/lib/site.ts) and is shared with
 * robots.txt, so the two cannot disagree about what is public.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Build time, which is the last moment any of these pages could have
  // changed -- they are static, so there is no later edit to record.
  const lastModified = new Date()

  return PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.path === '/' ? 'weekly' : 'monthly',
    priority: route.priority,
  }))
}
