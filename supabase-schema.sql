-- AKN Dhoom Database Schema (IDEMPOTENT — safe to run multiple times)
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  quote TEXT NOT NULL,
  image_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WORKS (PORTFOLIO) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS works (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  client_name TEXT,
  services_used TEXT[] DEFAULT '{}',
  results TEXT,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INSIGHTS (BLOG) TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  body TEXT NOT NULL,
  cover_image_url TEXT,
  author TEXT NOT NULL DEFAULT 'AKN Team',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  publish_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backfill for existing installations
ALTER TABLE insights ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ;

-- ============================================
-- CONTACT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  message TEXT,
  source TEXT DEFAULT 'contact_form',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  notes TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backfill columns on existing installations (idempotent)
ALTER TABLE contact_submissions ALTER COLUMN email DROP NOT NULL;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS referrer TEXT;

-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS TABLE (key-value store)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings (skip if already inserted)
INSERT INTO site_settings (key, value, description) VALUES
  ('site_name', 'Aspire Kinetic Network', 'Business name'),
  ('tagline', 'A global digital growth studio', 'Site tagline'),
  ('email', 'aspirekineticnetwork@gmail.com', 'Primary contact email'),
  ('phone_1', '+919840311092', 'Primary phone number'),
  ('whatsapp_number', '919840311092', 'WhatsApp number (without +)'),
  ('whatsapp_message', 'Hi AKN! I want to grow my business. I found your website at aspirekineticnetwork.in and I''m interested in your services. Can we connect?', 'Default WhatsApp message'),
  ('address_city', 'Worldwide', 'City'),
  ('address_state', 'Remote First', 'State'),
  ('instagram_url', '', 'Instagram profile URL'),
  ('linkedin_url', '', 'LinkedIn page URL'),
  ('twitter_url', '', 'Twitter/X profile URL'),
  ('hiring_enabled', 'false', 'Master toggle for careers page (true = show openings, false = coming soon)')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- PAGE VIEWS TABLE (lightweight analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily aggregation view for dashboard
CREATE OR REPLACE VIEW page_views_daily AS
SELECT
  DATE(created_at) as date,
  path,
  COUNT(*) as views
FROM page_views
GROUP BY DATE(created_at), path
ORDER BY date DESC, views DESC;

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  icon TEXT,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with current 7 services (skip if already inserted)
INSERT INTO services (title, description, details, display_order, is_published)
SELECT * FROM (VALUES
  ('Web Presence', 'Your website is your hardest-working employee. We build clean, fast, conversion-focused websites that represent your business 24/7. Currently free for our first five clients.', 'Includes custom design, mobile optimization, fast loading speeds, and basic SEO setup to ensure your business makes a strong first impression online.', 0, true),
  ('Local SEO', 'When someone in your city searches for what you offer, you should appear. We optimize your Google presence so the right people find you first.', 'We focus on local keyword research, on-page optimization, and building local citations to improve your ranking in local search results.', 1, true),
  ('Google Business Profile', 'Your GMB listing is often the first thing a customer sees. We set it up, optimize it, and keep it working.', 'Complete profile setup, regular post updates, review management, and performance tracking to maximize your local visibility.', 2, true),
  ('Social Media Presence', 'Consistent, on-brand content that builds trust and keeps your audience engaged — without you having to think about it.', 'Strategic content creation, community management, and targeted campaigns across platforms like Instagram, Facebook, and LinkedIn.', 3, true),
  ('Content Strategy', 'Random posting doesn''t work. We build a content plan tied to your business goals and your audience''s actual behaviour.', 'In-depth audience research, content calendar creation, and performance analysis to ensure every piece of content drives results.', 4, true),
  ('Growth Consulting', 'Monthly strategy sessions to review what''s working, what isn''t, and where to push next.', 'Data-driven insights, competitive analysis, and actionable recommendations to continuously scale your digital presence.', 5, true),
  ('Interactive Web Experiences', 'Engage your visitors with dynamic, interactive elements that keep them on your site longer.', 'Custom animations, 3D elements, parallax scrolling, and interactive tools designed to increase user engagement and conversion rates.', 6, true)
) AS v(title, description, details, display_order, is_published)
WHERE NOT EXISTS (SELECT 1 FROM services LIMIT 1);

-- ============================================
-- CAREERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS careers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  type TEXT DEFAULT 'full-time' CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
  location TEXT DEFAULT 'Remote',
  description TEXT NOT NULL,
  requirements TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers first if they exist, then recreate
DROP TRIGGER IF EXISTS testimonials_updated_at ON testimonials;
CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS works_updated_at ON works;
CREATE TRIGGER works_updated_at
  BEFORE UPDATE ON works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS insights_updated_at ON insights;
CREATE TRIGGER insights_updated_at
  BEFORE UPDATE ON insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS services_updated_at ON services;
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS careers_updated_at ON careers;
CREATE TRIGGER careers_updated_at
  BEFORE UPDATE ON careers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first to avoid "already exists" errors
DO $$
BEGIN
  -- Testimonials
  DROP POLICY IF EXISTS "Public can read published testimonials" ON testimonials;
  DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
  -- Works
  DROP POLICY IF EXISTS "Public can read published works" ON works;
  DROP POLICY IF EXISTS "Admins can manage works" ON works;
  -- Insights
  DROP POLICY IF EXISTS "Public can read published insights" ON insights;
  DROP POLICY IF EXISTS "Admins can manage insights" ON insights;
  -- Contact submissions
  DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
  DROP POLICY IF EXISTS "Admins can manage submissions" ON contact_submissions;
  -- Newsletter
  DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
  DROP POLICY IF EXISTS "Admins can manage subscribers" ON newsletter_subscribers;
  -- Site settings
  DROP POLICY IF EXISTS "Public can read settings" ON site_settings;
  DROP POLICY IF EXISTS "Admins can manage settings" ON site_settings;
  -- Page views
  DROP POLICY IF EXISTS "Anyone can log page view" ON page_views;
  DROP POLICY IF EXISTS "Admins can read analytics" ON page_views;
  -- Services
  DROP POLICY IF EXISTS "Public can read published services" ON services;
  DROP POLICY IF EXISTS "Admins can manage services" ON services;
  -- Careers
  DROP POLICY IF EXISTS "Public can read published careers" ON careers;
  DROP POLICY IF EXISTS "Admins can manage careers" ON careers;
  -- Storage
  DROP POLICY IF EXISTS "Public can read testimonial images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can upload testimonial images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete testimonial images" ON storage.objects;
  DROP POLICY IF EXISTS "Public can read work images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can upload work images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete work images" ON storage.objects;
  DROP POLICY IF EXISTS "Public can read insight images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can upload insight images" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete insight images" ON storage.objects;
END $$;

-- Public can read published content
CREATE POLICY "Public can read published testimonials" ON testimonials
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published works" ON works
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read published insights" ON insights
  FOR SELECT USING (is_published = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage works" ON works
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage insights" ON insights
  FOR ALL USING (auth.role() = 'authenticated');

-- Contact submissions — public can insert, admins can read/manage
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage submissions" ON contact_submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter — public can insert, admins can read/manage
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage subscribers" ON newsletter_subscribers
  FOR ALL USING (auth.role() = 'authenticated');

-- Site settings — public can read, admins can update
CREATE POLICY "Public can read settings" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Page views — public can insert (tracking), admins can read
CREATE POLICY "Anyone can log page view" ON page_views
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read analytics" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- Services — public can read published, admins can manage
CREATE POLICY "Public can read published services" ON services
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- Careers — public can read published, admins can manage
CREATE POLICY "Public can read published careers" ON careers
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage careers" ON careers
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets for images (skip if already exist)
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonials', 'testimonials', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('works', 'works', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('insights', 'insights', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies - public read, authenticated write
CREATE POLICY "Public can read testimonial images" ON storage.objects
  FOR SELECT USING (bucket_id = 'testimonials');

CREATE POLICY "Admins can upload testimonial images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'testimonials' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete testimonial images" ON storage.objects
  FOR DELETE USING (bucket_id = 'testimonials' AND auth.role() = 'authenticated');

CREATE POLICY "Public can read work images" ON storage.objects
  FOR SELECT USING (bucket_id = 'works');

CREATE POLICY "Admins can upload work images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'works' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete work images" ON storage.objects
  FOR DELETE USING (bucket_id = 'works' AND auth.role() = 'authenticated');

CREATE POLICY "Public can read insight images" ON storage.objects
  FOR SELECT USING (bucket_id = 'insights');

CREATE POLICY "Admins can upload insight images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'insights' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete insight images" ON storage.objects
  FOR DELETE USING (bucket_id = 'insights' AND auth.role() = 'authenticated');

-- ============================================
-- WEB VITALS TABLE (Core Web Vitals tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS web_vitals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  value FLOAT NOT NULL,
  rating TEXT,
  path TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE web_vitals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can log vitals" ON web_vitals;
  DROP POLICY IF EXISTS "Admins can read vitals" ON web_vitals;
END $$;

CREATE POLICY "Anyone can log vitals" ON web_vitals
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read vitals" ON web_vitals
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- MEDIA STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
  ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read media" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
END $$;

CREATE POLICY "Public can read media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admins can upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Admins can delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- ============================================
-- EMAIL DIGESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_digests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipient_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_digest_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  digest_id UUID REFERENCES email_digests(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  error TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE email_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_digest_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage digests" ON email_digests;
  DROP POLICY IF EXISTS "Admins can manage digest logs" ON email_digest_logs;
END $$;

CREATE POLICY "Admins can manage digests" ON email_digests
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage digest logs" ON email_digest_logs
  FOR ALL USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS email_digests_updated_at ON email_digests;
CREATE TRIGGER email_digests_updated_at
  BEFORE UPDATE ON email_digests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- CLIENT PORTAL TABLES
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage clients" ON clients;
  DROP POLICY IF EXISTS "Clients can read own profile" ON clients;
  DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
  DROP POLICY IF EXISTS "Clients can read own projects" ON projects;
  DROP POLICY IF EXISTS "Admins can manage milestones" ON project_milestones;
  DROP POLICY IF EXISTS "Clients can read own milestones" ON project_milestones;
  DROP POLICY IF EXISTS "Admins can manage updates" ON project_updates;
  DROP POLICY IF EXISTS "Clients can read own updates" ON project_updates;
END $$;

-- Admin full access
CREATE POLICY "Admins can manage clients" ON clients
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage milestones" ON project_milestones
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage updates" ON project_updates
  FOR ALL USING (auth.role() = 'authenticated');

-- Client access: read only their own data
CREATE POLICY "Clients can read own profile" ON clients
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Clients can read own projects" ON projects
  FOR SELECT USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Clients can read own milestones" ON project_milestones
  FOR SELECT USING (project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())));
CREATE POLICY "Clients can read own updates" ON project_updates
  FOR SELECT USING (is_public = true AND project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())));

DROP TRIGGER IF EXISTS clients_updated_at ON clients;
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
