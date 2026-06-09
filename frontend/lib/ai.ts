import { apiPost } from './api'

interface GeneratePayload {
  prompt: string
  projectId: string
}

interface GenerateResponse {
  blocks?: Array<{ id: string; type: string; props: Record<string, unknown> }>
}

export async function generateBlocks(payload: GeneratePayload): Promise<GenerateResponse> {
  const res = await apiPost('/api/ai/generate', payload)
  if (!res.ok) {
    throw new Error(`AI generate failed: ${res.status}`)
  }
  return res.json()
}
