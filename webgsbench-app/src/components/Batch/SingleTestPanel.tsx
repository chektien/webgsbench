import { useState, useCallback, useRef } from 'react';
import type { GSFile, SparkViewerContext } from '../../types';
import { getScenePresets } from '../../lib/camera/cameraPresets';

interface SingleTestPanelProps {
  onLoadFile: (file: GSFile, side: 'A' | 'B') => void;
  onGetContext: (side: 'A' | 'B') => SparkViewerContext | null;
  onGetMetrics: (side: 'A' | 'B') => {
    fps: number;
    loadTime: number;
    memoryMB: number;
    splatCount: number;
    resolution: { width: number; height: number };
  };
  onCaptureScreenshot: (side: 'A' | 'B') => Promise<string | null>;
  onCompareQuality: () => Promise<{ psnr: number | null; ssim: number | null }>;
  availableScenes: string[];
  availableFormats: string[];
}

type TestPhase = 'idle' | 'loading' | 'stabilizing' | 'capturing' | 'complete' | 'error';

interface TestResult {
  timestamp: string;
  sceneName: string;
  format: string;
  viewpointName: string;
  loadTimeMs: number;
  fps: number;
  memoryMB: number;
  splatCount: number;
  psnr: number | null;
  ssim: number | null;
  resolution: { width: number; height: number };
  screenshotDataUrl: string | null;
  durationMs: number;
}

