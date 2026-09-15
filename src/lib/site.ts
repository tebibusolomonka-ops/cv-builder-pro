import type { Metadata } from 'next'

/**
 * The site's public identity, in one place.
 *
 * The canonical origin is deliberately a literal rather than an environment
 * variable. It is a property of the site, not of the deployment: every Vercel
 * build (production, preview, branch) would otherwise be free to advertise its
 * own hostname as canonical, and a single mis-set NEXT_PUBLIC_APP_URL would
 * point Google at a *.vercel.app URL that duplicates the real one.
 *
 * Preview deployments are kept out of the index by Vercel itself, which serves
 * them with X-Robots-Tag: noindex.
 */
export const SITE_URL = 'https://netsacv.com'

export const SITE_NAME = 'Netsa CV'

/**
 * The spaceless spelling people also search for and type.
 *
 * Declared to search engines as schema.org alternateName so the two spellings
 * resolve to one entity rather than competing.
 */
export const SITE_ALTERNATE_NAME = 'NetsaCV'

export const SITE_TITLE = 'Netsa CV — Free Online CV & Resume Builder'

export const SITE_DESCRIPTION =
  'Build a CV online for free with Netsa CV. Pick from 50+ resume templates, fill in your details, and download a print-ready PDF. No account, no payment, and your information stays in your browser.'

/**
 * The social preview image, served by src/app/opengraph-image.png.
 *
 * Next normally attaches that file automatically, but only to pages that do
 * not declare an `openGraph` block of their own -- a page that does replaces
 * the inherited one outright rather than merging into it, which silently drops
 * the image, the type and the site name. Naming it here lets every page state
 * its own title and still keep the picture.
 */
export const OG_IMAGE = '/opengraph-image.png'

/** Build an absolute production URL for a root-relative path. */
export function absoluteUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

/**
 * Every page that belongs in search results.
 *
 * Listed by hand rather than discovered from the filesystem, because "is a
 * route" and "should be in Google" are different questions: the workspace,
 * the applications tracker, the settings screen and the editor are all real
 * routes, and none of them is a page anyone should arrive at from a search.
 * The editor is also an unbounded URL space (/resume/<any id>/edit), so it is
 * a crawl trap as well as a private one.
 *
 * Anything added here must return 200 to an anonymous visitor.
 */
export const PUBLIC_ROUTES = [
  { path: '/', priority: 1 },
  { path: '/templates', priority: 0.9 },
  { path: '/privacy', priority: 0.3 },
  { path: '/terms', priority: 0.3 },
] as const

/**
 * Prefixes robots.txt tells crawlers not to fetch at all.
 *
 * Kept to the two that genuinely need it. /api/ serves no pages, and /resume/
 * is an unbounded id space that a crawler would wander forever.
 *
 * The workspace, applications and settings screens are deliberately *not*
 * here. They are linked from the public navbar and footer, and a URL that is
 * linked but blocked in robots.txt can still be indexed as a bare link,
 * because the crawler is never allowed to fetch the page and see that it says
 * noindex. Letting those three be crawled is what makes their noindex work.
 */
export const DISALLOWED_PATHS = ['/api/', '/resume/']

/**
 * The search and social metadata for one public page.
 *
 * Every public page goes through this so the four of them cannot drift apart,
 * and so none of them can forget its canonical URL -- which is the one field
 * that quietly costs you the page if it is wrong.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_TITLE }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE] },
  }
}
