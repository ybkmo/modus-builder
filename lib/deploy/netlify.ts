#!/usr/bin/env tsx
// Stub script for Netlify CLI deploy
// Usage: tsx lib/deploy/netlify.ts

import { execSync } from 'child_process';

function deployToNetlify() {
  console.log('[Netlify] Starting deployment...');
  try {
    execSync('netlify deploy --prod --dir=frontend/dist', { stdio: 'inherit', cwd: process.cwd() });
    console.log('[Netlify] Deployment complete.');
  } catch (error) {
    console.error('[Netlify] Deployment failed. Ensure Netlify CLI is installed and authenticated.');
    process.exit(1);
  }
}

if (require.main === module) {
  deployToNetlify();
}

export { deployToNetlify };
