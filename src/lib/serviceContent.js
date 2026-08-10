// ─────────────────────────────────────────────────────────────
// Individual service landing page content — /services/:slug
// Each entry is written to be genuinely distinct (not a reskin
// of the same paragraph), grounded in what Royal Graphix
// actually offers (see PRICING_PLANS / price lists in constants.js).
//
// `problems` and `benefits` are index-paired — problems[i] is the
// challenge, benefits[i] is how this specific service solves it.
// Keep them the same length and in the same order when editing.
// ─────────────────────────────────────────────────────────────

export const SERVICE_PAGES = {
  'web-design': {
    slug: 'web-design',
    icon: 'Monitor',
    metaTitle: 'Web Design Services — Custom, Responsive Websites',
    metaDescription: 'Royal Graphix designs fast, responsive websites that turn visitors into clients. Custom design, mobile-first builds, and ongoing support — for businesses in Kenya and beyond.',
    h1: 'Web Design That Works as Hard as You Do',
    intro: 'Your website is usually the first real interaction someone has with your business. We design and build custom websites that load fast, look sharp on any device, and are structured to turn visitors into enquiries — not just another template with your logo on it.',
    challengesHeading: 'Common Website Challenges',
    problems: [
      'An outdated or template-heavy site that doesn\u2019t reflect how the business has grown',
      'A website that looks fine on desktop but breaks or feels clunky on mobile',
      'Visitors landing on the site but not converting into calls, messages, or bookings',
      'No one in-house able to update content without calling a developer',
    ],
    benefits: [
      'A custom design built around your current brand and how the business actually operates today',
      'Mobile-first layouts that are designed and tested for phones, not just scaled-down desktop views',
      'Clear calls-to-action placed at the exact points where people decide to reach out',
      'Basic content editing guidance or a simple CMS, so small updates don\u2019t need a developer',
    ],
    included: [
      'Custom UI design in Figma before any code is written',
      'Responsive build tested across phone, tablet, and desktop',
      'On-page SEO basics — proper headings, meta tags, and fast-loading images',
      'Contact/enquiry forms wired up and tested',
      'Basic content editing guidance or a simple CMS, depending on the plan',
    ],
    process: [
      { title: 'Discovery', text: 'We learn about your business, audience, and what the site needs to achieve.' },
      { title: 'Design', text: 'Wireframes and visual design, reviewed with you before development starts.' },
      { title: 'Build', text: 'The site is coded, made responsive, and connected to any forms or integrations.' },
      { title: 'Launch & Support', text: 'We test, launch, and stay available for fixes and updates after go-live.' },
    ],
    faqs: [
      { q: 'How long does a website take?', a: 'Most business websites take 2–4 weeks from approved design to launch, depending on scope and how quickly feedback comes back to us.' },
      { q: 'Will my site work on mobile?', a: 'Yes — every site we build is designed mobile-first and tested across common screen sizes before launch.' },
      { q: 'Can I update the content myself afterward?', a: 'Depending on the plan, we can set you up with a simple content editor, or handle updates for you on request.' },
    ],
    portfolioCategory: 'Web Design',
    relatedSlugs: ['web-development', 'web-applications', 'branding'],
  },

  'web-development': {
    slug: 'web-development',
    icon: 'Code2',
    metaTitle: 'Web Development Services — React, Next.js & Modern Stacks',
    metaDescription: 'Custom web development using React, Next.js, and Supabase. Royal Graphix builds fast, maintainable websites and backends built to grow with your business.',
    h1: 'Web Development Built to Scale With Your Business',
    intro: 'Design is only half the job — the code underneath decides how fast, reliable, and easy to maintain your site actually is. We build with modern, well-supported tools like React and Supabase, so your site stays fast today and easy to extend later.',
    challengesHeading: 'Common Development Challenges',
    problems: [
      'A website built on an old stack that\u2019s slow, hard to update, or insecure',
      'A designer handed over static mockups with no one to actually build them properly',
      'Needing custom functionality — bookings, dashboards, integrations — that page builders can\u2019t handle',
      'Previous developers who disappeared, leaving undocumented or fragile code behind',
    ],
    benefits: [
      'A rebuild on a modern, well-supported stack that\u2019s faster and easier to maintain',
      'Pixel-accurate development of your designs, with a developer involved from day one',
      'Custom backend and API work for the exact functionality your business needs',
      'Clean, documented code that a future developer — or we — can actually pick up and maintain',
    ],
    included: [
      'Front-end development with React and modern component architecture',
      'Backend and database setup where needed (Supabase/Postgres)',
      'API integrations — payments, forms, third-party tools',
      'Performance and security best practices baked into the build',
      'Deployment and post-launch technical support',
    ],
    process: [
      { title: 'Technical Scoping', text: 'We map out the functionality needed and the right tools for the job.' },
      { title: 'Architecture', text: 'Database structure and application architecture are planned before coding starts.' },
      { title: 'Development', text: 'Iterative builds with regular check-ins so nothing drifts from what you need.' },
      { title: 'Testing & Deployment', text: 'QA, performance checks, and a clean handover or deployment.' },
    ],
    faqs: [
      { q: 'Do you work with existing codebases?', a: 'Yes — we regularly take over or extend existing React/Supabase projects, after a short technical review.' },
      { q: 'Can you add custom features to my website?', a: 'Yes, from booking systems to client dashboards — if it can be built on the web, we can scope it.' },
      { q: 'What technologies do you use?', a: 'Primarily React, Next.js, and Supabase, chosen for reliability, speed, and long-term maintainability.' },
    ],
    portfolioCategory: 'Web Design',
    relatedSlugs: ['web-design', 'web-applications', 'seo'],
  },

  'web-applications': {
    slug: 'web-applications',
    icon: 'LayoutGrid',
    metaTitle: 'Web Application Development — Custom Tools & Dashboards',
    metaDescription: 'Royal Graphix builds custom web applications — client portals, booking systems, dashboards, and internal tools — designed around how your business actually operates.',
    h1: 'Custom Web Applications for How You Actually Work',
    intro: 'Sometimes a website isn\u2019t enough — you need a real tool. We design and build web applications like client portals, booking systems, and internal dashboards that fit your workflow instead of forcing you into someone else\u2019s template.',
    challengesHeading: 'Common Web Application Challenges',
    problems: [
      'Managing bookings, orders, or client requests through spreadsheets and WhatsApp',
      'Off-the-shelf software that\u2019s 80% right but doesn\u2019t fit how the business actually runs',
      'No visibility into what\u2019s happening across the business without manual reporting',
      'A growing team that needs shared, structured tools instead of ad-hoc processes',
    ],
    benefits: [
      'One custom tool your team logs into instead of juggling spreadsheets and chat threads',
      'An application built around your exact process, not a generic template you have to work around',
      'A central system with the data and views your business actually needs to see',
      'User roles and shared access so the whole team works from the same structured tool',
    ],
    included: [
      'Requirements mapping — what the tool needs to do and for whom',
      'Custom UI design for the application\u2019s screens and flows',
      'Secure backend and database setup (Supabase/Postgres)',
      'User roles and permissions where needed (e.g. admin vs. client access)',
      'Testing, deployment, and post-launch support',
    ],
    process: [
      { title: 'Requirements', text: 'We map the exact workflows and data the application needs to handle.' },
      { title: 'Design', text: 'Screens and flows are designed around real usage, not guesswork.' },
      { title: 'Build', text: 'The application is developed in stages, with working previews along the way.' },
      { title: 'Launch & Iterate', text: 'We launch, gather feedback, and refine based on real usage.' },
    ],
    faqs: [
      { q: 'What kind of tools can you build?', a: 'Client portals, booking and scheduling systems, internal dashboards, project trackers, and similar custom tools.' },
      { q: 'How is this different from a website?', a: 'A web application usually involves logins, user-specific data, and workflows — not just informational pages.' },
      { q: 'Can it integrate with tools we already use?', a: 'In most cases yes, depending on the tool\u2019s API — we\u2019ll confirm feasibility during scoping.' },
    ],
    portfolioCategory: 'Web Design',
    relatedSlugs: ['web-development', 'web-design', 'seo'],
  },

  'graphic-design': {
    slug: 'graphic-design',
    icon: 'Palette',
    metaTitle: 'Graphic Design Services — Logos, Posters, Social Media Graphics',
    metaDescription: 'Professional graphic design from Royal Graphix — logos, posters, flyers, social media kits, and marketing materials designed to get your brand noticed.',
    h1: 'Graphic Design That Gets Your Brand Noticed',
    intro: 'From a single event poster to a full set of social media templates, we design graphics that look professional and stay consistent with your brand — quickly, and without the back-and-forth of a slow design process.',
    challengesHeading: 'Common Design Challenges',
    problems: [
      'Marketing materials that look inconsistent because they\u2019ve come from different sources',
      'Needing a poster, flyer, or graphic on short notice for an event or promotion',
      'Social media posts that look unpolished compared to competitors',
      'No one in-house with the design skills or software to produce clean visuals',
    ],
    benefits: [
      'Consistent, professional visuals across every platform and printed material',
      'Fast turnaround for time-sensitive graphics like event posters and promotions',
      'Polished, on-brand social posts that hold their own against any competitor',
      'A design partner on call, so you\u2019re never stuck without someone to build the visual',
    ],
    included: [
      'Posters, flyers, and event graphics',
      'Social media post and story templates',
      'Banners, business cards, and other print collateral',
      'Source files where applicable, so you retain ownership',
      'Revisions until the design is right',
    ],
    process: [
      { title: 'Brief', text: 'You tell us what the graphic is for and any brand guidelines to follow.' },
      { title: 'Concept', text: 'We put together an initial design based on the brief.' },
      { title: 'Revisions', text: 'We refine based on your feedback until it\u2019s right.' },
      { title: 'Delivery', text: 'Final files delivered in the formats you need — print and/or digital.' },
    ],
    faqs: [
      { q: 'Do you do one-off designs or only packages?', a: 'Both — see our price list for individual items like posters and banners, or ask about a monthly design package.' },
      { q: 'Can you match our existing brand style?', a: 'Yes, we\u2019ll work from your existing brand guidelines, logo, and color palette if you have them.' },
      { q: 'How fast can you turn around a design?', a: 'Simple graphics can often be turned around within 24–48 hours, depending on current workload.' },
    ],
    portfolioCategory: 'Graphic Design',
    relatedSlugs: ['branding', 'social-media-management', 'web-design'],
  },

  'social-media-management': {
    slug: 'social-media-management',
    icon: 'Megaphone',
    metaTitle: 'Social Media Management Services — Content, Design & Growth',
    metaDescription: 'Full-service social media management from Royal Graphix — content planning, design, and consistent posting to grow your presence and generate leads.',
    h1: 'Social Media Management That Builds Real Presence',
    intro: 'Consistent, well-designed social media takes time most business owners don\u2019t have. We plan, design, and post content that keeps your accounts active and on-brand — so your social presence works for you instead of sitting on your to-do list.',
    challengesHeading: 'Common Social Media Challenges',
    problems: [
      'Social accounts that go quiet for weeks because there\u2019s no time to post',
      'Posts that are inconsistent in quality or don\u2019t match the brand',
      'No clear content plan — just posting whenever something comes to mind',
      'Wanting to use social media for leads, not just visibility',
    ],
    benefits: [
      'A consistent posting schedule that keeps your accounts active without you managing it day-to-day',
      'On-brand graphics for every single post, not just the occasional good one',
      'A monthly content plan built around your business goals, not random inspiration',
      'Content and captions written to prompt enquiries, not just likes',
    ],
    included: [
      'Monthly content planning aligned with your business and offers',
      'Custom graphics and post design for each piece of content',
      'Scheduled posting across your chosen platforms',
      'Monthly plans available at different posting volumes — see current pricing',
      'Ongoing adjustments based on what\u2019s resonating with your audience',
    ],
    process: [
      { title: 'Audit & Strategy', text: 'We review your current presence and set a content direction.' },
      { title: 'Content Planning', text: 'A monthly plan is built around your offers, events, and goals.' },
      { title: 'Design & Scheduling', text: 'Posts are designed and scheduled consistently through the month.' },
      { title: 'Review', text: 'We check in on performance and adjust the plan as needed.' },
    ],
    faqs: [
      { q: 'How many posts do I get per month?', a: 'This depends on the plan you choose — packages range from around 8 posts a month up to full daily management. See our pricing page for current options.' },
      { q: 'Which platforms do you manage?', a: 'Most commonly Instagram, Facebook, and TikTok — let us know which platforms matter most for your audience.' },
      { q: 'Do you write captions too?', a: 'Yes, captions are included as part of the content planning process.' },
    ],
    portfolioCategory: 'Graphic Design',
    relatedSlugs: ['graphic-design', 'branding', 'seo'],
  },

  'seo': {
    slug: 'seo',
    icon: 'Search',
    metaTitle: 'SEO Services — Technical SEO, Content & Growth Strategy',
    metaDescription: 'Royal Graphix provides data-driven SEO services — technical audits, keyword research, and content strategy to help your website rank and attract the right visitors.',
    h1: 'SEO That Puts You in Front of the Right Audience',
    intro: 'Ranking well on Google isn\u2019t about tricks — it\u2019s about a site that\u2019s technically sound, genuinely useful, and structured the way search engines expect. We handle the technical and content side of SEO so your site earns visibility over time.',
    challengesHeading: 'Common SEO Challenges',
    problems: [
      'A website that\u2019s live but barely appears in Google search results',
      'No clear idea which keywords or pages are worth targeting',
      'Technical issues such as slow load times, missing metadata, and broken links',
      'Content that exists but isn\u2019t structured in a way search engines can understand',
    ],
    benefits: [
      'A technically clean site that\u2019s easier for Google to crawl and index',
      'Clear keyword targeting based on what your actual audience is searching for',
      'Proper on-page and technical optimization to improve search visibility',
      'Content and pages structured around real search intent',
      'Steady, sustainable growth in organic (non-paid) traffic over time',
    ],
    included: [
      'Technical SEO audit — site speed, metadata, indexability, structured data',
      'Keyword research relevant to your services and audience',
      'On-page optimization — titles, meta descriptions, heading structure',
      'Content strategy recommendations',
      'Monthly reporting on progress, where applicable',
    ],
    process: [
      { title: 'Audit', text: 'A full technical and on-page review of the current site.' },
      { title: 'Strategy', text: 'Keyword and content priorities are set based on the audit and your goals.' },
      { title: 'Implementation', text: 'Technical fixes and on-page changes are made across the site.' },
      { title: 'Monitor & Refine', text: 'We track results and adjust the approach as the site gains traction.' },
    ],
    faqs: [
      { q: 'How long until I see SEO results?', a: 'SEO is gradual — most sites start seeing meaningful movement within 3–6 months, depending on competition and starting point.' },
      { q: 'Do you guarantee first-page rankings?', a: 'No — anyone guaranteeing specific rankings isn\u2019t being straight with you. We focus on sound technical and content fundamentals that support real, lasting growth.' },
      { q: 'Is SEO a one-time project?', a: 'It can start with a one-time audit and fix, but ongoing SEO tends to compound — ask us about what makes sense for your site.' },
    ],
    portfolioCategory: 'Web Design',
    relatedSlugs: ['web-design', 'web-development', 'social-media-management'],
  },

  'branding': {
    slug: 'branding',
    icon: 'PenTool',
    metaTitle: 'Branding & Brand Identity Services — Logos, Style Guides & Strategy',
    metaDescription: 'Royal Graphix builds complete brand identities — strategy, logo design, visual identity, and style guides — so your business looks consistent everywhere it shows up.',
    h1: 'Brand Identity That Holds Up Everywhere You Show Up',
    intro: 'A logo alone isn\u2019t a brand. We build complete identities — strategy, visual language, and guidelines — so your business looks like the same, deliberate brand whether someone finds you on a website, a poster, or a business card.',
    challengesHeading: 'Common Branding Challenges',
    problems: [
      'A logo that was designed years ago and no longer fits how the business has grown',
      'Inconsistent colors, fonts, or tone across different materials and platforms',
      'No clear brand guidelines, so every new designer or hire starts from scratch',
      'A brand that doesn\u2019t clearly communicate what makes the business different',
    ],
    benefits: [
      'A refreshed visual identity that reflects the business you\u2019ve actually become',
      'A defined color palette, typography, and voice applied consistently everywhere',
      'A brand guidelines document so anyone new can stay on-brand from day one',
      'Clear positioning that communicates what sets the business apart',
    ],
    included: [
      'Brand strategy — positioning, voice, and audience clarity',
      'Logo design with primary and secondary variations',
      'Color palette and typography system',
      'Brand guidelines document for consistent future use',
      'Business card and core collateral design where needed',
    ],
    process: [
      { title: 'Discovery', text: 'We dig into the business, audience, and what the brand needs to communicate.' },
      { title: 'Strategy', text: 'Positioning and brand voice are defined before any visuals are made.' },
      { title: 'Visual Identity', text: 'Logo, color, and typography are designed and refined with your input.' },
      { title: 'Guidelines', text: 'Everything is documented so the brand stays consistent going forward.' },
    ],
    faqs: [
      { q: 'Do I need a full rebrand, or just a refresh?', a: 'Not always a full rebrand — sometimes tightening the existing identity is enough. We\u2019ll advise honestly after understanding where things stand.' },
      { q: 'What do I actually receive at the end?', a: 'Logo files in multiple formats, a color and typography system, and a brand guidelines document, plus any collateral included in your package.' },
      { q: 'Can you design just a logo, without the full package?', a: 'Yes — logo design is available on its own, though a fuller identity tends to hold up better long-term.' },
    ],
    portfolioCategory: 'Branding',
    relatedSlugs: ['graphic-design', 'social-media-management', 'web-design'],
  },

  'ui-ux': {
    slug: 'ui-ux',
    icon: 'Layout',
    metaTitle: 'UI/UX Design Services — Wireframes, Prototypes & Design Systems',
    metaDescription: 'Royal Graphix offers user-centered UI/UX design — wireframes, Figma prototypes, and design systems that make digital products easier and more enjoyable to use.',
    h1: 'UI/UX Design Rooted in How People Actually Use Your Product',
    intro: 'Good design isn\u2019t just what looks nice — it\u2019s what\u2019s easy to use. We design interfaces starting from wireframes and user flows, so the final product is intuitive, not just attractive.',
    challengesHeading: 'Common UI/UX Challenges',
    problems: [
      'A product or website that looks fine but confuses users at key steps',
      'High drop-off at signup, checkout, or other critical flows',
      'No design system, so every new screen is designed from scratch',
      'Design decisions made on opinion rather than how users actually behave',
    ],
    benefits: [
      'Clear, intuitive flows at the exact steps where users were getting stuck',
      'Simplified, tested flows for signup, checkout, and other critical actions',
      'A reusable design system that speeds up every future screen and feature',
      'Design decisions grounded in user flows and research, not guesswork',
    ],
    included: [
      'User flow mapping and wireframing',
      'Interactive Figma prototypes',
      'Visual UI design consistent with your brand',
      'A reusable design system/component library',
      'Handoff-ready files for development',
    ],
    process: [
      { title: 'Research', text: 'Understanding the users, their goals, and current pain points.' },
      { title: 'Wireframes', text: 'Low-fidelity layouts to map structure and flow before visual design.' },
      { title: 'Prototyping', text: 'Interactive Figma prototypes for review and, where useful, testing.' },
      { title: 'UI Design & Handoff', text: 'Final visual design, delivered in a developer-ready format.' },
    ],
    faqs: [
      { q: 'Is this only for apps, or websites too?', a: 'Both — the same principles apply to websites, web applications, and mobile apps.' },
      { q: 'Do you also build what you design?', a: 'Yes, our web development team can take the same designs straight into development.' },
      { q: 'What do I receive at the end?', a: 'A Figma file with wireframes, prototypes, and final UI screens, ready for development.' },
    ],
    portfolioCategory: 'Web Design',
    relatedSlugs: ['web-design', 'web-applications', 'branding'],
  },
}

export const SERVICE_PAGE_SLUGS = Object.keys(SERVICE_PAGES)
