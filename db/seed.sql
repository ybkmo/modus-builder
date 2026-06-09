-- MODUS Builder Seed Data
-- Run after schema.sql

-- Insert default user (password is 'password' hashed with bcrypt — change in production)
INSERT INTO users (email, password_hash, role)
VALUES ('admin@modus.builder', '$2b$10$examplehashchangeme', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert Free plan
INSERT INTO plans (name, price_monthly, ai_credits, storage_gb)
VALUES ('Free', 0.00, 50, 1)
ON CONFLICT DO NOTHING;

-- Create default project "MODUS Agency"
INSERT INTO projects (name, org_id, user_id, blocks_json)
SELECT 'MODUS Agency', NULL, id, '[
  {
    "type": "hero",
    "props": {
      "title": "Welcome to MODUS Agency",
      "subtitle": "We build digital experiences that matter.",
      "ctaText": "Get Started",
      "ctaLink": "#contact"
    }
  },
  {
    "type": "features",
    "props": {
      "heading": "Our Services",
      "items": [
        { "title": "Web Design", "description": "Stunning, responsive websites." },
        { "title": "Branding", "description": "Identity that resonates." },
        { "title": "Development", "description": "Scalable, modern code." }
      ]
    }
  },
  {
    "type": "testimonials",
    "props": {
      "heading": "What Clients Say",
      "quotes": [
        { "author": "Jane Doe", "text": "MODUS transformed our online presence." }
      ]
    }
  },
  {
    "type": "contact",
    "props": {
      "heading": "Contact Us",
      "email": "hello@modus.agency",
      "phone": "+1 (555) 123-4567"
    }
  }
]'::jsonb
FROM users WHERE email = 'admin@modus.builder'
ON CONFLICT DO NOTHING;

-- Insert default pages for the project
INSERT INTO pages (project_id, name, order_index)
SELECT p.id, 'Home', 0 FROM projects p WHERE p.name = 'MODUS Agency'
ON CONFLICT DO NOTHING;

INSERT INTO pages (project_id, name, order_index)
SELECT p.id, 'About', 1 FROM projects p WHERE p.name = 'MODUS Agency'
ON CONFLICT DO NOTHING;

INSERT INTO pages (project_id, name, order_index)
SELECT p.id, 'Contact', 2 FROM projects p WHERE p.name = 'MODUS Agency'
ON CONFLICT DO NOTHING;

-- Insert default template
INSERT INTO templates (name, category, blocks_json)
VALUES ('Agency Landing', 'agency', '[
  {
    "type": "hero",
    "props": {
      "title": "Welcome to MODUS Agency",
      "subtitle": "We build digital experiences that matter.",
      "ctaText": "Get Started",
      "ctaLink": "#contact"
    }
  },
  {
    "type": "features",
    "props": {
      "heading": "Our Services",
      "items": [
        { "title": "Web Design", "description": "Stunning, responsive websites." },
        { "title": "Branding", "description": "Identity that resonates." },
        { "title": "Development", "description": "Scalable, modern code." }
      ]
    }
  },
  {
    "type": "testimonials",
    "props": {
      "heading": "What Clients Say",
      "quotes": [
        { "author": "Jane Doe", "text": "MODUS transformed our online presence." }
      ]
    }
  },
  {
    "type": "contact",
    "props": {
      "heading": "Contact Us",
      "email": "hello@modus.agency",
      "phone": "+1 (555) 123-4567"
    }
  }
]'::jsonb)
ON CONFLICT DO NOTHING;
