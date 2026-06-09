'use client'

import { useState, useCallback } from 'react'
import { generateBlocks } from '@/lib/ai'
import { Send, Loader2, X } from 'lucide-react'

interface AIChatPanelProps {
  projectId: string
  onBlocksGenerated: (blocks: Array<{ id: string; type: string; props: Record<string, unknown> }>) => void
  onClose: () => void
}

export default function AIChatPanel({ projectId, onBlocksGenerated, onClose }: AIChatPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([])

  const handleSend = useCallback(async () => {
    if (!prompt.trim()) return
    const userText = prompt.trim()
    setMessages((prev) => [...prev, { role: 'user', text: userText }])
    setPrompt('')
    setLoading(true)
    try {
      const data = await generateBlocks({ prompt: userText, projectId })
      const generatedBlocks = data.blocks
      if (generatedBlocks && Array.isArray(generatedBlocks)) {
        onBlocksGenerated(generatedBlocks)
        setMessages((prev) => [...prev, { role: 'assistant', text: `Added ${generatedBlocks.length} block(s) to the canvas.` }])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', text: 'No blocks were generated.' }])
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Error generating blocks.' }])
    } finally {
      setLoading(false)
    }
  }, [prompt, projectId, onBlocksGenerated])

  return (
    <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <span className="text-sm font-medium">AI Assistant</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm rounded-lg px-3 py-2 ${
              m.role === 'user' ? 'bg-accent/20 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Thinking...
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-800">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Describe the block you want..."
          className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
          rows={3}
        />
        <button
          onClick={handleSend}
          disabled={loading || !prompt.trim()}
          className="mt-2 w-full rounded-md bg-accent px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 active:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-700 inline-flex items-center justify-center gap-1"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Send
            </>
          )}
        </button>
      </div>
    </div>
  )
}
