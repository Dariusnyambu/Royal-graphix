import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Royal Graphix'
const SITE_URL  = 'https://royalgraphix.co.ke'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`

/**
 * Reusable SEO component — wraps react-helmet-async with sensible defaults.
 * Usage: <SEO title="Services" description="..." path="/services" />
 */
export default function SEO({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords,
  noindex = false,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Creative Digital Agency in Nairobi, Kenya`
  const url = `${SITE_URL}${path}`
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  )
}
