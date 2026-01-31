/**
 * Screenshot Capture System for WebGSBench
 * 
 * High-resolution screenshot capture with automatic naming conventions
 * for reproducible data collection and publication-ready figures.
 */

import type { SparkViewerContext } from '../../types';

export interface ScreenshotOptions {
  width?: number;      // Target width (default: 1920)
  height?: number;     // Target height (default: 1080)
  format?: 'png' | 'jpeg';  // Output format
  quality?: number;    // For JPEG (0-1)
  transparent?: boolean;  // Include alpha channel
}

export interface ScreenshotMetadata {
  sceneName: string;
  format: string;
  viewpoint: string;
  side: 'A' | 'B';
  timestamp: string;
  resolution: string;
  cameraDistance: number;
}

const DEFAULT_OPTIONS: ScreenshotOptions = {
  width: 1920,
  height: 1080,
  format: 'png',
  quality: 0.95,
  transparent: false,
};

/**
 * Capture a high-resolution screenshot from a viewer
 */
export async function captureScreenshot(
  context: SparkViewerContext,
  options: ScreenshotOptions = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { renderer, scene, camera } = context;
  const canvas = renderer.domElement;
  
  // Store original dimensions
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;
  const originalPixelRatio = renderer.getPixelRatio();
  
  try {
    // Set to high resolution
    renderer.setPixelRatio(1); // Disable device pixel ratio for consistent output
    renderer.setSize(opts.width!, opts.height!, false);
    camera.aspect = opts.width! / opts.height!;
    camera.updateProjectionMatrix();
    
    // Render
    renderer.render(scene, camera);
    
    // Get context with alpha if needed
    const ctx = canvas.getContext('2d');
    if (opts.transparent && ctx) {
      // Clear background for transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderer.render(scene, camera);
    }
    
    // Export as blob
    const mimeType = opts.format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b!), 
        mimeType, 
        opts.quality
      );
    });
    
    return blob;
  } finally {
    // Restore original dimensions
    renderer.setPixelRatio(originalPixelRatio);
    renderer.setSize(originalWidth, originalHeight, false);
    camera.aspect = originalWidth / originalHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }
}

/**
 * Generate automatic filename for screenshot
 * Format: {scene}_{format}_{viewpoint}_{side}_{timestamp}.png
 */
export function generateScreenshotFilename(
  metadata: ScreenshotMetadata
): string {
  const date = metadata.timestamp.split('T')[0]; // YYYY-MM-DD
  return [
    metadata.sceneName,
    metadata.format,
    metadata.viewpoint.toLowerCase().replace(/\s+/g, '-'),
    metadata.side,
    date,
  ].join('_') + '.png';
}

/**
 * Generate filename for comparison screenshot
 * Format: {scene}_comparison_{viewpoint}_{timestamp}.png
 */
export function generateComparisonFilename(
  sceneName: string,
  viewpoint: string,
  timestamp: string
): string {
  const date = timestamp.split('T')[0];
  return [
    sceneName,
    'comparison',
    viewpoint.toLowerCase().replace(/\s+/g, '-'),
    date,
  ].join('_') + '.png';
}

/**
 * Capture side-by-side comparison screenshot
 */
export async function captureComparisonScreenshot(
  contextA: SparkViewerContext,
  contextB: SparkViewerContext,
  options: ScreenshotOptions = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const width = opts.width!;
  const height = opts.height!;
  
  // Capture both viewers
  const [blobA, blobB] = await Promise.all([
    captureScreenshot(contextA, { ...opts, width: width / 2, height }),
    captureScreenshot(contextB, { ...opts, width: width / 2, height }),
  ]);
  
  // Create composite canvas
  const composite = document.createElement('canvas');
  composite.width = width;
  composite.height = height;
  const ctx = composite.getContext('2d')!;
  
  // Fill background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);
  
  // Draw images side by side
  const imgA = await createImageBitmap(blobA);
  const imgB = await createImageBitmap(blobB);
  
  ctx.drawImage(imgA, 0, 0, width / 2, height);
  ctx.drawImage(imgB, width / 2, 0, width / 2, height);
  
  // Add divider line
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();
  
  // Add labels
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;
  ctx.fillText('Reference', 20, 40);
  ctx.fillText('Compressed', width / 2 + 20, 40);
  
  // Export
  return new Promise((resolve) => {
    composite.toBlob((b) => resolve(b!), 'image/png');
  });
}

/**
 * Download a screenshot blob as a file
 */
export function downloadScreenshot(
  blob: Blob, 
  filename: string
): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Capture screenshot with full metadata
 * Returns both the image blob and metadata for CSV logging
 */
export async function captureScreenshotWithMetadata(
  context: SparkViewerContext,
  metadata: Omit<ScreenshotMetadata, 'timestamp' | 'resolution' | 'cameraDistance'>,
  options: ScreenshotOptions = {}
): Promise<{ blob: Blob; metadata: ScreenshotMetadata }> {
  const cameraDistance = context.camera.position.length();
  
  const fullMetadata: ScreenshotMetadata = {
    ...metadata,
    timestamp: new Date().toISOString(),
    resolution: `${options.width || 1920}x${options.height || 1080}`,
    cameraDistance,
  };
  
  const blob = await captureScreenshot(context, options);
  
  return { blob, metadata: fullMetadata };
}

/**
 * Create a screenshot capture button handler
 */
export function createScreenshotHandler(
  contextA: SparkViewerContext | null,
  contextB: SparkViewerContext | null,
  sceneName: string,
  formatA: string,
  formatB: string,
  viewpoint: string
) {
  return async (side: 'A' | 'B' | 'comparison') => {
    if (side === 'comparison') {
      if (!contextA || !contextB) return;
      const blob = await captureComparisonScreenshot(contextA, contextB);
      const filename = generateComparisonFilename(sceneName, viewpoint, new Date().toISOString());
      downloadScreenshot(blob, filename);
    } else {
      const context = side === 'A' ? contextA : contextB;
      const format = side === 'A' ? formatA : formatB;
      if (!context) return;
      
      const { blob, metadata } = await captureScreenshotWithMetadata(
        context,
        {
          sceneName,
          format,
          viewpoint,
          side,
        }
      );
      
      const filename = generateScreenshotFilename(metadata);
      downloadScreenshot(blob, filename);
    }
  };
}

/**
 * Capture multiple screenshots in sequence
 * Useful for batch capturing all viewpoints
 */
export async function captureViewpointSeries(
  context: SparkViewerContext,
  sceneName: string,
  format: string,
  side: 'A' | 'B',
  viewpoints: Array<{ name: string; apply: () => void }>,
  onCapture?: (name: string) => void
): Promise<Array<{ name: string; blob: Blob; metadata: ScreenshotMetadata }>> {
  const results = [];
  
  for (const viewpoint of viewpoints) {
    // Apply viewpoint
    viewpoint.apply();
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture
    const { blob, metadata } = await captureScreenshotWithMetadata(
      context,
      {
        sceneName,
        format,
        viewpoint: viewpoint.name,
        side,
      }
    );
    
    results.push({
      name: viewpoint.name,
      blob,
      metadata,
    });
    
    onCapture?.(viewpoint.name);
  }
  
  return results;
}
