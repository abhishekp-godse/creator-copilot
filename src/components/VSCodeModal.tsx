import React, { useState } from 'react';
import { Download, ExternalLink, Code2, Copy, Check, Terminal, FolderTree, Laptop, Sparkles, X } from 'lucide-react';
import { downloadVSCodeZip, openInVSCodeProtocol, openInVSCodeWeb, PROJECT_FILES, ProjectFileEntry } from '../services/vscodeBridge';

interface VSCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VSCodeModal: React.FC<VSCodeModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<ProjectFileEntry>(PROJECT_FILES[0]);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      setDownloadProgress(10);
      await downloadVSCodeZip((percent) => setDownloadProgress(percent));
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Download error:', err);
      setDownloading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const terminalCommands = `# 1. Download and extract the project zip
# 2. Open project folder in VS Code
cd creatorpilot-app
code .

# 3. Install packages & start local dev server
npm install
npm run dev`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">VS Code Development Bridge</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready to Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">Export complete codebase and edit exclusively in Visual Studio Code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 text-left transition-all active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-2">
                <Download className="w-5 h-5 text-blue-100" />
                <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded">1-Click Zip</span>
              </div>
              <div className="text-sm font-semibold">Download Project Zip</div>
              <div className="text-xs text-blue-100/80 mt-1">
                {downloading ? `Exporting files (${downloadProgress}%)...` : 'Includes all source files & configs'}
              </div>
              {downloading && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              )}
            </button>

            <button
              onClick={() => openInVSCodeProtocol()}
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white text-left transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center justify-between mb-2">
                <Laptop className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-semibold">Open Desktop VS Code</div>
              <div className="text-xs text-slate-400 mt-1">Launch vscode:// file protocol</div>
            </button>

            <button
              onClick={() => openInVSCodeWeb()}
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-white text-left transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-sm font-semibold">Open in vscode.dev</div>
              <div className="text-xs text-slate-400 mt-1">Browser-based zero install IDE</div>
            </button>
          </div>

          {/* Quick Terminal Guide */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Terminal Quick Start</span>
              </div>
              <button
                onClick={() => copyToClipboard(terminalCommands, 'terminal')}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors"
              >
                {copiedSnippet === 'terminal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'terminal' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-emerald-400/90 bg-black/40 p-3 rounded-xl overflow-x-auto selection:bg-emerald-500 selection:text-black">
              {terminalCommands}
            </pre>
          </div>

          {/* In-App Code Inspector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <FolderTree className="w-4 h-4 text-blue-400" />
                <span>Project File Preview</span>
              </div>
              <button
                onClick={() => copyToClipboard(selectedFile.content, 'code')}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
              >
                {copiedSnippet === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'code' ? 'Copied File' : 'Copy File Content'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden">
              {/* File list */}
              <div className="p-3 border-r border-slate-800 space-y-1">
                {PROJECT_FILES.map(file => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-colors flex items-center justify-between ${
                      selectedFile.path === file.path
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{file.path}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{file.category}</span>
                  </button>
                ))}
              </div>

              {/* Code viewer */}
              <div className="md:col-span-2 p-3 flex flex-col">
                <div className="text-[11px] text-slate-400 mb-2 font-mono">
                  {selectedFile.description}
                </div>
                <div className="flex-1 bg-black/60 rounded-xl p-3 border border-slate-800/80 max-h-56 overflow-y-auto">
                  <pre className="font-mono text-[11px] text-slate-300 leading-relaxed">
                    {selectedFile.content}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>VS Code settings pre-configured for Tailwind CSS & React 19</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
