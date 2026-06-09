'use client'

import { useCallback, memo } from 'react'

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
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export default function Canvas({ blocks, onUpdateBlock: _onUpdateBlock, onRemoveBlock, onDropBlock, onUndo, onRedo, canUndo, canRedo }: CanvasProps) {
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
            onRemove={onRemoveBlock}
          />
        ))}
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900/90 border border-gray-800 rounded-md px-2 py-1.5 shadow-lg z-10">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-2 py-1 text-xs font-medium text-gray-300 rounded hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Undo (Ctrl+Z)"
        >
          Undo
        </button>
        <div className="w-px h-3 bg-gray-700" />
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="px-2 py-1 text-xs font-medium text-gray-300 rounded hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          title="Redo (Ctrl+Y)"
        >
          Redo
        </button>
      </div>
    </div>
  )
}

const PageBlockRenderer = memo(function PageBlockRenderer({
  block,
  onRemove,
}: {
  block: PageBlock
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

  function isValidUrl(value: string): boolean {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  switch (type) {
    case 'hero':
      return wrapper(
        <div className={`text-${String(props?.align || 'center')}`}>
          <h2 className="text-2xl font-bold">{String(props?.title || 'Hero')}</h2>
          <p className="text-gray-400 mt-1">{String(props?.subtitle || '')}</p>
        </div>
      )
    case 'text':
      return wrapper(
        <p className={`text-${String(props?.align || 'left')} text-gray-300 leading-relaxed`}>
          {String(props?.content || '')}
        </p>
      )
    case 'image': {
      const imageSrc = String(props?.src || '')
      return wrapper(
        isValidUrl(imageSrc) ? (
          <img
            src={imageSrc}
            alt={String(props?.alt || '')}
            className="rounded-md"
            style={{ width: String(props?.width || '100%'), display: 'block' }}
          />
        ) : (
          <div className="rounded-md border border-gray-700 bg-gray-800 p-4 text-center text-sm text-gray-400">
            Invalid image URL
          </div>
        )
      )
    }
    case 'button':
      return wrapper(
        <div className="text-center">
          <a
            href={String(props?.url || '#')}
            className="inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition"
          >
            {String(props?.label || 'Button')}
          </a>
        </div>
      )
    case 'form':
      return wrapper(
        <form className="space-y-3" noValidate onSubmit={(e) => e.preventDefault()}>
          {(Array.isArray(props?.fields) ? props.fields : []).map((field: string) => {
            const fieldId = `field-${field.toLowerCase().replace(/\s+/g, '-')}`
            return (
              <label key={field} htmlFor={fieldId} className="block text-sm text-gray-300">
                {field}
                <input
                  id={fieldId}
                  name={field}
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                />
              </label>
            )
          })}
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition"
          >
            {String(props?.submitLabel || 'Submit')}
          </button>
        </form>
      )
    case 'spacer':
      return wrapper(<div style={{ height: Number(props?.height || 40) }} />)
    case 'pricing_table': {
      const tiers = Array.isArray(props?.tiers) ? props.tiers : [
        { name: 'Basic', price: '$9/mo', features: ['1 site', 'Email support'], cta: 'Choose Basic' },
        { name: 'Pro', price: '$29/mo', features: ['10 sites', 'Priority support'], cta: 'Choose Pro' },
        { name: 'Enterprise', price: '$99/mo', features: ['Unlimited', '24/7 phone support'], cta: 'Contact Sales' }
      ]
      return wrapper(
        <div className="space-y-3">
          <h3 className="text-center text-lg font-semibold text-white">{String(props?.title || 'Pricing')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiers.map((tier: any, i: number) => (
              <div key={i} className="rounded-md border border-gray-700 bg-gray-800/50 p-4 text-center">
                <div className="text-sm font-medium text-gray-400">{tier.name}</div>
                <div className="text-2xl font-bold text-white my-2">{tier.price}</div>
                <ul className="space-y-1 mb-4">
                  {(Array.isArray(tier.features) ? tier.features : []).map((f: string, fi: number) => (
                    <li key={fi} className="text-xs text-gray-400">• {f}</li>
                  ))}
                </ul>
                <button className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition">
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'testimonials': {
      const quotes = Array.isArray(props?.quotes) ? props.quotes : [
        { name: 'Sarah L.', role: 'CEO', text: 'Transformed our online presence completely.' },
        { name: 'James M.', role: 'CTO', text: 'The best platform we have ever used.' }
      ]
      return wrapper(
        <div className="space-y-3">
          <h3 className="text-center text-lg font-semibold text-white">{String(props?.title || 'Testimonials')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quotes.map((q: any, i: number) => (
              <div key={i} className="rounded-md border border-gray-700 bg-gray-800/50 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                    {String(q.name || '').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{q.name}</div>
                    <div className="text-xs text-gray-500">{q.role}</div>
                  </div>
                </div>
                <p className="text-sm italic text-gray-300">{`"${q.text}"`}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'faq': {
      const items = Array.isArray(props?.items) ? props.items : [
        { question: 'What is included?', answer: 'Everything you need to get started.' },
        { question: 'How do I contact support?', answer: 'Email us anytime at support@example.com.' }
      ]
      return wrapper(
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{String(props?.title || 'FAQ')}</h3>
          {items.map((item: any, i: number) => (
            <details key={i} className="rounded-md border border-gray-700 bg-gray-800/30">
              <summary className="cursor-pointer select-none px-4 py-2 text-sm font-medium text-gray-300 hover:text-white">
                {item.question}
              </summary>
              <div className="px-4 pb-3 text-sm text-gray-400 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      )
    }
    case 'gallery': {
      const images = Array.isArray(props?.images) ? props.images : [
        { src: 'https://picsum.photos/400/300?random=1', caption: 'Image 1' },
        { src: 'https://picsum.photos/400/300?random=2', caption: 'Image 2' },
        { src: 'https://picsum.photos/400/300?random=3', caption: 'Image 3' },
        { src: 'https://picsum.photos/400/300?random=4', caption: 'Image 4' }
      ]
      return wrapper(
        <div className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img: any, i: number) => (
              <div key={i} className="rounded-md border border-gray-700 bg-gray-800/30 overflow-hidden">
                {isValidUrl(String(img.src || '')) ? (
                  <img src={img.src} alt={String(img.caption || '')} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                    Invalid URL
                  </div>
                )}
                {img.caption && <div className="px-2 py-1 text-xs text-gray-500 text-center truncate">{img.caption}</div>}
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'video': {
      const src = String(props?.src || '')
      const valid = isValidUrl(src)
      const isDirectVideo = valid && (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.ogg'))
      return wrapper(
        <div className="space-y-2">
          {valid && isDirectVideo ? (
            <video controls className="w-full rounded-md border border-gray-700" src={src} />
          ) : valid ? (
            <div className="relative w-full aspect-video rounded-md overflow-hidden border border-gray-700">
              <iframe src={src} title={String(props?.title || 'Video')} className="w-full h-full" allowFullScreen />
            </div>
          ) : (
            <div className="relative w-full aspect-video rounded-md overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="h-5 w-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          )}
          {props?.caption ? (
            <p className="text-center text-xs text-gray-500">{String(props.caption)}</p>
          ) : null}
        </div>
      )
    }
    default:
      return wrapper(
        <div className="text-xs text-gray-500">Unknown block type: {type}</div>
      )
  }
})
