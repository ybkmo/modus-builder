import { Router } from 'express';
import { validate } from '../middleware/validate';
import { generateBlocksSchema } from '../validation';

const router = Router();

// Returns a stable block with id, type, props
function makeBlock(type: string, props: Record<string, unknown>) {
  return { id: crypto.randomUUID(), type, props };
}

const keywordBlocks: Record<string, Record<string, unknown>> = {
  hero: {
    title: 'Welcome to Our World',
    subtitle: 'Crafting digital experiences that matter',
    align: 'center',
  },
  navbar: {
    logo: 'Brand',
    links: ['Home', 'About', 'Services', 'Contact'],
  },
  pricing: {
    title: 'Pricing',
    tiers: [
      { name: 'Basic', price: '$9/mo', features: ['1 site', 'Email support'], cta: 'Choose Basic' },
      { name: 'Pro', price: '$29/mo', features: ['10 sites', 'Priority support'], cta: 'Choose Pro' },
      { name: 'Enterprise', price: '$99/mo', features: ['Unlimited', '24/7 phone support'], cta: 'Contact Sales' },
    ],
  },
  form: {
    fields: ['Full Name', 'Email', 'Phone', 'Message'],
    submitLabel: 'Send Message',
  },
  gallery: {
    images: [
      { src: 'https://picsum.photos/400/300?random=1', caption: 'Project Alpha' },
      { src: 'https://picsum.photos/400/300?random=2', caption: 'Project Beta' },
      { src: 'https://picsum.photos/400/300?random=3', caption: 'Project Gamma' },
    ],
  },
  features: {
    title: 'Why Choose Us',
    items: [
      { icon: 'zap', title: 'Fast', description: 'Lightning quick performance' },
      { icon: 'shield', title: 'Secure', description: 'Enterprise-grade security' },
      { icon: 'heart', title: 'Loved', description: '99% customer satisfaction' },
    ],
  },
  stats: {
    figures: [
      { label: 'Users', value: '12,000+' },
      { label: 'Projects', value: '8,500+' },
      { label: 'Countries', value: '45+' },
      { label: 'Uptime', value: '99.99%' },
    ],
  },
  testimonials: {
    title: 'Testimonials',
    quotes: [
      { name: 'Sarah L.', role: 'CEO', text: 'Transformed our online presence completely.' },
      { name: 'James M.', role: 'CTO', text: 'The best platform we have ever used.' },
    ],
  },
  text: {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    align: 'left',
  },
  button: {
    label: 'Get Started',
    url: '#',
  },
  faq: {
    title: 'FAQ',
    items: [
      { question: 'What is included?', answer: 'Everything you need to get started.' },
      { question: 'How do I contact support?', answer: 'Email us anytime at support@example.com.' },
    ],
  },
  video: {
    src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    caption: 'Demo Video',
    title: 'Video',
  },
};

const singleKeywordMap: Record<string, string> = {
  hero: 'hero',
  navbar: 'navbar',
  pricing: 'pricing_table',
  form: 'form',
  gallery: 'gallery',
  features: 'features',
  stats: 'text',
  testimonials: 'testimonials',
  text: 'text',
  button: 'button',
  faq: 'faq',
  video: 'video',
};

const singleKeywords = Object.keys(singleKeywordMap);

function isFullPageRequest(prompt: string): boolean {
  const p = prompt.toLowerCase();
  const fullPhrases = [
    'create a', 'build a', 'make a', 'generate a',
    'create an', 'build an', 'make an', 'generate an',
    'landing page', 'web page', 'webpage',
    'website for', 'site for', 'page for',
    'full page', 'complete page', 'whole page',
  ];
  return fullPhrases.some((phrase) => p.includes(phrase));
}

