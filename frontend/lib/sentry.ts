let isInitialized = false

export function initSentry(): void {
  if (isInitialized) return
  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.warn("[Sentry] SENTRY_DSN is not configured. Skipping Sentry initialization.")
    return
  }
  // Stub: real Sentry.init({ dsn }) would go here
  isInitialized = true
  console.log("[Sentry] Initialized successfully.")
}

export function captureException(error: unknown): void {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.warn("[Sentry] captureException called but SENTRY_DSN is not configured.", error)
    return
  }
  // Stub: real Sentry.captureException(error) would go here
  console.error("[Sentry] Captured exception:", error)
}
