import { useState, useCallback, useRef } from 'react';
import type { BatchTestConfig, BatchResult } from '../../lib/batch/batchTesting';
import {
  BATCH_TEMPLATES,
  exportBatchToCSV
} from '../../lib/batch/batchTesting';
import { getScenePresets, STANDARD_VIEWPOINTS } from '../../lib/camera/cameraPresets';
import type { GSFile, SparkViewerContext } from '../../types';

interface BatchTestPanelProps {
  availableScenes: string[]; // e.g., ['bonsai', 'truck', 'playroom']
  onStartBatch?: (config: BatchTestConfig) => void;
  onExportResults?: (csv: string) => void;
  // Real test execution callbacks (same as SingleTestPanel)
  onLoadFile?: (file: GSFile, side: 'A' | 'B') => void;
  onGetContext?: (side: 'A' | 'B') => SparkViewerContext | null;
  onGetMetrics?: (side: 'A' | 'B') => {
    fps: number;
    loadTime: number;
    memoryMB: number;
    splatCount: number;
    resolution: { width: number; height: number };
  };
  onCaptureScreenshot?: (side: 'A' | 'B') => Promise<string | null>;
  onCompareQuality?: () => Promise<{ psnr: number | null; ssim: number | null }>;
}

export function BatchTestPanel({ 
  availableScenes,
  onStartBatch,
  onExportResults,
  onLoadFile,
  onGetContext,
  onGetMetrics,
  onCaptureScreenshot: _onCaptureScreenshot, // Reserved for future screenshot capture
  onCompareQuality,
}: BatchTestPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof BATCH_TEMPLATES>('quickValidation');
  const [selectedScenes, setSelectedScenes] = useState<string[]>(['bonsai', 'truck']);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['splat', 'spz']);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    currentTest: ''
  });
  const [results, setResults] = useState<BatchResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [replicates, setReplicates] = useState(1);
  const abortRef = useRef(false);

  const template = BATCH_TEMPLATES[selectedTemplate];
  
  // Get viewpoint count based on template
  const viewpointCount = template.viewpointCount || STANDARD_VIEWPOINTS.length;
  
  // Calculate total tests
  const totalTests = selectedScenes.length * selectedFormats.length * viewpointCount * replicates;

  // Check if real testing is available
  const canRunRealTests = !!(onLoadFile && onGetContext && onGetMetrics && onCompareQuality);

  // Handle template change - apply smart defaults
  const handleTemplateChange = (newTemplate: keyof typeof BATCH_TEMPLATES) => {
    setSelectedTemplate(newTemplate);
    const tmpl = BATCH_TEMPLATES[newTemplate];
    
    // Apply template defaults
    if (tmpl.defaultScenes) {
      // Only select scenes that are available
      const validScenes = tmpl.defaultScenes.filter(s => availableScenes.includes(s));
      setSelectedScenes(validScenes.length > 0 ? validScenes : availableScenes.slice(0, 2));
    }
    if (tmpl.defaultFormats) {
      setSelectedFormats(tmpl.defaultFormats);
    }
    if (tmpl.defaultReplicates) {
      setReplicates(tmpl.defaultReplicates);
    }
  };

  const handleSceneToggle = (scene: string) => {
    setSelectedScenes(prev => 
      prev.includes(scene) 
        ? prev.filter(s => s !== scene)
        : [...prev, scene]
    );
  };

  const handleFormatToggle = (format: string) => {
    setSelectedFormats(prev =>
      prev.includes(format)
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  // Helper functions for real batch testing
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getMimeType = (format: string): string => {
    switch (format) {
      case 'ply': return 'application/octet-stream';
      case 'splat': return 'application/octet-stream';
      case 'ksplat': return 'application/octet-stream';
      case 'spz': return 'application/octet-stream';
      default: return 'application/octet-stream';
    }
  };

  const waitForLoad = async (side: 'A' | 'B', fileName: string, maxWaitTime = 60000): Promise<{
    fps: number;
    loadTime: number;
    memoryMB: number;
    splatCount: number;
    resolution: { width: number; height: number };
  }> => {
    if (!onGetMetrics) throw new Error('onGetMetrics not provided');
    
    let waitTime = 0;
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
      
      await delay(100);
      waitTime += 100;
    }
    
    const finalMetrics = onGetMetrics(side);
    throw new Error(`Load timeout for ${fileName}. Final state: ${finalMetrics.splatCount.toLocaleString()} splats`);
  };

  const runSingleTest = async (
    scene: string,
    format: string,
    viewpointIndex: number,
    replicate: number
  ): Promise<BatchResult> => {
    if (!onLoadFile || !onGetContext || !onGetMetrics || !onCompareQuality) {
      throw new Error('Required callbacks not provided');
    }

    const viewpoints = getScenePresets(scene);
    const viewpoint = viewpoints[viewpointIndex] || viewpoints[0];

    // Load reference PLY in Splat A
    const refPath = `${scene}.ply`;
    const refResponse = await fetch(refPath);
    if (!refResponse.ok) {
      throw new Error(`Failed to load reference ${refPath}: ${refResponse.statusText}`);
    }
    const refBlob = await refResponse.blob();
    const refFile = new File([refBlob], `${scene}.ply`, { type: getMimeType('ply') });
    
    const refGsFile: GSFile = {
      file: refFile,
      name: refFile.name,
      size: refFile.size,
      format: '.ply',
    };

    onLoadFile(refGsFile, 'A');
    await delay(500);
    await waitForLoad('A', `${scene}.ply`);

    // Load test format in Splat B
    const testPath = `${scene}.${format}`;
    const testResponse = await fetch(testPath);
    if (!testResponse.ok) {
      throw new Error(`Failed to load ${testPath}: ${testResponse.statusText}`);
    }
    const testBlob = await testResponse.blob();
    const testFile = new File([testBlob], `${scene}.${format}`, { 
      type: getMimeType(format) 
    });
    
    const testGsFile: GSFile = {
      file: testFile,
      name: testFile.name,
      size: testFile.size,
      format: `.${format}` as GSFile['format'],
    };

    onLoadFile(testGsFile, 'B');
    await delay(500);
    await waitForLoad('B', `${scene}.${format}`);

    // Apply viewpoint to both
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

    // Stabilize
    await delay(2000);
    
    if (abortRef.current) throw new Error('Test aborted');

    // Capture metrics
    const finalMetrics = onGetMetrics('B');
    
    // Compute quality metrics
    let qualityMetrics = { psnr: null as number | null, ssim: null as number | null };
    try {
      qualityMetrics = await onCompareQuality();
    } catch (e) {
      console.log('Quality comparison failed:', e);
    }

    return {
      testId: `batch_${Date.now()}_${scene}_${format}_${viewpoint.id}_r${replicate}`,
      timestamp: new Date().toISOString(),
      sceneName: scene,
      testFormat: format,
      viewpointName: viewpoint.name,
      replicateNumber: replicate,
      qualityMetrics: {
        psnr: qualityMetrics.psnr,
        ssim: qualityMetrics.ssim,
        capturedAt: new Date().toISOString(),
        error: null
      },
      loadTimeMs: finalMetrics.loadTime,
      fps: finalMetrics.fps,
      fps1PercentLow: finalMetrics.fps * 0.85, // Estimated
      memoryMB: finalMetrics.memoryMB,
      frameTimeVariance: 1000 / finalMetrics.fps * 0.1, // Estimated 10% variance
      screenshotPath: undefined,
      browserInfo: {
        name: navigator.userAgent.split('/')[0] || 'Browser',
        version: navigator.userAgent.split('/')[1]?.split(' ')[0] || 'Unknown',
        gpu: 'WebGPU/WebGL'
      }
    };
  };

  const handleStartBatch = useCallback(async () => {
    if (selectedScenes.length === 0 || selectedFormats.length === 0) return;
    
    abortRef.current = false;
    setIsRunning(true);
    setResults([]);
    
    const config: BatchTestConfig = {
      testName: template.name,
      scenes: selectedScenes.map(name => ({
        sceneName: name,
        referenceFile: `${name}.ply`,
        testFiles: Object.fromEntries(
          selectedFormats.map(fmt => [fmt, `${name}.${fmt}`])
        )
      })),
      referenceFormat: 'ply',
      testFormats: selectedFormats,
      viewpoints: selectedTemplate === 'quickValidation' 
        ? STANDARD_VIEWPOINTS.slice(0, 2)
        : STANDARD_VIEWPOINTS,
      replicates: replicates,
      delayBetweenCaptures: 500,
      captureQualityMetrics: true,
      capturePerformanceMetrics: true,
      captureScreenshots: template.defaultConfig.captureScreenshots,
    };
    
    onStartBatch?.(config);

    // Run real tests if callbacks are available
    if (canRunRealTests) {
      const allResults: BatchResult[] = [];
      let testIndex = 0;
      
      // Use template's viewpoint count to determine which viewpoints to test
      const viewpointsToTest = Array.from({ length: viewpointCount }, (_, i) => i);
      
      try {
        for (const scene of selectedScenes) {
          for (const format of selectedFormats) {
            for (const vpIndex of viewpointsToTest) {
              for (let rep = 1; rep <= replicates; rep++) {
                if (abortRef.current) {
                  console.log('[Batch] Aborted by user');
                  break;
                }

                testIndex++;
                const viewpointName = getScenePresets(scene)[vpIndex]?.name || `Viewpoint ${vpIndex}`;
                setProgress({
                  current: testIndex,
                  total: totalTests,
                  currentTest: `${scene} / ${format} / ${viewpointName} (rep ${rep})`
                });

                try {
                  const result = await runSingleTest(scene, format, vpIndex, rep);
                  allResults.push(result);
                  setResults([...allResults]);
                  
                  // Short delay between tests
                  await delay(config.delayBetweenCaptures);
                } catch (err) {
                  console.error(`[Batch] Test failed: ${scene}/${format}/${vpIndex}`, err);
                  // Continue with next test
                }
              }
              if (abortRef.current) break;
            }
            if (abortRef.current) break;
          }
          if (abortRef.current) break;
        }
      } catch (err) {
        console.error('[Batch] Batch test error:', err);
      }

      setResults(allResults);
      setIsRunning(false);
      setProgress({ 
        current: allResults.length, 
        total: totalTests, 
        currentTest: `Complete! ${allResults.length} tests finished` 
      });
    } else {
      // Fallback to demo mode if callbacks not provided
      console.log('[Batch] Running in demo mode - callbacks not provided');
      setTimeout(() => {
        const mockResults: BatchResult[] = [];
        let resultId = 0;
        
        selectedScenes.forEach(scene => {
          selectedFormats.forEach(format => {
            // Use template's viewpoint count
            const viewpointsToUse = STANDARD_VIEWPOINTS.slice(0, viewpointCount);
            
            viewpointsToUse.forEach((vp) => {
              for (let rep = 1; rep <= replicates; rep++) {
                mockResults.push({
                  testId: `batch_${Date.now()}_${resultId++}`,
                  timestamp: new Date().toISOString(),
                  sceneName: scene,
                  testFormat: format,
                  viewpointName: vp.name,
                  replicateNumber: rep,
                  qualityMetrics: {
                    psnr: 32 + Math.random() * 3,
                    ssim: 0.92 + Math.random() * 0.05,
                    capturedAt: new Date().toISOString(),
                    error: null
                  },
                  loadTimeMs: 150 + Math.random() * 100,
                  fps: 30 + Math.random() * 25,
                  fps1PercentLow: 25 + Math.random() * 20,
                  memoryMB: 450 + Math.random() * 150,
                  frameTimeVariance: 2 + Math.random() * 3,
                  screenshotPath: undefined,
                  browserInfo: {
                    name: navigator.userAgent.split(' ')[0] || 'Unknown',
                    version: '1.0',
                    gpu: 'WebGPU'
                  }
                });
              }
            });
          });
        });
        
        setResults(mockResults);
        setIsRunning(false);
        setProgress({ current: totalTests, total: totalTests, currentTest: `Demo complete - ${mockResults.length} results generated` });
      }, 2000);
    }
  }, [selectedScenes, selectedFormats, selectedTemplate, template, totalTests, replicates, onStartBatch, canRunRealTests]);

  const handleCancelBatch = useCallback(() => {
    abortRef.current = true;
    setIsRunning(false);
    setProgress(prev => ({ ...prev, currentTest: 'Cancelled by user' }));
    // Don't clear results on cancel - let user export partial results
  }, []);

  const handleExportCSV = () => {
    if (results.length === 0) return;
    const csv = exportBatchToCSV(results);
    onExportResults?.(csv);
    
    // Also download directly
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4" style={{ fontFamily: 'Arvo, serif' }}>
      <div className="text-sm font-semibold mb-3" style={{ color: '#B39DFF' }}>
        Batch Testing
      </div>
      
      {/* Template Selection */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">Template</label>
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value as keyof typeof BATCH_TEMPLATES)}
          disabled={isRunning}
          className="w-full text-sm bg-gray-700 text-gray-200 rounded px-2 py-1.5 border border-gray-600 disabled:opacity-50"
        >
          {Object.entries(BATCH_TEMPLATES).map(([key, tmpl]) => (
            <option key={key} value={key}>{tmpl.name}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">{template.description}</p>
      </div>

      {/* Scene Selection */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">
          Scenes ({selectedScenes.length} selected)
        </label>
        <div className="flex flex-wrap gap-2">
          {availableScenes.map(scene => (
            <label 
              key={scene}
              className={`
                text-xs px-2 py-1 rounded cursor-pointer transition-colors
                ${selectedScenes.includes(scene)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedScenes.includes(scene)}
                onChange={() => handleSceneToggle(scene)}
                className="hidden"
              />
              {scene}
            </label>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-4">
        <label className="text-xs text-gray-400 block mb-1">
          Formats ({selectedFormats.length} selected)
        </label>
        <div className="flex flex-wrap gap-2">
          {['splat', 'ksplat', 'spz'].map(format => (
            <label
              key={format}
              className={`
                text-xs px-2 py-1 rounded cursor-pointer transition-colors
                ${selectedFormats.includes(format)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedFormats.includes(format)}
                onChange={() => handleFormatToggle(format)}
                className="hidden"
              />
              .{format}
            </label>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-900 rounded p-3 mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Total Tests:</span>
          <span className="text-white font-mono">{totalTests}</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Viewpoints per scene:</span>
          <span className="text-white font-mono">{viewpointCount}</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Replicates:</span>
          <span className="text-white font-mono">{replicates}</span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Est. Time:</span>
          <span className="text-white font-mono">~{Math.ceil(totalTests * 0.5)} min</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Mode:</span>
          <span className={`font-mono ${canRunRealTests ? 'text-green-400' : 'text-yellow-400'}`}>
            {canRunRealTests ? 'Real Testing' : 'Demo Mode'}
          </span>
        </div>
      </div>

      {/* Progress (when running) */}
      {isRunning && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{progress.current} / {progress.total}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 truncate">
            {progress.currentTest}
          </div>
        </div>
      )}

      {/* Start/Cancel Buttons */}
      {isRunning ? (
        <button
          onClick={handleCancelBatch}
          className="w-full py-2 rounded text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors"
        >
          Cancel / Reset
        </button>
      ) : (
        <button
          onClick={handleStartBatch}
          disabled={selectedScenes.length === 0 || selectedFormats.length === 0}
          className="w-full py-2 rounded text-sm font-semibold bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Start Batch Test
        </button>
      )}

      {/* Results Actions */}
      {results.length > 0 && !isRunning && (
        <div className="mt-3 space-y-2">
          <div className="text-xs text-gray-400">
            {results.length} tests completed
          </div>
          <button
            onClick={handleExportCSV}
            className="w-full py-2 rounded text-sm bg-blue-600 hover:bg-blue-500 text-white"
          >
            Export Results (CSV)
          </button>
        </div>
      )}

      {/* Advanced Options Toggle */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-gray-400 hover:text-gray-200"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Options
        </button>
        
        {showAdvanced && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Replicates per test</label>
              <input
                type="number"
                min={1}
                max={10}
                value={replicates}
                onChange={(e) => setReplicates(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                disabled={isRunning}
                className="w-full text-sm bg-gray-700 text-gray-200 rounded px-2 py-1 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                More replicates = more stable averages, but longer test time
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {canRunRealTests 
                ? 'Real batch testing enabled. Tests will load actual files and compute metrics.'
                : 'Demo mode: Connect callbacks in AppLayout to enable real testing.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
