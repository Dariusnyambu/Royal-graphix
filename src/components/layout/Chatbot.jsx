import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import { submitToGoogleSheets } from '@/lib/googleSheets'

// ─────────────────────────────────────────────────────────────
// KITA v4 — Royal Graphix Conversational Sales Assistant
// Context-aware, session-memory, lead retention system
// ─────────────────────────────────────────────────────────────

const ADMIN = {
  phone:   '+254 708 039 015',
  email:   'info@royalgraphix.co.ke',
  website: 'https://royalgraphix.co.ke',
}

const WELCOME = "Welcome to Royal Graphix! I'm Kita, your digital assistant.\n\nI can help you with graphic design, branding, website development, UI/UX design, pricing, quotations, and project consultations.\n\nWhat are you working on today?"

// ── Session memory ─────────────────────────────────────────────
// Kita tracks user context silently across the session
const INITIAL_CONTEXT = {
  name: null, business: null, service: null,
  budget: null, timeline: null, stage: null, // 'new'|'existing'|'startup'
  // ── Additive fields (Kita System Upgrade) ──────────────────────
  emotion: null,        // detected emotional state
  leadScore: 'cold',    // 'hot' | 'warm' | 'cold'
  urgent: false,        // urgency phrase detected
  businessType: null,   // church, school, startup, restaurant, ngo, shop, salon, real_estate, personal_brand
}

