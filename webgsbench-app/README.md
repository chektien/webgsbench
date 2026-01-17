# SplattingArena

3D Gaussian Splatting Arena - A web-based benchmarking and comparison tool for 3D Gaussian Splatting (3DGS) formats. Test and visualize Gaussian splat files directly in your browser with real-time performance metrics.

## Features

- **Multi-format Support**: Load .ply, .splat, .ksplat, and .spz files
- **Real-time Metrics**:
  - FPS (frames per second)
  - Frame time
  - Memory usage (Chrome only)
  - Load time
  - File size and splat count
- **Interactive Viewer**: Built on [@mkkellogg/gaussian-splats-3d](https://github.com/mkkellogg/gaussian-splats-3d) with orbit controls
- **Drag-and-Drop**: Easy file loading with visual feedback

## Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### GitHub Pages (Manual)

```bash
npm run deploy
```

This will build the app and deploy it to the `gh-pages` branch.

### GitHub Pages (Automatic)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

To enable:
1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to `main` branch

The site will be available at `https://yourusername.github.io/splatting-arena/`

## Configuration

The app is configured for GitHub Pages deployment with the base path `/splatting-arena/`. To deploy to a different path or custom domain, update the `base` field in `vite.config.ts`.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **3D Rendering**: Three.js + @mkkellogg/gaussian-splats-3d
- **Styling**: Tailwind CSS v4
- **Deployment**: GitHub Pages

## Metrics

Performance metrics are collected in real-time:

- **FPS**: Rolling average over the last 60 frames
- **Frame Time**: Average milliseconds per frame
- **Memory**: JavaScript heap usage (Chrome DevTools Protocol)
- **Load Time**: Time from file selection to first render
- **File Info**: Size in MB and total splat count

## Browser Support

- Chrome/Edge (recommended for memory metrics)
- Firefox
- Safari

WebGL 2.0 support required.

## Contributing

Built as part of the SplattingArena research project. See the main [academic paper](../main.pdf) for details on the benchmarking methodology.

## License

MIT
