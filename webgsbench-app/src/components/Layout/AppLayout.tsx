import { useState, useEffect, useCallback, useMemo } from 'react';
import type { GSFile, SparkViewerContext } from '../../types';
import { FileDropzone } from '../FileLoader/FileDropzone';
import { GSViewer } from '../Viewer/GSViewer';
import { CameraDistance } from '../Viewer/CameraDistance';
import { MetricsPanel } from '../Metrics/MetricsPanel';
import { CameraPresetPanel } from '../Camera/CameraPresetPanel';
import { BatchTestPanel } from '../Batch/BatchTestPanel';
import { SingleTestPanel } from '../Batch/SingleTestPanel';
import { ExportPanel } from '../Export/ExportPanel';
import { useMetrics } from '../../hooks/useMetrics';
import { useImageQuality } from '../../hooks/useImageQuality';
import { useCameraSync } from '../../hooks/useCameraSync';
import { getScenePresets } from '../../lib/camera/cameraPresets';

// Scene detection from filename
function detectSceneName(filename: string): string | null {
  const knownScenes = ['bonsai', 'garden', 'playroom', 'truck', 'train', 'flower'];
  const lowerFilename = filename.toLowerCase();
  
  for (const scene of knownScenes) {
    if (lowerFilename.includes(scene)) {
      return scene;
    }
  }
  
  // Try to extract base name (remove extension and common suffixes)
  const baseName = filename
    .replace(/\.(ply|splat|ksplat|spz)$/i, '')
    .replace(/-splatfacto$/i, '')
    .replace(/_converted$/i, '');
  
  return baseName || null;
}

