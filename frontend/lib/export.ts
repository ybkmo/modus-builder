import JSZip from 'jszip'

export function generateHTML(
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
        case 'pricing_table': {
          const tiers = Array.isArray(block.props.tiers) ? block.props.tiers : []
          const title = escapeHtml(String(block.props.title || 'Pricing'))
          const cards = tiers.map((t: any) => {
            const feats = (Array.isArray(t.features) ? t.features : []).map((f: string) => `\n                      <li style="font-size:14px;color:#9ca3af">• ${escapeHtml(f)}</li>`).join('')
            return `\n              <div style="flex:1;min-width:200px;border:1px solid #374151;border-radius:6px;background:#111827;padding:16px;text-align:center">
                <div style="font-size:14px;font-weight:500;color:#9ca3af">${escapeHtml(t.name)}</div>
                <div style="font-size:24px;font-weight:700;color:#fff;margin:8px 0">${escapeHtml(t.price)}</div>
                <ul style="list-style:none;padding:0;margin:0 0 12px;display:flex;flex-direction:column;gap:4px">${feats}</ul>
                <button style="padding:8px 16px;background:#3b82f6;color:#fff;border-radius:6px;border:none;font-weight:500;cursor:pointer">${escapeHtml(t.cta)}</button>
              </div>`
          }).join('')
          return `\n        <section style="padding:24px;background:#0a0a0a">
          <h2 style="text-align:center;font-size:20px;font-weight:600;color:#fff;margin:0 0 16px">${title}</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center">${cards}</div>
        </section>`
        }
        case 'testimonials': {
          const quotes = Array.isArray(block.props.quotes) ? block.props.quotes : []
          const title = escapeHtml(String(block.props.title || 'Testimonials'))
          const cards = quotes.map((q: any) => {
            const initials = escapeHtml(String(q.name || '').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase())
            return `\n              <div style="flex:1;min-width:240px;border:1px solid #374151;border-radius:6px;background:#111827;padding:16px">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                  <div style="height:36px;width:36px;border-radius:9999px;background:#374151;display:flex;align-items:center;justify-content:center;font-size:12px;color:#9ca3af">${initials}</div>
                  <div>
                    <div style="font-size:14px;font-weight:500;color:#fff">${escapeHtml(q.name)}</div>
                    <div style="font-size:12px;color:#6b7280">${escapeHtml(q.role)}</div>
                  </div>
                </div>
                <p style="font-size:14px;color:#d1d5db;margin:0;font-style:italic">"${escapeHtml(q.text)}"</p>
              </div>`
          }).join('')
          return `\n        <section style="padding:24px;background:#0a0a0a">
          <h2 style="text-align:center;font-size:20px;font-weight:600;color:#fff;margin:0 0 16px">${title}</h2>
          <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center">${cards}</div>
        </section>`
        }
        case 'faq': {
          const items = Array.isArray(block.props.items) ? block.props.items : []
          const title = escapeHtml(String(block.props.title || 'FAQ'))
          const rows = items.map((item: any) => `\n          <details style="border:1px solid #374151;border-radius:6px;background:#111827;margin-bottom:8px">
            <summary style="cursor:pointer;padding:12px 16px;font-size:14px;font-weight:500;color:#d1d5db">${escapeHtml(item.question)}</summary>
            <div style="padding:0 16px 12px;font-size:14px;color:#9ca3af;line-height:1.6">${escapeHtml(item.answer)}</div>
          </details>`).join('')
          return `\n        <section style="padding:24px;background:#0a0a0a">
          <h2 style="font-size:20px;font-weight:600;color:#fff;margin:0 0 16px">${title}</h2>
          ${rows}
        </section>`
        }
        case 'gallery': {
          const images = Array.isArray(block.props.images) ? block.props.images : []
          return `\n        <section style="padding:24px;background:#030303">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">
            ${images.map((img: any) => {
              const src = escapeHtml(String(img.src || ''))
              const cap = img.caption ? `<div style="padding:6px 8px;font-size:12px;color:#6b7280;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(img.caption)}</div>` : ''
              return `<div style="border:1px solid #374151;border-radius:6px;overflow:hidden;background:#111827">
              <img src="${src}" alt="${escapeHtml(String(img.caption || ''))}" style="display:block;width:100%;height:140px;object-fit:cover" />
              ${cap}
            </div>`
            }).join('')}
          </div>
        </section>`
        }
        case 'video': {
          const src = String(block.props.src || '')
          return `\n        <section style="padding:24px;background:#030303">
          <div style="position:relative;width:100%;padding-top:56.25%;border-radius:6px;overflow:hidden;border:1px solid #374151">
            <iframe src="${escapeHtml(src)}" title="${escapeHtml(String(block.props.title || 'Video'))}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen></iframe>
          </div>
          ${block.props.caption ? `<p style="text-align:center;font-size:12px;color:#6b7280;margin-top:8px">${escapeHtml(String(block.props.caption))}</p>` : ''}
        </section>`
        }
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

export async function exportToZIP(
  blocks: Array<{ id: string; type: string; props: Record<string, unknown> }>
): Promise<Blob> {
  const zip = new JSZip()
  const html = generateHTML(blocks)
  zip.file('index.html', html)
  zip.file(
    'README.txt',
    'This ZIP was exported from Modus Builder.\nOpen index.html in your browser to preview the site.\n'
  )
  return await zip.generateAsync({ type: 'blob' })
}

export function downloadZIP(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
