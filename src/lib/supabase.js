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
      { id:'1', category:'Web Design',       live_url:'https://jewels-kitchen.vercel.app/',           emoji:'🍽️', created_at:'2025-01-15T00:00:00Z', title:'Jewels Kitchen',        description:'Nairobi\'s premier catering & food delivery.', image_url:'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=75&fit=crop' },
      { id:'2', category:'Web Design',       live_url:'https://bluestocks-fx-academy.vercel.app/',    emoji:'📊', created_at:'2025-02-01T00:00:00Z', title:'Bluestocks FX Academy', description:'Professional Forex education platform.', image_url:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&q=75&fit=crop' },
      { id:'3', category:'Web Design',       live_url:'https://pokea-sports.vercel.app/',             emoji:'⚽', created_at:'2025-02-15T00:00:00Z', title:'PokeaSports',           description:'Africa\'s #1 football news platform.', image_url:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=75&fit=crop' },
      { id:'4', category:'Web Design',       live_url:'https://jirani-sand.vercel.app/',              emoji:'🏠', created_at:'2025-03-01T00:00:00Z', title:'Jirani',                description:'Nairobi\'s #1 home services marketplace.', image_url:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=75&fit=crop' },
      { id:'5', category:'Web Design',       live_url:'https://ascend-alpha-one.vercel.app/',         emoji:'💳', created_at:'2025-03-15T00:00:00Z', title:'Ascend Finance',        description:'Kenya\'s trusted microfinance partner.', image_url:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=75&fit=crop' },
      { id:'6', category:'Web Design',       live_url:'https://mzedu-swift.vercel.app/',              emoji:'📦', created_at:'2025-04-01T00:00:00Z', title:'Mzedu Swift',           description:'Kenya\'s trusted parcel courier.', image_url:'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=700&q=75&fit=crop' },
      { id:'7', category:'Web Design',       live_url:'https://neema-collection.vercel.app/',         emoji:'👗', created_at:'2025-04-15T00:00:00Z', title:'Neema Collections',     description:'Premium Kenyan fashion e-commerce.', image_url:'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&q=75&fit=crop' },
      { id:'8', category:'Real Estate',      live_url:'https://dariusnyambu.github.io/karibuhomes/', emoji:'🏡', created_at:'2025-05-01T00:00:00Z', title:'Karibu Homes',          description:'Modern property listings & real estate platform.', image_url:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=75&fit=crop' },
      { id:'9', category:'Church & Ministry',live_url:'https://divine-encounter-church.vercel.app/', emoji:'⛪', created_at:'2025-05-10T00:00:00Z', title:'Divine Encounter Church',description:'Modern church website for a Nairobi community.', image_url:'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=700&q=75&fit=crop' },
      { id:'10',category:'Web Design',       live_url:'https://pokea-sports.vercel.app/',             created_at:'2025-02-15T00:00:00Z', title:'PokeaSports',              description:'Africa\'s #1 football news platform.', image_url:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=75&fit=crop' },
      { id:'11', category:'NGO & Community',   live_url:'https://africa-for-all.vercel.app/',          created_at:'2025-06-01T00:00:00Z', title:'Africa For All',           description:'Pan-African community platform connecting people across the continent.', image_url:'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=700&q=75&fit=crop' },
      { id:'12', category:'Research & Consulting',live_url:'https://www.arkexpertresearch.com',           created_at:'2025-06-05T00:00:00Z', title:'ARK Expert Research',      description:'Professional research and consulting firm with global reach.', image_url:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=75&fit=crop' },
      { id:'13', category:'Travel & Tourism',     live_url:'https://mzedu-tours.vercel.app/',             created_at:'2025-05-15T00:00:00Z', title:'Mzedu Tours',              description:'Premium travel & safari experiences across East Africa.', image_url:'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&q=75&fit=crop' },
      { id:'14', category:'Church & Ministry',    live_url:'https://divine-encounter-church.vercel.app/', created_at:'2025-06-08T00:00:00Z', title:'Divine Encounter Church',  description:'Modern church website with sermon archive, events and online giving.', image_url:'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=700&q=75&fit=crop' },
      { id:'15', category:'Church & Ministry',    live_url:'https://www.voiceofvalour.co.ke/',            created_at:'2025-06-10T00:00:00Z', title:'Voice of Valour',          description:'FGCK Christ Centre Church — faith, community and ministry online.', image_url:'https://images.unsplash.com/photo-1519491050282-cf00c82424b2?w=700&q=75&fit=crop' },
    ],
    contacts: [
      { id:'1', name:'Sarah Ahmed',  email:'sarah@startup.io', phone:'+254711000001', project_type:'Web Design',    budget:'KES 15,000–50,000', message:'Need a landing page for my SaaS launch.',        read:false, created_at:'2025-05-10T00:00:00Z' },
      { id:'2', name:'James Mwangi', email:'james@corp.co.ke', phone:'+254711000002', project_type:'Branding',      budget:'KES 5,000–15,000',  message:'Looking for a complete brand identity package.', read:false, created_at:'2025-05-14T00:00:00Z' },
      { id:'3', name:'Priya Sharma', email:'priya@media.com',  phone:'+254711000003', project_type:'SEO',           budget:'KES 5,000–15,000',  message:'Want to improve our organic search rankings.',   read:true,  created_at:'2025-05-17T00:00:00Z' },
    ],
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
        const newRows = arr.map(item => ({ ...item, id: `mock_${Date.now()}`, created_at: new Date().toISOString() }))
        if (!_store[table]) _store[table] = []
        _store[table].unshift(...newRows)
        return { select: () => ({ single: () => Promise.resolve({ data: newRows[0], error: null }) }), single: () => Promise.resolve({ data: newRows[0], error: null }), then: (r) => r({ data: newRows, error: null }) }
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

  return {
    from:    (table) => makeBuilder(table),
    auth:    mockAuth,
    storage: { from: () => ({ upload: () => Promise.resolve({ data: {}, error: null }), getPublicUrl: (p) => ({ data: { publicUrl: '' } }), remove: () => Promise.resolve({ error: null }) }) },
  }
}
