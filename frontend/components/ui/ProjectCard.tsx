interface ProjectCardProps {
  title: string
  lastEdited: string
  thumbnail?: string
}

const GRADIENTS = [
  'from-blue-600 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
]

function getGradient(title: string): string {
  let hash = 0
  for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash)
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

export default function ProjectCard({ title, lastEdited }: ProjectCardProps) {
  const initial = title.charAt(0).toUpperCase()
  const gradient = getGradient(title)

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/30 overflow-hidden hover:border-accent transition cursor-pointer">
      <div className={`relative aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-5xl font-bold text-white/30 select-none">{initial}</span>
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-xs text-gray-500">Last edited {lastEdited}</p>
      </div>
    </div>
  )
}
