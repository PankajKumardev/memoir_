import React, { useMemo } from 'react';
import {
  AspectRatio,
  FilmStock,
  PaperType,
  PhotoMetadata,
  FontFamily,
} from '../types';
import { NOISE_TEXTURE } from '../constants';

interface PhotoCardProps {
  image: string;
  filmStock: FilmStock;
  paper: PaperType;
  aspectRatio: AspectRatio;
  metadata: PhotoMetadata;
  caption: string;
  fontFamily: FontFamily;
  imagePosition: number;
  imagePositionX: number;
  innerRef: React.RefObject<HTMLDivElement>;
  grain: number;
  vignette: number;
  warmth: number;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  image,
  filmStock,
  paper,
  aspectRatio,
  metadata,
  caption,
  fontFamily,
  imagePosition,
  imagePositionX,
  innerRef,
  grain,
  vignette,
  warmth,
}) => {
  // Determine text color based on paper brightness (simple heuristic)
  const isDarkPaper = paper.id === 'matte-black';
  const textColor = isDarkPaper ? 'text-neutral-400' : 'text-[#1C1C1C]';
  const secondaryColor = isDarkPaper ? 'text-neutral-600' : 'text-neutral-400';

  const fontClass = useMemo(() => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif italic';
      case 'script':
        return 'font-[Castoro] italic'; // Fallback to Castoro for scripty feel if no cursive
      case 'mono':
        return 'font-mono uppercase tracking-widest';
      default:
        return 'font-mono';
    }
  }, [fontFamily]);

  // Calculate dynamic grain opacity
  // Base paper texture + up to 30% extra opacity from slider
  const grainOpacity = paper.textureOpacity + (grain / 100) * 0.3;

  return (
    <div
      ref={innerRef}
      className={`relative transition-all duration-500 ease-in-out shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] rounded-lg`}
      style={{ 
        backgroundColor: paper.hex, // Dynamic color from props - must use inline style
        width: '480px', // Fixed width for consistent output
        padding: '48px', // Fixed padding for consistent output
      }}
    >
      {/* Paper Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("${NOISE_TEXTURE}")`, // Dynamic background image
          opacity: grainOpacity, // Dynamic opacity from props
        }}
      />

      {/* Main Container constrained by Aspect Ratio */}
      <div className="relative w-full h-full overflow-hidden">
        {/* The Image Itself */}
        <div
          className={`relative overflow-hidden w-full max-w-full max-h-full ${aspectRatio.cssClass} transition-all duration-500 rounded`}
        >
          {/* Vignette Overlay */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
            style={{
              boxShadow: `inset 0 0 ${vignette * 2}px rgba(0,0,0,${vignette / 120})`,
            }}
          />
          
          {image && (
            <img
              src={image}
              alt="Art Print"
              className="w-full h-full object-cover transition-all duration-500"
              style={{
                filter: `${filmStock.cssFilter} sepia(${warmth}%)`, // Combine film stock filter with warmth
                objectPosition: `${imagePositionX}% ${imagePosition}%`, // Dynamic horizontal and vertical position
              }}
              crossOrigin={image.startsWith('data:') ? undefined : 'anonymous'}
            />
          )}
        </div>

        {/* Metadata Footer */}
        <div className="w-full flex justify-between items-end px-1 mt-1">
          <div className="flex flex-col gap-2 max-w-[70%] pt-4">
            {caption && (
              <h2
                className={`${fontClass} ${textColor} text-xl break-words leading-tight mt-1`}
              >
                {caption}
              </h2>
            )}
            <div
              className={`font-mono text-[8px] tracking-[0.2em] uppercase ${secondaryColor} mt-2 flex items-center gap-3`}
            >
              <span>{filmStock.name}</span>
              <span className="opacity-50">•</span>
              <span>{metadata.iso}</span>
              <span className="opacity-50">•</span>
              <span>{metadata.aperture}</span>
            </div>
          </div>
          <div
            className={`writing-vertical-lr rotate-180 font-mono text-[8px] tracking-[0.2em] ${secondaryColor} opacity-60 flex-shrink-0`}
          >
            {metadata.date}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
