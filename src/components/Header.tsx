import React from 'react';
import { ShieldAlert, Eye, Code, Heart, History, Grid } from 'lucide-react';

interface HeaderProps {
  activeView: 'catalog' | 'favorites' | 'recent';
  onSelectView: (view: 'catalog' | 'favorites' | 'recent') => void;
  onOpenCloakModal: () => void;
  onOpenJsonModal: () => void;
  onTriggerPanic: () => void;
  activeCloak: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onOpenCloakModal,
  onOpenJsonModal,
  onTriggerPanic,
  activeCloak,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element Brand wordmark */}
        <button
          onClick={() => onSelectView('catalog')}
          className="text-lg font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          Nexus Arcade
        </button>

        {/* Zone 2: 4-5 clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectView('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeView === 'catalog' ? 'text-sky-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <Grid className="w-4 h-4" />
            All Games
          </button>
          <button
            onClick={() => onSelectView('favorites')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeView === 'favorites' ? 'text-sky-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <Heart className="w-4 h-4" />
            Favorites
          </button>
          <button
            onClick={() => onSelectView('recent')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeView === 'recent' ? 'text-sky-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <History className="w-4 h-4" />
            Recent
          </button>
          <button
            onClick={onOpenJsonModal}
            className="transition-colors whitespace-nowrap shrink-0 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <Code className="w-4 h-4" />
            JSON File
          </button>
          <button
            onClick={onOpenCloakModal}
            className="transition-colors whitespace-nowrap shrink-0 text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            Tab Cloak {activeCloak !== 'default' && <span className="text-xs text-emerald-400">(Active)</span>}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onTriggerPanic}
            title="Emergency Panic: Instantly redirect to Google Classroom"
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg hover:bg-rose-900/80 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Panic Button
          </button>
        </div>
      </div>
    </header>
  );
};
