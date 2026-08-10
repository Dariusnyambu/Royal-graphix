const SITE_URL = 'https://royalgraphix.co.ke'
const SITE_NAME = 'Royal Graphix'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: 'hello@dariusnyambu.co.ke',
    telephone: '+254708039015',
    address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
    sameAs: [],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/portfolio?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbSchema(items) {
  // items: [{ name, path }]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function serviceSchema({ name, description, path, category }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    name,
    description,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    url: `${SITE_URL}${path}`,
    areaServed: { '@type': 'Country', name: 'Kenya' },
    category,
  }
}

export function faqSchema(faqs) {
  if (!faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function creativeWorkSchema({ title, description, image, path, dateCreated, category }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    image,
    url: `${SITE_URL}${path}`,
    dateCreated,
    genre: category,
    creator: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
}
