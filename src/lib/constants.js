export const APP_NAME = 'Royal Graphix'
export const APP_URL = 'https://royalgraphix.com'
export const APP_EMAIL = 'info@royalgraphix.co.ke'
export const APP_PHONE = '+254 708 039 015'
export const APP_LOCATION = 'Nairobi, Kenya'

export const NAV_LINKS = [
  { label: 'Home',          path: '/' },
  { label: 'Services',      path: '/services' },
  { label: 'Portfolio',     path: '/portfolio' },
  { label: 'Blog',          path: '/blog' },
  { label: 'Pricing',       path: '/pricing' },
  { label: 'Reviews',       path: '/reviews' },
  { label: 'Careers',       path: '/careers' },
  { label: 'Track Project', path: '/track' },
  { label: 'Refer & Earn',   path: '/refer' },
  { label: 'Contact',       path: '/contact' },
]

export const BLOG_CATEGORIES = [
  'Web Design',
  'SEO',
  'Branding',
  'UI/UX',
  'Development',
  'Graphics',
]

export const CAREERS = [
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    type: 'Full-time',
    location: 'Nairobi, Kenya (Hybrid)',
    emoji: '🎨',
    summary: 'Own the visual identity of client brands — from logos and social content to full brand systems — for our growing roster of Kenyan and international clients.',
    responsibilities: [
      'Design logos, brand identities, and marketing collateral for clients',
      'Create social media graphics, posters, and campaign assets',
      'Collaborate with the web team on landing page and UI visuals',
      'Maintain brand consistency across every client deliverable',
      'Turn client feedback into polished, on-brief revisions quickly',
    ],
    requirements: [
      '1+ years of professional graphic design experience',
      'Strong portfolio across branding, print, and digital design',
      'Proficiency in Adobe Creative Suite and/or Figma',
      'Sharp eye for typography, color, and layout',
      'Able to manage multiple projects and deadlines',
    ],
  },
  {
    id: 'senior-developer',
    title: 'Senior Developer',
    type: 'Full-time',
    location: 'Nairobi, Kenya (Hybrid)',
    emoji: '💻',
    summary: 'Lead development of client web platforms end-to-end — from architecture to deployment — mentoring the team while shipping fast, reliable products.',
    responsibilities: [
      'Architect and build client web apps with React and modern tooling',
      'Design and maintain Supabase/Postgres schemas and APIs',
      'Review code, mentor junior developers, and set engineering standards',
      'Own deployments (Vercel) and performance/SEO best practices',
      'Work directly with clients to scope technical requirements',
    ],
    requirements: [
      '4+ years of professional web development experience',
      'Strong command of React, JavaScript/TypeScript, and REST/SQL',
      'Experience with Supabase, Firebase, or similar backends',
      'Comfortable owning a project from spec to production',
      'Excellent communication with both clients and teammates',
    ],
  },
]

export const PORTFOLIO_CATEGORIES = [
  'All',
  'Web Design',
  'Graphic Design',
  'Branding',
  'Church & Ministry',
  'Travel & Tourism',
  'NGO & Community',
  'Research & Consulting',
  'Real Estate',
]

export const PROJECT_TYPES = [
  'Web Design',
  'Web App Development',
  'Graphic Design',
  'Branding',
  'SEO Optimization',
  'UI/UX Design',
  'Other',
]


// ─────────────────────────────────────────────────────────────
// Social Media Links
// ─────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  tiktok:    'https://www.tiktok.com/@royal.graphix8?lang=en',
  youtube:   'https://www.youtube.com/@royalgraphix93',
  instagram: 'https://www.instagram.com/royal_graphix93/?hl=en',
  facebook:  'https://www.facebook.com/profile.php?id=100064086038197',
}

// Google Business Review link
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CXhykQ-P_LbcEBM/review'

// App download links (update when APK/Play Store listing is live)
export const APP_DOWNLOAD = {
  android: 'https://royalgraphix.co.ke/app',  // update to Play Store URL when live
  apk:     'https://royalgraphix.co.ke/app',  // direct APK download fallback
}

