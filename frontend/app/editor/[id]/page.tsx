'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import Canvas from '@/components/editor/Canvas'
import BlockToolbar from '@/components/editor/BlockToolbar'
import AIChatPanel from '@/components/editor/AIChatPanel'
import ExportModal from '@/components/editor/ExportModal'
import DeployButton from '@/components/editor/DeployButton'

type PageBlock = { id: string; type: string; props: Record<string, unknown> }

export default function EditorPage() {
  const { id } = useParams() as { id: string }
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks

  const [historyState, setHistoryState] = useState<{ history: PageBlock[][]; index: number }>({
    history: [[]],
    index: 0,
  })
  const historyRef = useRef(historyState)
  historyRef.current = historyState

  const [showAI, setShowAI] = useState(false)
  const [breakpoint, setBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const commitBlocks = useCallback((updater: (prev: PageBlock[]) => PageBlock[]) => {
    const computed = updater(blocksRef.current)
    const hs = historyRef.current
    const sliced = hs.history.slice(0, hs.index + 1)
    const nextHistory = sliced.concat([computed])
    let nextIndex = hs.index + 1
    if (nextHistory.length > 50) {
      nextHistory.shift()
      nextIndex = hs.index
    }
    setBlocks(computed)
    setHistoryState({ history: nextHistory, index: nextIndex })
  }, [])

  const handleUndo = useCallback(() => {
    const hs = historyRef.current
    if (hs.index <= 0) return
    const nextIndex = hs.index - 1
    setBlocks(hs.history[nextIndex])
    setHistoryState({ ...hs, index: nextIndex })
  }, [])

  const handleRedo = useCallback(() => {
    const hs = historyRef.current
    if (hs.index >= hs.history.length - 1) return
    const nextIndex = hs.index + 1
    setBlocks(hs.history[nextIndex])
    setHistoryState({ ...hs, index: nextIndex })
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          handleUndo()
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault()
          handleRedo()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleUndo, handleRedo])

  const handleAddBlock = useCallback((type: string) => {
    const newBlock = { id: crypto.randomUUID(), type, props: getDefaultProps(type) }
    commitBlocks((prev) => [...prev, newBlock])
  }, [commitBlocks])

  const handleMergeBlocks = useCallback((incoming: PageBlock[]) => {
    commitBlocks((prev) => [...prev, ...incoming])
  }, [commitBlocks])

  const handleUpdateBlock = useCallback((blockId: string, newProps: Record<string, unknown>) => {
    commitBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, props: { ...b.props, ...newProps } } : b)))
  }, [commitBlocks])

  const handleRemoveBlock = useCallback((blockId: string) => {
    commitBlocks((prev) => prev.filter((b) => b.id !== blockId))
  }, [commitBlocks])

  const bpClass =
    breakpoint === 'desktop' ? 'max-w-full' : breakpoint === 'tablet' ? 'max-w-[768px]' : 'max-w-[375px]'

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <BlockToolbar onAddBlock={handleAddBlock} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h1 className="text-sm font-semibold tracking-wide text-gray-300">MODUS EDITOR</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-800 rounded-md p-1">
              <button
                onClick={() => setBreakpoint('desktop')}
                className={`p-1.5 rounded ${breakpoint === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Desktop"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setBreakpoint('tablet')}
                className={`p-1.5 rounded ${breakpoint === 'tablet' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Tablet"
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setBreakpoint('mobile')}
                className={`p-1.5 rounded ${breakpoint === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Mobile"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
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
        <div className="flex flex-1 overflow-hidden justify-center bg-gray-950">
          <div className={`h-full w-full transition-all duration-300 ease-in-out ${bpClass}`}>
            <Canvas
              blocks={blocks}
              onUpdateBlock={handleUpdateBlock}
              onRemoveBlock={handleRemoveBlock}
              onDropBlock={handleAddBlock}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyState.index > 0}
              canRedo={historyState.index < historyState.history.length - 1}
            />
          </div>
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
