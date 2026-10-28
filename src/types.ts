export type GameCategory = 'All' | 'Retro' | 'Action' | 'Puzzle' | 'Arcade' | 'Sports';

export interface GameItem {
  id: string;
  title: string;
  category: string;
  description: string;
  controls: string;
  rating: number;
  plays: number;
  featured?: boolean;
  icon?: string;
  iframeSrc: string;
  iframe: string;
  isCustom?: boolean;
}

export type CloakPreset = 'default' | 'classroom' | 'drive' | 'docs' | 'canvas';

export interface CloakConfig {
  title: string;
  favicon: string;
}
