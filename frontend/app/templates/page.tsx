'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Layout, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { templates, CATEGORIES } from '@/data/templates'

export default function TemplatesPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesQuery =
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'all' || t.category === category
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  const handleSelect = (id: string) => {
    try {
      localStorage.setItem('modus-selected-template', id)
    } catch {
      // ignore
    }
    router.push(`/editor/new?template=${id}`)
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Templates</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search templates..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-gray-800 bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['all', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  category === cat
                    ? 'bg-accent text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <Layout className="h-10 w-10 mx-auto mb-3 text-gray-600" />
            <p className="text-lg font-medium">No templates found</p>
            <p className="text-sm">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template.id)}
                className="text-left rounded-lg border border-gray-800 bg-gray-900/30 overflow-hidden hover:border-accent transition focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <div className={`relative aspect-video bg-gradient-to-br ${template.thumbnail} flex items-center justify-center`}>
                  <span className="text-5xl font-bold text-white/30 select-none">
                    {template.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="absolute top-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/90 uppercase tracking-wide">
                    {template.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
