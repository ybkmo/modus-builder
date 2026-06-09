import Image from 'next/image'

interface ProjectCardProps {
  title: string
  lastEdited: string
  thumbnail: string
}

export default function ProjectCard({ title, lastEdited, thumbnail }: ProjectCardProps) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/30 overflow-hidden hover:border-accent transition">
      <div className="relative aspect-video bg-gray-800">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-xs text-gray-500">Last edited {lastEdited}</p>
      </div>
    </div>
  )
}
