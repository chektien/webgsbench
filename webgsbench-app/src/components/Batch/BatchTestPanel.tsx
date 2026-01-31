import { useState, useCallback } from 'react';
import type { BatchTestConfig, BatchResult } from '../../lib/batch/batchTesting';
import {
  BATCH_TEMPLATES,
  exportBatchToCSV
} from '../../lib/batch/batchTesting';
import { STANDARD_VIEWPOINTS } from '../../lib/camera/cameraPresets';

interface BatchTestPanelProps {
  availableScenes: string[]; // e.g., ['bonsai', 'truck', 'playroom']
  onStartBatch?: (config: BatchTestConfig) => void;
  onExportResults?: (csv: string) => void;
}

export function BatchTestPanel({ 
  availableScenes,
  onStartBatch,
  onExportResults
}: BatchTestPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof BATCH_TEMPLATES>('paperEvaluation');
  const [selectedScenes, setSelectedScenes] = useState<string[]>(availableScenes);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['splat', 'ksplat', 'spz']);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    currentTest: ''
  });
  const [results, setResults] = useState<BatchResult[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const template = BATCH_TEMPLATES[selectedTemplate];
  
  // Calculate total tests
  const totalTests = selectedScenes.length * selectedFormats.length * STANDARD_VIEWPOINTS.length * 
    (selectedTemplate === 'quickValidation' ? 1 : 3);

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

  const handleStartBatch = useCallback(() => {
    if (selectedScenes.length === 0 || selectedFormats.length === 0) return;
    
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
      replicates: selectedTemplate === 'quickValidation' ? 1 : 3,
      delayBetweenCaptures: 500,
      captureQualityMetrics: true,
      capturePerformanceMetrics: true,
      captureScreenshots: selectedTemplate !== 'quickValidation',
    };
    
    setIsRunning(true);
    setProgress({ current: 0, total: totalTests, currentTest: 'Ready to start (manual mode)' });
    onStartBatch?.(config);
    
    // Auto-complete after 2 seconds for demo (remove when real batch implemented)
    setTimeout(() => {
      // Generate mock results matching BatchResult interface
      const mockResults: BatchResult[] = [];
      let resultId = 0;
      
      selectedScenes.forEach(scene => {
        selectedFormats.forEach(format => {
          const viewpoints = selectedTemplate === 'quickValidation' 
            ? STANDARD_VIEWPOINTS.slice(0, 2)
            : STANDARD_VIEWPOINTS;
          
          viewpoints.forEach((vp) => {
            const replicates = selectedTemplate === 'quickValidation' ? 1 : 3;
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
  }, [selectedScenes, selectedFormats, selectedTemplate, template, totalTests, onStartBatch]);

  const handleCancelBatch = useCallback(() => {
    setIsRunning(false);
    setProgress({ current: 0, total: 0, currentTest: '' });
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

  const estimatedTime = Math.ceil(totalTests * 0.5); // ~30 seconds per test

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
          onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof BATCH_TEMPLATES)}
          className="w-full text-sm bg-gray-700 text-gray-200 rounded px-2 py-1.5 border border-gray-600"
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
          <span className="text-white font-mono">
            {selectedTemplate === 'quickValidation' ? 2 : 5}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Est. Time:</span>
          <span className="text-white font-mono">~{estimatedTime} min</span>
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
              <label className="text-xs text-gray-400 block mb-1">Replicates</label>
              <input
                type="number"
                min={1}
                max={10}
                defaultValue={selectedTemplate === 'quickValidation' ? 1 : 3}
                className="w-full text-sm bg-gray-700 text-gray-200 rounded px-2 py-1"
              />
            </div>
            <div className="text-xs text-gray-500">
              Configure batch test parameters via configuration file for more options.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
