export interface TemplateBlock {
  id: string
  type: string
  props: Record<string, unknown>
}

export interface Template {
  id: string
  name: string
  category: string
  description: string
  thumbnail: string // gradient class
  blocks: TemplateBlock[]
}

const GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
]

export const CATEGORIES = ['agency', 'portfolio', 'saas', 'event', 'restaurant']

export function getGradient(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

export const templates: Template[] = [
  {
    id: 'agency',
    name: 'Digital Agency Landing',
    category: 'agency',
    description: 'A bold landing page tailored for digital agencies with hero, features, pricing, and contact sections.',
    thumbnail: getGradient('Digital Agency Landing'),
    blocks: [
      { id: 'hero-1', type: 'hero', props: { title: 'We Build Digital Experiences', subtitle: 'Crafting websites that convert visitors into customers.', align: 'center' } },
      { id: 'features-1', type: 'text', props: { content: 'Services: Branding, Web Design, Development, and Marketing.', align: 'left' } },
      { id: 'pricing-1', type: 'button', props: { label: 'View Pricing', url: '#pricing', variant: 'primary' } },
      { id: 'contact-1', type: 'form', props: { fields: ['Name', 'Email', 'Message'], submitLabel: 'Send Message' } },
    ],
  },
  {
    id: 'portfolio',
    name: 'Creative Portfolio',
    category: 'portfolio',
    description: 'Showcase your work with a gorgeous portfolio template: hero, gallery, about, and contact.',
    thumbnail: getGradient('Creative Portfolio'),
    blocks: [
      { id: 'hero-2', type: 'hero', props: { title: 'Hi, I am a Creative Developer', subtitle: 'I design and build interfaces that people love.', align: 'left' } },
      { id: 'gallery-2', type: 'image', props: { src: 'https://picsum.photos/800/400?random=portfolio', alt: 'Selected Work', width: '100%' } },
      { id: 'about-2', type: 'text', props: { content: 'With over 5 years of experience creating digital products, I specialize in clean, accessible UI.', align: 'left' } },
      { id: 'contact-2', type: 'form', props: { fields: ['Name', 'Email'], submitLabel: 'Get in Touch' } },
    ],
  },
  {
    id: 'saas',
    name: 'SaaS Product Page',
    category: 'saas',
    description: 'Launch your SaaS faster with hero, features, pricing, testimonials, and a strong CTA.',
    thumbnail: getGradient('SaaS Product Page'),
    blocks: [
      { id: 'hero-3', type: 'hero', props: { title: 'Ship Faster with Modus', subtitle: 'The all-in-one platform for building and deploying websites.', align: 'center' } },
      { id: 'features-3', type: 'text', props: { content: 'AI-powered blocks, instant deploys, built-in analytics, and custom domains.', align: 'center' } },
      { id: 'pricing-3', type: 'button', props: { label: 'Start Free Trial', url: '#signup', variant: 'primary' } },
      { id: 'testimonials-3', type: 'text', props: { content: '"Modus cut our launch time by 80%." — Sarah L., CEO', align: 'center' } },
      { id: 'cta-3', type: 'button', props: { label: 'Get Started', url: '#signup', variant: 'primary' } },
    ],
  },
  {
    id: 'event',
    name: 'Event Page',
    category: 'event',
    description: 'Promote your next event with a hero, schedule, speakers, and registration form.',
    thumbnail: getGradient('Event Page'),
    blocks: [
      { id: 'hero-4', type: 'hero', props: { title: 'ModusConf 2024', subtitle: 'Join 2,000+ developers in San Francisco.', align: 'center' } },
      { id: 'schedule-4', type: 'text', props: { content: 'Day 1: Keynotes & Workshops. Day 2: Panels & Networking.', align: 'left' } },
      { id: 'speakers-4', type: 'image', props: { src: 'https://picsum.photos/800/300?random=event', alt: 'Speakers', width: '100%' } },
      { id: 'register-4', type: 'form', props: { fields: ['Full Name', 'Email', 'Company'], submitLabel: 'Register' } },
    ],
  },
  {
    id: 'restaurant',
    name: 'Restaurant Page',
    category: 'restaurant',
    description: 'A tasteful page for restaurants with hero, menu highlights, gallery, and reservation form.',
    thumbnail: getGradient('Restaurant Page'),
    blocks: [
      { id: 'hero-5', type: 'hero', props: { title: 'Bistro Modus', subtitle: 'Fine dining meets modern comfort.', align: 'center' } },
      { id: 'menu-5', type: 'text', props: { content: 'Chef\'s Specials: Truffle Risotto, Wagyu Steak, Citrus Tart.', align: 'left' } },
      { id: 'gallery-5', type: 'image', props: { src: 'https://picsum.photos/800/400?random=restaurant', alt: 'Interior & Dishes', width: '100%' } },
      { id: 'reservation-5', type: 'form', props: { fields: ['Name', 'Phone', 'Date', 'Guests'], submitLabel: 'Book a Table' } },
    ],
  },
]

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id)
}
