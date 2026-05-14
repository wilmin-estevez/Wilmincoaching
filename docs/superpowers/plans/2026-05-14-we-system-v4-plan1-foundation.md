# WE System v4 — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the Next.js 14 app with Supabase, auth, WE design system, app shell, and migrate all 12 clients from sync.json — leaving a working dashboard with real data.

**Architecture:** Next.js 14 App Router at `Wilmincoaching/we-system/`. Supabase for PostgreSQL + Auth. Middleware protects all `/dashboard/*` routes. Migration script reads GitHub API → transforms → inserts into Supabase. Vercel deploy with `rootDirectory=we-system`.

**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Supabase JS v2 · Vitest

**Spec:** `docs/superpowers/specs/2026-05-14-we-system-v4-design.md`

---

## File Map

```
we-system/
├── app/
│   ├── layout.tsx                    # Root layout (fonts)
│   ├── (auth)/
│   │   └── login/page.tsx            # Login form
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Shell: Sidebar + Topbar
│   │   └── dashboard/page.tsx        # Dashboard principal
│   └── api/
│       └── health/route.ts           # Sanity check endpoint
├── components/
│   ├── shell/
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   └── dashboard/
│       └── KPIGrid.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client (singleton)
│   │   ├── server.ts                 # Server client (per-request)
│   │   └── types.ts                  # Database types (generated)
│   └── utils.ts                      # cn() helper
├── middleware.ts                      # Auth guard
├── scripts/
│   └── migrate-v3.ts                 # One-time migration
├── supabase/
│   └── schema.sql                    # Full DB schema
├── tailwind.config.ts
├── components.json                    # shadcn config
└── .env.local                        # Keys (never committed)
```

---

## Task 1: Create Next.js project

**Files:**
- Create: `we-system/` (entire project)

- [ ] **Step 1: Scaffold project**

Run from `C:\Users\think\Wilmincoaching\`:
```bash
npx create-next-app@latest we-system \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint
```

When prompted: use App Router = Yes, everything else default.

- [ ] **Step 2: Install dependencies**

```bash
cd we-system
npm install @supabase/supabase-js @supabase/ssr
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install vitest @vitejs/plugin-react @testing-library/react @testing-library/dom jsdom --save-dev
```

- [ ] **Step 3: Install shadcn**

```bash
npx shadcn@latest init
```

Choose: Default style → Default base color → yes to CSS variables.

Then add components:
```bash
npx shadcn@latest add button input label card badge tabs table
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```
Expected: `▲ Next.js 14.x.x` on `http://localhost:3000`

- [ ] **Step 5: Commit**

```bash
cd ..
git add we-system/
git commit -m "feat: scaffold we-system Next.js 14 app"
```

---

## Task 2: WE Design Tokens + Tailwind Config

**Files:**
- Modify: `we-system/tailwind.config.ts`
- Modify: `we-system/app/globals.css`
- Create: `we-system/lib/utils.ts`

- [ ] **Step 1: Update tailwind.config.ts**

Replace the contents of `we-system/tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'we-orange':      '#FF4500',
        'we-orange-dark': '#CC3700',
        'we-black':       '#0B0B0B',
        'we-carbon':      '#141414',
        'we-carbon-1':    '#181818',
        'we-carbon-2':    '#232323',
        'we-carbon-3':    '#2E2E2E',
        'we-white':       '#F5F5F5',
        'we-gray-mid':    '#8E8E8E',
        'we-gray-low':    '#555555',
        'we-success':     '#22C55E',
        'we-warn':        '#F59E0B',
        'we-danger':      '#EF4444',
      },
      fontFamily: {
        display: ['var(--font-oswald)', 'Impact', 'sans-serif'],
        body:    ['var(--font-open-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card:   '10px',
        btn:    '6px',
        chip:   '4px',
        avatar: '6px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

Install animate plugin:
```bash
cd we-system && npm install tailwindcss-animate
```

- [ ] **Step 2: Update globals.css**

Replace `we-system/app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Oswald:wght@500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-oswald: 'Oswald', Impact, sans-serif;
  --font-open-sans: 'Open Sans', system-ui, sans-serif;
  --we-orange-soft: rgba(255, 69, 0, 0.10);
}