export const SERVICES = [
  {
    icon: '🖥️',
    title: 'Web Design & Development',
    slug: 'web-design',
    description:
      'Responsive, blazing-fast websites and web applications built with React, Next.js, and modern stacks.',
    tags: ['React / Next.js', 'Responsive Design', 'Web Apps', 'E-commerce', 'CMS Integration'],
  },
  {
    icon: '🎨',
    title: 'Graphic Design',
    slug: 'graphic-design',
    description:
      'Logos, brand identities, social media kits, event posters, and marketing materials that impress.',
    tags: ['Logo Design', 'Social Media Kits', 'Posters & Flyers', 'Print Design', 'Packaging'],
  },
  {
    icon: '📱',
    title: 'UI/UX Design',
    slug: 'ui-ux',
    description:
      'User-centered design rooted in research. Wireframes, prototypes, and design systems.',
    tags: ['Wireframing', 'Figma Prototypes', 'Design Systems', 'User Research', 'Usability Testing'],
  },
  {
    icon: '🔍',
    title: 'SEO & Digital Marketing',
    slug: 'seo',
    description:
      'Data-driven SEO strategies and paid ads that put your business in front of the right audience.',
    tags: ['Technical SEO', 'Keyword Research', 'Content Strategy', 'Link Building', 'Google Ads'],
  },
  {
    icon: '✍️',
    title: 'Brand Identity',
    slug: 'branding',
    description:
      'Comprehensive branding packages — strategy, voice, visual identity, and guidelines.',
    tags: ['Brand Strategy', 'Visual Identity', 'Style Guides', 'Brand Voice', 'Naming'],
  },
  {
    icon: '📣',
    title: 'Social Media Management',
    slug: 'social-media-management',
    description:
      'Content planning, on-brand design, and consistent posting that builds real social presence.',
    tags: ['Content Planning', 'Post Design', 'Scheduling', 'Instagram & Facebook', 'TikTok'],
  },
  {
    icon: '📊',
    title: 'Analytics & Growth',
    slug: 'analytics',
    description:
      'Monthly dashboards, CRO, A/B testing, and actionable insights that drive growth decisions.',
    tags: ['Google Analytics', 'Conversion Tracking', 'A/B Testing', 'CRO Audits', 'Monthly Reports'],
  },
]

export const TESTIMONIALS = [
  {
    name: 'Amira Hassan',
    role: 'CEO, TechFlow',
    text: 'Royal Graphix completely transformed our brand. The new identity is clean, modern, and exactly what we envisioned. Highly professional team!',
    stars: 5,
    initials: 'AH',
  },
  {
    name: 'Daniel Omondi',
    role: 'Founder, EcoMart',
    text: 'Our website conversion rate doubled after the redesign. The attention to detail and user experience is simply outstanding.',
    stars: 5,
    initials: 'DO',
  },
  {
    name: 'Lena Müller',
    role: 'Marketing Head, NovaCorp',
    text: 'The SEO results speak for themselves — 340% increase in organic traffic in just 6 months. Incredible work!',
    stars: 5,
    initials: 'LM',
  },
]

// ─────────────────────────────────────────────────────────────
// ROYAL GRAPHIX DIGITAL SERVICES — KENYA PRICE LIST
// ─────────────────────────────────────────────────────────────

// 1. Graphic Design — à la carte items
export const GRAPHIC_DESIGN_PRICES = [
  { name: 'Event Poster Design',             price: 'KES 500' },
  { name: 'Business Poster / Flyer Design',  price: 'KES 1,000' },
  { name: 'Logo Design',                     price: 'KES 5,000 – 15,000' },
  { name: 'Business Card Design',            price: 'KES 1,500' },
  { name: 'Company Profile Design',          price: 'KES 8,000 – 25,000' },
  { name: 'Social Media Banner / Cover Design', price: 'KES 1,000' },
  { name: 'Roll-Up Banner Design',           price: 'KES 2,500' },
  { name: 'Brochure Design',                 price: 'KES 3,000+' },
  { name: 'Product Catalog Design',          price: 'KES 5,000+' },
]

