import JSZip from 'jszip';

export interface ProjectFileEntry {
  path: string;
  category: 'config' | 'source' | 'types' | 'styles';
  language: string;
  content: string;
  description: string;
}

export const PROJECT_FILES: ProjectFileEntry[] = [
  {
    path: 'package.json',
    category: 'config',
    language: 'json',
    description: 'Dependencies, build scripts, and Vite runner',
    content: `{
  "name": "creatorpilot-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.1",
    "jszip": "^3.10.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "tailwindcss": "^4.3.3",
    "vite": "^8.3.0"
  },
  "devDependencies": {
    "@types/jszip": "^3.4.1",
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "typescript": "^7.0.2"
  }
}`
  },
  {
    path: 'vite.config.ts',
    category: 'config',
    language: 'typescript',
    description: 'Vite configuration with Tailwind CSS v4 and React',
    content: `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});`
  },
  {
    path: 'tsconfig.json',
    category: 'config',
    language: 'json',
    description: 'TypeScript configuration with strict type checking',
    content: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    },
    "noEmit": true
  },
  "include": ["src"]
}`
  },
  {
    path: '.vscode/settings.json',
    category: 'config',
    language: 'json',
    description: 'VS Code workspace preferences for Tailwind & TypeScript',
    content: `{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.tabSize": 2,
  "files.associations": {
    "*.css": "tailwindcss"
  }
}`
  },
  {
    path: '.vscode/extensions.json',
    category: 'config',
    language: 'json',
    description: 'Recommended VS Code extensions for CreatorPilot',
    content: `{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint"
  ]
}`
  },
  {
    path: 'src/types.ts',
    category: 'types',
    language: 'typescript',
    description: 'Core domain models (CreatorClient, Retention, Trends, etc.)',
    content: `// Full CreatorPilot TypeScript Interfaces
export type SocialPlatform = 'youtube' | 'instagram' | 'tiktok' | 'x';

export interface CreatorClient {
  id: string;
  name: string;
  handle: string;
  niche: string;
  totalFollowers: number;
  subscriberVelocity24h: number;
  overallEngagementRate: number;
  growthHealthScore: { total: number; consistency: number; engagement: number; trendAlignment: number; };
  platforms: Record<SocialPlatform, any>;
}`
  },
  {
    path: 'README.md',
    category: 'config',
    language: 'markdown',
    description: 'Quickstart instructions and VS Code coding guide',
    content: `# CreatorPilot - AI Growth Coach & Real-Time Social Monitor

CreatorPilot is an AI Growth Coach for content creators and agency talent managers. It monitors creator presence in real-time across YouTube, Instagram, TikTok, and X.

## 🚀 Quick Start in VS Code

1. Open this folder in VS Code:
   \`\`\`bash
   code .
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Mobile Architecture
- Bottom navigation with 5 key modules: Monitor, Coach, Trends, Analytics, Growth Lab
- Speech-to-Text & Text-to-Speech Siri-like AI Coach
- Real-time client switcher and alert center
- Title/Thumbnail A/B Scorer & Retention Drop-off curve visualizer
`
  }
];

export async function downloadVSCodeZip(onProgress?: (percent: number) => void): Promise<void> {
  const zip = new JSZip();

  // Add root files
  PROJECT_FILES.forEach(file => {
    zip.file(file.path, file.content);
  });

  onProgress?.(30);

  // Generate binary zip
  const blob = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 9 } },
    (metadata) => {
      onProgress?.(30 + Math.round(metadata.percent * 0.7));
    }
  );

  // Trigger download in browser
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'creatorpilot-vscode-project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function openInVSCodeProtocol(folderPath: string = 'creatorpilot-app') {
  // Launches local VS Code via protocol handler
  window.location.href = `vscode://file/${encodeURIComponent(folderPath)}`;
}

export function openInVSCodeWeb() {
  window.open('https://vscode.dev', '_blank', 'noopener,noreferrer');
}
