'use client'

import { useCallback } from 'react'

interface PageBlock {
  id: string
  type: string
  props: Record<string, unknown>
}

interface CanvasProps {
  blocks: PageBlock[]
  onUpdateBlock: (id: string, props: Record<string, unknown>) => void
  onRemoveBlock: (id: string) => void
  onDropBlock: (type: string) => void
}

export default function Canvas({ blocks, onUpdateBlock, onRemoveBlock, onDropBlock }: CanvasProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('blockType')
      if (type) {
        onDropBlock(type)
      }
    },
    [onDropBlock]
  )

  return (
    <div
      className="flex-1 overflow-y-auto bg-background p-6"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mx-auto max-w-3xl space-y-4 min-h-full">
        {blocks.length === 0 && (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-800 py-24 text-gray-600">
            Drag blocks from the sidebar or use AI Assistant
          </div>
        )}
        {blocks.map((block) => (
          <PageBlockRenderer
            key={block.id}
            block={block}
            onUpdate={onUpdateBlock}
            onRemove={onRemoveBlock}
          />
        ))}
      </div>
    </div>
  )
}

function PageBlockRenderer({
  block,
  onUpdate,
  onRemove,
}: {
  block: PageBlock
  onUpdate: (id: string, props: Record<string, unknown>) => void
  onRemove: (id: string) => void
}) {
  const { id, type, props } = block

  const wrapper = (children: React.ReactNode) => (
    <div className="group relative rounded-lg border border-gray-800 bg-gray-900/40 p-4 hover:border-gray-700 transition">
      <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
        <button
          onClick={() => onRemove(id)}
          className="rounded bg-red-600/80 px-2 py-1 text-[10px] font-medium text-white hover:bg-red-600"
        >
          Remove
        </button>
      </div>
      {children}
    </div>
  )

  switch (type) {
    case 'hero':
      return wrapper(
        <div className={`text-${String(props.align || 'center')}`}>
          <h2 className="text-2xl font-bold">{String(props.title || 'Hero')}</h2>
          <p className="text-gray-400 mt-1">{String(props.subtitle || '')}</p>
        </div>
      )
    case 'text':
      return wrapper(
        <p className={`text-${String(props.align || 'left')} text-gray-300 leading-relaxed`}>
          {String(props.content || '')}
        </p>
      )
    case 'image':
      return wrapper(
        <img
          src={String(props.src || '')}
          alt={String(props.alt || '')}
          className="rounded-md"
          style={{ width: String(props.width || '100%'), display: 'block' }}
        />
      )
    case 'button':
      return wrapper(
        <div className="text-center">
          <a
            href={String(props.url || '#')}
            className="inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition"
          >
            {String(props.label || 'Button')}
          </a>
        </div>
      )
    case 'form':
      return wrapper(
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          {(Array.isArray(props.fields) ? props.fields : []).map((field: string) => (
            <label key={field} className="block text-sm text-gray-300">
              {field}
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
              />
            </label>
          ))}
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition"
          >
            {String(props.submitLabel || 'Submit')}
          </button>
        </form>
      )
    case 'spacer':
      return wrapper(<div style={{ height: Number(props.height || 40) }} />)
    default:
      return wrapper(
        <div className="text-xs text-gray-500">Unknown block type: {type}</div>
      )
  }
}
