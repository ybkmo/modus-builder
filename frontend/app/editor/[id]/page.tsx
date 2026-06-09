'use client'

import { useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Canvas from '@/components/editor/Canvas'
import BlockToolbar from '@/components/editor/BlockToolbar'
import AIChatPanel from '@/components/editor/AIChatPanel'
import ExportModal from '@/components/editor/ExportModal'
import DeployButton from '@/components/editor/DeployButton'

export default function EditorPage() {
  const { id } = useParams() as { id: string }
  const [blocks, setBlocks] = useState<Array<{ id: string; type: string; props: Record<string, unknown> }>>([])
  const [showAI, setShowAI] = useState(false)

  const handleAddBlock = useCallback((type: string) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      props: getDefaultProps(type),
    }
    setBlocks((prev) => [...prev, newBlock])
  }, [])

  const handleMergeBlocks = useCallback((incoming: Array<{ id: string; type: string; props: Record<string, unknown> }>) => {
    setBlocks((prev) => [...prev, ...incoming])
  }, [])

  const handleUpdateBlock = useCallback((blockId: string, newProps: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, props: { ...b.props, ...newProps } } : b)))
  }, [])

  const handleRemoveBlock = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId))
  }, [])

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <BlockToolbar onAddBlock={handleAddBlock} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h1 className="text-sm font-semibold tracking-wide text-gray-300">MODUS EDITOR</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAI((s) => !s)}
              className="rounded-md bg-gray-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition"
            >
              AI Assistant
            </button>
            <ExportModal blocks={blocks} />
            <DeployButton projectId={id} />
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <Canvas
            blocks={blocks}
            onUpdateBlock={handleUpdateBlock}
            onRemoveBlock={handleRemoveBlock}
            onDropBlock={handleAddBlock}
          />
          {showAI && (
            <AIChatPanel
              projectId={id}
              onBlocksGenerated={handleMergeBlocks}
              onClose={() => setShowAI(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function getDefaultProps(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return { title: 'Hero Title', subtitle: 'Subtitle here', align: 'center' }
    case 'text':
      return { content: 'Lorem ipsum dolor sit amet.', align: 'left' }
    case 'image':
      return { src: 'https://via.placeholder.com/800x400', alt: 'Image', width: '100%' }
    case 'button':
      return { label: 'Click me', url: '#', variant: 'primary' }
    case 'form':
      return { fields: ['Name', 'Email'], submitLabel: 'Submit' }
    case 'spacer':
      return { height: 40 }
    default:
      return {}
  }
}