// ── Knowledge base ─────────────────────────────────────────────
const KB = [
  // Greetings English
  { keys: ['hi','hello','hey','good morning','good afternoon','good evening','howdy','greetings','yo','sup'],
    reply: "Hello! Welcome to Royal Graphix. I'm Kita.\n\nI work with businesses every day on graphic design, branding, websites, and digital marketing.\n\nWhat are you currently working on or trying to achieve? Tell me a bit about your project and I'll point you in the right direction." },

  // Greetings Swahili / Sheng
  { keys: ['habari','mambo','sasa','niaje','vipi','salamu','karibu','hujambo','poa','sawa'],
    reply: "Habari! Karibu Royal Graphix. Mimi ni Kita, msaidizi wako wa kidijitali.\n\nTunaweza kukusaidia na graphic design, branding, website, au digital marketing.\n\nUnafanya mradi gani sasa hivi? Niambie zaidi ili nikusaidie vizuri." },

  // Swahili service requests
  { keys: ['nataka website','ninahitaji website','website ya biashara','tengeneza website'],
    reply: "Vizuri! Tunajenga websites za haraka, zinazofanya kazi kwenye simu na zinazopatikana kwenye Google.\n\nNiambie:\n- Biashara yako ni ya aina gani?\n- Je, unataka e-commerce (kuuza bidhaa online) au website ya kawaida ya habari?\n- Biashara yako ina jina gani?\n\nTutakuandalia quotation bure haraka iwezekanavyo." },

  { keys: ['nataka logo','ninahitaji logo','tengeneza logo'],
    reply: "Vizuri sana! Tunaunda logo za kitaalamu.\n\nNiambie kidogo:\n- Biashara yako inaitwa nini?\n- Ni sekta gani? (chakula, fedha, kanisa, teknolojia...)\n- Una rangi unazopenda?\n\nTutakutumia quotation haraka." },

  // Thank you
  { keys: ['thank you','thanks','asante','awesome','great','perfect','wonderful','cool','excellent','amazing'],
    type: 'thanks' },

  // Graphic Design
  { keys: ['graphic design','design service','graphics'],
    reply: "Royal Graphix creates professional graphic design for businesses across Kenya.\n\nWe handle:\n- Logo Design\n- Brand Identity\n- Posters and Flyers (from KES 500)\n- Social Media Graphics\n- Business Cards\n- Company Profiles and Brochures\n- Packaging Design\n- Event Branding\n- Church Posters\n- Marketing Materials\n\nWhich of these are you looking for? Or would you like me to walk you through all the options?" },

  // Logo
  { keys: ['logo'],
    reply: "Logo Design — We craft logos that are unique, memorable, and built to represent your brand perfectly.\n\nA logo works best when it's part of a complete brand identity. We usually recommend pairing it with brand colours, typography, and business cards for maximum impact.\n\nWhat kind of business is the logo for? That helps me suggest the right approach and give you an accurate quote.",
    upsell: "Since you're looking at logo design, would you also like to hear about our full branding packages? Many clients find it more cost-effective to do both together." },

  // Poster / Flyer
  { keys: ['poster','flyer','flyers','posters','bango','tangazo'],
    reply: "Poster and Flyer Design — Event Posters from KES 500, Business Posters and Flyers from KES 1,000, depending on size and complexity.\n\nWe handle:\n- Event posters\n- Business flyers\n- Church and ministry materials\n- Promotional campaigns\n- Print-ready A5, A4, A3 formats\n\nWe also offer express delivery for urgent orders.\n\nWhat's the poster or flyer for? Tell me the purpose and I'll give you a more accurate estimate." },

  // Social Media
  { keys: ['social media','instagram','facebook','twitter','tiktok','social','content creation'],
    reply: "Social Media Graphics — We design branded content that gets noticed and builds trust.\n\nThis includes:\n- Post templates\n- Story designs\n- Profile and cover photos\n- Branded content series\n- Platform-specific formats\n\nConsistent social media branding makes businesses look professional and credible.\n\nAre you looking for a one-time design or an ongoing content package?" },

  // Business Card
  { keys: ['business card','card','visiting card'],
    reply: "Business Cards — Clean, professional, print-ready designs that make a strong first impression.\n\nWe deliver multiple format options with fast turnaround.\n\nDo you have an existing brand identity or are you starting fresh? That helps us match the design perfectly." },

  // Branding
  { keys: ['brand','branding','brand identity','rebrand','rebranding'],
    reply: "Branding Services — We build complete brand identities that make businesses unforgettable.\n\nA complete package includes:\n- Logo Design\n- Brand Colours and Typography\n- Business Cards\n- Letterhead and Templates\n- Social Media Kit\n- Brand Style Guide\n\nIs this for a new business or are you rebranding an existing one? Knowing your stage helps us tailor the right package.",
    upsell: "Many clients who invest in branding also build a new website at the same time. Would you like to explore a combined branding and website package?" },

  // Web Development
  { keys: ['web','website','develop','site','build','web app','web development'],
    reply: "We build fast, responsive, mobile-first websites optimised for search engines.\n\nOur web services include:\n- Business Websites\n- E-commerce and Online Stores\n- Landing Pages\n- Booking Systems\n- School Management Systems\n- Church Websites\n- Portfolio Websites\n- Custom Web Applications\n\nWhat type of website are you thinking about? And is this for a new project or are you updating an existing site?",
    upsell: "A new website works best when paired with SEO so customers can find it on Google. Would you like to know more about our SEO packages?" },

  // E-commerce
  { keys: ['ecommerce','e-commerce','online store','shop','sell online','store','selling','mpesa','payment','woocommerce'],
    reply: "E-Commerce Websites — We build secure, professional online stores.\n\nFeatures include:\n- M-Pesa and card payment integration\n- Product inventory management\n- Order tracking and management\n- Mobile-friendly shopping experience\n- Full admin dashboard\n\nWe also recommend combining with SEO to drive organic traffic to your store.\n\nHow many products do you plan to sell? That helps us determine the right setup.",
    upsell: "Would you like to add an SEO package to help customers discover your store on Google? It makes a big difference in the first few months." },

  // Landing Page
  { keys: ['landing page','lead page','sales page','campaign page'],
    reply: "Landing Pages — High-converting pages designed specifically to capture leads and drive sales.\n\nTypically delivered in 3 to 5 days.\n\nWhat is the campaign or offer for? Knowing your goal helps us design a page that actually converts visitors into customers." },

  // School
  { keys: ['school','college','university','education system','school system'],
    reply: "School Websites and Management Systems — We build education platforms with student portals, timetables, fee payment, attendance tracking, and parent communication.\n\nIs this for a primary school, secondary school, college, or training institute? The requirements differ and I want to make sure we recommend the right solution." },

  // Church
  { keys: ['church','ministry','religious','gospel','kanisa','church website','church poster'],
    reply: "We work with many churches and ministries. Here is what we can do for you:\n\n- Church website with sermon archive and event calendar\n- Online giving integration\n- Church Posters and Flyers\n- Event Branding and Signage\n- Social Media Graphics\n- Livestream Overlay Graphics\n\nAre you working on an upcoming event or looking for a more complete digital solution for your church?",
    upsell: "We can put together a combined church package covering website, weekly posters, and social media. Would that be useful?" },

  // Business / Startup mention
  { keys: ['business','company','startup','enterprise','my company','my business','our company'],
    reply: "Helping businesses grow is exactly what we do.\n\nFor businesses at any stage, we usually recommend starting with:\n- A professional website\n- Strong logo and brand identity\n- Social media graphics\n- SEO to attract customers online\n\nWhat stage is your business at? Just launching, already running but needs a refresh, or scaling and looking for stronger digital presence?" },

  // NGO
  { keys: ['ngo','nonprofit','charity','foundation','community organisation'],
    reply: "We work with NGOs and nonprofits and understand mission-driven organisations.\n\nWe offer:\n- NGO Websites\n- Branding and Identity\n- Campaign and Awareness Materials\n- Annual Report Design\n- Event Collateral\n\nWe have special considerations for registered nonprofits.\n\nWhat project are you working on right now?" },

  // Event
  { keys: ['event','conference','concert','wedding','ceremony','exhibition','launch','gala'],
    reply: "Event Branding — We make events look polished and memorable.\n\nWe handle:\n- Event Posters and Flyers\n- Banners and Signage\n- Invitation Cards\n- Social Media Event Graphics\n- Event Programmes\n- Stage and Backdrop Design\n\nWhen is the event and what type is it? That helps us plan timelines and deliverables with you." },

  // Booking / Clinic / Salon
  { keys: ['booking','appointment','reservation','clinic','salon','hotel','spa'],
    reply: "Booking and Appointment Systems — We build custom systems for clinics, salons, hotels, and service businesses.\n\nIncludes payment integration, automated confirmations, and a full admin panel.\n\nWhat kind of business needs the booking system? Knowing more helps us propose the right features." },

  // Redesign
  { keys: ['redesign','refresh','revamp','update website','old website','modernise'],
    reply: "Website Redesign — We specialise in modernising outdated websites to improve look, performance, and user experience.\n\nDo you have your current website URL so I can understand the starting point? Even a quick description of what you want to change helps a lot." },

  // UI/UX
  { keys: ['ui','ux','ui/ux','user experience','wireframe','prototype','app design','figma','mobile app design'],
    reply: "UI/UX Design — We design experiences that users love and that convert visitors into customers.\n\nOur services include:\n- Wireframing\n- User Research\n- Mobile App Design\n- Web App Design\n- Interactive Figma Prototypes\n- Design Systems\n- User Journey Mapping\n\nIs this for a mobile app, web platform, or something else? Tell me more about the product." },

  // SEO
  { keys: ['seo','search engine','google ranking','rank','visibility','organic traffic','google'],
    reply: "SEO and Digital Marketing — We help businesses rank higher on Google and grow organic traffic.\n\nOur approach includes:\n- Keyword Research\n- On-Page Optimisation\n- Technical SEO\n- Link Building\n- Google Analytics and Monthly Reporting\n- Google Ads Management\n\nWe have grown client traffic by 340 percent in 90 days.\n\nDo you have an existing website or are you building one? SEO strategy differs depending on where you're starting." },

  // Digital Marketing
  { keys: ['digital marketing','marketing','social media management','google ads','ads','campaign'],
    reply: "Digital Marketing — We run campaigns that bring measurable results.\n\nServices include:\n- SEO\n- Social Media Management\n- Google Ads\n- Content Marketing\n- Email Marketing\n\nWhat is your main goal right now? More website visitors, more leads, more sales, or brand awareness? Knowing your goal helps us recommend the most effective approach." },

  // Support / Maintenance
  { keys: ['support','maintenance','update','after','ongoing','post-launch'],
    reply: "Yes, we provide ongoing support, maintenance, updates, and technical assistance after every project.\n\nYou can choose a monthly retainer or pay per task.\n\nWould you like me to include support options when we prepare your quotation?" },

  // Pricing
  { keys: ['price','pricing','cost','how much','affordable','budget','kes','ksh','bei'],
    reply: "Our Pricing Guide:\n\n- Event Poster Design — KES 500\n- Business Poster / Flyer Design — KES 1,000\n- Logo Design — KES 5,000 to 15,000\n- Business Card Design — KES 1,500\n- Company Profile Design — KES 8,000 to 25,000\n- Church Media Packages — from KES 3,000 per month\n- Event Branding Packages — from KES 2,000 per event\n- Starter Website — KES 30,000\n- Professional Website — KES 50,000\n- E-commerce Store — from KES 80,000\n- Custom Web Applications — from KES 150,000\n- Website Maintenance — from KES 3,000 per month\n- Mobile App Development — from KES 80,000\n\nPrices vary based on complexity and scope. What project are you budgeting for? I can help you get a more accurate number." },

  // Timeline
  { keys: ['how long','timeline','deadline','urgent','days','weeks','turnaround','time'],
    reply: "Project Timelines:\n\n- Poster or Flyer: 1 to 2 days\n- Logo Design: 3 to 5 days\n- Branding Package: 1 to 2 weeks\n- Business Website: 2 to 4 weeks\n- E-commerce Store: 4 to 6 weeks\n- UI/UX Project: 2 to 4 weeks\n- SEO results: 60 to 90 days\n\nDo you have a specific deadline? We can often accommodate tight timelines with our express delivery option." },

  // Get started
  { keys: ['get started','how to start','begin','start a project','how do i begin','next step'],
    reply: "Getting started is simple:\n\n1. Tell us about your project\n2. We discuss your requirements in detail\n3. We prepare a custom quotation\n4. Once you approve, work begins\n\nWould you like to share your project details now so we can prepare a quotation for you?" },

  // Portfolio
  { keys: ['portfolio','examples','your work','previous work','case studies','samples','see your work'],
    reply: "You can view our portfolio at royalgraphix.co.ke to see websites, brand identities, and design work we have done for businesses across Kenya.\n\nIs there a specific type of project you would like to see examples of? I can walk you through our work in that area." },

  // Contact
  { keys: ['contact','call','phone','email','whatsapp','reach you','talk to','speak to someone','human'],
    reply: "Contact Royal Graphix directly:\n\nWhatsApp or Call: " + '+254 708 039 015' + "\nEmail: info@royalgraphix.co.ke\nWebsite: royalgraphix.co.ke\nAdmin: Darius Nyambu\n\nWe are available Monday to Saturday, 9am to 6pm EAT.\n\nWould you prefer I help you prepare a quotation request before you reach out? That way the team has your full project details ready.",
    showContact: true },

  // No interest / leaving
  { keys: ['no thanks','not interested','maybe later','no need','bye','goodbye','kwaheri','not now'],
    reply: "No problem at all.\n\nBefore you go, is there anything you're currently working on that might need design, branding, or web development support in the near future? We work with businesses, churches, schools, startups, and events.\n\nWe're always here when you're ready." },

  // Unsure
  { keys: ["i don't know","not sure","unsure","sijui","sina uhakika","haven't decided","thinking about it"],
    reply: "That's completely fine. Many of our clients come to us at the ideas stage.\n\nTell me a little about what you're trying to achieve or the problem you're trying to solve. I'll help figure out the best solution from there.\n\nFor example, are you trying to attract more customers, build a professional online presence, launch a product, or something else?" },

  // Off-topic: general knowledge
  { keys: ['capital of','population','what is the','who is','when was','history','wikipedia','tell me a fact'],
    reply: "That's a bit outside my area, but our team specialises in making your business look great online.\n\nBy the way, are you working on a project or business that needs design, branding, or a website? I'd love to help point you in the right direction." },

  // Joke
  { keys: ['joke','funny','laugh','comedy','make me laugh'],
    reply: "Why don't designers like low-resolution images? Because they can't picture the future.\n\nSpeaking of great design, are you working on any project that needs branding, graphics, or a website? That's where we really shine." },

  // Quote triggers
  // Generic service / "something different" catch-all
  // Catches phrases like "I need a web update", "I need help with X",
  // "do you do Y", "looking for Z service" that aren't already matched
  // above by a more specific entry.
  { keys: ['i need','i want','looking for','do you do','do you offer','can you help','can you do','i require','need help with','help me with','update my'],
    reply: "Yes, we do that! We'd love to help.\n\nCould I get your name so our team can prepare a quick quote for you?" },

  { keys: ['quote','quotation','proposal','estimate','consult','get a quote','request quote','free quote','inquiry','enquire'],
    reply: '__LEAD__' },
]

