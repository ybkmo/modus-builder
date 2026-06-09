'use client'

import { useState, useCallback } from 'react'
import { createPreview, getPreviewUrl } from '@/lib/preview'
import { Share2, Loader2, CheckCircle } from 'lucide-react'

interface PreviewButtonProps {
  blocks: Array<{ id: string; type: string; props: Record<string, unknown> }>
}

export default function PreviewButton({ blocks }: PreviewButtonProps) {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async () => {
    if (blocks.length === 0) {
      alert('Add some blocks before sharing a preview.')
      return
    }
    setLoading(true)
    try {
      const id = await createPreview(blocks)
      const url = getPreviewUrl(id)
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (e) {
      console.error(e)
      alert('Failed to create preview link.')
    } finally {
      setLoading(false)
    }
  }, [blocks])

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="rounded-md bg-gray-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition inline-flex items-center gap-1 disabled:opacity-50"
      title="Share Preview URL"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : copied ? (
        <CheckCircle className="h-3.5 w-3.5" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      {copied ? 'Copied!' : 'Share Preview'}
    </button>
  )
}
