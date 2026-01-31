import { useState } from 'react';
import { createExportRecord, exportAndDownload, createCSVExporter } from '../../lib/export/csvExport';
import { captureScreenshotWithMetadata, generateScreenshotFilename, downloadScreenshot } from '../../lib/export/screenshot';
import type { BenchmarkMetrics, ImageQualityMetrics, SparkViewerContext } from '../../types';

interface ExportPanelProps {
  sceneName?: string;
  formatA?: string;
  formatB?: string;
  viewpointName?: string;
  cameraDistance?: number;
  metricsA: BenchmarkMetrics;
  metricsB: BenchmarkMetrics;
  qualityMetrics: ImageQualityMetrics;
  contextA: SparkViewerContext | null;
  contextB: SparkViewerContext | null;
}

export function ExportPanel({
  sceneName = 'unknown',
  formatA = 'reference',
  formatB = 'test',
  viewpointName = 'custom',
  cameraDistance = 0,
  metricsA,
  metricsB,
  qualityMetrics,
  contextA,
  contextB,
}: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);
  
  const csvExporter = createCSVExporter();

  const handleExportCSV = () => {
    const record = createExportRecord(
      sceneName,
      formatA,
      formatB,
      viewpointName,
      cameraDistance,
      {
        x: contextA?.camera.position.x || 0,
        y: contextA?.camera.position.y || 0,
        z: contextA?.camera.position.z || 0,
      },
      metricsA,
      metricsB,
      qualityMetrics
    );
    
    csvExporter.add(record);
    
    const timestamp = new Date().toLocaleTimeString();
    setLastExport(`CSV exported at ${timestamp}`);
    
    // Auto-download
    exportAndDownload(record);
  };

  const handleExportScreenshot = async (side: 'A' | 'B' | 'comparison') => {
    setIsExporting(true);
    
    try {
      if (side === 'comparison') {
        if (!contextA || !contextB) return;
        
        // Import dynamically to avoid circular dependencies
        const { captureComparisonScreenshot, generateComparisonFilename } = await import('../../lib/export/screenshot');
        const blob = await captureComparisonScreenshot(contextA, contextB);
        const filename = generateComparisonFilename(sceneName, viewpointName, new Date().toISOString());
        downloadScreenshot(blob, filename);
        setLastExport(`Comparison screenshot: ${filename}`);
      } else {
        const context = side === 'A' ? contextA : contextB;
        if (!context) return;
        
        const format = side === 'A' ? formatA : formatB;
        const { blob, metadata } = await captureScreenshotWithMetadata(
          context,
          {
            sceneName,
            format,
            viewpoint: viewpointName,
            side,
          }
        );
        
        const filename = generateScreenshotFilename(metadata);
        downloadScreenshot(blob, filename);
        setLastExport(`${side === 'A' ? 'Reference' : 'Test'} screenshot: ${filename}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setLastExport('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const canExport = !!contextA && !!contextB && qualityMetrics.psnr !== null;

  return (
    <div className="bg-gray-800 rounded-lg p-4" style={{ fontFamily: 'Arvo, serif' }}>
      <div className="text-sm font-semibold mb-3" style={{ color: '#B39DFF' }}>
        Export Results
      </div>

      {/* CSV Export */}
      <div className="mb-4">
        <button
          onClick={handleExportCSV}
          disabled={!canExport}
          className={`
            w-full py-2 rounded text-sm font-medium transition-colors
            ${canExport
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Export CSV Data
        </button>
        <div className="text-xs text-gray-500 mt-1">
          Full metrics with system info
        </div>
      </div>

      {/* Screenshot Export */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">Screenshots (1920×1080)</div>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleExportScreenshot('A')}
            disabled={!contextA || isExporting}
            className="py-2 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:opacity-50"
          >
            {isExporting ? '...' : 'Reference'}
          </button>
          
          <button
            onClick={() => handleExportScreenshot('B')}
            disabled={!contextB || isExporting}
            className="py-2 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:opacity-50"
          >
            {isExporting ? '...' : 'Test'}
          </button>
          
          <button
            onClick={() => handleExportScreenshot('comparison')}
            disabled={!contextA || !contextB || isExporting}
            className="py-2 rounded text-xs bg-purple-700 hover:bg-purple-600 text-white disabled:opacity-50"
          >
            {isExporting ? '...' : 'Side×Side'}
          </button>
        </div>
      </div>

      {/* Status */}
      {lastExport && (
        <div className="text-xs text-green-400 bg-gray-900 rounded p-2">
          ✓ {lastExport}
        </div>
      )}

      {/* Export Format Info */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <div className="font-semibold mb-1">CSV includes:</div>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>Quality metrics (PSNR, SSIM)</li>
            <li>Performance (FPS, memory, load time)</li>
            <li>System info (browser, GPU, resolution)</li>
            <li>Camera position and viewpoint</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