const THANKS_REPLIES = [
  "You're welcome! Is there a project you'd like us to help you with?",
  "Happy to help! Feel free to ask about any of our services — design, websites, branding, or marketing.",
  "Thank you for reaching out to Royal Graphix. We look forward to working with you.",
  "Glad I could help. Is there anything else you'd like to explore before we get started?",
  "Always a pleasure. Ready to start a project together?",
  "Anytime! If anything else comes up — design, website, or marketing related — I'm right here.",
  "No problem at all! Let me know if you'd like a quote for anything we discussed.",
  "You're very welcome. Feel free to reach back out whenever you're ready to start.",
  "It's what I'm here for! Anything else on your mind for your business or project?",
  "Glad that helped. Don't hesitate to ask if you think of anything else.",
]

const FALLBACK = "I want to make sure I give you the most helpful response.\n\nAre you looking for:\n- Graphic Design (logos, posters, branding)\n- Website Development\n- UI/UX Design\n- Digital Marketing or SEO\n- A quotation for a specific project\n\nOr would you like me to connect you with our team directly?"

const CLARIFY_OPTIONS = [
  "Could you tell me a bit more about what you have in mind?",
  "Do you mean a website for your business or a personal project?",
  "Are you looking for design, website development, or branding support?",
  "What is the main goal you're trying to achieve? That helps me give you the best recommendation.",
  "Could you describe the project in a few words? Even a rough idea helps me point you in the right direction.",
]

