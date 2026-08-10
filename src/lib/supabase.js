// ─────────────────────────────────────────────────────────────
// Royal Graphix — Supabase Client
// Uses real Supabase when VITE_SUPABASE_URL is set,
// falls back to mock client for local dev without keys.
// ─────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasRealKeys = supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://')

// ── Real Supabase client ─────────────────────────────────────
if (hasRealKeys) {
  console.log('✅ Using real Supabase client')
}

export const supabase = hasRealKeys
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : buildMockClient()

// ── Mock client (used when no real keys) ─────────────────────
function buildMockClient() {
  console.warn('⚠️ Using mock Supabase client — add real keys to .env to use real database')

  const SESSION_KEY = 'rg_mock_session'
  function loadSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) } catch { return null } }
  function saveSession(s) { try { if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); else sessionStorage.removeItem(SESSION_KEY) } catch {} }

  const _store = {
    portfolio: [
      { id:'1', category:'Web Design', slug:'jewels-kitchen', status:'published',       live_url:'https://jewels-kitchen.vercel.app/',           emoji:'🍽️', created_at:'2025-01-15T00:00:00Z', title:'Jewels Kitchen',        description:'Nairobi\'s premier catering & food delivery.', image_url:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=75&fit=crop' },
      { id:'2', category:'Web Design', slug:'bluestocks-fx-academy', status:'published',       live_url:'https://bluestocks-fx-academy.vercel.app/',    emoji:'📊', created_at:'2025-02-01T00:00:00Z', title:'Bluestocks FX Academy', description:'Professional Forex education platform.', image_url:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&q=75&fit=crop' },
      { id:'3', category:'Web Design', slug:'pokeasports', status:'published',       live_url:'https://pokea-sports.vercel.app/',             emoji:'⚽', created_at:'2025-02-15T00:00:00Z', title:'PokeaSports',           description:'Africa\'s #1 football news platform.', image_url:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=75&fit=crop' },
      { id:'4', category:'Web Design', slug:'jirani', status:'published',       live_url:'https://jirani-sand.vercel.app/',              emoji:'🏠', created_at:'2025-03-01T00:00:00Z', title:'Jirani',                description:'Nairobi\'s #1 home services marketplace.', image_url:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=75&fit=crop' },
      { id:'5', category:'Web Design', slug:'ascend-finance', status:'published',       live_url:'https://ascend-alpha-one.vercel.app/',         emoji:'💳', created_at:'2025-03-15T00:00:00Z', title:'Ascend Finance',        description:'Kenya\'s trusted microfinance partner.', image_url:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=75&fit=crop' },
      { id:'6', category:'Web Design', slug:'mzedu-swift', status:'published',       live_url:'https://mzedu-swift.vercel.app/',              emoji:'📦', created_at:'2025-04-01T00:00:00Z', title:'Mzedu Swift',           description:'Kenya\'s trusted parcel courier.', image_url:'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=700&q=75&fit=crop' },
      { id:'7', category:'Web Design', slug:'neema-collections', status:'published',       live_url:'https://neema-collection.vercel.app/',         emoji:'👗', created_at:'2025-04-15T00:00:00Z', title:'Neema Collections',     description:'Premium Kenyan fashion e-commerce.', image_url:'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&q=75&fit=crop' },
      { id:'8', category:'Real Estate', slug:'karibu-homes', status:'published',      live_url:'https://dariusnyambu.github.io/karibuhomes/', emoji:'🏡', created_at:'2025-05-01T00:00:00Z', title:'Karibu Homes',          description:'Modern property listings & real estate platform.', image_url:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=75&fit=crop' },
      { id:'9', category:'Church & Ministry', slug:'divine-encounter-church', status:'published',live_url:'https://divine-encounter-church.vercel.app/', emoji:'⛪', created_at:'2025-05-10T00:00:00Z', title:'Divine Encounter Church',description:'Modern church website for a Nairobi community.', image_url:'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=700&q=75&fit=crop' },
      { id:'10',category:'Web Design', slug:'pokeasports', status:'published',       live_url:'https://pokea-sports.vercel.app/',             created_at:'2025-02-15T00:00:00Z', title:'PokeaSports',              description:'Africa\'s #1 football news platform.', image_url:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=75&fit=crop' },
      { id:'11', category:'NGO & Community', slug:'africa-for-all', status:'published',   live_url:'https://africa-for-all.vercel.app/',          created_at:'2025-06-01T00:00:00Z', title:'Africa For All',           description:'Pan-African community platform connecting people across the continent.', image_url:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=700&q=75&fit=crop' },
      { id:'12', category:'Research & Consulting', slug:'ark-expert-research', status:'published',live_url:'https://www.arkexpertresearch.com',           created_at:'2025-06-05T00:00:00Z', title:'ARK Expert Research',      description:'Professional research and consulting firm with global reach.', image_url:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=75&fit=crop' },
      { id:'13', category:'Travel & Tourism', slug:'mzedu-tours', status:'published',     live_url:'https://mzedu-tours.vercel.app/',             created_at:'2025-05-15T00:00:00Z', title:'Mzedu Tours',              description:'Premium travel & safari experiences across East Africa.', image_url:'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&q=75&fit=crop' },
      { id:'14', category:'Church & Ministry', slug:'divine-encounter-church', status:'published',    live_url:'https://divine-encounter-church.vercel.app/', created_at:'2025-06-08T00:00:00Z', title:'Divine Encounter Church',  description:'Modern church website with sermon archive, events and online giving.', image_url:'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=700&q=75&fit=crop' },
      { id:'15', category:'Church & Ministry', slug:'voice-of-valour', status:'published',    live_url:'https://www.voiceofvalour.co.ke/',            created_at:'2025-06-10T00:00:00Z', title:'Voice of Valour',          description:'FGCK Christ Centre Church — faith, community and ministry online.', image_url:'https://images.unsplash.com/photo-1519491050282-cf00c82424b2?w=700&q=75&fit=crop' },
    ],
    contacts: [
      { id:'1', name:'Sarah Ahmed',  email:'sarah@startup.io', phone:'+254711000001', project_type:'Web Design',    budget:'KES 15,000–50,000', message:'Need a landing page for my SaaS launch.',        read:false, created_at:'2025-05-10T00:00:00Z' },
      { id:'2', name:'James Mwangi', email:'james@corp.co.ke', phone:'+254711000002', project_type:'Branding',      budget:'KES 5,000–15,000',  message:'Looking for a complete brand identity package.', read:false, created_at:'2025-05-14T00:00:00Z' },
      { id:'3', name:'Priya Sharma', email:'priya@media.com',  phone:'+254711000003', project_type:'SEO',           budget:'KES 5,000–15,000',  message:'Want to improve our organic search rankings.',   read:true,  created_at:'2025-05-17T00:00:00Z' },
    ],
    blog_posts: [
      { id:'b1', title:'10 Web Design Trends Dominating 2025', slug:'10-web-design-trends-2025', category:'Web Design', excerpt:'From glassmorphism to variable fonts — discover the design patterns top agencies are using to win clients in 2025.', content:'Bento grid layouts, variable fonts, dark-mode-first design, AI-assisted workflows and refined glassmorphism are reshaping how modern agencies design for the web in 2025.\n\nEach of these trends rewards intentional design choices over template defaults — pick the ones that fit your brand rather than chasing every trend at once.', cover_image:'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=75&fit=crop', emoji:'🖥️', author:'Royal Graphix', read_time:'5 min read', tags:['design','trends'], status:'published', views: 128, seo_title:null, seo_description:null, published_at:'2025-05-12T00:00:00Z', created_at:'2025-05-12T00:00:00Z', updated_at:'2025-05-12T00:00:00Z' },
      { id:'b2', title:'How to 10x Your SEO Traffic in 90 Days', slug:'how-to-10x-seo-traffic-90-days', category:'SEO', excerpt:'A step-by-step breakdown of the exact SEO strategy we used to grow a client from 2k to 20k monthly organic visitors.', content:'A 90-day SEO framework built on three phases: technical foundation, content velocity, and authority building.\n\nMonth one fixes what is broken. Month two builds content velocity. Month three earns authority through genuine backlinks — compounding, not one-off tactics, win long term.', cover_image:'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&q=75&fit=crop', emoji:'📈', author:'Royal Graphix', read_time:'8 min read', tags:['seo','growth'], status:'published', views: 96, seo_title:null, seo_description:null, published_at:'2025-04-28T00:00:00Z', created_at:'2025-04-28T00:00:00Z', updated_at:'2025-04-28T00:00:00Z' },
      { id:'b3', title:'The Complete Brand Identity Checklist', slug:'complete-brand-identity-checklist', category:'Branding', excerpt:'Everything a modern brand needs — from logo variants to tone of voice guidelines — in one comprehensive checklist.', content:'A complete brand identity goes far beyond a logo: color palette, typography system, iconography, voice, and real-world application templates all need to work together.\n\nConsistency across every touchpoint is what builds trust over time.', cover_image:'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=75&fit=crop', emoji:'🎨', author:'Royal Graphix', read_time:'6 min read', tags:['branding'], status:'published', views: 74, seo_title:null, seo_description:null, published_at:'2025-04-15T00:00:00Z', created_at:'2025-04-15T00:00:00Z', updated_at:'2025-04-15T00:00:00Z' },
    ],
    reviews: [
      { id:'r1', name:'Amina Yusuf',  email:'amina@example.com', role:'Founder, Jewels Kitchen', rating:5, message:'Royal Graphix rebuilt our website and online ordering flow — bookings doubled within a month. Fast, professional, and genuinely creative.', hidden:false, created_at:'2025-06-02T00:00:00Z' },
      { id:'r2', name:'Brian Otieno', email:'brian@example.com', role:'CEO, Bluestocks FX Academy', rating:5, message:'Clear communication from day one and a platform that just works. Highly recommend for any Nairobi business going digital.', hidden:false, created_at:'2025-06-10T00:00:00Z' },
      { id:'r3', name:'Grace Wanjiru', email:'grace@example.com', role:'Marketing Lead, Neema Collections', rating:4, message:'Great design instincts and quick turnaround on our branding refresh. Would work with them again.', hidden:false, created_at:'2025-06-18T00:00:00Z' },
    ],
    job_applications: [],
    jobs: [
      { id:'j1', title:'Graphic Designer', icon:'Palette', type:'Full-time', location:'Nairobi, Kenya (Hybrid)', summary:'Own the visual identity of client brands — from logos and social content to full brand systems — for our growing roster of Kenyan and international clients.', responsibilities:['Design logos, brand identities, and marketing collateral for clients','Create social media graphics, posters, and campaign assets','Collaborate with the web team on landing page and UI visuals','Maintain brand consistency across every client deliverable','Turn client feedback into polished, on-brief revisions quickly'], requirements:['1+ years of professional graphic design experience','Strong portfolio across branding, print, and digital design','Proficiency in Adobe Creative Suite and/or Figma','Sharp eye for typography, color, and layout','Able to manage multiple projects and deadlines'], status:'published', created_at:'2025-06-01T00:00:00Z', updated_at:'2025-06-01T00:00:00Z' },
      { id:'j2', title:'Senior Developer', icon:'Code2', type:'Full-time', location:'Nairobi, Kenya (Hybrid)', summary:'Lead development of client web platforms end-to-end — from architecture to deployment — mentoring the team while shipping fast, reliable products.', responsibilities:['Architect and build client web apps with React and modern tooling','Design and maintain Supabase/Postgres schemas and APIs','Review code, mentor junior developers, and set engineering standards','Own deployments (Vercel) and performance/SEO best practices','Work directly with clients to scope technical requirements'], requirements:['4+ years of professional web development experience','Strong command of React, JavaScript/TypeScript, and REST/SQL','Experience with Supabase, Firebase, or similar backends','Comfortable owning a project from spec to production','Excellent communication with both clients and teammates'], status:'published', created_at:'2025-06-01T00:00:00Z', updated_at:'2025-06-01T00:00:00Z' },
    ],
    service_images: [
      { slug:'web-design',     image_url:'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=75&fit=crop', updated_at:'2025-06-01T00:00:00Z' },
      { slug:'graphic-design', image_url:'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=75&fit=crop', updated_at:'2025-06-01T00:00:00Z' },
      { slug:'ui-ux',          image_url:'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=75&fit=crop', updated_at:'2025-06-01T00:00:00Z' },
      { slug:'seo',            image_url:'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&q=75&fit=crop', updated_at:'2025-06-01T00:00:00Z' },
      { slug:'branding',       image_url:'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=75&fit=crop', updated_at:'2025-06-01T00:00:00Z' },
      { slug:'analytics',      image_url:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=75&fit=crop', updated_at:'2025-06-01T00:00:00Z' },
      { slug:'social-media-management', image_url:'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=75&fit=crop', updated_at:'2025-06-01T00:00:00Z' },
    ],
    page_views: [],
  }

  function makeBuilder(table) {
    const filters = []
    const builder = {
      eq(col, val)   { filters.push({ col, val }); return builder },
      select()       { return builder },
      order()        { return builder },
      _rows() {
        let rows = [...(_store[table] || [])]
        filters.forEach(({ col, val }) => { rows = rows.filter(r => r[col] === val) })
        return rows
      },
      then(res, rej) { return Promise.resolve({ data: builder._rows(), error: null }).then(res, rej) },
      single()       { return Promise.resolve({ data: builder._rows()[0] ?? null, error: null }) },
      insert(payload) {
        const arr = Array.isArray(payload) ? payload : [payload]
        const newRows = arr.map(item => ({ ...item, id: item.id || `mock_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, created_at: item.created_at || new Date().toISOString() }))
        if (!_store[table]) _store[table] = []
        _store[table].unshift(...newRows)
        return { select: () => ({ single: () => Promise.resolve({ data: newRows[0], error: null }) }), single: () => Promise.resolve({ data: newRows[0], error: null }), then: (r) => r({ data: newRows, error: null }) }
      },
      upsert(payload, opts = {}) {
        const conflictKey = opts.onConflict || (payload && payload.slug !== undefined ? 'slug' : 'id')
        if (!_store[table]) _store[table] = []
        const existingIdx = _store[table].findIndex(r => r[conflictKey] === payload[conflictKey])
        let row
        if (existingIdx >= 0) {
          row = { ..._store[table][existingIdx], ...payload, updated_at: new Date().toISOString() }
          _store[table][existingIdx] = row
        } else {
          row = { ...payload, id: payload.id || `mock_${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          _store[table].unshift(row)
        }
        return { select: () => ({ single: () => Promise.resolve({ data: row, error: null }) }), single: () => Promise.resolve({ data: row, error: null }), then: (r) => r({ data: [row], error: null }) }
      },
      update(payload) {
        const ef = [...filters]
        _store[table] = (_store[table] || []).map(r => ef.every(({ col, val }) => r[col] === val) ? { ...r, ...payload } : r)
        const updated = (_store[table] || []).find(r => ef.every(({ col, val }) => r[col] === val))
        return { eq: (c,v)=>{ ef.push({col:c,val:v}); return this }, select: ()=>({ single: ()=>Promise.resolve({data:updated,error:null}) }), single: ()=>Promise.resolve({data:updated,error:null}), then:(r)=>r({data:updated,error:null}) }
      },
      delete() {
        const ef = [...filters]
        _store[table] = (_store[table] || []).filter(r => !ef.every(({ col, val }) => r[col] === val))
        return Promise.resolve({ error: null })
      },
    }
    return builder
  }

  const mockAuth = {
    getSession:          () => Promise.resolve({ data: { session: loadSession() }, error: null }),
    onAuthStateChange:   (cb) => { setTimeout(() => cb('INITIAL_SESSION', loadSession()), 0); return { data: { subscription: { unsubscribe: () => {} } } } },
    signInWithPassword:  ({ email, password }) => {
      if (email === 'admin@royalgraphix.com' && password === 'admin123') {
        const user = { id: 'mock-admin', email, role: 'authenticated' }
        const session = { user, access_token: 'mock-token' }
        saveSession(session)
        return Promise.resolve({ data: { user, session }, error: null })
      }
      return Promise.resolve({ data: null, error: { message: 'Invalid credentials. Use admin@royalgraphix.com / admin123' } })
    },
    signOut: () => { saveSession(null); return Promise.resolve({ error: null }) },
  }

  // Minimal mock "realtime" channel — no live push, admin hooks fall back to polling.
  function mockChannel() {
    const ch = {
      on()        { return ch },
      subscribe(cb) { if (cb) cb('SUBSCRIBED'); return ch },
      unsubscribe() { return Promise.resolve('ok') },
    }
    return ch
  }

  return {
    from:    (table) => makeBuilder(table),
    auth:    mockAuth,
    channel: () => mockChannel(),
    removeChannel: () => {},
    storage: { from: (bucket) => ({ upload: (path, file, opts) => { if (!_store.__files) _store.__files = {}; _store.__files[`${bucket}/${path}`] = file; return Promise.resolve({ data: {}, error: null }) }, getPublicUrl: (p) => ({ data: { publicUrl: (_store.__files && _store.__files[`${bucket}/${p}`] instanceof Blob) ? URL.createObjectURL(_store.__files[`${bucket}/${p}`]) : '' } }), remove: () => Promise.resolve({ error: null }) }) },
  }
}
