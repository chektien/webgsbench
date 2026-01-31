/**
 * CSV Export System for WebGSBench
 * 
 * Comprehensive data export with full metadata for reproducibility
 * and analysis in Python, R, or other tools.
 */

import type { BenchmarkMetrics, ImageQualityMetrics } from '../../types';

export interface ExportRecord {
  // Test identification
  timestamp: string;
  testId: string;
  sceneName: string;
  
  // Format information
  referenceFormat: string;
  testFormat: string;
  fileSizeReferenceMB: number;
  fileSizeTestMB: number;
  compressionRatio: number;
  
  // Viewpoint information
  viewpointName: string;
  cameraDistance: number;
  cameraPosition: { x: number; y: number; z: number };
  
  // Quality metrics
  psnr: number | null;
  ssim: number | null;
  
  // Performance metrics - Reference
  fpsReference: number;
  frameTimeReference: number;
  memoryMBReference: number;
  loadTimeMsReference: number;
  fps1PercentLowReference: number;
  frameTimeVarianceReference: number;
  
  // Performance metrics - Test
  fpsTest: number;
  frameTimeTest: number;
  memoryMBTest: number;
  loadTimeMsTest: number;
  fps1PercentLowTest: number;
  frameTimeVarianceTest: number;
  
  // System information
  browserName: string;
  browserVersion: string;
  browserEngine: string;
  gpuRenderer: string;
  webglVersion: string;
  osPlatform: string;
  screenResolution: string;
  devicePixelRatio: number;
  
  // Splat counts
  splatCountReference: number;
  splatCountTest: number;
  
  // Canvas resolution
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Get system information for export
 */
function getSystemInfo(): Pick<ExportRecord, 
  'browserName' | 'browserVersion' | 'browserEngine' | 
  'gpuRenderer' | 'webglVersion' | 'osPlatform' |
  'screenResolution' | 'devicePixelRatio'
> {
  const ua = navigator.userAgent;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  // Detect browser
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browserName = 'Chrome';
    browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Firefox/')) {
    browserName = 'Firefox';
    browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browserName = 'Safari';
    browserVersion = ua.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Edg/')) {
    browserName = 'Edge';
    browserVersion = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || 'Unknown';
  }
  
  // Get GPU info
  let gpuRenderer = 'Unknown';
  let webglVersion = 'Unknown';
  
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
    }
    webglVersion = gl.getParameter(gl.VERSION) || 'Unknown';
  }
  
  return {
    browserName,
    browserVersion,
    browserEngine: browserName === 'Chrome' || browserName === 'Edge' ? 'Blink' :
                   browserName === 'Firefox' ? 'Gecko' :
                   browserName === 'Safari' ? 'WebKit' : 'Unknown',
    gpuRenderer,
    webglVersion,
    osPlatform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    devicePixelRatio: window.devicePixelRatio,
  };
}

/**
 * Create export record from current comparison
 */
export function createExportRecord(
  sceneName: string,
  referenceFormat: string,
  testFormat: string,
  viewpointName: string,
  cameraDistance: number,
  cameraPosition: { x: number; y: number; z: number },
  metricsA: BenchmarkMetrics,
  metricsB: BenchmarkMetrics,
  qualityMetrics: ImageQualityMetrics,
  testId?: string
): ExportRecord {
  const systemInfo = getSystemInfo();
  
  return {
    timestamp: new Date().toISOString(),
    testId: testId || `${sceneName}_${testFormat}_${Date.now()}`,
    sceneName,
    referenceFormat,
    testFormat,
    fileSizeReferenceMB: metricsA.fileSize / (1024 * 1024),
    fileSizeTestMB: metricsB.fileSize / (1024 * 1024),
    compressionRatio: metricsA.fileSize / metricsB.fileSize,
    viewpointName,
    cameraDistance,
    cameraPosition,
    psnr: qualityMetrics.psnr,
    ssim: qualityMetrics.ssim,
    fpsReference: metricsA.fps,
    frameTimeReference: metricsA.frameTime,
    memoryMBReference: metricsA.memoryUsage,
    loadTimeMsReference: metricsA.loadTime,
    fps1PercentLowReference: metricsA.fps1PercentLow,
    frameTimeVarianceReference: metricsA.frameTimeVariance,
    fpsTest: metricsB.fps,
    frameTimeTest: metricsB.frameTime,
    memoryMBTest: metricsB.memoryUsage,
    loadTimeMsTest: metricsB.loadTime,
    fps1PercentLowTest: metricsB.fps1PercentLow,
    frameTimeVarianceTest: metricsB.frameTimeVariance,
    ...systemInfo,
    splatCountReference: metricsA.splatCount,
    splatCountTest: metricsB.splatCount,
    canvasWidth: metricsA.resolution[0],
    canvasHeight: metricsA.resolution[1],
  };
}