export function SingleTestPanel({
  onLoadFile,
  onGetContext,
  onGetMetrics,
  onCaptureScreenshot,
  onCompareQuality,
  availableScenes,
  availableFormats
}: SingleTestPanelProps) {
  const [selectedScene, setSelectedScene] = useState<string>(availableScenes[0] || 'bonsai');
  const [selectedFormat, setSelectedFormat] = useState<string>(availableFormats[0] || 'splat');
  const [selectedViewpoint, setSelectedViewpoint] = useState<number>(0);
  const [phase, setPhase] = useState<TestPhase>('idle');
  const [progress, setProgress] = useState<string>('');
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string>('');
  const abortRef = useRef(false);

  const viewpoints = getScenePresets(selectedScene);

  const reset = () => {
    abortRef.current = false;
    setPhase('idle');
    setProgress('');
    setResult(null);
    setError('');
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const waitForLoad = async (side: 'A' | 'B', fileName: string) => {
    let waitTime = 0;
    const maxWaitTime = 60000;
    let lastSplatCount = 0;
    let stableCount = 0;
    
    while (waitTime < maxWaitTime) {
      if (abortRef.current) throw new Error('Test aborted');
      
      const metrics = onGetMetrics(side);
      
      if (metrics.loadTime > 0 && metrics.splatCount > 0) {
        if (metrics.splatCount === lastSplatCount) {
          stableCount++;
          if (stableCount >= 5) {
            return metrics;
          }
        } else {
          stableCount = 0;
          lastSplatCount = metrics.splatCount;
        }
      }
      
      setProgress(`Loading ${fileName}... ${metrics.splatCount > 0 ? `(${metrics.splatCount.toLocaleString()} splats)` : ''}`);
      
      await delay(100);
      waitTime += 100;
    }
    
    const finalMetrics = onGetMetrics(side);
    throw new Error(`Load timeout for ${fileName}. Final state: ${finalMetrics.splatCount.toLocaleString()} splats`);
  };

  const runTest = useCallback(async () => {
    if (phase === 'loading' || phase === 'stabilizing' || phase === 'capturing') {
      return;
    }

    reset();
    abortRef.current = false;
    const startTime = performance.now();

    try {
      // Phase 1: Load reference PLY in Splat A
      setPhase('loading');
      setProgress(`Loading reference: ${selectedScene}.ply...`);

      const refPath = `${selectedScene}.ply`;
      const refResponse = await fetch(refPath);
      if (!refResponse.ok) {
        throw new Error(`Failed to load reference ${refPath}: ${refResponse.statusText}`);
      }
      const refBlob = await refResponse.blob();
      const refFile = new File([refBlob], `${selectedScene}.ply`, { type: getMimeType('ply') });
      
      const refGsFile: GSFile = {
        file: refFile,
        name: refFile.name,
        size: refFile.size,
        format: '.ply',
      };

      onLoadFile(refGsFile, 'A');
      await delay(500);
      
      const refMetrics = await waitForLoad('A', `${selectedScene}.ply`);
      setProgress(`Reference loaded: ${refMetrics.splatCount.toLocaleString()} splats in ${refMetrics.loadTime.toFixed(0)}ms`);

      // Phase 2: Load test format in Splat B
      setProgress(`Loading test format: ${selectedScene}.${selectedFormat}...`);
      
      const testPath = `${selectedScene}.${selectedFormat}`;
      const testResponse = await fetch(testPath);
      if (!testResponse.ok) {
        throw new Error(`Failed to load ${testPath}: ${testResponse.statusText}`);
      }
      const testBlob = await testResponse.blob();
      const testFile = new File([testBlob], `${selectedScene}.${selectedFormat}`, { 
        type: getMimeType(selectedFormat) 
      });
      
      const testGsFile: GSFile = {
        file: testFile,
        name: testFile.name,
        size: testFile.size,
        format: `.${selectedFormat}` as GSFile['format'],
      };

      onLoadFile(testGsFile, 'B');
      await delay(500);
      
      const testMetrics = await waitForLoad('B', `${selectedScene}.${selectedFormat}`);
      setProgress(`Test format loaded: ${testMetrics.splatCount.toLocaleString()} splats in ${testMetrics.loadTime.toFixed(0)}ms`);

      // Phase 3: Apply viewpoint to both
      setPhase('stabilizing');
      const viewpoint = viewpoints[selectedViewpoint];
      
      const contextA = onGetContext('A');
      const contextB = onGetContext('B');
      
      if (contextA && viewpoint) {
        contextA.camera.position.set(viewpoint.position.x, viewpoint.position.y, viewpoint.position.z);
        contextA.controls.target.set(viewpoint.target.x, viewpoint.target.y, viewpoint.target.z);
        contextA.controls.update();
      }
      
      if (contextB && viewpoint) {
        contextB.camera.position.set(viewpoint.position.x, viewpoint.position.y, viewpoint.position.z);
        contextB.controls.target.set(viewpoint.target.x, viewpoint.target.y, viewpoint.target.z);
        contextB.controls.update();
      }

      setProgress(`Viewpoint: ${viewpoint?.name || 'default'}. Stabilizing...`);
      await delay(2000);
      
      if (abortRef.current) throw new Error('Test aborted');

      // Phase 4: Capture metrics and quality
      setPhase('capturing');
      setProgress('Capturing metrics and computing quality...');

      const finalMetrics = onGetMetrics('B');
      const screenshot = await onCaptureScreenshot('B');
      
      // Compute quality metrics (PSNR/SSIM)
      let qualityMetrics = { psnr: null as number | null, ssim: null as number | null };
      try {
        qualityMetrics = await onCompareQuality();
      } catch (e) {
        console.log('Quality comparison failed:', e);
      }

      const durationMs = performance.now() - startTime;

      const testResult: TestResult = {
        timestamp: new Date().toISOString(),
        sceneName: selectedScene,
        format: selectedFormat,
        viewpointName: viewpoint?.name || 'default',
        loadTimeMs: finalMetrics.loadTime,
        fps: finalMetrics.fps,
        memoryMB: finalMetrics.memoryMB,
        splatCount: finalMetrics.splatCount,
        psnr: qualityMetrics.psnr,
        ssim: qualityMetrics.ssim,
        resolution: finalMetrics.resolution,
        screenshotDataUrl: screenshot,
        durationMs
      };

      setResult(testResult);
      setPhase('complete');
      setProgress(`Complete! Test took ${(durationMs / 1000).toFixed(1)}s`);

    } catch (err) {
      console.error('Test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setPhase('error');
    }
  }, [selectedScene, selectedFormat, selectedViewpoint, viewpoints, onLoadFile, onGetContext, onGetMetrics, onCaptureScreenshot, onCompareQuality]);

  const handleCancel = () => {
    abortRef.current = true;
    setPhase('idle');
    setProgress('Cancelled');
  };

  const exportResult = () => {
    if (!result) return;

    const csv = [
      'timestamp,sceneName,format,viewpointName,loadTimeMs,fps,memoryMB,splatCount,psnr,ssim,resolution,durationMs',
      `${result.timestamp},${result.sceneName},${result.format},${result.viewpointName},${result.loadTimeMs.toFixed(2)},${result.fps.toFixed(2)},${result.memoryMB.toFixed(2)},${result.splatCount},${result.psnr?.toFixed(4) || ''},${result.ssim?.toFixed(4) || ''},${result.resolution.width}x${result.resolution.height},${result.durationMs.toFixed(2)}`
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `single_test_${result.sceneName}_${result.format}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'loading': return 'text-yellow-400';
      case 'stabilizing': return 'text-blue-400';
      case 'capturing': return 'text-purple-400';
      case 'complete': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4" style={{ fontFamily: 'Arvo, serif' }}>
      <div className="text-sm font-semibold mb-3" style={{ color: '#B39DFF' }}>
        Single Test (Real Metrics)
      </div>

      {/* Scene Selection */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Scene</label>
        <select
          value={selectedScene}
          onChange={(e) => {
            setSelectedScene(e.target.value);
            setSelectedViewpoint(0); // Reset viewpoint when scene changes
          }}
          disabled={phase === 'loading' || phase === 'stabilizing' || phase === 'capturing'}
          className="w-full text-sm bg-gray-700 text-gray-200 rounded px-2 py-1.5 border border-gray-600 disabled:opacity-50"
        >
          {availableScenes.map(scene => (
            <option key={scene} value={scene}>{scene}</option>
          ))}
        </select>
      </div>

      {/* Format Selection */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Format</label>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          disabled={phase === 'loading' || phase === 'stabilizing' || phase === 'capturing'}
          className="w-full text-sm bg-gray-700 text-gray-200 rounded px-2 py-1.5 border border-gray-600 disabled:opacity-50"
        >
          {availableFormats.map(fmt => (
            <option key={fmt} value={fmt}>.{fmt}</option>
          ))}
        </select>
      </div>

      {/* Viewpoint Selection */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">
          Viewpoint ({viewpoints.length} available)
        </label>
        <select
          value={selectedViewpoint}
          onChange={(e) => setSelectedViewpoint(Number(e.target.value))}
          disabled={phase === 'loading' || phase === 'stabilizing' || phase === 'capturing'}
          className="w-full text-sm bg-gray-700 text-gray-200 rounded px-2 py-1.5 border border-gray-600 disabled:opacity-50"
        >
          {viewpoints.map((vp, idx) => (
            <option key={idx} value={idx}>{vp.name}</option>
          ))}
        </select>
      </div>

      {/* Status / Progress */}
      {(phase !== 'idle' || progress) && (
        <div className="mb-4 p-3 bg-gray-900 rounded">
          <div className={`text-xs font-medium mb-1 ${getPhaseColor()}`}>
            {phase === 'idle' ? 'Ready' : phase.charAt(0).toUpperCase() + phase.slice(1)}
          </div>
          <div className="text-xs text-gray-400">{progress || 'Waiting to start...'}</div>
          {(phase === 'loading' || phase === 'stabilizing' || phase === 'capturing') && (
            <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded">
          <div className="text-xs text-red-400 font-medium">Error</div>
          <div className="text-xs text-red-300">{error}</div>
        </div>
      )}

      {/* Run/Cancel Button */}
      {phase === 'loading' || phase === 'stabilizing' || phase === 'capturing' ? (
        <button
          onClick={handleCancel}
          className="w-full py-2 rounded text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors"
        >
          Cancel Test
        </button>
      ) : (
        <button
          onClick={runTest}
          className="w-full py-2 rounded text-sm font-semibold bg-green-600 hover:bg-green-500 text-white transition-colors"
        >
          Run Single Test
        </button>
      )}

      {/* Results */}
      {result && phase === 'complete' && (
        <div className="mt-4 p-3 bg-gray-900 rounded space-y-2">
          <div className="text-xs font-medium text-green-400">Test Complete!</div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-400">Load Time:</div>
            <div className="text-white font-mono">{result.loadTimeMs.toFixed(0)} ms</div>
            
            <div className="text-gray-400">FPS:</div>
            <div className="text-white font-mono">{result.fps.toFixed(1)}</div>
            
            <div className="text-gray-400">Memory:</div>
            <div className="text-white font-mono">{result.memoryMB.toFixed(1)} MB</div>
            
            <div className="text-gray-400">Splats:</div>
            <div className="text-white font-mono">{result.splatCount.toLocaleString()}</div>
            
            <div className="text-gray-400">Resolution:</div>
            <div className="text-white font-mono">{result.resolution.width}x{result.resolution.height}</div>
            
            {result.psnr !== null && (
              <>
                <div className="text-gray-400">PSNR:</div>
                <div className="text-white font-mono">{result.psnr.toFixed(2)} dB</div>
              </>
            )}
            
            {result.ssim !== null && (
              <>
                <div className="text-gray-400">SSIM:</div>
                <div className="text-white font-mono">{result.ssim.toFixed(4)}</div>
              </>
            )}
            
            <div className="text-gray-400">Total Time:</div>
            <div className="text-white font-mono">{(result.durationMs / 1000).toFixed(1)}s</div>
          </div>

          {result.screenshotDataUrl && (
            <div className="mt-2">
              <div className="text-xs text-gray-400 mb-1">Screenshot:</div>
              <img 
                src={result.screenshotDataUrl} 
                alt="Test screenshot"
                className="w-full h-32 object-cover rounded border border-gray-600"
              />
            </div>
          )}

          <button
            onClick={exportResult}
            className="w-full mt-2 py-2 rounded text-sm bg-blue-600 hover:bg-blue-500 text-white"
          >
            Export Result (CSV)
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500">
        <p className="mb-1">This test will:</p>
        <ol className="list-decimal list-inside space-y-0.5 ml-1">
          <li>Load reference PLY in Splat A (ground truth)</li>
          <li>Load test format in Splat B</li>
          <li>Apply same viewpoint to both</li>
          <li>Wait 2s for stabilization</li>
          <li>Capture metrics & compute PSNR/SSIM</li>
        </ol>
        <p className="mt-2 text-gray-400">
          Compares compressed format against PLY reference.
        </p>
      </div>
    </div>
  );
}

function getMimeType(format: string): string {
  switch (format) {
    case 'ply': return 'application/octet-stream';
    case 'splat': return 'application/octet-stream';
    case 'ksplat': return 'application/octet-stream';
    case 'spz': return 'application/octet-stream';
    default: return 'application/octet-stream';
  }
}
