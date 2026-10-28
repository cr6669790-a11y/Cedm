import React, { useState, useRef, useEffect } from 'react';
import { GameItem } from '../types';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  Share2,
  ThumbsUp,
  SlidersHorizontal,
  Code,
  Check,
  Tv,
} from 'lucide-react';
import { openAboutBlank } from '../utils/cloak';

interface GamePlayerProps {
  game: GameItem;
  onBack: () => void;
  onSelectGame: (game: GameItem) => void;
  allGames: GameItem[];
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  onBack,
  onSelectGame,
  allGames,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [likes, setLikes] = useState(() => {
    const saved = localStorage.getItem(`likes_${game.id}`);
    return saved ? parseInt(saved, 10) : Math.floor(game.plays * 0.12);
  });
  const [hasLiked, setHasLiked] = useState(() => {
    return localStorage.getItem(`has_liked_${game.id}`) === 'true';
  });
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync likes on game change
  useEffect(() => {
    const saved = localStorage.getItem(`likes_${game.id}`);
    setLikes(saved ? parseInt(saved, 10) : Math.floor(game.plays * 0.12));
    setHasLiked(localStorage.getItem(`has_liked_${game.id}`) === 'true');
    setIframeKey((prev) => prev + 1);
  }, [game.id, game.plays]);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleLike = () => {
    if (hasLiked) {
      const next = likes - 1;
      setLikes(next);
      setHasLiked(false);
      localStorage.setItem(`likes_${game.id}`, String(next));
      localStorage.setItem(`has_liked_${game.id}`, 'false');
    } else {
      const next = likes + 1;
      setLikes(next);
      setHasLiked(true);
      localStorage.setItem(`likes_${game.id}`, String(next));
      localStorage.setItem(`has_liked_${game.id}`, 'true');
    }
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('game', game.id);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  };

  const handleCopyIframe = () => {
    const iframeSnippet =
      game.iframe ||
      `<iframe src="${game.iframeSrc}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(iframeSnippet).then(() => {
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    });
  };

  const relatedGames = allGames
    .filter((g) => g.id !== game.id)
    .slice(0, 4);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top action header */}
      <div className="w-full max-w-6xl px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Open in about:blank cloaked tab */}
          <button
            onClick={() => openAboutBlank(game.iframeSrc, game.title)}
            title="Open in an unblocked about:blank cloaked tab"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-sky-400 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>about:blank</span>
          </button>
        </div>
      </div>

      {/* Main Iframe Player Stage */}
      <div
        ref={containerRef}
        className={`w-full transition-all duration-300 flex flex-col items-center justify-center ${
          isFullscreen
            ? 'h-screen bg-black p-0'
            : isTheater
            ? 'max-w-7xl px-2 sm:px-4'
            : 'max-w-5xl px-4 sm:px-6'
        }`}
      >
        <div
          className={`w-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col ${
            isFullscreen ? 'rounded-none border-none h-full' : ''
          }`}
        >
          {/* Player Toolbar Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-semibold text-white truncate">
                {game.title}
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
                {game.category}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Reload Button */}
              <button
                onClick={handleReload}
                title="Restart Game"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Theater Mode Toggle */}
              <button
                onClick={() => setIsTheater(!isTheater)}
                title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
                className={`p-1.5 rounded-lg transition-colors hidden sm:block ${
                  isTheater
                    ? 'text-sky-400 bg-slate-800'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Tv className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F)'}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* The Iframe Container */}
          <div
            className={`w-full relative bg-slate-950 flex items-center justify-center ${
              isFullscreen
                ? 'flex-grow h-full'
                : isTheater
                ? 'h-[620px] sm:h-[700px]'
                : 'h-[500px] sm:h-[580px]'
            }`}
          >
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={game.iframeSrc}
              title={game.title}
              className="w-full h-full border-0 block"
              allow="autoplay; fullscreen; gamepad"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Game Details & Controls & Metadata */}
      {!isFullscreen && (
        <div className="w-full max-w-5xl px-4 sm:px-6 py-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 cols: Overview & Controls */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Title & Stats */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      {game.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      <span>{game.category} Category</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-300 font-mono">
                        ★ {game.rating.toFixed(1)} Rating
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">
                        {game.plays.toLocaleString()} Plays
                      </span>
                    </div>
                  </div>

                  {/* Like button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      hasLiked
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${hasLiked ? 'fill-sky-400' : ''}`}
                    />
                    <span className="font-mono">{likes}</span>
                  </button>
                </div>

                <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Controls Panel */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                  Controls & Instructions
                </h2>
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3.5 text-sm text-slate-300 font-mono">
                  {game.controls}
                </div>
              </div>

              {/* Stored Iframe in JSON Representation */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-sky-400" />
                    <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                      Stored Iframe JSON Embed
                    </h2>
                  </div>
                  <button
                    onClick={handleCopyIframe}
                    className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    {copiedIframe ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <span>Copy Iframe Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-slate-950/90 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300 font-mono overflow-x-auto">
                  <code>{game.iframe}</code>
                </pre>
              </div>
            </div>

            {/* Right 1 col: Recommended Games Sidebar */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                More Unblocked Games
              </h2>
              <div className="flex flex-col gap-3">
                {relatedGames.map((rg) => (
                  <div
                    key={rg.id}
                    onClick={() => onSelectGame(rg)}
                    className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-sky-400 transition-colors">
                        {rg.title}
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">
                        {rg.category} · ★ {rg.rating.toFixed(1)}
                      </div>
                    </div>
                    <span className="text-xs text-sky-400 font-medium group-hover:translate-x-0.5 transition-transform">
                      Play →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
