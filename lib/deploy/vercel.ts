#!/usr/bin/env tsx
// Stub script for Vercel CLI deploy
// Usage: tsx lib/deploy/vercel.ts

import { execSync } from 'child_process';

function deployToVercel() {
  console.log('[Vercel] Starting deployment...');
  try {
    execSync('vercel --prod', { stdio: 'inherit', cwd: process.cwd() });
    console.log('[Vercel] Deployment complete.');
  } catch (error) {
    console.error('[Vercel] Deployment failed. Ensure Vercel CLI is installed and authenticated.');
    process.exit(1);
  }
}

if (require.main === module) {
  deployToVercel();
}

export { deployToVercel };
