import React from 'react';
import { CloakPreset } from '../types';
import { CLOAK_PRESETS, applyCloak } from '../utils/cloak';
import { X, Shield, ExternalLink, AlertTriangle } from 'lucide-react';

interface CloakModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCloak: CloakPreset;
  onSelectCloak: (preset: CloakPreset) => void;
}

export const CloakModal: React.FC<CloakModalProps> = ({
  isOpen,
  onClose,
  activeCloak,
  onSelectCloak,
}) => {
  if (!isOpen) return null;

  const presets: { id: CloakPreset; name: string; subtitle: string }[] = [
    { id: 'default', name: 'Default Nexus Arcade', subtitle: 'Standard title and logo' },
    { id: 'classroom', name: 'Google Classroom', subtitle: 'Tab shows "Classes" with official green icon' },
    { id: 'drive', name: 'Google Drive', subtitle: 'Tab shows "My Drive - Google Drive"' },
    { id: 'docs', name: 'Google Docs', subtitle: 'Tab shows "Untitled document - Google Docs"' },
    { id: 'canvas', name: 'Canvas LMS', subtitle: 'Tab shows "Dashboard" with Canvas icon' },
  ];

  const handlePick = (id: CloakPreset) => {
    onSelectCloak(id);
    applyCloak(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tab Cloaking & Stealth</h3>
              <p className="text-xs text-slate-400">Disguise browser tab title and favicon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset list */}
        <div className="p-6 flex flex-col gap-2.5">
          {presets.map((p) => {
            const isSelected = activeCloak === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePick(p.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    {p.name}
                    {isSelected && (
                      <span className="text-[10px] uppercase font-mono tracking-wider text-sky-400 bg-sky-500/20 px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.subtitle}</div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  <img
                    src={CLOAK_PRESETS[p.id].favicon}
                    alt={p.name}
                    className="w-4 h-4 object-contain"
                  />
                </div>
              </button>
            );
          })}

          {/* Quick info tip */}
          <div className="mt-4 p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-200">Emergency Panic Key:</strong> You can click the top-right Panic button at any time to instantly redirect this browser tab to Google Classroom.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