// 2. Church Media Packages — monthly retainers
export const CHURCH_PACKAGES = [
  {
    name: 'Starter Package',
    price: 'KES 3,000',
    period: 'per month',
    featured: false,
    tagline: 'Ideal for small and growing churches',
    features: [
      '2 Posters Per Week (8 Monthly)',
      'Sunday Service Posters',
      'Midweek Service Posters',
      'Event Announcements',
      'Basic Graphic Support',
    ],
  },
  {
    name: 'Standard Package',
    price: 'KES 7,000',
    period: 'per month',
    featured: false,
    tagline: 'For churches building a content rhythm',
    features: [
      '3 Posters Per Week',
      'Sunday Service Posters',
      'Event Posters',
      'Social Media Graphics',
      'Live Service Thumbnails',
      'Basic Sermon Quote Graphics',
    ],
  },
  {
    name: 'Premium Package',
    price: 'KES 12,000',
    period: 'per month',
    featured: true,
    tagline: 'Perfect for churches growing their online presence',
    features: [
      'Everything in Starter, plus:',
      '2 Posters Per Week',
      'Live Service Thumbnails',
      'Sermon Cuts',
      'Reels Editing',
      'Event Promotion Graphics',
      'Social Media Content Support',
      'Priority Turnaround',
    ],
  },
]

// 3. Event Branding Packages
export const EVENT_PACKAGES = [
  {
    name: 'Starter Event Package',
    price: 'KES 2,000',
    period: 'per event',
    featured: false,
    features: [
      'Main Event Poster',
      'Attending Posters',
      'Event Thumbnail',
      'Event Banner',
    ],
  },
  {
    name: 'Premium Event Package',
    price: 'KES 5,000',
    period: 'per event',
    featured: true,
    tagline: 'Best for conferences, crusades, concerts, and launches',
    features: [
      'Main Event Poster',
      'Attending Posters',
      'Event Banner',
      'Event Thumbnail',
      'Promo Video',
      'Squeeze Backs',
      'Social Media Promo Graphics',
    ],
  },
]

// 4. Website Design — Business Website Packages
export const WEBSITE_PACKAGES = [
  {
    name: 'Starter Website',
    price: 'KES 30,000',
    period: 'one-time',
    featured: false,
    features: [
      'Up to 5 Pages',
      'Mobile Responsive Design',
      'Contact Form',
      'WhatsApp Integration',
      'Basic SEO Setup',
    ],
  },
  {
    name: 'Professional Website',
    price: 'KES 50,000',
    period: 'one-time',
    featured: true,
    features: [
      'Up to 10 Pages',
      'Advanced Design',
      'Blog Setup',
      'SEO Optimization',
      'Analytics Integration',
      'Speed Optimization',
    ],
  },
  {
    name: 'E-Commerce Website',
    price: 'KES 80,000+',
    period: 'one-time',
    featured: false,
    features: [
      'Online Store',
      'Product Management',
      'Payment Integration',
      'Order Management',
      'Mobile Responsive Design',
      'SEO Setup',
    ],
  },
  {
    name: 'Custom Web Applications',
    price: 'KES 150,000+',
    period: 'one-time',
    featured: false,
    tagline: 'School Management, Booking, CRM, SACCO Systems, Business Platforms, Custom Dashboards',
    features: [
      'School Management Systems',
      'Booking Systems',
      'CRM Systems',
      'SACCO Systems',
      'Business Management Platforms',
      'Custom Dashboards',
    ],
  },
]

// 5. Website Maintenance Packages — monthly retainers
export const MAINTENANCE_PACKAGES = [
  {
    name: 'Basic Maintenance',
    price: 'KES 3,000',
    period: 'per month',
    featured: false,
    features: [
      'Website Monitoring',
      'Content Updates',
      'Monthly Backups',
      'Security Checks',
      'Technical Support',
    ],
  },
  {
    name: 'Standard Maintenance',
    price: 'KES 7,000',
    period: 'per month',
    featured: true,
    features: [
      'Everything in Basic, plus:',
      'Weekly Backups',
      'Performance Optimization',
      'SEO Monitoring',
      'Content Updates',
    ],
  },
  {
    name: 'Premium Maintenance',
    price: 'KES 15,000',
    period: 'per month',
    featured: false,
    features: [
      'Everything in Standard, plus:',
      'Priority Support',
      'Unlimited Minor Updates',
      'Security Monitoring',
      'Monthly Performance Reports',
      'SEO Optimization',
    ],
  },
]

