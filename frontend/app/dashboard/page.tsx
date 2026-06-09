'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/ui/Header'
import ProjectCard from '@/components/ui/ProjectCard'
import Link from 'next/link'
import { templates } from '@/data/templates'
import { Layout, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <main>
      <Header />

      {/* Templates Section */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Templates</h1>
          <Link
            href="/templates"
            className="inline-flex items-center text-sm font-medium text-accent hover:text-blue-400 transition"
          >
            Browse all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
          <Link
            href="/templates"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 p-8 hover:border-accent transition"
          >
            <Layout className="h-8 w-8 text-gray-500 mb-2" />
            <span className="text-sm font-medium text-gray-400">Browse templates</span>
          </Link>
        </div>
      </section>

      {/* Projects Section */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>
          <Link
            href="/editor/new"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition"
          >
            New Project
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Link
            href="/editor/new"
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 p-8 hover:border-accent transition"
          >
            <span className="text-4xl text-gray-500 mb-2">+</span>
            <span className="text-sm font-medium text-gray-400">Create New Project</span>
          </Link>
          <ProjectCard title="Agency Landing" lastEdited="2 hours ago" />
          <ProjectCard title="SaaS Demo" lastEdited="Yesterday" />
        </div>
      </section>
    </main>
  )
}

function TemplateCard({ template }: { template: typeof templates[number] }) {
  const router = useRouter()
  const initial = template.name.charAt(0).toUpperCase()

  const handleClick = () => {
    try {
      localStorage.setItem('modus-selected-template', template.id)
    } catch {
      // ignore
    }
    router.push(`/editor/new?template=${template.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className="text-left rounded-lg border border-gray-800 bg-gray-900/30 overflow-hidden hover:border-accent transition focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      <div className={`relative aspect-video bg-gradient-to-br ${template.thumbnail} flex items-center justify-center`}>
        <span className="text-5xl font-bold text-white/30 select-none">{initial}</span>
        <span className="absolute top-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/90 uppercase tracking-wide">
          {template.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-1">{template.name}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{template.description}</p>
      </div>
    </button>
  )
}