function getFullPageBlocks(prompt: string) {
  const p = prompt.toLowerCase();
  // SaaS / tech landing page
  if (p.includes('saas') || p.includes('software') || p.includes('app') || p.includes('product')) {
    return [
      makeBlock('hero', keywordBlocks.hero),
      makeBlock('features', keywordBlocks.features),
      makeBlock('pricing_table', keywordBlocks.pricing),
      makeBlock('testimonials', keywordBlocks.testimonials),
      makeBlock('button', { label: 'Get Started', url: '#signup' }),
      makeBlock('faq', keywordBlocks.faq),
    ];
  }
  // Restaurant / food
  if (p.includes('restaurant') || p.includes('food') || p.includes('cafe') || p.includes('menu')) {
    return [
      makeBlock('hero', { title: 'Taste the Extraordinary', subtitle: 'Fine dining redefined', align: 'center' }),
      makeBlock('text', { content: 'Our restaurant brings locally sourced ingredients together with world-class culinary artistry.', align: 'left' }),
      makeBlock('gallery', {
        images: [
          { src: 'https://picsum.photos/400/300?random=1', caption: 'Signature Dish' },
          { src: 'https://picsum.photos/400/300?random=2', caption: 'Interior' },
          { src: 'https://picsum.photos/400/300?random=3', caption: 'Fresh Ingredients' },
          { src: 'https://picsum.photos/400/300?random=4', caption: 'Our Team' },
        ],
      }),
      makeBlock('form', { fields: ['Name', 'Party Size', 'Date', 'Time'], submitLabel: 'Reserve Table' }),
    ];
  }
  // Portfolio / personal
  if (p.includes('portfolio') || p.includes('personal') || p.includes('resume') || p.includes('cv')) {
    return [
      makeBlock('hero', { title: 'Hello, I\'m a Creator', subtitle: 'Designer & Developer', align: 'center' }),
      makeBlock('gallery', {
        images: [
          { src: 'https://picsum.photos/400/300?random=1', caption: 'Project 1' },
          { src: 'https://picsum.photos/400/300?random=2', caption: 'Project 2' },
          { src: 'https://picsum.photos/400/300?random=3', caption: 'Project 3' },
          { src: 'https://picsum.photos/400/300?random=4', caption: 'Project 4' },
        ],
      }),
      makeBlock('text', { content: 'I craft beautiful digital experiences with a focus on usability and performance.', align: 'left' }),
      makeBlock('form', { fields: ['Name', 'Email', 'Message'], submitLabel: 'Contact Me' }),
    ];
  }
  // E-commerce / shop
  if (p.includes('shop') || p.includes('store') || p.includes('ecommerce') || p.includes('e-commerce')) {
    return [
      makeBlock('hero', { title: 'Shop the Collection', subtitle: 'Curated products for modern living', align: 'center' }),
      makeBlock('gallery', {
        images: [
          { src: 'https://picsum.photos/400/300?random=1', caption: 'New Arrivals' },
          { src: 'https://picsum.photos/400/300?random=2', caption: 'Best Sellers' },
          { src: 'https://picsum.photos/400/300?random=3', caption: 'Sale' },
        ],
      }),
      makeBlock('pricing_table', keywordBlocks.pricing),
      makeBlock('testimonials', keywordBlocks.testimonials),
      makeBlock('button', { label: 'Shop Now', url: '#products' }),
    ];
  }
  // Agency / business general
  if (p.includes('agency') || p.includes('business') || p.includes('company') || p.includes('startup')) {
    return [
      makeBlock('hero', keywordBlocks.hero),
      makeBlock('features', keywordBlocks.features),
      makeBlock('testimonials', keywordBlocks.testimonials),
      makeBlock('form', keywordBlocks.form),
      makeBlock('faq', keywordBlocks.faq),
    ];
  }
  // Blog / content
  if (p.includes('blog') || p.includes('news') || p.includes('magazine')) {
    return [
      makeBlock('hero', { title: 'Stories & Insights', subtitle: 'Thoughts on design, tech, and life', align: 'center' }),
      makeBlock('text', { content: 'Explore our latest articles covering industry trends, tutorials, and behind-the-scenes looks at our creative process.', align: 'left' }),
      makeBlock('gallery', keywordBlocks.gallery),
      makeBlock('form', { fields: ['Email'], submitLabel: 'Subscribe' }),
    ];
  }
  // Event / conference
  if (p.includes('event') || p.includes('conference') || p.includes('meetup') || p.includes('workshop')) {
    return [
      makeBlock('hero', { title: 'Join Us Live', subtitle: 'An event you won\'t forget', align: 'center' }),
      makeBlock('text', { content: 'Connect with industry leaders, attend hands-on workshops, and expand your network.', align: 'left' }),
      makeBlock('video', keywordBlocks.video),
      makeBlock('form', { fields: ['Name', 'Email', 'Company'], submitLabel: 'Register' }),
      makeBlock('faq', keywordBlocks.faq),
    ];
  }
  // Generic fallback full page
  return [
    makeBlock('hero', keywordBlocks.hero),
    makeBlock('text', keywordBlocks.text),
    makeBlock('features', keywordBlocks.features),
    makeBlock('gallery', keywordBlocks.gallery),
    makeBlock('form', keywordBlocks.form),
  ];
}

router.post('/generate', validate(generateBlocksSchema), (req, res) => {
  const { prompt } = req.body;

  if (isFullPageRequest(prompt)) {
    const blocks = getFullPageBlocks(prompt);
    setTimeout(() => res.json({ blocks }), 800);
    return;
  }

  const lower = prompt.toLowerCase();
  const matched = singleKeywords.filter((k) => lower.includes(k));

  const blocks = matched.length > 0
    ? matched.map((k) => makeBlock(singleKeywordMap[k], keywordBlocks[singleKeywordMap[k]]))
    : [makeBlock('hero', keywordBlocks.hero)];

  setTimeout(() => {
    return res.json({ blocks });
  }, 800);
});

export default router;

