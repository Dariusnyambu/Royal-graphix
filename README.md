# Royal Graphix — Creative Digital Agency Website

A **production-ready, full-stack React web application** for Royal Graphix, a premium creative digital agency based in Nairobi. Built with Vite, React 18, TailwindCSS, Framer Motion, and Supabase.

---

## ✨ Features

### Public Site
| Feature | Details |
|---|---|
| **Hero Section** | Animated headline, CTA buttons, live stats counter |
| **Services Page** | 6 service cards with feature tags and detail layout |
| **Portfolio** | Filterable grid (Web Design, Branding, Graphics, SEO), project modals |
| **Blog** | Category filter, full article pages, related posts |
| **Pricing** | 3-tier plan cards, FAQ accordion, custom quote CTA |
| **Contact Form** | Validates & saves to Supabase, budget selector, success state |
| **Testimonials** | Client review carousel with star ratings |
| **Process Section** | 4-step visual process |
| **AI Chatbot** | Smart keyword-based chatbot for visitor inquiries |
| **Dark / Light Mode** | Persisted via localStorage |
| **Page Transitions** | Framer Motion `AnimatePresence` on every route |
| **SEO** | `react-helmet-async` meta tags & OG tags on every page |
| **Fully Responsive** | Mobile-first, tested across all breakpoints |

### Admin Dashboard (`/admin`)
| Feature | Details |
|---|---|
| **Auth** | Supabase email/password login with protected routes |
| **Dashboard** | Stat cards, recent leads table, recent project tiles |
| **Portfolio Manager** | Full CRUD — add/edit/delete projects, image upload to Supabase Storage |
| **Contact Leads** | Search, view full message, reply by email, delete |
| **Analytics** | Animated bar chart, traffic source bars, monthly breakdown table, top pages |
| **Blog Manager** | Add/edit/delete blog posts with category badges |
| **Settings** | Agency info, social links, notification toggles, password change, integrations panel |

---

## 🗂 Folder Structure

```
royal-graphix-react/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                   # SPA routing for Vercel
├── .env.example                  # Copy to .env and add keys
├── supabase/
│   ├── schema.sql                # Run first — creates tables + RLS policies
│   └── seed.sql                  # Run second — inserts sample data
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Router + layout wiring
    ├── index.css                 # Tailwind directives + CSS variables
    ├── lib/
    │   ├── supabase.js           # Supabase client (reads .env)
    │   ├── constants.js          # All static data (services, blog, pricing…)
    │   └── motion.js             # Shared Framer Motion variants
    ├── context/
    │   ├── ThemeContext.jsx      # Dark/light mode state
    │   └── AuthContext.jsx       # Supabase auth session
    ├── hooks/
    │   ├── usePortfolio.js       # Portfolio CRUD + state
    │   ├── useContacts.js        # Contact form submit + admin read
    │   ├── useImageUpload.js     # Supabase Storage upload with preview
    │   └── useScrollReveal.js    # IntersectionObserver reveal helper
    ├── services/
    │   ├── portfolio.js          # Supabase portfolio table API
    │   ├── contacts.js           # Supabase contacts table API
    │   └── auth.js               # Supabase auth wrappers
    ├── layouts/
    │   ├── MainLayout.jsx        # Navbar + Footer + Chatbot wrapper
    │   └── AdminLayout.jsx       # Sidebar + main content wrapper
    ├── components/
    │   ├── ui/
    │   │   ├── Button.jsx        # Primary / outline / ghost / danger variants
    │   │   ├── Card.jsx          # Hover-animated surface card
    │   │   ├── Modal.jsx         # Animated modal with backdrop
    │   │   ├── Input.jsx         # Controlled input with focus ring
    │   │   ├── Badge.jsx         # Category / status badges
    │   │   ├── Skeleton.jsx      # Shimmer loading placeholders
    │   │   ├── SectionHeader.jsx # Tag + title + subtitle block
    │   │   ├── PageWrapper.jsx   # Framer Motion page transition wrapper
    │   │   └── ProtectedRoute.jsx# Redirects unauthenticated users
    │   ├── layout/
    │   │   ├── Navbar.jsx        # Fixed nav, mobile drawer, theme toggle
    │   │   ├── Footer.jsx        # Multi-column footer
    │   │   └── Chatbot.jsx       # Floating chatbot widget
    │   └── sections/
    │       ├── HeroSection.jsx
    │       ├── ServicesSection.jsx
    │       ├── PortfolioSection.jsx
    │       ├── TestimonialsSection.jsx
    │       ├── ProcessSection.jsx
    │       ├── PricingSection.jsx
    │       └── CTABanner.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── Services.jsx
    │   ├── Portfolio.jsx
    │   ├── Blog.jsx
    │   ├── BlogArticle.jsx
    │   ├── Pricing.jsx
    │   ├── Contact.jsx
    │   ├── NotFound.jsx
    │   └── admin/
    │       ├── Login.jsx
    │       ├── Dashboard.jsx
    │       ├── Portfolio.jsx
    │       ├── Contacts.jsx
    │       ├── Analytics.jsx
    │       ├── Blog.jsx
    │       └── Settings.jsx
```