const QUICK_ACTIONS = [
  { label: 'Design a Logo',     msg: 'I need a logo design' },
  { label: 'Poster Design',     msg: 'I need a poster design' },
  { label: 'Build a Website',   msg: 'I need a website' },
  { label: 'Online Store',      msg: 'I need an online store' },
  { label: 'UI/UX Design',      msg: 'Tell me about UI/UX design' },
  { label: 'Request a Quote',   msg: 'I would like a quotation' },
  { label: 'Branding Package',  msg: 'Tell me about branding' },
  { label: 'Digital Marketing', msg: 'Tell me about digital marketing' },
  { label: 'Pricing',           msg: 'What are your prices' },
  { label: 'Contact Us',        msg: 'contact' },
]

const LEAD_STEPS = [
  { key: 'name',    prompt: 'What is your full name?' },
  { key: 'company', prompt: 'What is your business or company name? (type "personal" if this is a personal project)' },
  { key: 'phone',   prompt: 'What is the best phone number to reach you on for WhatsApp or a call?' },
  { key: 'email',   prompt: 'What is your email address?' },
  { key: 'service', prompt: 'Which service are you most interested in?\n(e.g. Logo, Website, Poster, Branding, SEO, UI/UX, E-commerce)' },
  { key: 'desc',    prompt: 'Briefly describe your project. What do you need, and when do you need it by?' },
]

// ── Context-aware reply engine ─────────────────────────────────
// ═════════════════════════════════════════════════════════════
// KITA SYSTEM UPGRADE — APPEND-ONLY INTELLIGENCE LAYER
// Everything below is additive. It reads/enriches context and
// post-processes replies. It never alters KB entries, getReply()
// internals, conversation recovery logic, or lead capture flow.
// ═════════════════════════════════════════════════════════════

