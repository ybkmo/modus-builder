'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { fetchPreview } from '@/lib/preview'

interface PageBlock {
  id: string
  type: string
  props: Record<string, unknown>
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function StaticBlockRenderer({ block }: { block: PageBlock }) {
  const { type, props } = block

  switch (type) {
    case 'hero':
      return (
        <section
          className={`px-6 py-16 text-${String(props?.align || 'center')}`}
          style={{ background: '#0a0a0a' }}
        >
          <h1 className="text-4xl font-bold text-white mb-3">
            {String(props?.title || 'Hero')}
          </h1>
          <p className="text-lg text-gray-400">
            {String(props?.subtitle || '')}
          </p>
        </section>
      )
    case 'text':
      return (
        <section className="px-6 py-6" style={{ background: '#030303' }}>
          <p
            className={`text-${String(props?.align || 'left')} text-gray-300 leading-relaxed`}
          >
            {String(props?.content || '')}
          </p>
        </section>
      )
    case 'image': {
      const imageSrc = String(props?.src || '')
      return (
        <section className="px-6 py-6" style={{ background: '#030303' }}>
          {isValidUrl(imageSrc) ? (
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
          )}
        </section>
      )
    }
    case 'button':
      return (
        <section className="px-6 py-6 text-center" style={{ background: '#030303' }}>
          <a
            href={String(props?.url || '#')}
            className="inline-block rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition"
          >
            {String(props?.label || 'Button')}
          </a>
        </section>
      )
    case 'form':
      return (
        <section className="px-6 py-6" style={{ background: '#0a0a0a' }}>
          <form
            className="flex flex-col gap-3 max-w-lg mx-auto"
            noValidate
            onSubmit={(e) => e.preventDefault()}
          >
            {(Array.isArray(props?.fields) ? props.fields : []).map((field: string) => {
              const fieldId = `field-${field.toLowerCase().replace(/\s+/g, '-')}`
              return (
                <label key={field} htmlFor={fieldId} className="flex flex-col gap-1.5 text-sm text-gray-300">
                  {field}
                  <input
                    id={fieldId}
                    name={field}
                    type="text"
                    required
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-600 focus:outline-none"
                  />
                </label>
              )
            })}
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
            >
              {String(props?.submitLabel || 'Submit')}
            </button>
          </form>
        </section>
      )
    case 'spacer':
      return (
        <div
          className="w-full"
          style={{ height: Number(props?.height || 40), background: '#030303' }}
        />
      )
    default:
      return (
        <div className="px-6 py-4 text-xs text-gray-500">
          Unknown block type: {type}
        </div>
      )
  }
}

export default function PreviewPage() {
  const { id } = useParams() as { id: string }
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchPreview(id)
      .then((data) => {
        setBlocks(data)
        setError(null)
      })
      .catch((e) => {
        setError(e.message || 'Preview not found')
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans">
      <div className="sticky top-0 z-50 bg-blue-600 text-white text-center text-sm py-2 px-4">
        This is a preview. Build your own at{' '}
        <Link href="/" className="font-semibold underline hover:text-blue-100 transition">
          MODUS Builder
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-32 text-gray-500">
          Loading preview…
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-4">
          <p>{error}</p>
          <Link
            href="/"
            className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
          >
            Back to Home
          </Link>
        </div>
      )}

      {!loading && !error && blocks.length === 0 && (
        <div className="flex items-center justify-center py-32 text-gray-500">
          Nothing to preview.
        </div>
      )}

      {!loading && !error && blocks.length > 0 && (
        <div className="max-w-3xl mx-auto">
          {blocks.map((block) => (
            <StaticBlockRenderer key={block.id} block={block} />
          ))}
        </div>
      )}
    </div>
  )
}
