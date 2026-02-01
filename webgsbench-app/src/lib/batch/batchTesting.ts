/**
 * Batch Testing System for WebGSBench
 * 
 * Enables automated, unattended benchmarking of multiple scenes,
 * formats, and viewpoints. Supports both standard test suites and
 * custom researcher-defined configurations.
 */

import type { ViewpointPreset } from '../camera/cameraPresets';
import type { ImageQualityMetrics } from '../../types';

export interface BatchTestConfig {
  // Identification
  testName: string;
  description?: string;
  
  // Test matrix
  scenes: BatchSceneConfig[];
  referenceFormat: string;  // e.g., 'ply'
  testFormats: string[];    // e.g., ['splat', 'ksplat', 'spz']
  viewpoints: ViewpointPreset[];
  
  // Options
  replicates: number;       // Number of captures per configuration
  delayBetweenCaptures: number; // ms to wait between captures
  captureQualityMetrics: boolean;
  capturePerformanceMetrics: boolean;
  captureScreenshots: boolean;
}

export interface BatchSceneConfig {
  sceneName: string;
  referenceFile: string;    // Path/URL to reference file
  testFiles: Record<string, string>;  // format -> path
}

export interface BatchResult {
  // Identification
  testId: string;
  timestamp: string;
  
  // Configuration
  sceneName: string;
  testFormat: string;
  viewpointName: string;
  replicateNumber: number;
  
  // Quality metrics
  qualityMetrics?: ImageQualityMetrics;
  
  // Performance metrics
  loadTimeMs?: number;
  fps?: number;
  fps1PercentLow?: number;
  memoryMB?: number;
  frameTimeVariance?: number;
  
  // Screenshot
  screenshotPath?: string;
  
  // Metadata
  browserInfo: {
    name: string;
    version: string;
    gpu: string;
  };
}

export interface BatchProgress {
  totalTests: number;
  completedTests: number;
  currentTest?: {
    scene: string;
    format: string;
    viewpoint: string;
    replicate: number;
  };
  estimatedTimeRemaining: number; // seconds
}

/**
 * Predefined test templates for common use cases
 */
export const BATCH_TEMPLATES = {
  /**
   * Quick Check - Fast validation of 1-2 scenes
   * For iterative development and smoke testing
   * Takes ~2-5 minutes
   */
  quickValidation: {
    name: 'Quick Check',
    description: 'Fast 2-scene validation (2 viewpoints, 1 replicate). ~2-5 min.',
    defaultScenes: ['bonsai', 'truck'],
    defaultFormats: ['splat', 'spz'],
    viewpointCount: 2,
    defaultReplicates: 1,
    defaultConfig: {
      testName: 'quick-validation',
      scenes: [],
      referenceFormat: 'ply',
      testFormats: ['splat', 'spz'],
      viewpoints: [], // Will use front and close-up only
      replicates: 1,
      delayBetweenCaptures: 200,
      captureQualityMetrics: true,
      capturePerformanceMetrics: true,
      captureScreenshots: false,
    }
  },

  /**
   * Format Comparison - Compare all formats on selected scenes
   * Good for evaluating compression quality vs file size tradeoffs
   * Takes ~10-20 minutes
   */
  formatComparison: {
    name: 'Format Comparison',
    description: 'Compare all formats across scenes (3 viewpoints, 2 replicates). ~10-20 min.',
    defaultScenes: ['bonsai', 'truck', 'garden'],
    defaultFormats: ['splat', 'ksplat', 'spz'],
    viewpointCount: 3,
    defaultReplicates: 2,
    defaultConfig: {
      testName: 'format-comparison',
      scenes: [],
      referenceFormat: 'ply',
      testFormats: ['splat', 'ksplat', 'spz'],
      viewpoints: [], // Front, close-up, wide
      replicates: 2,
      delayBetweenCaptures: 500,
      captureQualityMetrics: true,
      capturePerformanceMetrics: true,
      captureScreenshots: true,
    }
  },

  /**
   * Full Benchmark - Complete 6-scene evaluation
   * For paper submissions and comprehensive analysis
   * Takes ~1-2 hours
   */
  paperEvaluation: {
    name: 'Full Benchmark',
    description: 'Complete 6-scene benchmark (5 viewpoints, 3 replicates). ~1-2 hours.',
    defaultScenes: ['bonsai', 'garden', 'playroom', 'truck', 'train', 'flower'],
    defaultFormats: ['splat', 'ksplat', 'spz'],
    viewpointCount: 5,
    defaultReplicates: 3,
    defaultConfig: {
      testName: 'paper-evaluation',
      scenes: [], // To be populated based on available scenes
      referenceFormat: 'ply',
      testFormats: ['splat', 'ksplat', 'spz'],
      viewpoints: [], // Will use STANDARD_VIEWPOINTS
      replicates: 3,
      delayBetweenCaptures: 500,
      captureQualityMetrics: true,
      capturePerformanceMetrics: true,
      captureScreenshots: true,
    }
  },
  
  /**
   * Performance Profiling - Focus on FPS and memory metrics
   * More replicates for stable measurements, quality metrics optional
   */
  performanceProfiling: {
    name: 'Performance Focus',
    description: 'FPS/memory profiling with 5 replicates (2 viewpoints). ~15-30 min.',
    defaultScenes: ['bonsai', 'truck', 'garden'],
    defaultFormats: ['splat', 'ksplat', 'spz'],
    viewpointCount: 2,
    defaultReplicates: 5,
    defaultConfig: {
      testName: 'performance-profile',
      scenes: [],
      referenceFormat: 'ply',
      testFormats: ['splat', 'ksplat', 'spz'],
      viewpoints: [], // Just front and wide view
      replicates: 5, // More replicates for stable FPS measurements
      delayBetweenCaptures: 1000,
      captureQualityMetrics: false,
      capturePerformanceMetrics: true,
      captureScreenshots: false,
    }
  },

  /**
   * Single Format Deep Dive - Evaluate one format across all scenes
   * Useful for validating a specific compression method
   */
  singleFormat: {
    name: 'Single Format',
    description: 'Deep evaluation of one format across all scenes. ~20-40 min.',
    defaultScenes: ['bonsai', 'garden', 'playroom', 'truck', 'train', 'flower'],
    defaultFormats: ['spz'], // User should select
    viewpointCount: 5,
    defaultReplicates: 3,
    defaultConfig: {
      testName: 'single-format',
      scenes: [],
      referenceFormat: 'ply',
      testFormats: [], // Specify when creating
      viewpoints: [],
      replicates: 3,
      delayBetweenCaptures: 500,
      captureQualityMetrics: true,
      capturePerformanceMetrics: true,
      captureScreenshots: true,
    }
  },
};

