export interface Testimonial {
  id: string;
  client_name: string;
  business_name: string;
  quote: string;
  image_url: string | null;
  rating: number;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  gallery_urls: string[];
  client_name: string | null;
  services_used: string[];
  results: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Insight {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  author: string;
  tags: string[];
  is_published: boolean;
  publish_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  business_name: string | null;
  business_type: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  message: string | null;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  notes: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  name: string | null;
  email: string;
  is_active: boolean;
  source: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

export interface PageView {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  details: string | null;
  icon: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  department: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  description: string;
  requirements: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
