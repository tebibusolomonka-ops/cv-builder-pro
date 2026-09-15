import { SITE_ALTERNATE_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from './site'

/**
 * Brand/entity structured data for the homepage.
 *
 * Emitted as a single @graph rather than two separate <script> blocks, so
 * there is exactly one WebSite node and one Organization node on the site and
 * they cannot end up contradicting each other. The @id values are what let the
 * WebSite point at the Organization as its publisher instead of restating it.
 *
 * Deliberately absent: address, telephone, aggregateRating, award and sameAs.
 * None of those are things we actually know, and inventing them is what turns
 * structured data into a manual action.
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

export const homepageStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      url: absoluteUrl('/'),
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
      publisher: { '@id': ORGANIZATION_ID },
    },
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: SITE_ALTERNATE_NAME,
      url: absoluteUrl('/'),
      description: SITE_DESCRIPTION,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/icon.png'),
        width: 512,
        height: 512,
        caption: SITE_NAME,
      },
    },
  ],
}

/**
 * Serialise a JSON-LD graph for embedding in a <script> tag.
 *
 * The '<' escape matters even for content we wrote ourselves: a literal
 * "</script>" anywhere inside the JSON would close the tag early and spill the
 * rest onto the page. Nothing here contains one today, and this makes sure
 * nothing added later can.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\u003c')
}