// ── Emotional Intelligence Layer ────────────────────────────────
const EMOTION_PATTERNS = [
  { state: 'frustrated',  keys: ['not working', "doesn't work", 'frustrated', 'annoying', 'still waiting', 'why is this', 'this is hard', 'confusing', "can't figure"] },
  { state: 'excited',     keys: ['excited', 'love this', 'amazing', 'awesome', "can't wait", 'perfect', 'great idea', 'finally'] },
  { state: 'rushed',      keys: ['quick', 'quickly', 'asap', 'right now', "don't have time", 'hurry', 'fast as possible'] },
  { state: 'ready_to_buy',keys: ['ready to start', "let's do it", 'sign me up', 'sounds good lets', 'how do i pay', 'send invoice', 'book me in'] },
  { state: 'comparing',   keys: ['other companies', 'other agencies', 'competitor', 'vs', 'compared to', 'cheaper than', 'better than', 'other quotes'] },
  { state: 'skeptical',   keys: ['really', 'are you sure', 'is this legit', 'sounds too good', "i don't believe", 'prove it', 'guarantee'] },
  { state: 'confused',    keys: ['what do you mean', "i don't get it", 'confused', 'not sure what', 'huh', 'explain again'] },
  { state: 'curious',     keys: ['just looking', 'just browsing', 'just curious', 'wondering', 'out of curiosity'] },
]

function detectEmotion(msg) {
  const m = msg.toLowerCase()
  for (const { state, keys } of EMOTION_PATTERNS) {
    if (keys.some(k => m.includes(k))) return state
  }
  return null
}

const EMOTION_PREFIX = {
  frustrated:  "I understand your concern. Let me make this as simple as possible. ",
  excited:     "That's exciting! We'd love to help bring your idea to life. ",
  rushed:      "Let's keep it quick. ",
  ready_to_buy:"Great, let's get you moving on this. ",
  comparing:   "Smart to compare your options. ",
  skeptical:   "Fair question. ",
  confused:    "No problem, let me clarify. ",
  curious:     "",
}

// ── Lead Scoring System ─────────────────────────────────────────
const HOT_SIGNALS  = ['how much', 'can we start', 'send quote', 'contact me', 'whatsapp', 'urgently', 'i need this urgently', 'ready to start', "let's do it", 'sign me up', 'book me in']
const WARM_SIGNALS = ['what do you', 'how does', 'do you offer', 'tell me about', 'comparing', 'options', 'which is better', 'difference between']

function scoreLeadFromMessage(msg, currentScore) {
  const m = msg.toLowerCase()
  if (HOT_SIGNALS.some(s => m.includes(s))) return 'hot'
  if (currentScore === 'hot') return 'hot' // hot doesn't downgrade mid-session
  if (WARM_SIGNALS.some(s => m.includes(s))) return 'warm'
  return currentScore || 'cold'
}

// ── Urgency Detection ───────────────────────────────────────────
const URGENCY_WORDS = ['today', 'asap', 'urgent', 'urgently', 'deadline', 'immediately', 'this week', 'right away', 'by tomorrow']

function detectUrgency(msg) {
  const m = msg.toLowerCase()
  return URGENCY_WORDS.some(w => m.includes(w))
}

// ── Business Type Detection ─────────────────────────────────────
const BUSINESS_TYPE_PATTERNS = [
  { type: 'church',       keys: ['church', 'ministry', 'congregation', 'pastor', 'sermon'] },
  { type: 'school',       keys: ['school', 'college', 'university', 'academy', 'students'] },
  { type: 'startup',      keys: ['startup', 'start-up', 'launching a business', 'new business', 'just starting'] },
  { type: 'restaurant',   keys: ['restaurant', 'cafe', 'café', 'eatery', 'kitchen', 'catering'] },
  { type: 'ngo',          keys: ['ngo', 'nonprofit', 'non-profit', 'charity', 'foundation'] },
  { type: 'shop',         keys: ['shop', 'store', 'boutique', 'retail'] },
  { type: 'salon',        keys: ['salon', 'spa', 'barbershop', 'beauty'] },
  { type: 'real_estate',  keys: ['real estate', 'property', 'realtor', 'land', 'apartments'] },
  { type: 'personal_brand', keys: ['personal brand', 'influencer', 'my brand', 'content creator'] },
]

function detectBusinessType(msg) {
  const m = msg.toLowerCase()
  for (const { type, keys } of BUSINESS_TYPE_PATTERNS) {
    if (keys.some(k => m.includes(k))) return type
  }
  return null
}

const BUSINESS_TYPE_LABEL = {
  church: 'church', school: 'school', startup: 'startup', restaurant: 'restaurant',
  ngo: 'NGO', shop: 'shop', salon: 'salon', real_estate: 'real estate business',
  personal_brand: 'personal brand',
}

