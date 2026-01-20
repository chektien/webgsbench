import { useState, useEffect, useCallback } from 'react';
import type { GSFile, SparkViewerContext } from '../../types';
import { FileDropzone } from '../FileLoader/FileDropzone';
import { GSViewer } from '../Viewer/GSViewer';
import { CameraDistance } from '../Viewer/CameraDistance';
import { MetricsPanel } from '../Metrics/MetricsPanel';
// import { Toast } from '../UI/Toast'; // TODO: Implement toast notifications
import { useMetrics } from '../../hooks/useMetrics';
import { useImageQuality } from '../../hooks/useImageQuality';
import { useCameraSync } from '../../hooks/useCameraSync';

export function AppLayout() {
  const [fileA, setFileA] = useState<GSFile | null>(null);
  const [fileB, setFileB] = useState<GSFile | null>(null);
  const [contextA, setContextA] = useState<SparkViewerContext | null>(null);
  const [contextB, setContextB] = useState<SparkViewerContext | null>(null);
  const [cameraSyncEnabled] = useState(true); // TODO: Add UI control to toggle

  const metricsA = useMetrics();
  const metricsB = useMetrics();
  const imageQuality = useImageQuality();

  // Camera sync: Splat B follows Splat A
  useCameraSync({
    sourceContext: contextA,
    targetContext: contextB,
    enabled: cameraSyncEnabled && !!contextA && !!contextB,
  });

  const handleFileSelectA = (file: GSFile) => {
    metricsA.reset();
    setFileA(file);
  };

  const handleFileSelectB = (file: GSFile) => {
    metricsB.reset();
    setFileB(file);
  };

  // Auto-trigger quality comparison when both files are loaded
  useEffect(() => {
    if (fileA && fileB && contextA && contextB && !imageQuality.isComparing && imageQuality.metrics.psnr === null) {
      // Small delay to ensure viewers are fully rendered
      const timer = setTimeout(() => {
        console.log('=== Auto-triggering Quality Comparison ===');
        console.log('Splat A:', fileA.name);
        console.log('Splat B:', fileB.name);
        if (fileA.name === fileB.name) {
          console.warn('⚠️ WARNING: Both viewers loaded the SAME FILE!');
          console.warn('PSNR/SSIM will be perfect (identical images)');
        }
        imageQuality.compareQuality(contextA, contextB);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fileA, fileB, contextA, contextB, imageQuality.isComparing, imageQuality.metrics.psnr]);

  const handleContextReadyA = useCallback((context: SparkViewerContext) => {
    setContextA(context);
  }, []);

  const handleContextReadyB = useCallback((context: SparkViewerContext) => {
    setContextB(context);
  }, []);

  const handleLoadCompleteA = (loadTime: number, splatCount: number) => {
    console.log('handleLoadCompleteA:', { loadTime, splatCount, fileSize: fileA?.size });
    metricsA.setLoadTime(loadTime);
    metricsA.setFileInfo(fileA?.size || 0, splatCount);
  };

  const handleLoadCompleteB = (loadTime: number, splatCount: number) => {
    console.log('handleLoadCompleteB:', { loadTime, splatCount, fileSize: fileB?.size });
    metricsB.setLoadTime(loadTime);
    metricsB.setFileInfo(fileB?.size || 0, splatCount);
  };

  const handleFrameUpdateA = (deltaTime: number) => {
    metricsA.recordFrame(deltaTime);
  };

  const handleFrameUpdateB = (deltaTime: number) => {
    metricsB.recordFrame(deltaTime);
  };

  const handleChangeA = () => {
    // Trigger file input directly
    document.getElementById('file-input-A')?.click();
  };

  const handleChangeB = () => {
    // Trigger file input directly
    document.getElementById('file-input-B')?.click();
  };

  const handleClearA = () => {
    setFileA(null);
    setContextA(null);
    metricsA.reset();
    imageQuality.reset(); // Reset quality comparison when either file changes
  };

  const handleClearB = () => {
    setFileB(null);
    setContextB(null);
    metricsB.reset();
    imageQuality.reset(); // Reset quality comparison when either file changes
  };

  const handleClearAll = () => {
    setFileA(null);
    setFileB(null);
    setContextA(null);
    setContextB(null);
    metricsA.reset();
    metricsB.reset();
    imageQuality.reset();
  };

  const handleManualCompareQuality = () => {
    if (contextA && contextB) {
      console.log('=== Manual Quality Comparison Triggered ===');
      imageQuality.compareQuality(contextA, contextB);
    }
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
      {/* Hidden file inputs for Change button functionality */}
      <input
        id="file-input-A"
        type="file"
        accept=".ply,.splat,.ksplat,.spz"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const extension = file.name.substring(file.name.lastIndexOf('.')) as GSFile['format'];
            const gsFile: GSFile = {
              file,
              name: file.name,
              size: file.size,
              format: extension,
            };
            handleClearA();
            setTimeout(() => handleFileSelectA(gsFile), 50);
          }
          e.target.value = ''; // Reset input
        }}
        className="hidden"
      />
      <input
        id="file-input-B"
        type="file"
        accept=".ply,.splat,.ksplat,.spz"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const extension = file.name.substring(file.name.lastIndexOf('.')) as GSFile['format'];
            const gsFile: GSFile = {
              file,
              name: file.name,
              size: file.size,
              format: extension,
            };
            handleClearB();
            setTimeout(() => handleFileSelectB(gsFile), 50);
          }
          e.target.value = ''; // Reset input
        }}
        className="hidden"
      />

      {/* Header */}
      <header className="px-10 py-6 flex items-center justify-between shadow-lg" style={{ backgroundColor: '#3E3E3E', borderBottom: '1px solid #555', fontFamily: 'Arvo, serif' }}>
        <div>
          <h1 className="text-4xl tracking-tight" style={{ color: '#B39DFF', fontFamily: 'Arvo, serif' }}>WebGSBench</h1>
          <p className="text-sm mt-1" style={{ color: '#FFACBF', fontFamily: 'Arvo, serif' }}>Web 3D Gaussian Splatting Benchmarking Tool</p>
        </div>
        <div className="flex gap-3">
          {(fileA || fileB) && (
            <button
              onClick={handleClearAll}
              className="px-6 py-2.5 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#B39DFF', fontFamily: 'Arvo, serif' }}
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
          <div className="flex-1 relative" style={{ borderRight: '1px solid #555' }}>
            {/* File info top-left */}
            <div className="absolute top-4 left-4 z-20">
              <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(62, 62, 62, 0.9)', fontFamily: 'Arvo, serif' }}>
                <div className="text-sm font-semibold mb-0.5" style={{ color: '#FFACBF' }}>Splat A</div>
                {fileA && (
                  <div className="text-sm truncate max-w-[200px]" title={fileA.name} style={{ color: '#FDFDFB' }}>
                    {fileA.name}
                  </div>
                )}
              </div>
            </div>
            {/* Change button top-right */}
            {fileA && (
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={handleChangeA}
                  className="px-3 py-2 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  style={{ backgroundColor: '#FF575F', fontFamily: 'Arvo, serif' }}
                  title="Change file for Splat A"
                >
                  Change
                </button>
              </div>
            )}
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
                onViewerReady={handleContextReadyA}
              />
            )}
          </div>

          {/* Splat B */}
          <div className="flex-1 relative">
            {/* File info top-left */}
            <div className="absolute top-4 left-4 z-20">
              <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(62, 62, 62, 0.9)', fontFamily: 'Arvo, serif' }}>
                <div className="text-sm font-semibold mb-0.5" style={{ color: '#FFACBF' }}>Splat B</div>
                {fileB && (
                  <div className="text-sm truncate max-w-[200px]" title={fileB.name} style={{ color: '#FDFDFB' }}>
                    {fileB.name}
                  </div>
                )}
              </div>
            </div>
            {/* Change button top-right */}
            {fileB && (
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={handleChangeB}
                  className="px-3 py-2 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                  style={{ backgroundColor: '#FF575F', fontFamily: 'Arvo, serif' }}
                  title="Change file for Splat B"
                >
                  Change
                </button>
              </div>
            )}
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
                onViewerReady={handleContextReadyB}
              />
            )}
          </div>

          {/* Navigation Controls - Single panel for both sides */}
          {(fileA || fileB) && (
            <div className="absolute bottom-4 left-4 space-y-3" style={{ zIndex: 30 }}>
              <div className="px-4 py-3 rounded-lg text-xs" style={{ backgroundColor: 'rgba(62, 62, 62, 0.9)', color: '#FDFDFB', fontFamily: 'Arvo, serif' }}>
                <div className="font-semibold mb-2" style={{ color: '#B39DFF' }}>Navigation Controls</div>
                <div className="space-y-1">
                  <div><span className="font-medium">Rotate</span> - Left-click + Drag (One-finger)</div>
                  <div><span className="font-medium">Pan</span> - Right-click + Drag, Ctrl/Cmd + Drag (Two-finger)</div>
                  <div><span className="font-medium">Dolly ("zoom")</span> - Scroll (Mouse), Pinch (Trackpad)</div>
                </div>
              </div>
              {/* Camera distance display - shows for Splat A (primary viewer) */}
              <CameraDistance context={contextA} />
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
            onCompareQuality={handleManualCompareQuality}
            isComparingQuality={imageQuality.isComparing}
          />
        </div>
      </div>
    </div>
  );
}
