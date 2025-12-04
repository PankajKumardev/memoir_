<div align="center">
  <h1>Memoir.</h1>
  <p><em>Analog Lab & Archive</em></p>
  <p>Transform your photos into beautiful analog film-style prints with customizable film stocks, paper types, and typography.</p>
  
  <p>
    <a href="https://github.com/PankajKumardev/memoir_">
      <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
    </a>
  </p>
</div>

---

## 📍 Repository

**GitHub**: [https://github.com/PankajKumardev/memoir\_](https://github.com/PankajKumardev/memoir_)

---

## 📸 About

**Memoir.** is a web application that transforms digital photos into beautiful analog film-style photo cards. It offers a curated selection of film stocks, paper textures, aspect ratios, and typography options to create stunning, gallery-ready prints.

### ✨ Features

#### 🎞️ Film & Effects
- **Film Stock Presets** - Choose from multiple film emulations (Portra 400, Ilford HP5, Cinestill 800T, Ektar 100, and more)
- **Granular Controls** - Fine-tune Grain, Vignette, and Warmth with precise sliders
- **Real-time Preview** - See your changes instantly as you customize

#### 🖼️ Frame Styles
- **Standard** - Clean gallery-style presentation
- **Film Strip** - Authentic 35mm film look with sprocket holes (auto-orientation)
- **Polaroid** - Classic instant-film aesthetic with signature chin

#### 📄 Paper & Typography
- **Paper Types** - Select from different paper bases (Alabaster, Exhibition White, Matte Black, Kraft)
- **Custom Typography** - Add captions with different font styles (Serif, Script, Mono)
- **Aspect Ratios** - Multiple formats including 1:1, 4:5, 16:9, and 2:3

#### 🚀 Productivity
- **Undo/Redo** - Full history with `Ctrl+Z` / `Ctrl+Shift+Z` support
- **Copy to Clipboard** - One-click copy for quick social sharing
- **Reset All** - Instantly restore default settings
- **EXIF Extraction** - Auto-reads camera metadata from uploaded images

#### 📱 Export & Responsive
- **High-Res Export** - Download 2x resolution PNG exports
- **Fully Responsive** - Optimized for both mobile and desktop
- **Drag & Drop** - Easy image upload

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/PankajKumardev/memoir_.git
   cd memoir_
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in your terminal)

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **html-to-image** - Image export functionality
- **ExifReader** - EXIF metadata extraction
- **Lucide React** - Icons

## 📁 Project Structure

```
memoir_/
├── components/
│   ├── PhotoCard.tsx      # Main photo card component
│   └── Sidebar.tsx        # Control panel sidebar
├── App.tsx                # Main application component
├── constants.ts           # Film stocks, papers, aspect ratios, frames
├── types.ts               # TypeScript type definitions
├── index.css              # Global styles & frame effects
├── index.html             # HTML entry point
├── index.tsx              # React entry point
└── vite.config.ts         # Vite configuration
```

## 🎨 Usage

1. **Upload an Image**
   - Click "Load Negative" or drag and drop an image file
   - EXIF metadata (ISO, aperture, date) is extracted automatically

2. **Customize Your Photo**
   - **Film Stock**: Apply color grading presets
   - **Frame Style**: Choose Standard, Film Strip, or Polaroid
   - **Format**: Select aspect ratio (1:1, 4:5, 2:3, 16:9)
   - **Paper Base**: Pick background color/texture
   - **Effects**: Adjust Grain, Vignette, and Warmth
   - **Inscription**: Add caption with custom typography

3. **Export & Share**
   - 📋 **Copy** - Copy to clipboard for quick sharing
   - 💾 **Save** - Download as high-res PNG
   - ↩️ **Undo/Redo** - `Ctrl+Z` / `Ctrl+Shift+Z`
   - 🔄 **Reset** - Restore all defaults

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+Y` | Redo (alternative) |

## 🎯 Mobile Experience

The app is fully responsive with a mobile-first design:

- **Mobile**: Header → Image Preview → Controls (scrollable)
- **Desktop**: Sidebar (controls) on left, Image Preview on right

## 🔧 Configuration

### Custom Film Stocks

Edit `constants.ts` to add or modify film stock presets:

```typescript
export const FILM_STOCKS: FilmStock[] = [
  {
    id: 'custom',
    name: 'Custom Film',
    cssFilter: 'your-css-filter-here',
    description: 'Your description',
  },
  // ...
];
```

### Custom Paper Types

Add new paper types in `constants.ts`:

```typescript
export const PAPERS: PaperType[] = [
  {
    id: 'custom',
    name: 'Custom Paper',
    hex: '#HEXCOLOR',
    textureOpacity: 0.1,
  },
  // ...
];
```

## 📝 Notes

- The default image uses Picsum Photos service
- Images are automatically converted to base64 format to ensure consistent exports
- For best results, use images with good resolution (800x1000px or higher recommended)

## 🐛 Known Issues

- Export functionality may not work with external images due to CORS restrictions. The app automatically converts external images to base64 to mitigate this.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/PankajKumardev/memoir_/issues).

## 📄 License

This project is private and proprietary.

## 🔗 Links

- **Repository**: [https://github.com/PankajKumardev/memoir\_](https://github.com/PankajKumardev/memoir_)

## 👨‍💻 Development

### Key Features Implementation

- **Image Loading**: External images are fetched and converted to base64 on mount to avoid CORS issues during export
- **Responsive Design**: Uses Tailwind CSS with mobile-first approach
- **Export Functionality**: Uses `html-to-image` library to capture the photo card as PNG

---

<div align="center">
  <p>Made with ❤️ for analog photography enthusiasts</p>
</div>
