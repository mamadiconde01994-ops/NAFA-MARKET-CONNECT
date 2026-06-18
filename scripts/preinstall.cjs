const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '..');
const filesToRemove = ['package-lock.json', 'yarn.lock'];

filesToRemove.forEach((filename) => {
  const filepath = path.join(workspaceRoot, filename);
  try {
    fs.unlinkSync(filepath);
  } catch {
    // ignore if missing
  }
});

const userAgent = process.env.npm_config_user_agent || '';
if (!userAgent.startsWith('pnpm/')) {
  console.error('Use pnpm instead');
  process.exit(1);
}