// ── Portfolio Trigger System ────────────────────────────────────
const PORTFOLIO_TRIGGER_WORDS = ['examples', 'samples', 'portfolio', 'previous work', 'have you done this before', 'see your work', 'show me examples', 'case studies']

function isPortfolioTrigger(msg) {
  const m = msg.toLowerCase()
  return PORTFOLIO_TRIGGER_WORDS.some(w => m.includes(w))
}

// ── Value-Based Pricing Detection ───────────────────────────────
// Fires when a message is price-only with no other context (pure price fixation)
function isPriceOnlyFixation(msg, context) {
  const m = msg.toLowerCase().trim()
  const isShortPriceAsk = /^(price|cost|how much|too expensive|expensive|cheaper)\??$/.test(m)
  return isShortPriceAsk && !context.service
}

// ── Conversation Health Monitor ─────────────────────────────────
// Lightweight self-check: ensures every outgoing reply moves the
// conversation forward (ends with a question, suggestion, or CTA).
function ensuresForwardMomentum(text) {
  const trimmed = text.trim()
  const endsWithQuestion = trimmed.endsWith('?')
  const hasForwardPhrase = /(would you like|let me know|share your|want me to|shall i|can i|tell me)/i.test(trimmed)
  return endsWithQuestion || hasForwardPhrase
}

const MOMENTUM_NUDGES = [
  "What would be most helpful to look at next?",
  "Is there a particular service you'd like to explore further?",
  "Would you like me to help you get a quotation for this?",
]

// ── Master enrichment function ──────────────────────────────────
// Wraps the EXISTING getReply() output. Never touches its logic —
// only reads the user message for additional signals and lightly
// adjusts the final text (tone prefix, momentum nudge) and updates
// context with the new additive fields.
function enrichReply(msg, context, baseResult) {
  const emotion      = detectEmotion(msg)
  const leadScore     = scoreLeadFromMessage(msg, context.leadScore)
  const urgent        = detectUrgency(msg)
  const businessType  = detectBusinessType(msg) || context.businessType

  const enrichedCtx = {
    ...baseResult.ctx,
    emotion: emotion || context.emotion,
    leadScore,
    urgent: urgent || context.urgent,
    businessType,
  }

  // Don't touch special control values (__LEAD__) or lead-trigger flows
  if (baseResult.text === '__LEAD__' || baseResult.triggerLead) {
    return { ...baseResult, ctx: enrichedCtx }
  }

  let text = baseResult.text

  // Tone prefix from emotional intelligence layer (only on first detection turn)
  if (emotion && EMOTION_PREFIX[emotion] && !text.startsWith(EMOTION_PREFIX[emotion].trim())) {
    text = EMOTION_PREFIX[emotion] + text
  }

  // Urgency acknowledgement — prioritize lead collection
  if (urgent && !context.urgent) {
    text = "Thanks for sharing that this is time-sensitive — I'll prioritize getting your details to the team right away.\n\n" + text
  }

  // Business type tailoring note (only first time detected this session)
  if (businessType && businessType !== context.businessType) {
    const label = BUSINESS_TYPE_LABEL[businessType]
    text = text + `\n\n(Noted — tailoring this for your ${label}.)`
  }

  // Portfolio trigger — offer category-specific examples
  if (isPortfolioTrigger(msg)) {
    text = "We'd be happy to share examples. Are you interested in logos, posters, flyers, branding, websites, UI/UX, or social media designs?"
  }

  // Value-based pricing response — redirect pure price fixation toward value
  if (isPriceOnlyFixation(msg, context)) {
    text = "The right solution depends on what you want to achieve. For example, a website designed to generate leads may provide far more value than a basic informational site.\n\nWhat are you hoping this will help you accomplish?"
  }

  // Conversation health monitor — ensure forward momentum
  if (!ensuresForwardMomentum(text)) {
    text = text + '\n\n' + MOMENTUM_NUDGES[Math.floor(Math.random() * MOMENTUM_NUDGES.length)]
  }

  return { ...baseResult, text, ctx: enrichedCtx }
}

