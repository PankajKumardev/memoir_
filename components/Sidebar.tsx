import React from 'react';
import { FilmStock, PaperType, AspectRatio, FontFamily } from '../types';
import { FILM_STOCKS, PAPERS, ASPECT_RATIOS } from '../constants';
import {
  Upload,
  Type,
  Aperture,
  Layout,
  Palette,
  ArrowUpDown,
} from 'lucide-react';

interface SidebarProps {
  currentFilter: FilmStock;
  setFilter: (f: FilmStock) => void;
  currentPaper: PaperType;
  setPaper: (p: PaperType) => void;
  currentRatio: AspectRatio;
  setRatio: (r: AspectRatio) => void;
  caption: string;
  setCaption: (s: string) => void;
  currentFont: FontFamily;
  setFont: (f: FontFamily) => void;
  imagePosition: number;
  setImagePosition: (p: number) => void;
  imagePositionX: number;
  setImagePositionX: (p: number) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SidebarSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="mb-6 sm:mb-8 md:mb-10">
    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-[#1C1C1C] opacity-60">
      {icon}
      <h3 className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em]">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  currentFilter,
  setFilter,
  currentPaper,
  setPaper,
  currentRatio,
  setRatio,
  caption,
  setCaption,
  currentFont,
  setFont,
  imagePosition,
  setImagePosition,
  imagePositionX,
  setImagePositionX,
  onUpload,
}) => {
  return (
    <aside className="w-full md:w-[380px] bg-white border-t md:border-t-0 md:border-r border-[#E5E5E5] h-auto md:h-full md:max-h-none overflow-y-auto z-40 flex flex-col order-2 md:order-1 flex-shrink-0">
      {/* Header - Only visible on desktop */}
      <div className="hidden md:block p-4 sm:p-6 md:p-8 pb-3 sm:pb-4 border-b border-[#E5E5E5] flex-shrink-0">
        <h1 className="font-serif italic text-3xl sm:text-4xl text-[#1C1C1C] mb-1">
          Memoir.
        </h1>
        <p className="font-mono text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest">
          Analog Lab & Archive
        </p>
      </div>

      <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
        {/* Upload */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <label className="group flex flex-col items-center justify-center w-full h-20 sm:h-24 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#C75D46] hover:bg-[#F4F2ED] transition-all active:bg-[#F4F2ED]">
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-5 sm:pb-6">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5 sm:mb-2 text-gray-400 group-hover:text-[#C75D46]" />
              <p className="font-mono text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest">
                Load Negative
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onUpload}
            />
          </label>
        </div>

        {/* Film Stocks */}
        <SidebarSection title="Film Stock" icon={<Aperture size={14} />}>
          <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
            {FILM_STOCKS.map((stock) => (
              <button
                key={stock.id}
                onClick={() => setFilter(stock)}
                className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 border transition-all duration-300 flex items-center justify-between group active:bg-gray-50 ${
                  currentFilter.id === stock.id
                    ? 'border-[#C75D46] bg-[#F4F2ED]'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <span
                  className={`font-mono text-[10px] sm:text-xs uppercase tracking-wider ${
                    currentFilter.id === stock.id
                      ? 'text-[#C75D46]'
                      : 'text-[#1C1C1C]'
                  }`}
                >
                  {stock.name}
                </span>
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    currentFilter.id === stock.id
                      ? 'bg-[#C75D46]'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            ))}
          </div>
        </SidebarSection>

        {/* Format */}
        <SidebarSection title="Format" icon={<Layout size={14} />}>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setRatio(ratio)}
                className={`py-2 sm:py-2.5 border text-[10px] sm:text-xs font-mono transition-all active:scale-95 ${
                  currentRatio.id === ratio.id
                    ? 'border-[#1C1C1C] bg-[#1C1C1C] text-white'
                    : 'border-[#E5E5E5] text-gray-500 hover:border-gray-400'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </SidebarSection>

        {/* Image Position */}
        <SidebarSection title="Image Position" icon={<ArrowUpDown size={14} />}>
          <div className="space-y-4">
            {/* Vertical Position (Up/Down) */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() =>
                    setImagePosition(Math.max(0, imagePosition - 10))
                  }
                  className="px-3 py-2 border border-[#E5E5E5] hover:border-gray-400 transition-colors active:scale-95"
                  aria-label="Move image up"
                >
                  <span className="font-mono text-[10px] sm:text-xs">↑</span>
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={imagePosition}
                    onChange={(e) => setImagePosition(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C1C1C]"
                    style={{
                      background: `linear-gradient(to right, #1C1C1C 0%, #1C1C1C ${imagePosition}%, #E5E5E5 ${imagePosition}%, #E5E5E5 100%)`,
                    }}
                  />
                </div>
                <button
                  onClick={() =>
                    setImagePosition(Math.min(100, imagePosition + 10))
                  }
                  className="px-3 py-2 border border-[#E5E5E5] hover:border-gray-400 transition-colors active:scale-95"
                  aria-label="Move image down"
                >
                  <span className="font-mono text-[10px] sm:text-xs">↓</span>
                </button>
              </div>
              <div className="text-center">
                <span className="font-mono text-[9px] sm:text-[10px] text-gray-400 uppercase">
                  {imagePosition === 50
                    ? 'Vertical: Center'
                    : imagePosition < 50
                    ? `Vertical: Top (${imagePosition}%)`
                    : `Vertical: Bottom (${imagePosition}%)`}
                </span>
              </div>
            </div>

            {/* Horizontal Position (Left/Right) */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() =>
                    setImagePositionX(Math.max(0, imagePositionX - 10))
                  }
                  className="px-3 py-2 border border-[#E5E5E5] hover:border-gray-400 transition-colors active:scale-95"
                  aria-label="Move image left"
                >
                  <span className="font-mono text-[10px] sm:text-xs">←</span>
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={imagePositionX}
                    onChange={(e) => setImagePositionX(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C1C1C]"
                    style={{
                      background: `linear-gradient(to right, #1C1C1C 0%, #1C1C1C ${imagePositionX}%, #E5E5E5 ${imagePositionX}%, #E5E5E5 100%)`,
                    }}
                  />
                </div>
                <button
                  onClick={() =>
                    setImagePositionX(Math.min(100, imagePositionX + 10))
                  }
                  className="px-3 py-2 border border-[#E5E5E5] hover:border-gray-400 transition-colors active:scale-95"
                  aria-label="Move image right"
                >
                  <span className="font-mono text-[10px] sm:text-xs">→</span>
                </button>
              </div>
              <div className="text-center">
                <span className="font-mono text-[9px] sm:text-[10px] text-gray-400 uppercase">
                  {imagePositionX === 50
                    ? 'Horizontal: Center'
                    : imagePositionX < 50
                    ? `Horizontal: Left (${imagePositionX}%)`
                    : `Horizontal: Right (${imagePositionX}%)`}
                </span>
              </div>
            </div>
          </div>
        </SidebarSection>

        {/* Paper Type */}
        <SidebarSection title="Paper Base" icon={<Palette size={14} />}>
          <div className="flex gap-2.5 sm:gap-3">
            {PAPERS.map((paper) => (
              <button
                key={paper.id}
                onClick={() => setPaper(paper)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#E5E5E5] shadow-sm transition-transform active:scale-95 ${
                  currentPaper.id === paper.id
                    ? 'ring-2 ring-offset-1 sm:ring-offset-2 ring-[#C75D46] scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: paper.hex }} // Dynamic color from props - must use inline style
                title={paper.name}
              />
            ))}
          </div>
          <div className="mt-2">
            <span className="font-mono text-[9px] sm:text-[10px] uppercase text-gray-400">
              {currentPaper.name}
            </span>
          </div>
        </SidebarSection>

        {/* Typography */}
        <SidebarSection title="Inscription" icon={<Type size={14} />}>
          <input
            type="text"
            placeholder="TYPE CAPTION..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full bg-transparent border-b border-[#E5E5E5] pb-2 font-mono text-[10px] sm:text-xs focus:outline-none focus:border-[#C75D46] text-[#1C1C1C] placeholder-gray-300"
            maxLength={40}
          />
          <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {(['mono', 'serif', 'script'] as FontFamily[]).map((font) => (
              <button
                key={font}
                onClick={() => setFont(font)}
                className={`flex-1 py-2 text-[9px] sm:text-[10px] uppercase border transition-colors active:bg-gray-50 ${
                  currentFont === font
                    ? 'border-[#1C1C1C] text-[#1C1C1C]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {font}
              </button>
            ))}
          </div>
        </SidebarSection>
      </div>
    </aside>
  );
};
