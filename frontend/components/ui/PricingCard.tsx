import { Check } from 'lucide-react'

interface PricingCardProps {
  tier: string
  price: string
  features: string[]
  highlighted?: boolean
}

export default function PricingCard({ tier, price, features, highlighted }: PricingCardProps) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        highlighted
          ? 'border-accent bg-gray-900/50'
          : 'border-gray-800 bg-gray-900/30'
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">{tier}</h3>
      <div className="text-3xl font-bold mb-4">
        {price}
        <span className="text-sm font-normal text-gray-400">/mo</span>
      </div>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
            <Check className="h-4 w-4 text-accent" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}
