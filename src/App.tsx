/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import defaultGamesData from './data/games.json';
import { GameItem, GameCategory, CloakPreset } from './types';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { JsonViewerModal } from './components/JsonViewerModal';
import { CloakModal } from './components/CloakModal';
import { applyCloak, openAboutBlank } from './utils/cloak';
import {
  Search,
  Shuffle,
  Plus,
  Sparkles,
  Heart,
  History,
  Grid,
  FileCode,
  Shield,
  Layers,
  Gamepad2,
} from 'lucide-react';

const CATEGORIES: GameCategory[] = [
  'All',
  'Retro',
  'Action',
  'Puzzle',
  'Arcade',
  'Sports',
];

export default function App() {
  // Load games (bundled JSON + any user added custom games in localStorage)
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const savedCustom = localStorage.getItem('nexus_custom_games');
      const customList: GameItem[] = savedCustom ? JSON.parse(savedCustom) : [];
      return [...(defaultGamesData as GameItem[]), ...customList];
    } catch {
      return defaultGamesData as GameItem[];
    }
  });

  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<GameCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'catalog' | 'favorites' | 'recent'>('catalog');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_favorites');
      return saved ? JSON.parse(saved) : ['snake-retro', 'block-stack'];
    } catch {
      return ['snake-retro', 'block-stack'];
    }
  });

  // Recent Plays
  const [recentPlays, setRecentPlays] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Tab Cloaking
  const [activeCloak, setActiveCloak] = useState<CloakPreset>(() => {
    return (localStorage.getItem('nexus_cloak') as CloakPreset) || 'default';
  });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);

  // Initialize Tab Cloak
  useEffect(() => {
    applyCloak(activeCloak);
  }, [activeCloak]);

  // Deep Link support (?game=id)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game');
    if (gameId) {
      const found = games.find((g) => g.id === gameId);
      if (found) {
        setSelectedGame(found);
      }
    }
  }, [games]);

  // Panic Button Handler
  const handlePanic = () => {
    window.location.href = 'https://classroom.google.com';
  };

  // Keyboard shortcut for Search ('/') and Panic ('Escape' or '`')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`') {
        handlePanic();
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('catalog-search-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectGame = (game: GameItem) => {
    setSelectedGame(game);
    // Track in recent
    setRecentPlays((prev) => {
      const updated = [game.id, ...prev.filter((id) => id !== game.id)].slice(0, 10);
      localStorage.setItem('nexus_recent', JSON.stringify(updated));
      return updated;
    });
    // Increment plays
    setGames((prev) =>
      prev.map((g) => (g.id === game.id ? { ...g, plays: g.plays + 1 } : g))
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('nexus_favorites', JSON.stringify(next));
      return next;
    });
  };

  const handleAddGame = (newGame: GameItem) => {
    setGames((prev) => {
      const next = [newGame, ...prev];
      const customOnes = next.filter((g) => g.isCustom);
      localStorage.setItem('nexus_custom_games', JSON.stringify(customOnes));
      return next;
    });
    handleSelectGame(newGame);
  };

  const handleSurpriseMe = () => {
    const randomGame = games[Math.floor(Math.random() * games.length)];
    if (randomGame) {
      handleSelectGame(randomGame);
    }
  };

  // Filtered games list
  const filteredGames = useMemo(() => {
    let list = games;

    if (activeView === 'favorites') {
      list = list.filter((g) => favorites.includes(g.id));
    } else if (activeView === 'recent') {
      list = recentPlays
        .map((id) => games.find((g) => g.id === id))
        .filter((g): g is GameItem => Boolean(g));
    }

    if (activeCategory !== 'All') {
      list = list.filter(
        (g) => g.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.category.toLowerCase().includes(query) ||
          g.description.toLowerCase().includes(query)
      );
    }

    return list;
  }, [games, activeView, activeCategory, searchQuery, favorites, recentPlays]);

  // Featured games
  const featuredGames = useMemo(() => {
    return games.filter((g) => g.featured);
  }, [games]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          setSelectedGame(null);
        }}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        onTriggerPanic={handlePanic}
        activeCloak={activeCloak}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {selectedGame ? (
          /* Active Game Player Stage */
          <GamePlayer
            game={selectedGame}
            onBack={() => {
              setSelectedGame(null);
              // Clean up URL query
              const url = new URL(window.location.href);
              url.searchParams.delete('game');
              window.history.replaceState({}, '', url.toString());
            }}
            onSelectGame={handleSelectGame}
            allGames={games}
          />
        ) : (
          /* Catalog View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">
            {/* Hero / Portal Header Section */}
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 p-6 sm:p-8 overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Fast Unblocked Arcade
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Instant playable web arcade with zero external dependencies. Each game is stored as a clean iframe in a standalone JSON file with tab stealth cloaking.
                </p>

                {/* Quick Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSurpriseMe}
                    className="px-4 py-2 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Surprise Me</span>
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-sky-400" />
                    <span>Add Custom Game</span>
                  </button>

                  <button
                    onClick={() => setIsJsonModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Inspect games.json</span>
                  </button>
                </div>
              </div>

              {/* Decorative Subtle Background Graphics */}
              <div
                className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, #38bdf8 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Filter Tabs (Functional segmented buttons) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        if (activeView !== 'catalog') setActiveView('catalog');
                      }}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                        isActive
                          ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                          : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="catalog-search-input"
                  type="text"
                  placeholder="Search games... (Press '/')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* View Subheader (if Favorites or Recent active) */}
            {activeView !== 'catalog' && (
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  {activeView === 'favorites' ? (
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
                  ) : (
                    <History className="w-4 h-4 text-sky-400" />
                  )}
                  <h2 className="text-base font-semibold text-white capitalize">
                    {activeView === 'favorites' ? 'Your Bookmarked Favorites' : 'Recently Played Games'}
                  </h2>
                </div>

                <button
                  onClick={() => setActiveView('catalog')}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium"
                >
                  View All Games →
                </button>
              </div>
            )}

            {/* Games Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onPlay={handleSelectGame}
                    onOpenAboutBlank={(g, e) => {
                      e.stopPropagation();
                      openAboutBlank(g.iframeSrc, g.title);
                    }}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search / Filter State */
              <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
                <Gamepad2 className="w-10 h-10 text-slate-600 mb-3" />
                <h3 className="text-base font-semibold text-white">No games found</h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm">
                  {searchQuery
                    ? `No titles matched "${searchQuery}". Try a different keyword or category.`
                    : activeView === 'favorites'
                    ? "You haven't added any favorite games yet. Click the star icon on any game card to bookmark it."
                    : 'No games available in this view.'}
                </p>
                <div className="mt-4 flex gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-sky-400 bg-sky-950/40 border border-sky-800/60 rounded-lg hover:bg-sky-900/40 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                  {activeCategory !== 'All' && (
                    <button
                      onClick={() => setActiveCategory('All')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Show All Categories
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Nexus Arcade</span>
            <span aria-hidden="true">·</span>
            <span>Unblocked Web Games Hub</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{games.length} catalog games</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              games.json
            </button>
            <button
              onClick={() => setIsCloakModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Tab Cloak
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Add Game
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
      />

      <CloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activeCloak={activeCloak}
        onSelectCloak={setActiveCloak}
      />
    </div>
  );
}
