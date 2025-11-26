import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Sidebar } from './components/Sidebar';
import PhotoCard from './components/PhotoCard';
import { FILM_STOCKS, PAPERS, ASPECT_RATIOS } from './constants';
import {
  FilmStock,
  PaperType,
  AspectRatio,
  PhotoMetadata,
  FontFamily,
} from './types';
import { ArrowDownToLine, Loader2 } from 'lucide-react';


const INITIAL_IMAGE = 'https://picsum.photos/seed/memoir/800/1000';

const App: React.FC = () => {
  const [image, setImage] = useState<string>('');
  const [filter, setFilter] = useState<FilmStock>(FILM_STOCKS[0]);
  const [paper, setPaper] = useState<PaperType>(PAPERS[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[1]); // Default 4:5
  const [caption, setCaption] = useState<string>('Memoir. No. 001');
  const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
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
  const [flash, setFlash] = useState(false);
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
        // If CORS fails, return the URL as fallback
        return url;
      }
    };

    loadImageAsDataUrl(INITIAL_IMAGE).then((dataUrl) => {
      setImage(dataUrl);
    });
  }, []);

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
          // Generate pseudo random metadata for the feel
          setMetadata({
            ...metadata,
            iso: `ISO ${
              [100, 200, 400, 800, 1600][Math.floor(Math.random() * 5)]
            }`,
            aperture: `ƒ/${
              [1.4, 1.8, 2.0, 2.8, 4.0, 5.6][Math.floor(Math.random() * 6)]
            }`,
            shutterSpeed: `1/${
              [60, 125, 250, 500, 1000][Math.floor(Math.random() * 5)]
            }`,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = useCallback(async () => {
    if (cardRef.current === null) return;

    setIsExporting(true);

    // Trigger Flash
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `memoir-export-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
      alert(
        'Could not export. If using the default image, this might be a CORS issue. Try uploading your own image.'
      );
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
      {/* Flash Overlay */}
      <div
        className={`fixed inset-0 bg-white z-[60] pointer-events-none transition-opacity duration-150 ease-out ${
          flash ? 'opacity-100' : 'opacity-0'
        }`}
      />

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
            onClick={handleExport}
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
          className={`relative z-10 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[520px] flex items-center justify-center scale-[0.85] sm:scale-90 md:scale-100 transition-transform py-4 sm:py-6 md:py-8 ${
            aspectRatio.id === '2:3' ? 'mt-4 sm:mt-6 md:mt-8' : ''
          }`}
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
          />
        </div>
      </main>

      {/* Sidebar Controls - Third on mobile (after header and image), first on desktop */}
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
        onUpload={handleImageUpload}
      />
    </div>
  );
};

export default App;