// 6. Mobile App Development
export const MOBILE_APP_PACKAGES = [
  {
    name: 'Basic Mobile App',
    price: 'From KES 80,000',
    period: 'one-time',
    featured: false,
    features: [
      'Android App',
      'User Authentication',
      'Basic Dashboard',
      'API Integration',
    ],
  },
  {
    name: 'Business Mobile App',
    price: 'From KES 150,000',
    period: 'one-time',
    featured: true,
    features: [
      'Android & iOS',
      'Admin Dashboard',
      'Push Notifications',
      'Analytics',
      'Advanced Features',
    ],
  },
  {
    name: 'Custom Enterprise App',
    price: 'From KES 300,000',
    period: 'one-time',
    featured: false,
    features: [
      'Custom Functionality',
      'Multiple User Roles',
      'Integrations',
      'Scalable Architecture',
      'Ongoing Support',
    ],
  },
]

// 7. Digital Marketing Packages
export const DIGITAL_MARKETING_PACKAGES = [
  {
    name: 'Starter Marketing',
    price: 'KES 10,000',
    period: 'per month',
    featured: false,
    tagline: 'Perfect for businesses getting started on social media',
    features: [
      '8 Social Media Posts Monthly',
      '4 Custom Graphics',
      'Captions and Hashtags',
      'Basic Page Management',
      'WhatsApp Marketing Support',
      'Monthly Performance Report',
    ],
  },
  {
    name: 'Standard Marketing',
    price: 'KES 25,000',
    period: 'per month',
    featured: false,
    tagline: 'For businesses ready to grow their online audience',
    features: [
      '16 Social Media Posts Monthly',
      '8 Custom Graphics',
      '4 Reels / Short Videos',
      'Content Calendar',
      'Community Management',
      'Facebook and Instagram Management',
      'Monthly Analytics Report',
      'Basic Ad Campaign Setup',
    ],
  },
  {
    name: 'Premium Marketing',
    price: 'KES 50,000',
    period: 'per month',
    featured: true,
    badge: 'Most Popular',
    tagline: 'Full-service social media management and lead generation',
    features: [
      '30 Social Media Posts Monthly',
      'Unlimited Graphic Design',
      '12 Reels / Short Videos',
      'Full Content Strategy',
      'Daily Page Management',
      'Facebook Management',
      'Instagram Management',
      'TikTok Management',
      'Lead Generation Campaigns',
      'Meta Ads Management',
      'Monthly Growth Reports',
      'Priority Support',
    ],
  },
]

// 8. Business Growth Packages
export const BUSINESS_GROWTH_PACKAGES = [
  {
    name: 'Starter Business',
    price: 'KES 15,000',
    period: 'per month',
    featured: false,
    tagline: 'Ideal for small businesses building their brand presence',
    features: [
      '4 Business Posters Monthly',
      'Social Media Management',
      'WhatsApp Marketing Support',
      'Brand Guidance',
      'Monthly Performance Reports',
      'Business Consultation',
    ],
  },
  {
    name: 'Standard Business',
    price: 'KES 35,000',
    period: 'per month',
    featured: false,
    tagline: 'For growing businesses needing design, content, and strategy',
    features: [
      '8 Business Posters Monthly',
      '12 Social Media Posts Monthly',
      '4 Promotional Reels Monthly',
      'Website Content Updates',
      'Lead Follow-Up Strategy',
      'Community Management',
      'Monthly Analytics Reports',
    ],
  },
  {
    name: 'Premium Business Growth',
    price: 'KES 75,000',
    period: 'per month',
    featured: true,
    badge: 'Best Value',
    tagline: 'Complete business growth — website included',
    note: 'Free website activated after a 3-month commitment. Domain and hosting renewals billed separately. Up to 5 pages included.',
    features: [
      'FREE Professional Website (Worth KES 30,000)',
      'Website Hosting Setup',
      'Website Maintenance',
      'Unlimited Graphic Design Requests',
      'Full Social Media Management',
      '20 Social Media Posts Monthly',
      '12 Reels Monthly',
      'Lead Generation Campaigns',
      'Meta Ads Management',
      'Monthly Strategy Meetings',
      'Priority Support',
      'Detailed Growth Reports',
    ],
  },
]

// 9. Royal Graphix Business Partner (Enterprise)
export const BUSINESS_PARTNER_PACKAGE = [
  {
    name: 'Royal Graphix Business Partner',
    price: 'KES 120,000',
    period: 'per month',
    featured: true,
    badge: 'Enterprise',
    tagline: 'The complete done-for-you business growth partnership',
    features: [
      'FREE Premium Website (Worth KES 50,000)',
      'Website Maintenance and SEO',
      'Unlimited Graphic Design',
      'Full Social Media Management',
      '30+ Social Media Posts Monthly',
      '20+ Reels Monthly',
      'Ad Campaign Management',
      'Lead Generation Systems',
      'Branding Strategy',
      'Dedicated Account Manager',
      'Executive Performance Reports',
      'Priority Delivery',
    ],
  },
]


