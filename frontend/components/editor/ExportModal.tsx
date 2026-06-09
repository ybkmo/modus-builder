'use client'

import { useState, useCallback } from 'react'
import JSZip from 'jszip'
import { Download, X } from 'lucide-react'

interface ExportModalProps {
  blocks: Array<{ id: string; type: string; props: Record<string, unknown> }>
}

export default function ExportModal({ blocks }: ExportModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleExport = useCallback(async () => {
    setLoading(true)
    const zip = new JSZip()
    const html = renderStaticHtml(blocks)
    zip.file('index.html', html)
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modus-export.zip'
    a.click()
    URL.revokeObjectURL(url)
    setLoading(false)
    setOpen(false)
  }, [blocks])

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

function renderStaticHtml(
  blocks: Array<{ id: string; type: string; props: Record<string, unknown> }>
): string {
  const bodyContent = blocks
    .map((block) => {
      switch (block.type) {
        case 'hero':
          return `\n        <section style="padding:64px 24px;text-align:${escapeHtml(String(block.props.align || 'center'))};background:#0a0a0a">\n          <h1 style="font-size:36px;font-weight:700;color:#fff;margin:0 0 12px">${escapeHtml(String(block.props.title || 'Hero'))}</h1>\n          <p style="font-size:18px;color:#9ca3af;margin:0">${escapeHtml(String(block.props.subtitle || ''))}</p>\n        </section>`
        case 'text':
          return `\n        <section style="padding:24px;text-align:${escapeHtml(String(block.props.align || 'left'))};background:#030303">\n          <p style="font-size:16px;color:#e5e7eb;line-height:1.6;margin:0">${escapeHtml(String(block.props.content || ''))}</p>\n        </section>`
        case 'image':
          return `\n        <section style="padding:24px;background:#030303">\n          <img src="${escapeHtml(String(block.props.src || ''))}" alt="${escapeHtml(String(block.props.alt || ''))}" style="display:block;width:${escapeHtml(String(block.props.width || '100%'))};border-radius:8px" />\n        </section>`
        case 'button':
          return `\n        <section style="padding:24px;text-align:center;background:#030303">\n          <a href="${escapeHtml(String(block.props.url || '#'))}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:6px;text-decoration:none;font-weight:500">${escapeHtml(String(block.props.label || 'Button'))}</a>\n        </section>`
        case 'form':
          return `\n        <section style="padding:24px;background:#0a0a0a">\n          <form style="display:flex;flex-direction:column;gap:12px;max-width:480px;margin:0 auto">\n            ${(Array.isArray(block.props.fields) ? block.props.fields : [])
              .map(
                (field: string) =>
                  `<label style="display:flex;flex-direction:column;gap:6px;color:#e5e7eb;font-size:14px">${escapeHtml(field)}\n              <input type="text" style="padding:10px 12px;border:1px solid #374151;border-radius:6px;background:#111827;color:#fff" />\n            </label>`
              )
              .join('')}\n            <button type="submit" style="padding:12px 24px;background:#3b82f6;color:#fff;border-radius:6px;border:none;font-weight:500;cursor:pointer">${escapeHtml(String(block.props.submitLabel || 'Submit'))}</button>\n          </form>\n        </section>`
        case 'spacer':
          return `\n        <div style="height:${Number(block.props.height || 40)}px;background:#030303"></div>`
        default:
          return ''
      }
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Exported Site</title>
    <style>
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #030303; color: #ffffff; }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body>${bodyContent}
  </body>
</html>`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