* { box-sizing: border-box; }

body {
  background: #0B0B0B;
  color: #F5F5F5;
  font-family: var(--font-open-sans);
  -webkit-font-smoothing: antialiased;
}

/* WE brand bar utility */
.brand-bar { border-left: 4px solid #FF4500; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #141414; }
::-webkit-scrollbar-thumb { background: #2E2E2E; border-radius: 2px; }
```

- [ ] **Step 3: Create lib/utils.ts**

```typescript
// we-system/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
```

- [ ] **Step 4: Commit**

```bash
git add we-system/tailwind.config.ts we-system/app/globals.css we-system/lib/utils.ts we-system/package.json we-system/package-lock.json
git commit -m "feat: WE design tokens and Tailwind config"
```

---

## Task 3: Supabase Schema

**Files:**
- Create: `we-system/supabase/schema.sql`

- [ ] **Step 1: Create Supabase project**

1. Go to https://supabase.com → New project
2. Name: `we-system`
3. DB password: generate strong password, save it
4. Region: `US East (N. Virginia)` (closest to RD)
5. Wait ~2 min for provisioning

- [ ] **Step 2: Copy project credentials**

In Supabase dashboard → Settings → API:
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

Create `we-system/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
GH_TOKEN=ghp_TU_TOKEN_AQUI
FORM_WEBHOOK_SECRET=we-system-secret-2026
```

- [ ] **Step 3: Write schema.sql**

Create `we-system/supabase/schema.sql`:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  email           TEXT,
  whatsapp        TEXT,
  age             INT,
  weight_kg       NUMERIC,
  height_m        NUMERIC,
  goal_weight_kg  NUMERIC,
  goal            TEXT,
  timeline        TEXT,
  experience      TEXT,
  training_days   INT,
  gym_access      TEXT,
  dietary_restrictions TEXT,
  injuries        TEXT,
  status          TEXT NOT NULL DEFAULT 'active',
  plan_type       TEXT,
  monthly_fee     NUMERIC DEFAULT 0,
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  plan_expires_at TIMESTAMPTZ,
  notes           TEXT,
  quick_notes     TEXT,
  sex             TEXT,
  v3_id           TEXT UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Weight history
CREATE TABLE IF NOT EXISTS weight_entries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  weight_kg   NUMERIC NOT NULL,
  recorded_at DATE NOT NULL,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Check-ins
CREATE TABLE IF NOT EXISTS checkins (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  note        TEXT,
  score       INT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Nutrition plans
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  week_start    DATE,
  kcal_target   INT,
  protein_g     INT,
  carbs_high_g  INT,
  carbs_mid_g   INT,
  carbs_low_g   INT,
  fat_g         INT,
  cycle         INT[] DEFAULT '{0,1,2,0,1,2,2}',
  meals         JSONB DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'draft',
  public_slug   TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Training plans
CREATE TABLE IF NOT EXISTS training_plans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  week_start  DATE,
  name        TEXT,
  days        JSONB DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'draft',
  public_slug TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount      NUMERIC NOT NULL,
  method      TEXT,
  status      TEXT NOT NULL DEFAULT 'pending',
  due_date    DATE,
  paid_at     TIMESTAMPTZ,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Notes
CREATE TABLE IF NOT EXISTS client_notes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  category    TEXT DEFAULT 'general',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Form submissions from Google Forms
CREATE TABLE IF NOT EXISTS form_submissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raw_data    JSONB NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new',
  client_id   UUID REFERENCES clients(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_status       ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_v3_id        ON clients(v3_id);
CREATE INDEX IF NOT EXISTS idx_weight_client        ON weight_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_client     ON nutrition_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_slug       ON nutrition_plans(public_slug);
CREATE INDEX IF NOT EXISTS idx_training_client      ON training_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_training_slug        ON training_plans(public_slug);
CREATE INDEX IF NOT EXISTS idx_payments_client      ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_checkins_client      ON checkins(client_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

- [ ] **Step 4: Run schema in Supabase**

In Supabase dashboard → SQL Editor → New query → paste schema.sql → Run.
Expected: "Success. No rows returned."

- [ ] **Step 5: Commit schema**

```bash
git add we-system/supabase/schema.sql we-system/.env.local
git commit -m "feat: Supabase schema — clients, nutrition, training, payments"
```

Note: `.env.local` should be in `.gitignore` — verify before committing.

---

## Task 4: Supabase Client + Types

**Files:**
- Create: `we-system/lib/supabase/client.ts`
- Create: `we-system/lib/supabase/server.ts`
- Create: `we-system/lib/supabase/types.ts`

- [ ] **Step 1: Create browser client**

```typescript
// we-system/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create server client**

```typescript
// we-system/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

export function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}
```

- [ ] **Step 3: Create types**

```typescript
// we-system/lib/supabase/types.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type ClientStatus = 'active' | 'renew' | 'expired' | 'new'
export type PlanStatus = 'draft' | 'sent'
export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export interface Client {
  id: string
  name: string
  email: string | null
  whatsapp: string | null
  age: number | null
  weight_kg: number | null
  height_m: number | null
  goal_weight_kg: number | null
  goal: string | null
  timeline: string | null
  experience: string | null
  training_days: number | null
  gym_access: string | null
  dietary_restrictions: string | null
  injuries: string | null
  status: ClientStatus
  plan_type: string | null
  monthly_fee: number
  joined_at: string
  plan_expires_at: string | null
  notes: string | null
  quick_notes: string | null
  sex: string | null
  v3_id: string | null
  created_at: string
  updated_at: string
}

export interface WeightEntry {
  id: string
  client_id: string
  weight_kg: number
  recorded_at: string
  note: string | null
}

export interface Checkin {
  id: string
  client_id: string
  checkin_date: string
  note: string | null
  score: number | null
}

export interface Ingredient {
  food: string
  amount_g: number
  unit: string
}

export interface MealOption {
  name: string
  ingredients: Ingredient[]
  protein_g: number
  carbs_g: number
  fat_g: number
  kcal: number
}

export interface Meal {
  time: string
  options: [MealOption, MealOption, MealOption]
}

export interface DayMeals {
  cycle_level: 0 | 1 | 2  // 0=ALTO, 1=MEDIO, 2=BAJO
  desayuno: Meal
  merienda: Meal
  almuerzo: Meal
  cena: Meal
}

export interface NutritionPlanMeals {
  lunes: DayMeals
  martes: DayMeals
  miercoles: DayMeals
  jueves: DayMeals
  viernes: DayMeals
  sabado: DayMeals
  domingo: DayMeals
}

export interface Exercise {
  name: string
  muscle: string
  equipment: string
  sets: number
  reps: string
  rest_s: number
  weight: string
  gif_url: string
  notes: string
}

export interface TrainingDay {
  name: string
  exercises: Exercise[]
}

export interface TrainingPlanDays {
  lunes?: TrainingDay
  martes?: TrainingDay
  miercoles?: TrainingDay
  jueves?: TrainingDay
  viernes?: TrainingDay
  sabado?: TrainingDay
  domingo?: TrainingDay
}

export interface NutritionPlan {
  id: string
  client_id: string
  week_start: string | null
  kcal_target: number | null
  protein_g: number | null
  carbs_high_g: number | null
  carbs_mid_g: number | null
  carbs_low_g: number | null
  fat_g: number | null
  cycle: number[]
  meals: NutritionPlanMeals | Record<string, never>
  status: PlanStatus
  public_slug: string | null
  created_at: string
}

export interface TrainingPlan {
  id: string
  client_id: string
  week_start: string | null
  name: string | null
  days: TrainingPlanDays
  status: PlanStatus
  public_slug: string | null
  created_at: string
}

export interface Payment {
  id: string
  client_id: string
  amount: number
  method: string | null
  status: PaymentStatus
  due_date: string | null
  paid_at: string | null
  notes: string | null
  created_at: string
}

export interface FormSubmission {
  id: string
  raw_data: Record<string, string>
  status: 'new' | 'converted'
  client_id: string | null
  created_at: string
}

// Database interface for Supabase generic typing
export interface Database {
  public: {
    Tables: {
      clients: { Row: Client; Insert: Partial<Client>; Update: Partial<Client> }
      weight_entries: { Row: WeightEntry; Insert: Partial<WeightEntry>; Update: Partial<WeightEntry> }
      checkins: { Row: Checkin; Insert: Partial<Checkin>; Update: Partial<Checkin> }
      nutrition_plans: { Row: NutritionPlan; Insert: Partial<NutritionPlan>; Update: Partial<NutritionPlan> }
      training_plans: { Row: TrainingPlan; Insert: Partial<TrainingPlan>; Update: Partial<TrainingPlan> }
      payments: { Row: Payment; Insert: Partial<Payment>; Update: Partial<Payment> }
      form_submissions: { Row: FormSubmission; Insert: Partial<FormSubmission>; Update: Partial<FormSubmission> }
    }
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add we-system/lib/
git commit -m "feat: Supabase client and TypeScript types"
```

---

## Task 5: Auth — Login + Middleware

**Files:**
- Create: `we-system/middleware.ts`
- Create: `we-system/app/(auth)/login/page.tsx`
- Create: `we-system/app/layout.tsx`
- Create: `we-system/app/api/auth/callback/route.ts`

- [ ] **Step 1: Create root layout**

```typescript
// we-system/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WE System · Wilmin Estévez',
  description: 'Sistema de coaching profesional',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Create middleware**

```typescript
// we-system/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Public routes
  if (path.startsWith('/plan/') || path.startsWith('/api/form-submission')) {
    return supabaseResponse
  }

  // Auth callback
  if (path.startsWith('/auth/callback')) return supabaseResponse

  // Redirect unauthenticated to login
  if (!user && !path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated away from login
  if (user && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 3: Create auth callback route**

```typescript
// we-system/app/api/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}
```

- [ ] **Step 4: Create login page**

```typescript
// we-system/app/(auth)/login/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenciales incorrectas')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-we-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-we-orange rounded-[6px] flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">WE</span>
          </div>
          <div>
            <div className="font-display font-bold text-we-white text-sm tracking-widest uppercase">
              WILMIN <span className="text-we-orange">ESTÉVEZ</span>
            </div>
            <div className="text-we-gray-mid text-xs">Fitness Coach · RD</div>
          </div>
        </div>

        <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-6">
          <h1 className="font-display font-bold text-we-white text-xl uppercase tracking-wide mb-6">
            Acceso al sistema
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-we-gray-mid uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-2.5 text-we-white text-sm focus:outline-none focus:border-we-orange transition-colors"
                placeholder="wilminestevez@gmail.com"
              />
            </div>

            <div>
              <label className="text-xs text-we-gray-mid uppercase tracking-widest block mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-2.5 text-we-white text-sm focus:outline-none focus:border-we-orange transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-we-danger text-xs">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-we-orange hover:bg-we-orange-dark text-white font-bold text-sm py-2.5 rounded-btn transition-colors disabled:opacity-50 shadow-[0_2px_12px_rgba(255,69,0,0.20)] uppercase tracking-wide font-display"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create Supabase user for Wilmin**

In Supabase dashboard → Authentication → Users → Add user:
- Email: `wilminestevez@gmail.com`
- Password: (choose strong password, share with Wilmin)
- Click "Create user"

- [ ] **Step 6: Test login flow**

```bash
cd we-system && npm run dev
```
Navigate to `http://localhost:3000` → should redirect to `/login`.
Enter credentials → should redirect to `/dashboard` (will 404 for now — that's OK).

- [ ] **Step 7: Commit**

```bash
git add we-system/middleware.ts we-system/app/
git commit -m "feat: auth — login page, middleware, Supabase session"
```

---

## Task 6: App Shell — Sidebar + Topbar

**Files:**
- Create: `we-system/components/shell/Sidebar.tsx`
- Create: `we-system/components/shell/Topbar.tsx`
- Create: `we-system/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Create Sidebar**

```typescript
// we-system/components/shell/Sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, Apple, Dumbbell,
  DollarSign, Link as LinkIcon, FileText, LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV = [
  {
    group: 'PRINCIPAL',
    items: [
      { href: '/dashboard',  label: 'Dashboard',    icon: LayoutDashboard },
      { href: '/clients',    label: 'Asesorados',   icon: Users, badge: null },
    ],
  },
  {
    group: 'PLANES',
    items: [
      { href: '/nutrition',  label: 'Nutrición',    icon: Apple },
      { href: '/training',   label: 'Entrenamiento',icon: Dumbbell },
    ],
  },
  {
    group: 'NEGOCIO',
    items: [
      { href: '/cobros',     label: 'Cobros',       icon: DollarSign },
    ],
  },
  {
    group: 'COMPARTIR',
    items: [
      { href: '/links',      label: 'Links',        icon: LinkIcon },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-52 bg-we-carbon border-r border-we-carbon-2 flex flex-col flex-shrink-0 h-screen sticky top-0">
      {/* Brand */}
      <div className="p-4 border-b border-we-carbon-2 flex items-center gap-3">
        <div className="w-4 h-full bg-we-orange absolute left-0 top-0 rounded-l hidden" />
        <div className="w-9 h-9 bg-we-orange rounded-[6px] flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-white text-xs">WE</span>
        </div>
        <div className="min-w-0">
          <div className="font-display font-bold text-we-white text-xs tracking-widest uppercase truncate">
            WILMIN <span className="text-we-orange">ESTÉVEZ</span>
          </div>
          <div className="text-we-gray-mid text-[10px]">Fitness Coach · RD</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {NAV.map(group => (
          <div key={group.group} className="mb-1">
            <div className="px-4 py-2 text-[9px] font-bold text-we-gray-low tracking-[2px] uppercase">
              {group.group}
            </div>
            {group.items.map(item => {
              const active = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 mx-2 px-3 py-2 rounded-btn text-sm transition-colors relative',
                    active
                      ? 'bg-we-carbon-1 text-we-white border-l-2 border-we-orange'
                      : 'text-we-gray-mid hover:text-we-white hover:bg-we-carbon-1'
                  )}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-we-carbon-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-btn text-sm text-we-gray-mid hover:text-we-danger hover:bg-we-carbon-1 transition-colors"
        >
          <LogOut size={15} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create Topbar**

```typescript
// we-system/components/shell/Topbar.tsx
import { Search, Bell, Plus } from 'lucide-react'

interface TopbarProps {
  title: string
  accent?: string
  action?: React.ReactNode
}

export function Topbar({ title, accent, action }: TopbarProps) {
  return (
    <header className="h-14 border-b border-we-carbon-2 bg-we-carbon flex items-center px-6 gap-4 flex-shrink-0">
      <div className="font-display font-bold text-we-white text-sm tracking-[2px] uppercase">
        {title}
        {accent && <span className="text-we-orange ml-1">{accent}</span>}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1 bg-we-carbon-1 border border-we-carbon-2 rounded-btn px-3 py-1.5 w-56">
        <Search size={12} className="text-we-gray-mid flex-shrink-0" />
        <input
          placeholder="Buscar asesorado..."
          className="bg-transparent text-xs text-we-white placeholder:text-we-gray-low flex-1 outline-none"
        />
      </div>

      <button className="w-8 h-8 flex items-center justify-center rounded-btn border border-we-carbon-2 text-we-gray-mid hover:text-we-white hover:border-we-carbon-3 transition-colors">
        <Bell size={14} />
      </button>

      {action}
    </header>
  )
}
```

- [ ] **Step 3: Create dashboard layout**

```typescript
// we-system/app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/shell/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-we-black overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create placeholder dashboard page**

```typescript
// we-system/app/(dashboard)/dashboard/page.tsx
import { Topbar } from '@/components/shell/Topbar'

export default function DashboardPage() {
  return (
    <>
      <Topbar title="DASHBOARD" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="text-we-gray-mid text-sm">Cargando dashboard...</div>
      </main>
    </>
  )
}
```

- [ ] **Step 5: Test shell renders**

```bash
npm run dev
```
Login → should see sidebar + topbar with "DASHBOARD".

- [ ] **Step 6: Commit**

```bash
git add we-system/components/ we-system/app/
git commit -m "feat: app shell — sidebar, topbar, dashboard layout"
```

---

## Task 7: Data Migration Script (v3 → Supabase)

**Files:**
- Create: `we-system/scripts/migrate-v3.ts`

- [ ] **Step 1: Install migration deps**

```bash
cd we-system
npm install tsx --save-dev
```

- [ ] **Step 2: Create migration script**

```typescript
// we-system/scripts/migrate-v3.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GH_TOKEN     = process.env.GH_TOKEN!

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Fetch sync.json from GitHub ───────────────────────────────────────────────
async function fetchSyncJson(): Promise<any> {
  const res = await fetch(
    'https://api.github.com/repos/wilmin-estevez/Wilmincoaching/contents/data/sync.json',
    { headers: { Authorization: `token ${GH_TOKEN}`, Accept: 'application/vnd.github.v3.raw' } }
  )
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

// ── Map v3 goal string → standard goal key ───────────────────────────────────
function mapGoal(goal: string): string {
  const g = goal.toLowerCase()
  if (g.includes('grasa') || g.includes('perder') || g.includes('bajar')) return 'lose_fat'
  if (g.includes('músculo') || g.includes('musculo') || g.includes('ganar')) return 'gain_muscle'
  if (g.includes('rendimiento') || g.includes('atlét')) return 'performance'
  return 'habits'
}

// ── Map v3 status ─────────────────────────────────────────────────────────────
function mapStatus(client: any): string {
  if (!client.activo) return 'expired'
  if (!client.paymentDate) return 'active'
  const exp = new Date(client.paymentDate)
  const now = new Date()
  const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / 86400000)
  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 7) return 'renew'
  return 'active'
}

// ── Main migration ────────────────────────────────────────────────────────────
async function migrate() {
  console.log('📦 Fetching sync.json from GitHub...')
  const data = await fetchSyncJson()
  const clientes: any[] = data.clientes || []
  console.log(`✓ Found ${clientes.length} clients`)

  let clientsInserted = 0
  let weightsInserted = 0
  let checkinsInserted = 0
  let errors = 0

  for (const c of clientes) {
    try {
      // Parse weight and height from combined string if needed
      const weightKg = c.weights?.length > 0
        ? c.weights[c.weights.length - 1].kg   // most recent weight
        : null
      const startWeightKg = c.weights?.length > 0 ? c.weights[0].kg : null

      // Insert client
      const { data: inserted, error: clientError } = await supabase
        .from('clients')
        .upsert({
          name:            c.name,
          whatsapp:        c.phone ? String(c.phone) : null,
          age:             c.edad || null,
          weight_kg:       weightKg,
          height_m:        c.altura ? c.altura / 100 : null,  // v3 stores cm
          goal:            mapGoal(c.goal || ''),
          training_days:   null,
          status:          mapStatus(c),
          monthly_fee:     0,
          joined_at:       c.startDate ? new Date(c.startDate).toISOString() : new Date().toISOString(),
          plan_expires_at: c.paymentDate ? new Date(c.paymentDate).toISOString() : null,
          notes:           c.notes || null,
          quick_notes:     c.quickNotes || null,
          sex:             c.sexo || null,
          v3_id:           String(c.id),
        }, { onConflict: 'v3_id' })
        .select('id')
        .single()

      if (clientError || !inserted) {
        console.error(`✗ Client ${c.name}: ${clientError?.message}`)
        errors++
        continue
      }

      clientsInserted++
      const clientId = inserted.id

      // Insert weight history
      if (c.weights?.length > 0) {
        const weightRows = c.weights.map((w: any) => ({
          client_id:   clientId,
          weight_kg:   w.kg,
          recorded_at: w.date,
          note:        w.note || null,
        }))
        const { error: wErr } = await supabase.from('weight_entries').insert(weightRows)
        if (!wErr) weightsInserted += weightRows.length
      }

      // Insert check-ins
      if (c.checkins?.length > 0) {
        const checkinRows = c.checkins.map((ci: any) => ({
          client_id:    clientId,
          checkin_date: ci.date,
          note:         ci.nota || null,
          score:        ci.score ? parseInt(ci.score) : null,
        }))
        const { error: ciErr } = await supabase.from('checkins').insert(checkinRows)
        if (!ciErr) checkinsInserted += checkinRows.length
      }

      console.log(`  ✓ ${c.name} (${mapStatus(c)})`)
    } catch (err) {
      console.error(`✗ ${c.name}: ${err}`)
      errors++
    }
  }

  console.log(`
═══════════════════════════════
✅ Migration complete
   Clients:   ${clientsInserted}/${clientes.length}
   Weights:   ${weightsInserted}
   Check-ins: ${checkinsInserted}
   Errors:    ${errors}
═══════════════════════════════`)
}

migrate().catch(console.error)
```

- [ ] **Step 3: Add script to package.json**

In `we-system/package.json` add to `"scripts"`:
```json
"migrate": "tsx --env-file=.env.local scripts/migrate-v3.ts"
```

- [ ] **Step 4: Run migration**

```bash
cd we-system
npm run migrate
```

Expected output:
```
📦 Fetching sync.json from GitHub...
✓ Found 12 clients
  ✓ Michael Estevez (active)
  ✓ ...
═══════════════════════════════
✅ Migration complete
   Clients:   12/12
   Weights:   xx
   Check-ins: xx
   Errors:    0
═══════════════════════════════
```

- [ ] **Step 5: Verify in Supabase**

In Supabase dashboard → Table Editor → clients → should show 12 rows.

- [ ] **Step 6: Commit**

```bash
git add we-system/scripts/ we-system/package.json
git commit -m "feat: v3 migration script — imports 12 clients from sync.json"
```

---

## Task 8: Dashboard with Real KPIs

**Files:**
- Create: `we-system/components/dashboard/KPIGrid.tsx`
- Create: `we-system/components/dashboard/HeroStrip.tsx`
- Modify: `we-system/app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Create KPIGrid component**

```typescript
// we-system/components/dashboard/KPIGrid.tsx
import { cn } from '@/lib/utils'

interface KPI {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'good' | 'warn' | 'danger'
}

interface KPIGridProps {
  kpis: KPI[]
}

export function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-we-carbon border border-we-carbon-2 rounded-card p-5"
        >
          <div className="text-[9px] font-bold text-we-gray-mid tracking-[2px] uppercase mb-2">
            {kpi.label}
          </div>
          <div className="font-display font-bold text-we-white text-4xl leading-none">
            {kpi.value}
          </div>
          {kpi.delta && (
            <div className={cn(
              'text-xs mt-2',
              kpi.deltaType === 'good'   && 'text-we-success',
              kpi.deltaType === 'warn'   && 'text-we-warn',
              kpi.deltaType === 'danger' && 'text-we-danger',
              !kpi.deltaType             && 'text-we-gray-mid',
            )}>
              {kpi.delta}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create HeroStrip**

```typescript
// we-system/components/dashboard/HeroStrip.tsx
import Link from 'next/link'

interface HeroStripProps {
  newForms: number
}

export function HeroStrip({ newForms }: HeroStripProps) {
  const today = new Date().toLocaleDateString('es-DO', {
    weekday: 'long', day: 'numeric', month: 'long'
  }).toUpperCase()

  return (
    <div className="brand-bar bg-we-carbon border border-we-carbon-2 rounded-r-card px-6 py-4 flex items-center justify-between">
      <div>
        <div className="text-[9px] font-bold text-we-orange tracking-[2px] uppercase">{today}</div>
        <div className="font-display font-bold text-we-white text-2xl uppercase tracking-wide mt-1">
          BUEN DÍA, <span className="text-we-orange">WILMIN.</span>
        </div>
        {newForms > 0 && (
          <div className="text-xs text-we-gray-mid mt-1">
            Tienes <span className="text-we-success font-bold">{newForms} formulario{newForms > 1 ? 's' : ''} nuevo{newForms > 1 ? 's' : ''}</span> esperando
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Link
          href="/clients"
          className="bg-we-carbon-2 hover:bg-we-carbon-3 text-we-white text-xs font-bold px-4 py-2 rounded-btn transition-colors uppercase tracking-wide font-display"
        >
          Ver asesorados
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update dashboard page with real data**

```typescript
// we-system/app/(dashboard)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Topbar } from '@/components/shell/Topbar'
import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { HeroStrip } from '@/components/dashboard/HeroStrip'

export default async function DashboardPage() {
  const supabase = createClient()

  const [
    { count: totalActive },
    { count: toRenew },
    { count: newForms },
    { data: recentClients },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'renew'),
    supabase.from('form_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('clients').select('id, name, status, plan_expires_at').order('created_at', { ascending: false }).limit(5),
  ])

  const kpis = [
    {
      label: 'Asesorados activos',
      value: totalActive ?? 0,
      delta: 'Total en sistema',
      deltaType: 'good' as const,
    },
    {
      label: 'Por renovar',
      value: toRenew ?? 0,
      delta: toRenew && toRenew > 0 ? 'Esta semana' : 'Al día',
      deltaType: toRenew && toRenew > 0 ? 'warn' as const : 'good' as const,
    },
    {
      label: 'Formularios nuevos',
      value: newForms ?? 0,
      delta: newForms && newForms > 0 ? 'Esperando plan' : 'Sin pendientes',
      deltaType: newForms && newForms > 0 ? 'good' as const : undefined,
    },
    {
      label: 'Expirados',
      value: 0,
      delta: 'Sin vencidos',
      deltaType: 'good' as const,
    },
  ]

  return (
    <>
      <Topbar title="DASHBOARD" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <HeroStrip newForms={newForms ?? 0} />
        <KPIGrid kpis={kpis} />

        {/* Recent clients */}
        <div className="bg-we-carbon border border-we-carbon-2 rounded-card p-5">
          <div className="text-[11px] font-bold text-we-white tracking-[2px] uppercase mb-4">
            Asesorados recientes
          </div>
          <div className="space-y-2">
            {(recentClients ?? []).map(client => (
              <div key={client.id} className="flex items-center gap-3 py-2 border-b border-we-carbon-2 last:border-0">
                <div className="w-8 h-8 bg-we-carbon-2 rounded-avatar flex items-center justify-center text-xs font-bold text-we-orange font-display">
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 text-sm text-we-white">{client.name}</div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-chip uppercase tracking-wide ${
                  client.status === 'active' ? 'bg-we-success/10 text-we-success' :
                  client.status === 'renew'  ? 'bg-we-warn/10 text-we-warn' :
                  'bg-we-danger/10 text-we-danger'
                }`}>
                  {client.status === 'active' ? 'Activo' : client.status === 'renew' ? 'Por renovar' : 'Expirado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 4: Test dashboard shows real data**

```bash
npm run dev
```
Navigate to `http://localhost:3000/dashboard` → should show KPIs with real counts from Supabase.

- [ ] **Step 5: Commit**

```bash
git add we-system/components/dashboard/ we-system/app/(dashboard)/dashboard/
git commit -m "feat: dashboard — real KPIs and client list from Supabase"
```

---

## Task 9: Deploy to Vercel

**Files:**
- Create: `we-system/vercel.json`

- [ ] **Step 1: Create Vercel config**

```json
// we-system/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

- [ ] **Step 2: Push to GitHub**

```bash
git add we-system/vercel.json
git commit -m "feat: vercel config"
git push origin main
```

- [ ] **Step 3: Deploy on Vercel**

1. Go to vercel.com → New Project
2. Import `wilmin-estevez/Wilmincoaching`
3. **Root Directory:** `we-system`
4. Framework: Next.js (auto-detected)
5. Add environment variables (same as .env.local):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `FORM_WEBHOOK_SECRET`
   - `GH_TOKEN`
6. Click Deploy

- [ ] **Step 4: Verify deploy**

Visit the Vercel URL → login → dashboard with real client data.

- [ ] **Step 5: Update project memory**

Note the Vercel URL (e.g., `https://we-system-wilmin.vercel.app`) for use in subsequent plans.

---

## Plan 1 Complete ✅

After this plan, you have:
- Working Next.js 14 app on Vercel
- Supabase with all 12 clients migrated from v3
- Secure auth (only Wilmin can log in)
- App shell (sidebar + topbar) with WE brand
- Dashboard showing real KPI counts

**Next plan:** `2026-05-14-we-system-v4-plan2-clients.md` — Client list, profiles, form webhook.
