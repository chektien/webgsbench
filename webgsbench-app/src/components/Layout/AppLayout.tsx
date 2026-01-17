import { useState, useEffect, useCallback } from 'react';
import type { GSFile } from '../../types';
import { FileDropzone } from '../FileLoader/FileDropzone';
import { GSViewer } from '../Viewer/GSViewer';
import { MetricsPanel } from '../Metrics/MetricsPanel';
import { useMetrics } from '../../hooks/useMetrics';
import { useImageQuality } from '../../hooks/useImageQuality';
import { useCameraSync } from '../../hooks/useCameraSync';
import type * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

export function AppLayout() {
  const [fileA, setFileA] = useState<GSFile | null>(null);
  const [fileB, setFileB] = useState<GSFile | null>(null);
  const [viewerA, setViewerA] = useState<GaussianSplats3D.Viewer | null>(null);
  const [viewerB, setViewerB] = useState<GaussianSplats3D.Viewer | null>(null);
  const [cameraSyncEnabled, setCameraSyncEnabled] = useState(true);

  const metricsA = useMetrics();
  const metricsB = useMetrics();
  const imageQuality = useImageQuality();

  // Camera sync: Splat B follows Splat A
  useCameraSync({
    sourceViewer: viewerA,
    targetViewer: viewerB,
    enabled: cameraSyncEnabled && !!viewerA && !!viewerB,
  });

  const handleFileSelectA = (file: GSFile) => {
    metricsA.reset();
    setFileA(file);
  };

  const handleFileSelectB = (file: GSFile) => {
    metricsB.reset();
    setFileB(file);
  };

  const handleViewerReadyA = useCallback((viewer: GaussianSplats3D.Viewer) => {
    setViewerA(viewer);
  }, []);

  const handleViewerReadyB = useCallback((viewer: GaussianSplats3D.Viewer) => {
    setViewerB(viewer);
  }, []);

  const handleLoadCompleteA = (loadTime: number, splatCount: number) => {
    metricsA.setLoadTime(loadTime);
    metricsA.setFileInfo(fileA?.size || 0, splatCount);
  };

  const handleLoadCompleteB = (loadTime: number, splatCount: number) => {
    metricsB.setLoadTime(loadTime);
    metricsB.setFileInfo(fileB?.size || 0, splatCount);
  };

  const handleFrameUpdateA = (deltaTime: number) => {
    metricsA.recordFrame(deltaTime);
  };

  const handleFrameUpdateB = (deltaTime: number) => {
    metricsB.recordFrame(deltaTime);
  };

  const handleClearAll = () => {
    setFileA(null);
    setFileB(null);
    setViewerA(null);
    setViewerB(null);
    metricsA.reset();
    metricsB.reset();
    imageQuality.reset();
  };

  // Update resolution on window resize for both viewers
  useEffect(() => {
    const updateResolution = () => {
      const canvases = document.querySelectorAll('canvas[data-engine="three.js r182"]');
      if (canvases.length >= 1) {
        const canvasA = canvases[0] as HTMLCanvasElement;
        metricsA.setResolution(canvasA.width, canvasA.height);
      }
      if (canvases.length >= 2) {
        const canvasB = canvases[1] as HTMLCanvasElement;
        metricsB.setResolution(canvasB.width, canvasB.height);
      }
    };

    // Update after a short delay to ensure canvas is rendered
    const timeoutId = setTimeout(updateResolution, 100);
    window.addEventListener('resize', updateResolution);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateResolution);
    };
  }, [fileA, fileB]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 px-10 py-6 flex items-center justify-between shadow-lg" style={{ borderBottom: '1px solid #444' }}>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SplattingArena</h1>
          <p className="text-sm mt-1 text-gray-400">3D Gaussian Splatting Arena</p>
        </div>
        <div className="flex gap-3">
          {(fileA && fileB) && (
            <button
              onClick={() => {
                console.log('=== Starting Quality Comparison ===');
                console.log('Splat A:', fileA.name);
                console.log('Splat B:', fileB.name);
                if (fileA.name === fileB.name) {
                  console.warn('⚠️ WARNING: Both viewers loaded the SAME FILE!');
                  console.warn('PSNR/SSIM will be perfect (identical images)');
                }
                imageQuality.compareQuality(viewerA, viewerB);
              }}
              disabled={imageQuality.isComparing}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {imageQuality.isComparing ? 'Comparing...' : 'Compare Quality'}
            </button>
          )}
          {(fileA || fileB) && (
            <button
              onClick={handleClearAll}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Clear All
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Split Viewer Area */}
        <div className="flex-1 flex relative">
          {/* Splat A */}
          <div className="flex-1 relative" style={{ borderRight: '1px solid #444' }}>
            <div className="absolute top-4 left-4 z-20 px-3 py-2 bg-gray-800 bg-opacity-90 rounded-lg max-w-[280px]">
              <div className="text-xs font-semibold text-gray-400 mb-0.5">Splat A</div>
              {fileA && (
                <div className="text-sm text-white truncate" title={fileA.name}>
                  {fileA.name}
                </div>
              )}
            </div>
            {!fileA ? (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="max-w-lg w-full">
                  <FileDropzone onFileSelect={handleFileSelectA} side="A" />
                </div>
              </div>
            ) : (
              <GSViewer
                gsFile={fileA}
                onLoadComplete={handleLoadCompleteA}
                onFrameUpdate={handleFrameUpdateA}
                onViewerReady={handleViewerReadyA}
              />
            )}
          </div>

          {/* Splat B */}
          <div className="flex-1 relative">
            <div className="absolute top-4 left-4 z-20 px-3 py-2 bg-gray-800 bg-opacity-90 rounded-lg max-w-[280px]">
              <div className="text-xs font-semibold text-gray-400 mb-0.5">Splat B</div>
              {fileB && (
                <div className="text-sm text-white truncate" title={fileB.name}>
                  {fileB.name}
                </div>
              )}
            </div>
            {!fileB ? (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="max-w-lg w-full">
                  <FileDropzone onFileSelect={handleFileSelectB} side="B" />
                </div>
              </div>
            ) : (
              <GSViewer
                gsFile={fileB}
                onLoadComplete={handleLoadCompleteB}
                onFrameUpdate={handleFrameUpdateB}
                onViewerReady={handleViewerReadyB}
              />
            )}
          </div>

          {/* Navigation Controls - Single panel for both sides */}
          {(fileA || fileB) && (
            <div
              className="absolute bottom-4 left-4 px-4 py-3 bg-gray-800 bg-opacity-90 rounded-lg text-xs text-gray-300"
              style={{ zIndex: 30 }}
            >
              <div className="font-semibold mb-2 text-white">Navigation Controls</div>
              <div className="space-y-1">
                <div><span className="font-medium">Rotate</span> - Left-click + Drag (One-finger)</div>
                <div><span className="font-medium">Pan</span> - Right-click + Drag, Ctrl/Cmd + Drag (Two-finger)</div>
                <div><span className="font-medium">Dolly ("zoom")</span> - Scroll (Mouse), Pinch (Trackpad)</div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Panel */}
        <div className="w-80" style={{ borderLeft: '1px solid #444' }}>
          <MetricsPanel
            metricsA={metricsA.metrics}
            metricsB={metricsB.metrics}
            showComparison={!!(fileA && fileB)}
            qualityMetrics={imageQuality.metrics}
          />
        </div>
      </div>
    </div>
  );
}
