import React from 'react';
import { GameItem } from '../types';
import { Play, Star, Sparkles, ExternalLink } from 'lucide-react';

interface GameCardProps {
  game: GameItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onPlay: (game: GameItem) => void;
  onOpenAboutBlank: (game: GameItem, e: React.MouseEvent) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
  onOpenAboutBlank,
}) => {
  // Category-specific color theme for thumbnail art
  const getGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case 'retro':
        return 'from-amber-500/20 via-orange-500/10 to-transparent text-amber-400 border-amber-500/20';
      case 'action':
        return 'from-rose-500/20 via-red-500/10 to-transparent text-rose-400 border-rose-500/20';
      case 'puzzle':
        return 'from-cyan-500/20 via-blue-500/10 to-transparent text-cyan-400 border-cyan-500/20';
      case 'arcade':
        return 'from-emerald-500/20 via-teal-500/10 to-transparent text-emerald-400 border-emerald-500/20';
      case 'sports':
        return 'from-purple-500/20 via-indigo-500/10 to-transparent text-purple-400 border-purple-500/20';
      default:
        return 'from-sky-500/20 via-slate-800/20 to-transparent text-sky-400 border-sky-500/20';
    }
  };

  const formattedPlays = game.plays >= 1000 ? `${(game.plays / 1000).toFixed(1)}k` : `${game.plays}`;

  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative flex flex-col bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
    >
      {/* Thumbnail / Visual Area */}
      <div
        className={`relative w-full h-36 bg-gradient-to-br ${getGradient(
          game.category
        )} flex items-center justify-center border-b overflow-hidden`}
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Big stylized title in thumbnail */}
        <div className="z-10 text-center px-4">
          <span className="text-xl font-bold tracking-tight text-white/90 drop-shadow-md group-hover:scale-105 transition-transform duration-200 inline-block">
            {game.title}
          </span>
          <div className="mt-1 text-xs text-slate-400 font-mono">
            {game.category} System
          </div>
        </div>

        {/* Favorite Star Button (Top Right) */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg backdrop-blur-sm transition-colors ${
            isFavorite
              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
              : 'bg-slate-950/40 text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>

        {/* About:Blank Quick Launch (Top Left) */}
        <button
          onClick={(e) => onOpenAboutBlank(game, e)}
          title="Stealth Launch (about:blank)"
          className="absolute top-2.5 left-2.5 z-20 p-1.5 rounded-lg bg-slate-950/40 text-slate-400 hover:text-sky-300 hover:bg-slate-900/60 backdrop-blur-sm transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {/* Play Overlay Button on hover */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
          <div className="w-12 h-12 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Content & Zero-Pill Unboxed Metadata */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-2.5">
        <div>
          <h3 className="font-semibold text-base text-white group-hover:text-sky-400 transition-colors line-clamp-1">
            {game.title}
          </h3>

          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Clean unboxed metadata with dot separators */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="text-slate-300">{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-0.5 text-amber-300/90 font-mono">
              ★ {game.rating.toFixed(1)}
            </span>
          </div>

          <div className="font-mono text-slate-400 text-xs">
            {formattedPlays} plays
          </div>
        </div>
      </div>
    </div>
  );
};
