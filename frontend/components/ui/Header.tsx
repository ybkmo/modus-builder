import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <Link href="/" className="text-xl font-bold tracking-tight">
        MODUS
      </Link>
      <nav className="flex items-center gap-6 text-sm text-gray-400">
        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
        <Link href="/" className="hover:text-white transition">Pricing</Link>
      </nav>
    </header>
  )
}