export const PRICING_CATEGORIES = [
  { key: 'graphic',     label: 'Graphic Design',   icon: 'Palette' },
  { key: 'church',      label: 'Church Media',      icon: 'Church' },
  { key: 'event',       label: 'Event Branding',    icon: 'PartyPopper' },
  { key: 'website',     label: 'Websites',          icon: 'Globe' },
  { key: 'maintenance', label: 'Maintenance',       icon: 'Wrench' },
  { key: 'mobile',      label: 'Mobile Apps',       icon: 'Smartphone' },
  { key: 'marketing',   label: 'Digital Marketing', icon: 'TrendingUp' },
  { key: 'growth',      label: 'Business Growth',   icon: 'Rocket' },
]

// Backwards-compatible alias (some components may still import this name)
export const PRICING_PLANS = WEBSITE_PACKAGES


export const PROCESS_STEPS = [
  { n: 1, title: 'Discovery', desc: 'We learn about your business, goals, target audience, and competitors.' },
  { n: 2, title: 'Strategy', desc: 'We craft a tailored plan combining design, tech, and growth tactics.' },
  { n: 3, title: 'Design & Build', desc: 'Our team brings your vision to life with pixel-perfect precision.' },
  { n: 4, title: 'Launch & Grow', desc: 'We deploy, monitor, and continuously optimize for results.' },
]

export const BLOG_POSTS = [
  {
    id: 'b1',
    slug: '10-web-design-trends-2025',
    title: '10 Web Design Trends Dominating 2025',
    category: 'Web Design',
    date: 'May 12, 2025',
    author: 'Royal Graphix',
    emoji: '🖥️',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=75&fit=crop',
    excerpt: 'From glassmorphism to variable fonts — discover the design patterns top agencies are using to win clients in 2025.',
  },
  {
    id: 'b2',
    slug: 'how-to-10x-seo-traffic-90-days',
    title: 'How to 10x Your SEO Traffic in 90 Days',
    category: 'SEO',
    date: 'Apr 28, 2025',
    author: 'Royal Graphix',
    emoji: '📈',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=75&fit=crop',
    excerpt: 'A step-by-step breakdown of the exact SEO strategy we used to grow a client from 2k to 20k monthly organic visitors.',
  },
  {
    id: 'b3',
    slug: 'complete-brand-identity-checklist',
    title: 'The Complete Brand Identity Checklist',
    category: 'Branding',
    date: 'Apr 15, 2025',
    author: 'Royal Graphix',
    emoji: '🎨',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=75&fit=crop',
    excerpt: 'Everything a modern brand needs — from logo variants to tone of voice guidelines — in one comprehensive checklist.',
  },
  {
    id: 'b4',
    slug: 'why-ux-design-drives-revenue',
    title: 'Why UI/UX Design Drives Revenue (With Numbers)',
    category: 'UI/UX',
    date: 'Mar 30, 2025',
    author: 'Royal Graphix',
    emoji: '⚡',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=75&fit=crop',
    excerpt: 'Data-backed case studies showing how better UX increased conversion rates by 40–200% for our clients.',
  },
  {
    id: 'b5',
    slug: 'supabase-vs-firebase-2025',
    title: 'Supabase vs Firebase: Which to Choose in 2025?',
    category: 'Development',
    date: 'Mar 14, 2025',
    author: 'Royal Graphix',
    emoji: '🔧',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=75&fit=crop',
    excerpt: 'A deep dive comparing these two BaaS platforms across pricing, developer experience, scalability, and real-world use cases.',
  },
  {
    id: 'b6',
    slug: 'social-media-design-that-converts',
    title: 'Social Media Design That Actually Converts',
    category: 'Graphics',
    date: 'Feb 28, 2025',
    author: 'Royal Graphix',
    emoji: '📱',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=75&fit=crop',
    excerpt: 'Stop posting generic graphics. Here\'s how to design social media content that stops the scroll and drives real engagement.',
  },
]
