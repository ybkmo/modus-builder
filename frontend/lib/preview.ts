import { apiPost, apiGet } from './api'

export async function createPreview(
  blocks: Array<{ id: string; type: string; props: Record<string, unknown> }>
): Promise<string> {
  const res = await apiPost('/api/previews', { blocks })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to create preview')
  }
  return data.previewId as string
}

export async function fetchPreview(id: string): Promise<
  Array<{ id: string; type: string; props: Record<string, unknown> }>
> {
  const res = await apiGet(`/api/previews/${id}`)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch preview')
  }
  return data.blocks
}

export function getPreviewUrl(previewId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/preview/${previewId}`
  }
  return `/preview/${previewId}`
}
