import React from 'react';
import { ExternalLink, Sparkles, Layers } from 'lucide-react';
import { ALIVONE_ECOSYSTEM_APPS } from '../data/ecosystem';

export const EcosystemDirectoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#101914] border border-emerald-900/60 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-emerald-950/70 flex items-center justify-between bg-[#0d1410]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Alivone Ecosystem</h3>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  Network
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Interconnected intentional apps designed to respect your focus and calm.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white bg-stone-900 border border-stone-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* List of Apps */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {ALIVONE_ECOSYSTEM_APPS.map(app => {
            const isCurrent = app.id === 'alivane';
            return (
              <a
                key={app.id}
                href={isCurrent ? '#' : app.url}
                target={isCurrent ? undefined : '_blank'}
                rel={isCurrent ? undefined : 'noopener noreferrer'}
                onClick={e => {
                  if (isCurrent) {
                    e.preventDefault();
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-800/80 cursor-default'
                    : 'bg-[#121c17] hover:bg-[#16251e] border-emerald-950/70 hover:border-emerald-700/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-center text-lg shrink-0">
                    {app.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-100 group-hover:text-emerald-300 transition-colors">
                        {app.name}
                      </span>
                      {app.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 font-mono">
                          {app.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug line-clamp-1 mt-0.5">
                      {app.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-stone-300 group-hover:text-emerald-400 shrink-0">
                  <span className="hidden sm:inline font-mono">{app.intendedDomain}</span>
                  {!isCurrent && <ExternalLink className="w-3.5 h-3.5" />}
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0c120f] border-t border-emerald-950/60 text-center text-[11px] text-stone-300">
          Part of the unified <strong className="text-emerald-300">Alivone</strong> family of tools for digital well-being.
        </div>
      </div>
    </div>
  );
};
