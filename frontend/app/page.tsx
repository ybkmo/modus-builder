import Header from '@/components/ui/Header'
import PricingCard from '@/components/ui/PricingCard'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Header />
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 md:py-32">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Build websites with <span className="text-accent">AI</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
          MODUS is the fastest way to design, build, and deploy stunning landing pages. Describe what you want, and let AI do the rest.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-blue-600 transition"
        >
          Start Building
        </Link>
      </section>

      <section className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PricingCard
            tier="Free"
            price="$0"
            features={['3 projects', 'Basic blocks', 'Community support']}
          />
          <PricingCard
            tier="Pro"
            price="$19"
            features={['Unlimited projects', 'AI generation', 'Custom domains', 'Priority support']}
            highlighted
          />
          <PricingCard
            tier="Business"
            price="$49"
            features={['Team collaboration', 'SSO', 'Advanced analytics', 'Dedicated support']}
          />
        </div>
      </section>
    </main>
  )
}