/**
 * Convert export record to CSV row
 */
function recordToRow(record: ExportRecord): string {
  const values = [
    record.timestamp,
    record.testId,
    record.sceneName,
    record.referenceFormat,
    record.testFormat,
    record.fileSizeReferenceMB.toFixed(2),
    record.fileSizeTestMB.toFixed(2),
    record.compressionRatio.toFixed(2),
    record.viewpointName,
    record.cameraDistance.toFixed(2),
    `"${JSON.stringify(record.cameraPosition)}"`,
    record.psnr?.toFixed(2) ?? '',
    record.ssim?.toFixed(4) ?? '',
    record.fpsReference.toFixed(1),
    record.frameTimeReference.toFixed(2),
    record.memoryMBReference.toFixed(1),
    record.loadTimeMsReference.toFixed(0),
    record.fps1PercentLowReference.toFixed(1),
    record.frameTimeVarianceReference.toFixed(2),
    record.fpsTest.toFixed(1),
    record.frameTimeTest.toFixed(2),
    record.memoryMBTest.toFixed(1),
    record.loadTimeMsTest.toFixed(0),
    record.fps1PercentLowTest.toFixed(1),
    record.frameTimeVarianceTest.toFixed(2),
    record.browserName,
    record.browserVersion,
    record.browserEngine,
    record.gpuRenderer,
    record.webglVersion,
    record.osPlatform,
    record.screenResolution,
    record.devicePixelRatio,
    record.splatCountReference,
    record.splatCountTest,
    record.canvasWidth,
    record.canvasHeight,
  ];
  
  return values.join(',');
}

/**
 * CSV column headers
 */
const CSV_HEADERS = [
  'timestamp',
  'test_id',
  'scene_name',
  'reference_format',
  'test_format',
  'file_size_reference_mb',
  'file_size_test_mb',
  'compression_ratio',
  'viewpoint_name',
  'camera_distance',
  'camera_position',
  'psnr_db',
  'ssim',
  'fps_reference',
  'frame_time_ms_reference',
  'memory_mb_reference',
  'load_time_ms_reference',
  'fps_1_percent_low_reference',
  'frame_time_variance_reference',
  'fps_test',
  'frame_time_ms_test',
  'memory_mb_test',
  'load_time_ms_test',
  'fps_1_percent_low_test',
  'frame_time_variance_test',
  'browser_name',
  'browser_version',
  'browser_engine',
  'gpu_renderer',
  'webgl_version',
  'os_platform',
  'screen_resolution',
  'device_pixel_ratio',
  'splat_count_reference',
  'splat_count_test',
  'canvas_width',
  'canvas_height',
];

/**
 * Export records to CSV
 */
export function exportToCSV(records: ExportRecord[]): string {
  const lines = [
    CSV_HEADERS.join(','),
    ...records.map(recordToRow),
  ];
  return lines.join('\n');
}

/**
 * Export single record and download
 */
export function exportAndDownload(
  record: ExportRecord,
  filename?: string
): void {
  const csv = exportToCSV([record]);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `webgsbench_${record.sceneName}_${record.testFormat}_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Create a CSV exporter that accumulates multiple records
 */
export function createCSVExporter() {
  const records: ExportRecord[] = [];
  
  return {
    add(record: ExportRecord) {
      records.push(record);
    },
    
    export(_filename?: string): string {
      return exportToCSV(records);
    },
    
    download(filename?: string) {
      const csv = exportToCSV(records);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `webgsbench_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    getRecordCount() {
      return records.length;
    },
    
    clear() {
      records.length = 0;
    },
  };
}

/**
 * Generate summary statistics from export records
 */
export function generateSummary(records: ExportRecord[]) {
  if (records.length === 0) return null;
  
  const byScene = groupBy(records, 'sceneName');
  const byFormat = groupBy(records, 'testFormat');
  
  return {
    totalTests: records.length,
    scenes: Object.keys(byScene),
    formats: Object.keys(byFormat),
    avgPsnr: average(records.map(r => r.psnr).filter((x): x is number => x !== null)),
    avgSsim: average(records.map(r => r.ssim).filter((x): x is number => x !== null)),
    avgCompression: average(records.map(r => r.compressionRatio)),
    byScene: Object.fromEntries(
      Object.entries(byScene).map(([scene, recs]) => [
        scene,
        {
          count: recs.length,
          avgPsnr: average(recs.map(r => r.psnr).filter((x): x is number => x !== null)),
        },
      ])
    ),
  };
}

// Helper functions
function groupBy<T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
