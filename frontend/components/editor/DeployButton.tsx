'use client'

import { useState, useCallback } from 'react'
import { apiPost } from '@/lib/api'
import { Globe, Loader2 } from 'lucide-react'

interface DeployButtonProps {
  projectId: string
  onAfterDeploy?: () => void
}

export default function DeployButton({ projectId, onAfterDeploy }: DeployButtonProps) {
  const [loading, setLoading] = useState(false)
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleDeploy = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiPost(`/api/projects/${projectId}/deploy`, {})
      const data = await res.json()
      setDeployedUrl(data.url || null)
      setShowModal(true)
      onAfterDeploy?.()
    } catch (e) {
      console.error(e)
      setDeployedUrl(null)
      setShowModal(true)
    } finally {
      setLoading(false)
    }
  }, [projectId, onAfterDeploy])

  return (
    <>
      <button
        onClick={handleDeploy}
        disabled={loading}
        className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600 transition inline-flex items-center gap-1 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
        Deploy
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-2">{deployedUrl ? 'Deployed!' : 'Deploy Failed'}</h2>
            {deployedUrl ? (
              <a
                href={deployedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-accent hover:underline block mb-4"
              >
                {deployedUrl}
              </a>
            ) : (
              <p className="text-sm text-gray-400 mb-4">Something went wrong. Please try again.</p>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="rounded-md bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
