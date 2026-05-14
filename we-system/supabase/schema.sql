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
