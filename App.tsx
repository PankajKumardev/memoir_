import ExifReader from 'exifreader';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toBlob } from 'html-to-image';
import { Sidebar } from './components/Sidebar';
import PhotoCard from './components/PhotoCard';
import { FILM_STOCKS, PAPERS, ASPECT_RATIOS, FRAMES } from './constants';
import {
  FilmStock,
  PaperType,
  AspectRatio,
  PhotoMetadata,
  FontFamily,
  FrameType,
} from './types';
import { ArrowDownToLine, Loader2 } from 'lucide-react';

const getRandomImageUrl = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/800/1000?random=${randomId}`;
};

const App: React.FC = () => {
  const [image, setImage] = useState<string>('');
  const [filter, setFilter] = useState<FilmStock>(FILM_STOCKS[0]);
  const [paper, setPaper] = useState<PaperType>(PAPERS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[1]);
  const [caption, setCaption] = useState<string>('Memoir. No. 001');
  const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
  const [imagePosition, setImagePosition] = useState<number>(50);
  const [imagePositionX, setImagePositionX] = useState<number>(50);
  
  // New Granular Controls
  const [grain, setGrain] = useState<number>(50); // 0-100
  const [vignette, setVignette] = useState<number>(20); // 0-100
  const [warmth, setWarmth] = useState<number>(0); // 0-100
  
  // Frame Style
  const [frame, setFrame] = useState<FrameType>(FRAMES[0]);

  const [metadata, setMetadata] = useState<PhotoMetadata>({
    iso: 'ISO 400',
    aperture: 'ƒ/2.8',
    shutterSpeed: '1/125',
    date: new Date()
      .toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      .toUpperCase(),
  });

  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load initial image and convert to base64 to avoid CORS issues on export
  useEffect(() => {
    const loadImageAsDataUrl = async (url: string) => {
      try {
        // Fetch image and convert to base64
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result);
          };
          reader.onerror = () => reject(new Error('Failed to read image'));
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Failed to load image as base64:', error);
        return url;
      }
    };

    const randomImageUrl = getRandomImageUrl();
    loadImageAsDataUrl(randomImageUrl).then((dataUrl) => {
      setImage(dataUrl);
    });
  }, []);

  // Handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Load Image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Reset metadata to "Scanning..." feel or just random immediately to show change
      // We'll generate new random defaults first, then override if EXIF exists
      const randomIso = [100, 200, 400, 800, 1600][Math.floor(Math.random() * 5)];
      const randomAperture = [1.4, 1.8, 2.0, 2.8, 4.0, 5.6][Math.floor(Math.random() * 6)];
      const randomShutter = [60, 125, 250, 500, 1000][Math.floor(Math.random() * 5)];
      
      const newMetadata: PhotoMetadata = {
        iso: `ISO ${randomIso}`,
        aperture: `ƒ/${randomAperture}`,
        shutterSpeed: `1/${randomShutter}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).toUpperCase(),
      };

      setMetadata(newMetadata);

      // Extract EXIF Data
      try {
        const tags = await ExifReader.load(file);
        
        // Update with real data if available
        if (tags['ISOSpeedRatings']?.description) {
          newMetadata.iso = `ISO ${tags['ISOSpeedRatings'].description}`;
        }
        
        if (tags['FNumber']?.description) {
          newMetadata.aperture = `ƒ/${parseFloat(tags['FNumber'].description).toFixed(1)}`;
        }
        
        if (tags['ExposureTime']?.description) {
          newMetadata.shutterSpeed = `${tags['ExposureTime'].description}`;
        }
        
        if (tags['DateTimeOriginal']?.description) {
          const date = new Date(tags['DateTimeOriginal'].description.replace(/:/g, '-').replace(' ', 'T'));
          if (!isNaN(date.getTime())) {
            newMetadata.date = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).toUpperCase();
          }
        }

        setMetadata({ ...newMetadata }); // Trigger re-render with final data
      } catch (error) {
        console.log('No EXIF data found, using random analog values');
        // Already set to random above, so we're good!
      }
    }
  };

  const handleExport = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (cardRef.current === null) return;

    setIsExporting(true);

    try {
      // Use toBlob instead of toPng to save memory (Base64 is 33% larger)
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, 
        skipAutoScale: true,
        type: 'image/png',
      });

      if (!blob) throw new Error('Failed to generate image blob');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `memoir-export-${Date.now()}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL after a small delay to ensure download starts
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error('Failed to export image', err);
      alert('Could not export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [cardRef]);

  // Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Reuse the upload logic logic manually or trigger the input
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) setImage(evt.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row h-screen w-full overflow-y-auto md:overflow-hidden bg-[#F4F2ED] touch-pan-y"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Header - Top on mobile, inside sidebar on desktop */}
      <header className="md:hidden w-full bg-white border-b border-[#E5E5E5] flex-shrink-0 z-30 sticky top-0">
        <div className="p-4 sm:p-6">
          <h1 className="font-serif italic text-3xl sm:text-4xl text-[#1C1C1C] mb-1">
            Memoir.
          </h1>
          <p className="font-mono text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest">
            Analog Lab & Archive
          </p>
        </div>
      </header>

      {/* Main Preview Area - Second on mobile (after header), second on desktop */}
      <main className="flex-1 relative flex items-center justify-center p-3 sm:p-4 md:p-8 lg:p-12 overflow-auto order-1 md:order-2 min-h-[50vh] md:min-h-full">
        {/* Gallery Wall Effect - subtle radial gradient behind the art */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent opacity-50" />

        {/* Floating Export Button */}
        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-50">
          <button
            type="button"
            onClick={(e) => handleExport(e)}
            disabled={isExporting}
            className="flex items-center gap-2 sm:gap-3 bg-[#1C1C1C] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-lg hover:bg-[#333] hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="animate-spin w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <ArrowDownToLine className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase hidden sm:inline">
              Develop & Save
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase sm:hidden">
              Save
            </span>
          </button>
        </div>

        {/* The Art Piece */}
        <div
          className={`relative z-10 flex items-center justify-center py-4 ${
            aspectRatio.id === '2:3' ? 'mt-4' : ''
          }`}
          style={{
            transform: 'scale(var(--card-scale, 0.9))',
            transformOrigin: 'center center',
          }}
        >
          <PhotoCard
            innerRef={cardRef}
            image={image}
            filmStock={filter}
            paper={paper}
            aspectRatio={aspectRatio}
            metadata={metadata}
            caption={caption}
            fontFamily={fontFamily}
            imagePosition={imagePosition}
            imagePositionX={imagePositionX}
            grain={grain}
            vignette={vignette}
            warmth={warmth}
            frame={frame}
          />
        </div>
      </main>

      {/* Sidebar Controls */}
      <Sidebar
        currentFilter={filter}
        setFilter={setFilter}
        currentPaper={paper}
        setPaper={setPaper}
        currentRatio={aspectRatio}
        setRatio={setAspectRatio}
        caption={caption}
        setCaption={setCaption}
        currentFont={fontFamily}
        setFont={setFontFamily}
        imagePosition={imagePosition}
        setImagePosition={setImagePosition}
        imagePositionX={imagePositionX}
        setImagePositionX={setImagePositionX}
        onUpload={handleImageUpload}
        grain={grain}
        setGrain={setGrain}
        vignette={vignette}
        setVignette={setVignette}
        warmth={warmth}
        setWarmth={setWarmth}
        currentFrame={frame}
        setFrame={setFrame}
      />
    </div>
  );
};

export default App;
