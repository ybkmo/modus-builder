'use client'

import { useState, useCallback } from 'react'
import { exportToZIP, downloadZIP } from '@/lib/export'
import { Download, X } from 'lucide-react'

interface ExportModalProps {
  blocks: Array<{ id: string; type: string; props: Record<string, unknown> }>
  onAfterExport?: () => void
}

export default function ExportModal({ blocks, onAfterExport }: ExportModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleExport = useCallback(async () => {
    setLoading(true)
    const blob = await exportToZIP(blocks)
    downloadZIP(blob, 'modus-export.zip')
    setLoading(false)
    setOpen(false)
    onAfterExport?.()
  }, [blocks, onAfterExport])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-gray-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition inline-flex items-center gap-1"
      >
        <Download className="h-3.5 w-3.5" />
        Export
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Export Site</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Download a self-contained ZIP with static HTML/CSS of your current page.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={loading}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Download ZIP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
