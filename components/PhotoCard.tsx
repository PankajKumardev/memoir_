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
  imagePosition: number; // 0-100 for vertical position
  imagePositionX: number; // 0-100 for horizontal position
  innerRef: React.RefObject<HTMLDivElement>;
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

  return (
    <div
      ref={innerRef}
      className={`relative p-2 sm:p-4 md:p-6 lg:p-8 xl:p-12 transition-all duration-500 ease-in-out shadow-none sm:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] rounded-lg`}
      style={{ backgroundColor: paper.hex }} // Dynamic color from props - must use inline style
    >
      {/* Paper Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("${NOISE_TEXTURE}")`, // Dynamic background image
          opacity: paper.textureOpacity, // Dynamic opacity from props
        }}
      />

      {/* Main Container constrained by Aspect Ratio */}
      <div className="relative w-full h-full overflow-hidden">
        {/* The Image Itself */}
        <div
          className={`relative overflow-hidden w-full max-w-full max-h-full ${aspectRatio.cssClass} transition-all duration-500 rounded`}
        >
          {image && (
            <img
              src={image}
              alt="Art Print"
              className="w-full h-full object-cover transition-all duration-500"
              style={{
                filter: filmStock.cssFilter, // Dynamic CSS filter - must use inline style
                objectPosition: `${imagePositionX}% ${imagePosition}%`, // Dynamic horizontal and vertical position
              }}
              crossOrigin={image.startsWith('data:') ? undefined : 'anonymous'}
            />
          )}
        </div>

        {/* Metadata Footer */}
        <div className="w-full flex justify-between items-end px-0.5 sm:px-1 mt-1">
          <div className="flex flex-col gap-1.5 sm:gap-2 max-w-[70%] pt-3 sm:pt-4">
            {caption && (
              <h2
                className={`${fontClass} ${textColor} text-sm sm:text-base md:text-lg lg:text-xl break-words leading-tight mt-0.5 sm:mt-1`}
              >
                {caption}
              </h2>
            )}
            <div
              className={`font-mono text-[5px] sm:text-[6px] md:text-[8px] tracking-[0.15em] sm:tracking-[0.2em] uppercase ${secondaryColor} mt-1.5 sm:mt-2 flex items-center gap-2 sm:gap-3`}
            >
              <span>{filmStock.name}</span>
              <span className="opacity-50">•</span>
              <span>{metadata.iso}</span>
              <span className="opacity-50">•</span>
              <span>{metadata.aperture}</span>
            </div>
          </div>
          <div
            className={`writing-vertical-lr rotate-180 font-mono text-[5px] sm:text-[6px] md:text-[8px] tracking-[0.15em] sm:tracking-[0.2em] ${secondaryColor} opacity-60 flex-shrink-0`}
          >
            {metadata.date}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