export function AppLayout() {
  const [fileA, setFileA] = useState<GSFile | null>(null);
  const [fileB, setFileB] = useState<GSFile | null>(null);
  const [contextA, setContextA] = useState<SparkViewerContext | null>(null);
  const [contextB, setContextB] = useState<SparkViewerContext | null>(null);
  const [cameraSyncEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'metrics' | 'single' | 'batch' | 'export'>('metrics');
  const [showCameraPresets, setShowCameraPresets] = useState(true);

  const metricsA = useMetrics();
  const metricsB = useMetrics();
  const imageQuality = useImageQuality();

  // Detect scene names from filenames
  const sceneNameA = useMemo(() => detectSceneName(fileA?.name || ''), [fileA?.name]);
  const sceneNameB = useMemo(() => detectSceneName(fileB?.name || ''), [fileB?.name]);
  const currentScene = sceneNameA || sceneNameB || 'unknown';

  // Camera sync: Splat B follows Splat A
  useCameraSync({
    sourceContext: contextA,
    targetContext: contextB,
    enabled: cameraSyncEnabled && !!contextA && !!contextB,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (document.activeElement?.tagName === 'INPUT') return;
      
      // Number keys 1-5 for camera presets
      if (e.key >= '1' && e.key <= '5') {
        const presetIndex = parseInt(e.key) - 1;
        const presets = getScenePresets(currentScene);
        if (presetIndex < presets.length && contextA) {
          const preset = presets[presetIndex];
          contextA.camera.position.set(preset.position.x, preset.position.y, preset.position.z);
          contextA.controls.target.set(preset.target.x, preset.target.y, preset.target.z);
          contextA.controls.update();
          console.log(`[Keyboard] Applied camera preset: ${preset.name}`);
        }
        return;
      }
      
      // 'C' for screenshot capture
      if (e.key === 'c' || e.key === 'C') {
        console.log('[Keyboard] Capture screenshot - implement export');
        // Trigger export panel
        setActiveTab('export');
        return;
      }
      
      // 'E' for CSV export
      if (e.key === 'e' || e.key === 'E') {
        console.log('[Keyboard] Export CSV');
        setActiveTab('export');
        return;
      }
      
      // 'B' for batch testing
      if (e.key === 'b' || e.key === 'B') {
        setActiveTab('batch');
        return;
      }
      
      // 'M' for metrics
      if (e.key === 'm' || e.key === 'M') {
        setActiveTab('metrics');
        return;
      }
      
      // 'P' to toggle camera presets
      if (e.key === 'p' || e.key === 'P') {
        setShowCameraPresets(prev => !prev);
        return;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contextA, currentScene]);

  const handleFileSelectA = (file: GSFile) => {
    metricsA.reset();
    setFileA(file);
    console.log(`[File] Loaded A: ${file.name} (detected scene: ${detectSceneName(file.name)})`);
  };

  const handleFileSelectB = (file: GSFile) => {
    metricsB.reset();
    setFileB(file);
    console.log(`[File] Loaded B: ${file.name} (detected scene: ${detectSceneName(file.name)})`);
  };

  // Auto-trigger quality comparison when both files are loaded
  useEffect(() => {
    if (fileA && fileB && contextA && contextB && !imageQuality.isComparing && imageQuality.metrics.psnr === null) {
      const timer = setTimeout(() => {
        console.log('=== Auto-triggering Quality Comparison ===');
        console.log('Splat A:', fileA.name, 'Scene:', detectSceneName(fileA.name));
        console.log('Splat B:', fileB.name, 'Scene:', detectSceneName(fileB.name));
        if (fileA.name === fileB.name) {
          console.warn('⚠️ WARNING: Both viewers loaded the SAME FILE!');
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
    document.getElementById('file-input-A')?.click();
  };

  const handleChangeB = () => {
    document.getElementById('file-input-B')?.click();
  };

  const handleClearA = () => {
    setFileA(null);
    setContextA(null);
    metricsA.reset();
    imageQuality.reset();
  };

  const handleClearB = () => {
    setFileB(null);
    setContextB(null);
    metricsB.reset();
    imageQuality.reset();
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

    const timeoutId = setTimeout(updateResolution, 100);
    window.addEventListener('resize', updateResolution);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateResolution);
    };
  }, [fileA, fileB]);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Hidden file inputs */}
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
          e.target.value = '';
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
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between shadow-lg" style={{ backgroundColor: '#3E3E3E', borderBottom: '1px solid #555', fontFamily: 'Arvo, serif' }}>
        <div>
          <h1 className="text-3xl tracking-tight" style={{ color: '#B39DFF', fontFamily: 'Arvo, serif' }}>WebGSBench</h1>
          <p className="text-xs mt-1" style={{ color: '#FFACBF', fontFamily: 'Arvo, serif' }}>Web 3D Gaussian Splatting Benchmarking Tool</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-gray-400 hidden lg:block">
            <span className="mr-2">1-5: Viewpoints</span>
            <span className="mr-2">C: Capture</span>
            <span className="mr-2">E: Export</span>
            <span>B: Batch</span>
          </div>
          {(fileA || fileB) && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
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
                {sceneNameA && (
                  <div className="text-xs text-gray-400 mt-0.5">Scene: {sceneNameA}</div>
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
            {/* Camera Presets for A */}
            {fileA && showCameraPresets && (
              <div className="absolute top-24 left-4 z-20">
                <CameraPresetPanel 
                  viewerContext={contextA} 
                  sceneName={sceneNameA || undefined}
                  onPresetApplied={(preset) => console.log('[Preset] Applied:', preset.name)}
                />
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
                {sceneNameB && (
                  <div className="text-xs text-gray-400 mt-0.5">Scene: {sceneNameB}</div>
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
            {/* Camera Presets for B */}
            {fileB && showCameraPresets && (
              <div className="absolute top-24 left-4 z-20">
                <CameraPresetPanel 
                  viewerContext={contextB} 
                  sceneName={sceneNameB || undefined}
                  onPresetApplied={(preset) => console.log('[Preset] Applied to B:', preset.name)}
                />
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

          {/* Navigation Controls */}
          {(fileA || fileB) && (
            <div className="absolute bottom-4 left-4 space-y-3" style={{ zIndex: 30 }}>
              <div className="px-4 py-3 rounded-lg text-xs" style={{ backgroundColor: 'rgba(62, 62, 62, 0.9)', color: '#FDFDFB', fontFamily: 'Arvo, serif' }}>
                <div className="font-semibold mb-2" style={{ color: '#B39DFF' }}>Navigation Controls</div>
                <div className="space-y-1">
                  <div><span className="font-medium">Rotate</span> - Left-click + Drag</div>
                  <div><span className="font-medium">Pan</span> - Right-click + Drag</div>
                  <div><span className="font-medium">Dolly</span> - Scroll / Pinch</div>
                </div>
              </div>
              <CameraDistance context={contextA} />
            </div>
          )}
        </div>

        {/* Right Panel - Tabbed Interface */}
        <div className="w-80 flex flex-col" style={{ borderLeft: '1px solid #444' }}>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-600" style={{ backgroundColor: '#3E3E3E' }}>
            {(['metrics', 'single', 'batch', 'export'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-semibold transition-colors ${
                  activeTab === tab
                    ? 'text-white border-b-2'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                style={{
                  borderColor: activeTab === tab ? '#B39DFF' : 'transparent',
                  fontFamily: 'Arvo, serif',
                }}
              >
                {tab === 'metrics' && 'Metrics'}
                {tab === 'single' && 'Single Test'}
                {tab === 'batch' && 'Batch Test'}
                {tab === 'export' && 'Export'}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#3E3E3E' }}>
            {activeTab === 'metrics' && (
              <MetricsPanel
                metricsA={metricsA.metrics}
                metricsB={metricsB.metrics}
                showComparison={!!(fileA && fileB)}
                qualityMetrics={imageQuality.metrics}
                onCompareQuality={handleManualCompareQuality}
                isComparingQuality={imageQuality.isComparing}
              />
            )}

            {activeTab === 'single' && (
              <div className="p-4">
                <SingleTestPanel
                  availableScenes={['bonsai', 'garden', 'playroom', 'truck', 'train', 'flower']}
                  availableFormats={['splat', 'ksplat', 'spz']}
                  onLoadFile={(file, side) => {
                    if (side === 'B') {
                      handleFileSelectB(file);
                    } else {
                      handleFileSelectA(file);
                    }
                  }}
                  onGetContext={(side) => side === 'A' ? contextA : contextB}
                  onGetMetrics={(side) => {
                    const m = side === 'A' ? metricsA.getCurrentMetrics() : metricsB.getCurrentMetrics();
                    return {
                      fps: m.fps,
                      loadTime: m.loadTime,
                      memoryMB: m.memoryUsage,
                      splatCount: m.splatCount,
                      resolution: { width: m.resolution[0], height: m.resolution[1] }
                    };
                  }}
                  onCaptureScreenshot={async (side) => {
                    const ctx = side === 'A' ? contextA : contextB;
                    if (!ctx) return null;
                    // Use the viewer's canvas to capture screenshot
                    const canvas = ctx.renderer.domElement;
                    return canvas.toDataURL('image/png');
                  }}
                  onCompareQuality={async () => {
                    if (contextA && contextB) {
                      // compareQuality now returns the metrics directly
                      const result = await imageQuality.compareQuality(contextA, contextB);
                      return result;
                    }
                    return { psnr: null, ssim: null };
                  }}
                />
              </div>
            )}

            {activeTab === 'batch' && (
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-2">
                  Batch testing is currently in demo mode. Use "Single Test" for real metrics.
                </p>
                <BatchTestPanel
                  availableScenes={['bonsai', 'garden', 'playroom', 'truck', 'train', 'flower']}
                  onStartBatch={(config) => console.log('[Batch] Starting:', config)}
                />
              </div>
            )}
            
            {activeTab === 'export' && (
              <div className="p-4">
                <ExportPanel
                  sceneName={currentScene}
                  formatA={fileA?.format.replace('.', '')}
                  formatB={fileB?.format.replace('.', '')}
                  viewpointName="current"
                  cameraDistance={contextA?.camera.position.length()}
                  metricsA={metricsA.metrics}
                  metricsB={metricsB.metrics}
                  qualityMetrics={imageQuality.metrics}
                  contextA={contextA}
                  contextB={contextB}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
