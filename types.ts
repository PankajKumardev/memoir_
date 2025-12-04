export interface FilmStock {
  id: string;
  name: string;
  cssFilter: string;
  description: string;
}

export interface PaperType {
  id: string;
  name: string;
  hex: string;
  textureOpacity: number;
}

export interface AspectRatio {
  id: string;
  label: string;
  ratio: number; // width / height
  cssClass: string;
}

export interface PhotoMetadata {
  iso: string;
  aperture: string;
  shutterSpeed: string;
  date: string;
}

export type FontFamily = 'mono' | 'serif' | 'script';

export interface FrameType {
  id: string;
  name: string;
  cssClass: string;
  type: 'paper' | 'film' | 'polaroid';
}
