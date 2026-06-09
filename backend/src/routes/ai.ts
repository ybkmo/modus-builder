import { Router } from 'express';

const router = Router();

const keywordBlocks: Record<string, any> = {
  hero: {
    type: 'hero',
    content: {
      title: 'Welcome to Our World',
      subtitle: 'Crafting digital experiences that matter',
      cta: 'Get Started'
    }
  },
  navbar: {
    type: 'navbar',
    content: {
      logo: 'Brand',
      links: ['Home', 'About', 'Services', 'Contact']
    }
  },
  pricing: {
    type: 'pricing',
    content: {
      plans: [
        { name: 'Basic', price: '$9/mo', features: ['1 site', 'Email support'] },
        { name: 'Pro', price: '$29/mo', features: ['10 sites', 'Priority support'] },
        { name: 'Enterprise', price: '$99/mo', features: ['Unlimited', '24/7 phone support'] }
      ]
    }
  },
  form: {
    type: 'form',
    content: {
      title: 'Contact Us',
      fields: ['Full Name', 'Email', 'Phone', 'Message'],
      button: 'Send Message'
    }
  },
  gallery: {
    type: 'gallery',
    content: {
      title: 'Our Work',
      images: [
        { src: 'https://picsum.photos/400/300?random=1', caption: 'Project Alpha' },
        { src: 'https://picsum.photos/400/300?random=2', caption: 'Project Beta' },
        { src: 'https://picsum.photos/400/300?random=3', caption: 'Project Gamma' }
      ]
    }
  },
  features: {
    type: 'features',
    content: {
      title: 'Why Choose Us',
      items: [
        { icon: 'zap', title: 'Fast', description: 'Lightning quick performance' },
        { icon: 'shield', title: 'Secure', description: 'Enterprise-grade security' },
        { icon: 'heart', title: 'Loved', description: '99% customer satisfaction' }
      ]
    }
  },
  stats: {
    type: 'stats',
    content: {
      figures: [
        { label: 'Users', value: '12,000+' },
        { label: 'Projects', value: '8,500+' },
        { label: 'Countries', value: '45+' },
        { label: 'Uptime', value: '99.99%' }
      ]
    }
  },
  testimonials: {
    type: 'testimonials',
    content: {
      quotes: [
        { name: 'Sarah L.', role: 'CEO', text: 'Transformed our online presence completely.' },
        { name: 'James M.', role: 'CTO', text: 'The best platform we have ever used.' }
      ]
    }
  }
};

const keywords = Object.keys(keywordBlocks);

router.post('/generate', (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const lower = prompt.toLowerCase();
  const matched = keywords.filter((k) => lower.includes(k));

  const blocks = matched.length > 0
    ? matched.map((k) => keywordBlocks[k])
    : [keywordBlocks.hero, keywordBlocks.features, keywordBlocks.form];

  setTimeout(() => {
    return res.json({ blocks });
  }, 800);
});

export default router;