function getReply(msg, context) {
  const m = msg.toLowerCase().trim()

  // Detect name / business in message
  const nameMatch = msg.match(/(?:my name is|i am|i'm|called|it's)\s+([A-Z][a-z]+)/i)
  const bizMatch  = msg.match(/(?:my business|company|shop|called|named)\s+(?:is\s+)?["']?([A-Z][A-Za-z\s]+?)["']?(?:\.|,|$)/i)

  const updatedCtx = { ...context }
  if (nameMatch) updatedCtx.name     = nameMatch[1]
  if (bizMatch)  updatedCtx.business = bizMatch[1].trim()

  // "how much again" / "price again" — reference previous service
  if ((m.includes('again') || m.includes('what was')) && context.service) {
    return {
      text: `Based on your interest in ${context.service}, here is our pricing:\n\n- Starter Website: KES 30,000\n- Professional Website: KES 50,000\n- E-commerce Store: from KES 80,000\n- Logo Design: KES 5,000 to 15,000\n- Church Media Package: from KES 3,000/month\n- Event Branding: from KES 2,000/event\n- Mobile App: from KES 80,000\n\nWould you like me to prepare a detailed quotation for your ${context.service} project?`,
      ctx: updatedCtx, upsell: null, showContact: false,
    }
  }

  // Short / unclear messages — clarify intelligently
  if (m.length < 5 && !m.match(/hi|hey|yo|ok|yes|no/)) {
    return {
      text: CLARIFY_OPTIONS[Math.floor(Math.random() * CLARIFY_OPTIONS.length)],
      ctx: updatedCtx, upsell: null, showContact: false,
    }
  }

  // "yes" — continue from last context
  if ((m === 'yes' || m === 'yeah' || m === 'yep' || m === 'sure' || m === 'okay' || m === 'ok') && context.service) {
    return {
      text: `Let me get your details so our team can prepare a quotation for your ${context.service} project.`,
      ctx: { ...updatedCtx }, upsell: null, showContact: false,
      triggerLead: true,
    }
  }

  // KB lookup
  for (const entry of KB) {
    if (entry.type === 'thanks' && entry.keys.some(k => m.includes(k))) {
      return { text: THANKS_REPLIES[Math.floor(Math.random() * THANKS_REPLIES.length)], ctx: updatedCtx, upsell: null, showContact: false }
    }
    if (!entry.type && entry.keys.some(k => m.includes(k))) {
      // Track service interest
      const svcMap = {
        'logo': 'Logo Design', 'website': 'Website', 'poster': 'Poster Design',
        'flyer': 'Flyer Design', 'brand': 'Branding', 'ecommerce': 'E-commerce',
        'seo': 'SEO', 'ui': 'UI/UX Design', 'social media': 'Social Media Graphics',
        'church': 'Church Services', 'school': 'School System', 'booking': 'Booking System',
      }
      for (const [key, svc] of Object.entries(svcMap)) {
        if (m.includes(key)) updatedCtx.service = svc
      }
      if (entry.reply === '__LEAD__') return { text: '__LEAD__', ctx: updatedCtx, upsell: null, showContact: false }
      return { text: entry.reply, ctx: updatedCtx, upsell: entry.upsell || null, showContact: entry.showContact || false }
    }
  }

  return { text: FALLBACK, ctx: updatedCtx, upsell: null, showContact: true }
}

function renderText(text) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i} style={{ display: 'block', marginBottom: i < arr.length - 1 ? '0.22rem' : 0 }}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={j}>{part.slice(2, -2)}</strong>
          : part
      )}
    </span>
  ))
}