---

## 🚀 Quick Start

### 1 — Clone & Install

```bash
git clone https://github.com/yourname/royal-graphix.git
cd royal-graphix-react
npm install
```

### 2 — Configure Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your **Project URL** and **anon key**
3. Copy the env file and fill in your keys:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3 — Set Up the Database

In your Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Step 1: Create tables, RLS policies, and storage bucket
-- (paste contents of supabase/schema.sql)

-- Step 2: Insert sample data (optional)
-- (paste contents of supabase/seed.sql)
```

### 4 — Create an Admin User

In Supabase dashboard → **Authentication → Users → Invite user**, add:
- Email: `admin@royalgraphix.com`
- Set a password via the invite link

### 5 — Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🏗 Build & Deploy

### Build for Production

```bash
npm run build
```

Output goes to `/dist` — ready to serve from any static host.

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Set your environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

The included `vercel.json` handles client-side routing automatically.

### Deploy to Netlify

```bash
npm run build
# drag the /dist folder to netlify.com/drop
```

Or connect your GitHub repo and set:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- Add a `_redirects` file in `/public`:
  ```
  /*  /index.html  200
  ```

---

## 🗄 Supabase Schema Overview

### `portfolio` table

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | Auto-generated |
| `title` | text | Required |
| `description` | text | Required |
| `image_url` | text | Supabase Storage URL |
| `category` | text | Web Design / Branding / Graphics / SEO Projects |
| `live_url` | text | Optional external link |
| `emoji` | text | Fallback icon |
| `created_at` | timestamptz | Auto |

### `contacts` table

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | Auto-generated |
| `name` | text | Required |
| `email` | text | Required |
| `project_type` | text | Required |
| `budget` | text | Optional range |
| `message` | text | Required |
| `read` | boolean | Default false |
| `created_at` | timestamptz | Auto |

### Row Level Security

- **Portfolio**: Public `SELECT`, authenticated `INSERT/UPDATE/DELETE`
- **Contacts**: Public `INSERT`, authenticated `SELECT/UPDATE/DELETE`
- **Storage** (`portfolio-images`): Public `SELECT`, authenticated `INSERT/DELETE`

---

## 🎨 Design Tokens

Defined as CSS custom properties in `src/index.css`:

```css
--red: #C8102E          /* Brand red */
--red-dark: #9B0B22     /* Hover state */
--font-display: 'Syne'  /* Headings */
--font-body: 'DM Sans'  /* Body text */
--nav-h: 72px           /* Navbar height */
```

Dark/light mode values swap automatically via the `.dark` / `.light` class on `<html>`.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | TailwindCSS 3 + CSS Variables |
| Animations | Framer Motion 11 |
| Routing | React Router DOM 6 |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| SEO | react-helmet-async |
| Toasts | react-hot-toast |
| Deploy | Vercel (recommended) |

---

## 📄 License

MIT — free to use, modify, and deploy for Royal Graphix or any client project.

---

*Built with ❤️ in Nairobi by Royal Graphix*
