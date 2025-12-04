import React, { useMemo } from 'react';
import {
  AspectRatio,
  FilmStock,
  PaperType,
  PhotoMetadata,
  FontFamily,
  FrameType,
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
  frame: FrameType;
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
  frame,
}) => {
  // Determine text color based on paper brightness
  const isDarkPaper = paper.id === 'matte-black';
  const textColor = isDarkPaper ? 'text-neutral-300' : 'text-[#1C1C1C]';
  const secondaryColor = isDarkPaper ? 'text-neutral-500' : 'text-neutral-400';

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

  // Determine frame class based on aspect ratio for film strip
  const frameClass = useMemo(() => {
    if (frame.id === 'film-strip') {
      const isLandscape = ['3:2', '4:3', '16:9', '5:4'].includes(aspectRatio.id);
      return isLandscape ? 'film-strip-border-horizontal' : 'film-strip-border';
    }
    return frame.cssClass;
  }, [frame, aspectRatio]);

  // Determine footer positioning
  const isPolaroid = frame.id === 'polaroid';
  const footerClass = isPolaroid 
    ? 'absolute bottom-4 left-4 right-4 px-4' 
    : 'w-full flex justify-between items-end px-1 mt-1';

  return (
    <div
      ref={innerRef}
      className={`relative transition-all duration-500 ease-in-out shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] rounded-lg ${frameClass}`}
      style={{ 
        backgroundColor: paper.hex,
        width: '480px',
        padding: isPolaroid ? undefined : '48px',
        '--hole-color': isDarkPaper ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)',
        '--border-color': isDarkPaper ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
      } as React.CSSProperties}
    >
      {/* Paper Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay rounded-lg"
        style={{
          backgroundImage: `url("${NOISE_TEXTURE}")`,
          opacity: grainOpacity,
        }}
      />

      {/* Main Container */}
      <div className={`relative w-full ${isPolaroid ? '' : 'h-full'} overflow-hidden`}>
        {/* The Image Itself */}
        <div
          className={`relative overflow-hidden w-full max-w-full max-h-full ${aspectRatio.cssClass} transition-all duration-500 ${isPolaroid ? 'rounded-sm' : 'rounded'}`}
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
                filter: `${filmStock.cssFilter} sepia(${warmth}%)`,
                objectPosition: `${imagePositionX}% ${imagePosition}%`,
              }}
              crossOrigin={image.startsWith('data:') ? undefined : 'anonymous'}
            />
          )}
        </div>

        {/* Standard Metadata Footer (non-Polaroid) */}
        {!isPolaroid && (
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
        )}
      </div>

      {/* Polaroid Footer - Outside the image container, in the chin area */}
      {isPolaroid && (
        <div className="flex flex-col items-center justify-center w-full pt-4 pb-2">
          {caption && (
            <h2
              className={`${fontClass} ${textColor} text-lg text-center break-words leading-tight`}
            >
              {caption}
            </h2>
          )}
          <div
            className={`font-mono text-[8px] tracking-[0.2em] uppercase ${secondaryColor} mt-2`}
          >
            {metadata.date}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCard;