/**
 * Calculate total number of tests in a batch
 */
export function calculateTotalTests(config: BatchTestConfig): number {
  return config.scenes.length * 
         config.testFormats.length * 
         config.viewpoints.length * 
         config.replicates;
}

/**
 * Generate a test queue from configuration
 * Returns ordered list of all tests to run
 */
export function generateTestQueue(config: BatchTestConfig): Array<{
  scene: BatchSceneConfig;
  format: string;
  viewpoint: ViewpointPreset;
  replicate: number;
}> {
  const queue = [];
  
  for (const scene of config.scenes) {
    for (const format of config.testFormats) {
      for (const viewpoint of config.viewpoints) {
        for (let r = 1; r <= config.replicates; r++) {
          queue.push({
            scene,
            format,
            viewpoint,
            replicate: r,
          });
        }
      }
    }
  }
  
  return queue;
}

/**
 * Export batch results to CSV
 */
export function exportBatchToCSV(results: BatchResult[]): string {
  if (results.length === 0) return '';
  
  // Define columns
  const columns = [
    'timestamp',
    'testId',
    'sceneName',
    'testFormat',
    'viewpointName',
    'replicateNumber',
    'psnr',
    'ssim',
    'loadTimeMs',
    'fps',
    'fps1PercentLow',
    'memoryMB',
    'frameTimeVariance',
    'browserName',
    'browserVersion',
    'gpu',
  ];
  
  // Header
  let csv = columns.join(',') + '\n';
  
  // Rows
  for (const result of results) {
    const row = [
      result.timestamp,
      result.testId,
      result.sceneName,
      result.testFormat,
      result.viewpointName,
      result.replicateNumber,
      result.qualityMetrics?.psnr ?? '',
      result.qualityMetrics?.ssim ?? '',
      result.loadTimeMs ?? '',
      result.fps ?? '',
      result.fps1PercentLow ?? '',
      result.memoryMB ?? '',
      result.frameTimeVariance ?? '',
      result.browserInfo.name,
      result.browserInfo.version,
      result.browserInfo.gpu,
    ];
    csv += row.join(',') + '\n';
  }
  
  return csv;
}

/**
 * Generate summary statistics from batch results
 */
