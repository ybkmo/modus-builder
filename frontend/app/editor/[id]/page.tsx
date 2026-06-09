'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Monitor, Tablet, Smartphone, HelpCircle } from 'lucide-react'
import { getTemplateById } from '@/data/templates'
import Canvas from '@/components/editor/Canvas'
import BlockToolbar from '@/components/editor/BlockToolbar'
import AIChatPanel from '@/components/editor/AIChatPanel'
import ExportModal from '@/components/editor/ExportModal'
import DeployButton from '@/components/editor/DeployButton'
import PreviewButton from '@/components/editor/PreviewButton'
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts'

type PageBlock = { id: string; type: string; props: Record<string, unknown> }

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000
const SAVE_INTERVAL = 3000

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
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [draftRestored, setDraftRestored] = useState(false)

  const searchParams = useSearchParams()
  const draftKey = `modus-builder-draft-${id}`

  // Load template for new projects
  useEffect(() => {
    if (id !== 'new') return
    const templateId = searchParams.get('template') || (() => {
      try { return localStorage.getItem('modus-selected-template') } catch { return null }
    })()
    if (!templateId) return
    const template = getTemplateById(templateId)
    if (!template) return
    try { localStorage.removeItem('modus-selected-template') } catch { /* ignore */ }

    const freshBlocks = template.blocks.map((b) => ({ ...b, id: crypto.randomUUID() }))
    setBlocks(freshBlocks)
    setHistoryState({ history: [freshBlocks], index: 0 })
  }, [id, searchParams])

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && Array.isArray(parsed.blocks) && typeof parsed.savedAt === 'number') {
          const age = Date.now() - parsed.savedAt
          if (age < TWENTY_FOUR_HOURS) {
            setBlocks(parsed.blocks)
            setHistoryState({ history: [parsed.blocks], index: 0 })
            setDraftRestored(true)
          } else {
            localStorage.removeItem(draftKey)
          }
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [draftKey])

  // Auto-save to localStorage every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const payload = { blocks: blocksRef.current, savedAt: Date.now() }
        localStorage.setItem(draftKey, JSON.stringify(payload))
      } catch {
        // storage may be full
      }
    }, SAVE_INTERVAL)
    return () => clearInterval(timer)
  }, [draftKey])

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey)
    } catch {
      // ignore
    }
  }, [draftKey])

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
      if (e.key === 'Escape') {
        setShowAI(false)
        setShowShortcuts(false)
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
        {draftRestored && (
          <div className="flex items-center justify-between px-4 py-2 bg-accent/10 border-b border-accent/20 text-xs text-accent">
            <span>Draft restored from local storage.</span>
            <button
              onClick={() => setDraftRestored(false)}
              className="text-accent hover:text-white font-medium"
            >
              Dismiss
            </button>
          </div>
        )}
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
            <ExportModal blocks={blocks} onAfterExport={clearDraft} />
            <PreviewButton blocks={blocks} />
            <DeployButton projectId={id} onAfterDeploy={clearDraft} />
            <button
              onClick={() => setShowShortcuts(true)}
              className="rounded-md bg-gray-800 px-2 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition inline-flex items-center gap-1"
              title="Keyboard shortcuts"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">?</span>
            </button>
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
      {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
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
    case 'pricing_table':
      return { title: 'Pricing', tiers: [
        { name: 'Basic', price: '$9/mo', features: ['1 site', 'Email support'], cta: 'Choose Basic' },
        { name: 'Pro', price: '$29/mo', features: ['10 sites', 'Priority support'], cta: 'Choose Pro' },
        { name: 'Enterprise', price: '$99/mo', features: ['Unlimited', '24/7 phone support'], cta: 'Contact Sales' }
      ]}
    case 'testimonials':
      return { title: 'Testimonials', quotes: [
        { name: 'Sarah L.', role: 'CEO', text: 'Transformed our online presence completely.' },
        { name: 'James M.', role: 'CTO', text: 'The best platform we have ever used.' }
      ]}
    case 'faq':
      return { title: 'FAQ', items: [
        { question: 'What is included?', answer: 'Everything you need to get started.' },
        { question: 'How do I contact support?', answer: 'Email us anytime at support@example.com.' }
      ]}
    case 'gallery':
      return { images: [
        { src: 'https://picsum.photos/400/300?random=1', caption: 'Image 1' },
        { src: 'https://picsum.photos/400/300?random=2', caption: 'Image 2' },
        { src: 'https://picsum.photos/400/300?random=3', caption: 'Image 3' },
        { src: 'https://picsum.photos/400/300?random=4', caption: 'Image 4' }
      ]}
    case 'video':
      return { src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', caption: 'Demo Video', title: 'Video' }
    default:
      return {}
  }
}
