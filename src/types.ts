export type LanternType = '愿' | '念' | '记';
export type DestinyType = '入星' | '归流' | '化雾';

export interface RitualResponse {
  type: LanternType;
  poem: string;
  name: string;
  echo: string;
  weight: number;
  image?: string;
  imageUrl?: string;
}

export interface LanternItem extends RitualResponse {
  id: string;
  originalText: string;
  destiny: DestinyType;
  createdAt: string;
  author: string;
  resonanceCount: number;
  x?: number;
  y?: number;
  image?: string;
  imageUrl?: string;
}

export interface SkyPhenomenonState {
  title: string;
  subtitle: string;
  windForce: number; // -1 to 1
  fogLevel: number; // 0 to 1
  starBrightness: number; // 0.5 to 1.5
  totalLanterns: number;
}

export type ActiveTab = 'release' | 'sky' | 'stories' | 'phenomena' | 'mine';