export function generateBatchSummary(results: BatchResult[]) {
  const scenes = [...new Set(results.map(r => r.sceneName))];
  const formats = [...new Set(results.map(r => r.testFormat))];
  
  const summary: Record<string, Record<string, {
    avgPsnr: number;
    stdPsnr: number;
    avgSsim: number;
    stdSsim: number;
    avgFps: number;
    avgLoadTime: number;
    count: number;
  }>> = {};
  
  for (const scene of scenes) {
    summary[scene] = {};
    for (const format of formats) {
      const relevant = results.filter(
        r => r.sceneName === scene && r.testFormat === format
      );
      
      const psnrs = relevant.map(r => r.qualityMetrics?.psnr).filter((p): p is number => p !== undefined && p !== null);
      const ssims = relevant.map(r => r.qualityMetrics?.ssim).filter((s): s is number => s !== undefined && s !== null);
      const fpses = relevant.map(r => r.fps).filter((f): f is number => f !== undefined && f !== null);
      const loadTimes = relevant.map(r => r.loadTimeMs).filter((l): l is number => l !== undefined && l !== null);
      
      summary[scene][format] = {
        avgPsnr: psnrs.length > 0 ? psnrs.reduce((a, b) => a + b, 0) / psnrs.length : 0,
        stdPsnr: calculateStd(psnrs),
        avgSsim: ssims.length > 0 ? ssims.reduce((a, b) => a + b, 0) / ssims.length : 0,
        stdSsim: calculateStd(ssims),
        avgFps: fpses.length > 0 ? fpses.reduce((a, b) => a + b, 0) / fpses.length : 0,
        avgLoadTime: loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0,
        count: relevant.length,
      };
    }
  }
  
  return summary;
}

function calculateStd(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Batch test runner class
 * Manages the execution of a batch test queue
 */
export class BatchTestRunner {
  private config: BatchTestConfig;
  private queue: ReturnType<typeof generateTestQueue>;
  private results: BatchResult[] = [];
  private currentIndex = 0;
  private isRunning = false;
  private abortController = new AbortController();
  
  // Callbacks
  onProgress?: (progress: BatchProgress) => void;
  onTestComplete?: (result: BatchResult) => void;
  onComplete?: (results: BatchResult[]) => void;
  onError?: (error: Error) => void;
  
  constructor(config: BatchTestConfig) {
    this.config = config;
    this.queue = generateTestQueue(config);
  }
  
  /**
   * Start the batch test
   */
  async start(): Promise<BatchResult[]> {
    if (this.isRunning) {
      throw new Error('Batch test already running');
    }
    
    this.isRunning = true;
    this.results = [];
    this.currentIndex = 0;
    this.abortController = new AbortController();
    
    const startTime = Date.now();
    
    for (let i = 0; i < this.queue.length; i++) {
      // Check for abort
      if (this.abortController.signal.aborted) {
        break;
      }
      
      this.currentIndex = i;
      const test = this.queue[i];
      
      // Report progress
      const elapsed = (Date.now() - startTime) / 1000;
      const avgTimePerTest = elapsed / (i + 1);
      const remaining = (this.queue.length - i - 1) * avgTimePerTest;
      
      this.onProgress?.({
        totalTests: this.queue.length,
        completedTests: i,
        currentTest: {
          scene: test.scene.sceneName,
          format: test.format,
          viewpoint: test.viewpoint.name,
          replicate: test.replicate,
        },
        estimatedTimeRemaining: remaining,
      });
      
      try {
        // Execute test (this would be implemented with actual viewer integration)
        const result = await this.executeTest(test);
        this.results.push(result);
        this.onTestComplete?.(result);
        
        // Delay before next test
        if (i < this.queue.length - 1) {
          await this.delay(this.config.delayBetweenCaptures);
        }
      } catch (error) {
        this.onError?.(error as Error);
        // Continue with next test
      }
    }
    
    this.isRunning = false;
    this.onComplete?.(this.results);
    return this.results;
  }
  
  /**
   * Stop the batch test
   */
  stop(): void {
    this.abortController.abort();
    this.isRunning = false;
  }
  
  /**
   * Get current progress
   */
  getProgress(): BatchProgress {
    return {
      totalTests: this.queue.length,
      completedTests: this.currentIndex,
      currentTest: this.currentIndex < this.queue.length 
        ? {
            scene: this.queue[this.currentIndex].scene.sceneName,
            format: this.queue[this.currentIndex].format,
            viewpoint: this.queue[this.currentIndex].viewpoint.name,
            replicate: this.queue[this.currentIndex].replicate,
          }
        : undefined,
      estimatedTimeRemaining: 0,
    };
  }
  
  /**
   * Execute a single test
   * This is a placeholder - actual implementation would integrate with viewer
   */
  private async executeTest(test: typeof this.queue[0]): Promise<BatchResult> {
    // Placeholder implementation
    // Actual implementation would:
    // 1. Load reference file
    // 2. Load test file
    // 3. Apply camera preset
    // 4. Wait for stabilization
    // 5. Capture quality metrics
    // 6. Capture performance metrics
    // 7. Take screenshot
    // 8. Return result
    
    return {
      testId: `${test.scene.sceneName}_${test.format}_${test.viewpoint.id}_r${test.replicate}`,
      timestamp: new Date().toISOString(),
      sceneName: test.scene.sceneName,
      testFormat: test.format,
      viewpointName: test.viewpoint.name,
      replicateNumber: test.replicate,
      browserInfo: {
        name: navigator.userAgent,
        version: 'unknown',
        gpu: 'unknown',
      },
    };
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
