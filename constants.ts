import { AspectRatio, FilmStock, PaperType } from "./types";

export const FILM_STOCKS: FilmStock[] = [
  {
    id: 'standard',
    name: 'Standard',
    cssFilter: 'contrast(100%) brightness(100%)',
    description: 'Original',
  },
  {
    id: 'portra400',
    name: 'Portra 400',
    cssFilter: 'sepia(0.3) saturate(1.4) contrast(0.9) brightness(1.1) hue-rotate(-10deg)',
    description: 'Warm tones, fine grain',
  },
  {
    id: 'ilford-bw',
    name: 'Ilford HP5',
    cssFilter: 'grayscale(100%) contrast(1.2) brightness(0.9)',
    description: 'High contrast B&W',
  },
  {
    id: 'cinestill',
    name: 'Cinestill 800T',
    cssFilter: 'sepia(0.1) hue-rotate(180deg) saturate(1.1) brightness(1.05) contrast(1.1)',
    description: 'Cool shadows, glowing highlights',
  },
  {
    id: 'ektar',
    name: 'Ektar 100',
    cssFilter: 'saturate(1.5) contrast(1.1) brightness(0.95)',
    description: 'Vivid, punchy colors',
  }
];

export const PAPERS: PaperType[] = [
  { id: 'alabaster', name: 'Alabaster', hex: '#F4F2ED', textureOpacity: 0.05 },
  { id: 'pure-white', name: 'Exhibition White', hex: '#FFFFFF', textureOpacity: 0.02 },
  { id: 'matte-black', name: 'Matte Black', hex: '#1C1C1C', textureOpacity: 0.1 },
  { id: 'kraft', name: 'Kraft', hex: '#D6C6B9', textureOpacity: 0.15 },
];

export const ASPECT_RATIOS: AspectRatio[] = [
  { id: '1:1', label: '1:1', ratio: 1, cssClass: 'aspect-square' },
  { id: '4:5', label: '4:5', ratio: 0.8, cssClass: 'aspect-[4/5]' },
  { id: '16:9', label: '16:9', ratio: 1.77, cssClass: 'aspect-video' },
  { id: '2:3', label: '2:3', ratio: 0.66, cssClass: 'aspect-[2/3]' },
];

// SVG Noise data URI for the paper grain texture
export const NOISE_TEXTURE = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E`;
