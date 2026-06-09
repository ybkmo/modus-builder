import Header from '@/components/ui/Header'
import ProjectCard from '@/components/ui/ProjectCard'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <main>
      <Header />
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
