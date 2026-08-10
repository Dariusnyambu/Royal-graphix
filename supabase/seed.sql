-- ============================================================
-- Royal Graphix — Seed Data
-- Run AFTER schema.sql to populate dev/staging data
-- ============================================================

-- ── Portfolio Items (Real Royal Graphix Client Sites) ──
insert into public.portfolio (title, description, image_url, category, live_url, emoji) values
  ('Jewels Kitchen',       'Nairobi''s premier catering & food delivery website — wedding catering, corporate events, authentic Kenyan cuisine.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=75', 'Web Design', 'https://jewels-kitchen.vercel.app/', '🍽️'),
  ('Bluestocks FX Academy','Professional Forex education platform — VIP signals, mentorship & account management for traders across Africa.',      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&q=75', 'Web Design', 'https://bluestocks-fx-academy.vercel.app/', '📈'),
  ('PokeaSports',          'Africa''s #1 football news platform — live scores, EPL standings, transfer rumours, fixtures & predictions.',          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=75', 'Web Design', 'https://pokea-sports.vercel.app/', '⚽'),
  ('Jirani',               'Nairobi''s #1 home services marketplace — book trusted plumbers, electricians, laundry & errand runners in 3 min.',  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=75', 'Web Design', 'https://jirani-sand.vercel.app/', '🏠'),
  ('Ascend Finance',       'Kenya''s trusted microfinance partner — personal loans, business loans, emergency loans & salary advances.',           'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=75', 'Web Design', 'https://ascend-alpha-one.vercel.app/', '💰'),
  ('Mzedu Swift',          'Kenya''s trusted parcel courier — fast delivery from Nairobi to the coast. Book, track & ship nationwide.',            'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=700&q=75', 'Web Design', 'https://mzedu-swift.vercel.app/', '📦'),
  ('Neema Collections',    'Premium Kenyan fashion e-commerce — women, men, kids, shoes & bags. M-Pesa checkout, countrywide delivery.',           'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&q=75', 'Web Design', 'https://neema-collection.vercel.app/', '👗'),
  ('Karibu Homes',         'Modern property listings & real estate platform — browse, search and inquire about homes across Kenya with ease.',      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=75', 'Real Estate', 'https://dariusnyambu.github.io/karibuhomes/', '🏡');

-- ── Contact Leads ──
insert into public.contacts (name, email, phone, project_type, budget, message) values
  ('Sarah Ahmed',   'sarah@startup.io',    '+254711000001', 'Web Design',        '$1,000 – $3,000',  'Need a landing page for my SaaS product launch next month.'),
  ('James Mwangi',  'james@corp.co.ke',    '+254711000002', 'Branding',          '$500 – $1,000',    'Looking for a complete brand identity including logo and guidelines.'),
  ('Priya Sharma',  'priya@media.com',     'SEO Optimization',  '$500 – $1,000',    'Want to improve our search rankings for competitive keywords.'),
  ('Carlos Diaz',   'carlos@agency.mx', '+254711000004', 'Graphic Design',    'Under $500',       'Need social media design templates for Instagram and LinkedIn.'),
  ('Aisha Kamau',   'aisha@ngo.org',       '+254711000005', 'Web Design',        '$3,000 – $10,000', 'Nonprofit website redesign — accessibility and mobile-first are priorities.');

-- New portfolio items (added 2025)
INSERT INTO public.portfolio (title, category, description, live_url, image_url, created_at)
VALUES
  ('Africa For All',        'NGO & Community',      'Pan-African community platform connecting people across the continent.',            'https://africa-for-all.vercel.app/',           'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=700&q=75&fit=crop', '2025-06-01'),
  ('ARK Expert Research',   'Research & Consulting', 'Professional research and consulting firm with global reach.',                     'https://www.arkexpertresearch.com',            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=75&fit=crop', '2025-06-05'),
  ('Mzedu Tours',           'Travel & Tourism',      'Premium travel & safari experiences across East Africa.',                          'https://mzedu-tours.vercel.app/',              'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=700&q=75&fit=crop', '2025-05-15'),
  ('Divine Encounter Church','Church & Ministry',    'Modern church website with sermon archive, events and online giving.',             'https://divine-encounter-church.vercel.app/',  'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=700&q=75&fit=crop', '2025-06-08'),
  ('Voice of Valour',       'Church & Ministry',     'FGCK Christ Centre Church — faith, community and ministry online.',                'https://www.voiceofvalour.co.ke/',             'https://images.unsplash.com/photo-1519491050282-cf00c82424b2?w=700&q=75&fit=crop', '2025-06-10')
ON CONFLICT DO NOTHING;
