'use client'

import { useCallback } from 'react'
import { Type, Image, Square, MousePointerClick, FormInput, MoveVertical, DollarSign, MessageSquareQuote, HelpCircle, Grid3X3, Play } from 'lucide-react'

const BLOCK_TYPES = [
  { type: 'hero', label: 'Hero', icon: Square },
  { type: 'text', label: 'Text', icon: Type },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'button', label: 'Button', icon: MousePointerClick },
  { type: 'form', label: 'Form', icon: FormInput },
  { type: 'spacer', label: 'Spacer', icon: MoveVertical },
  { type: 'pricing_table', label: 'Pricing', icon: DollarSign },
  { type: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { type: 'faq', label: 'FAQ', icon: HelpCircle },
  { type: 'gallery', label: 'Gallery', icon: Grid3X3 },
  { type: 'video', label: 'Video', icon: Play },
]

interface BlockToolbarProps {
  onAddBlock: (type: string) => void
}

export default function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
  const handleDragStart = useCallback((e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('blockType', type)
    e.dataTransfer.effectAllowed = 'copy'
  }, [])

  return (
    <aside className="w-16 md:w-56 flex-shrink-0 border-r border-gray-800 bg-gray-900 flex flex-col">
      <div className="px-3 py-3 border-b border-gray-800 text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:block">
        Blocks
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            onClick={() => onAddBlock(type)}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