export default function Chatbot() {
  const [open,     setOpen]     = useState(false)
  const [input,    setInput]    = useState('')
  const [messages, setMessages] = useState([])
  const [typing,   setTyping]   = useState(false)
  const [leadMode, setLeadMode] = useState(false)
  const [leadStep, setLeadStep] = useState(0)
  const [leadData, setLeadData] = useState({})
  const [showAll,  setShowAll]  = useState(false)
  const [context,  setContext]  = useState(INITIAL_CONTEXT)

  const endRef   = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => setMessages([{ role: 'bot', text: WELCOME }]), 300)
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 400)
  }, [open])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const pushBot  = useCallback((text, extra = {}) => {
    setTyping(false)
    setMessages(p => [...p, { role: 'bot', text, ...extra }])
  }, [])

  const startLead = useCallback(() => {
    setLeadMode(true); setLeadStep(0); setLeadData({})
    setTyping(true)
    setTimeout(() => pushBot(
      `To prepare a free quotation for you, I just need a few quick details.\n\n${LEAD_STEPS[0].prompt}`
    ), 700)
  }, [pushBot])

  const handleLeadStep = async (value) => {
    const key = LEAD_STEPS[leadStep].key
    const updated = { ...leadData, [key]: value }
    setLeadData(updated)

    if (leadStep < LEAD_STEPS.length - 1) {
      setLeadStep(s => s + 1)
      setTyping(true)
      setTimeout(() => pushBot(LEAD_STEPS[leadStep + 1].prompt), 650)
    } else {
      setLeadMode(false)
      setTyping(true)
      try {
        await submitToGoogleSheets('Chat Leads', {
          ...updated,
          service_interest: context.service || 'General',
          source: 'Kita Chatbot v4',
          timestamp: new Date().toLocaleString('en-KE'),
        })
      } catch (_) {}
      // Update context with captured name/company
      if (updated.name)    setContext(c => ({ ...c, name: updated.name }))
      if (updated.company) setContext(c => ({ ...c, business: updated.company }))
      setTimeout(() => pushBot(
        `Thank you${updated.name ? ', ' + updated.name : ''}! We have received your details.\n\nOur team will contact you shortly at ${updated.phone || 'the number you provided'}.\n\nYou can also reach us directly:\n${ADMIN.phone}\n${ADMIN.email}\n\nWe look forward to working with you on your ${updated.service || 'project'}!`
      ), 800)
    }
  }

  const send = useCallback((msgText) => {
    const text = (msgText ?? input).trim()
    if (!text) return
    setInput('')
    setMessages(p => [...p, { role: 'user', text }])
    setTyping(true)

    if (leadMode) { setTimeout(() => handleLeadStep(text), 400); return }

    const baseResult = getReply(text, context)
    const result = enrichReply(text, context, baseResult)
    setContext(result.ctx)

    if (result.text === '__LEAD__') { setTimeout(() => startLead(), 500); return }
    if (result.triggerLead)         { setTimeout(() => startLead(), 700); return }

    setTimeout(() => {
      pushBot(result.text, result.showContact ? { isContact: true } : {})
      if (result.upsell) {
        setTimeout(() => pushBot(result.upsell), 1400)
      }
    }, 750)
  }, [input, leadMode, context, startLead, pushBot])

  const visibleActions = showAll ? QUICK_ACTIONS : QUICK_ACTIONS.slice(0, 5)

  return (
    <>
      {/* FAB */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 180 }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(o => !o)}
        aria-label="Chat with Kita"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 800,
          width: 58, height: 58, borderRadius: '50%',
          background: 'linear-gradient(135deg, #C8102E 0%, #8B0E1F 100%)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(200,16,46,0.55)',
        }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <X size={22} color="white" strokeWidth={2.5} />
              </motion.span>
            : <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                <MessageCircle size={22} color="white" strokeWidth={2} />
              </motion.span>
          }
        </AnimatePresence>
        {!open && (
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ position: 'absolute', top: 4, right: 4, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid white' }}
          />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 28, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 800,
              width: 'min(400px, calc(100vw - 2rem))',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 24px 72px rgba(0,0,0,0.4)',
              maxHeight: '84vh',
            }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #C8102E 0%, #8B0E1F 100%)', padding: '0.875rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', color: 'white', flexShrink: 0 }}>
                  K
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: 'white' }}>Kita</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.72)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                    Royal Graphix Assistant · Online
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <a href={`tel:${ADMIN.phone.replace(/\s/g, '')}`} title="Call us"
                  style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <Phone size={13} color="white" strokeWidth={2} />
                </a>
                <a href={`mailto:${ADMIN.email}`} title="Email us"
                  style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  <Mail size={13} color="white" strokeWidth={2} />
                </a>
                <button onClick={() => setOpen(false)}
                  style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={14} color="white" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 200, maxHeight: '46vh' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-start' }}>
                  {msg.role === 'bot' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(200,16,46,0.12)', border: '1px solid rgba(200,16,46,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', color: 'var(--red)' }}>
                      K
                    </div>
                  )}
                  <div>
                    <div style={{
                      maxWidth: '82%', padding: '0.7rem 1rem',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                      background: msg.role === 'user' ? 'var(--red)' : 'var(--bg2)',
                      color: msg.role === 'user' ? 'white' : 'var(--text)',
                      fontSize: '0.855rem', lineHeight: 1.65,
                      border: msg.role === 'bot' ? '1px solid var(--border)' : 'none',
                    }}>
                      {renderText(msg.text)}
                    </div>
                    {msg.isContact && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                        <a href={`https://wa.me/${ADMIN.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: '#25D366', color: 'white', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
                          <Phone size={11} strokeWidth={2} /> WhatsApp
                        </a>
                        <a href={`tel:${ADMIN.phone.replace(/\s/g, '')}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: 'var(--red)', color: 'white', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
                          <Phone size={11} strokeWidth={2} /> Call
                        </a>
                        <button onClick={() => send('I would like a quotation')}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border-med)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                          Get Quote
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.72rem', color: 'white' }}>
                      U
                    </div>
                  )}
                </div>
              ))}

              {typing && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(200,16,46,0.12)', border: '1px solid rgba(200,16,46,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '0.75rem', color: 'var(--red)' }}>K</div>
                  <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '0.7rem 1rem', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }}
                        style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', display: 'block' }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick actions */}
            {!leadMode && messages.length <= 2 && (
              <div style={{ padding: '0.625rem 0.875rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-faint)', marginBottom: '0.4rem' }}>Quick Actions</div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {visibleActions.map(q => (
                    <button key={q.label} onClick={() => send(q.msg)}
                      style={{ padding: '4px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, border: '1px solid var(--border-med)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(200,16,46,0.06)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
                    >
                      {q.label}
                    </button>
                  ))}
                  <button onClick={() => setShowAll(s => !s)}
                    style={{ padding: '4px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 600, border: '1px solid var(--border-med)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    {showAll ? <><ChevronUp size={11} /> Less</> : <><ChevronDown size={11} /> More</>}
                  </button>
                </div>
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder={leadMode ? 'Type your answer...' : 'Ask Kita anything...'}
                style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border-med)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.875rem', fontSize: '0.875rem', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--red)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-med)'}
              />
              <motion.button onClick={() => send()} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px var(--red-glow)' }}>
                <Send size={16} color="white" strokeWidth={2} />
              </motion.button>
            </div>

            {/* Footer */}
            <div style={{ padding: '0.35rem', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-faint)', background: 'var(--bg2)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              Powered by <strong style={{ color: 'var(--red)' }}>Royal Graphix</strong> · Kita v4.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
