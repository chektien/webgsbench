import { useState, useCallback } from 'react';
import { captureCanvas, calculatePSNR, calculateSSIM, findViewerCanvases } from '../lib/metrics/imageQuality';
import type { ImageQualityMetrics } from '../types';
import type * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

export function useImageQuality() {
  const [metrics, setMetrics] = useState<ImageQualityMetrics>({
    psnr: null,
    ssim: null,
    capturedAt: null,
    error: null,
  });
  const [isComparing, setIsComparing] = useState(false);

  const compareQuality = useCallback(async (
    viewerA?: GaussianSplats3D.Viewer | null,
    viewerB?: GaussianSplats3D.Viewer | null
  ) => {
    setIsComparing(true);
    setMetrics({
      psnr: null,
      ssim: null,
      capturedAt: null,
      error: null,
    });

    try {
      // Find both viewer canvases
      const canvases = findViewerCanvases();

      console.log(`Found ${canvases.length} canvases:`, canvases);

      if (canvases.length < 2) {
        throw new Error('Both Splat A and Splat B must be loaded to compare quality');
      }

      const canvasA = canvases[0];
      const canvasB = canvases[1];

      const rectA = canvasA.getBoundingClientRect();
      const rectB = canvasB.getBoundingClientRect();

      console.log('Canvas A position:', { left: rectA.left, top: rectA.top, width: rectA.width, height: rectA.height });
      console.log('Canvas B position:', { left: rectB.left, top: rectB.top, width: rectB.width, height: rectB.height });

      // Verify we have different canvases
      if (canvasA === canvasB) {
        throw new Error('Found the same canvas twice! Cannot compare.');
      }

      // Validate same resolution
      if (canvasA.width !== canvasB.width || canvasA.height !== canvasB.height) {
        throw new Error(
          `Canvas resolutions must match. Splat A: ${canvasA.width}x${canvasA.height}, Splat B: ${canvasB.width}x${canvasB.height}`
        );
      }

      console.log(`Capturing canvases at ${canvasA.width}x${canvasA.height}...`);
      console.log('Viewer A available:', !!viewerA);
      console.log('Viewer B available:', !!viewerB);

      // Wait a bit for rendering to stabilize
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture both canvases with forced render (async now)
      const imageDataA = await captureCanvas(canvasA, viewerA);
      const imageDataB = await captureCanvas(canvasB, viewerB);

      // Sample some pixels to verify they're different
      const samplePixels = (data: ImageData, label: string) => {
        const center = Math.floor(data.data.length / 2);
        const topLeft = 0;
        const bottomRight = data.data.length - 4;
        console.log(`${label} sample pixels:`, {
          topLeft: {
            r: data.data[topLeft],
            g: data.data[topLeft + 1],
            b: data.data[topLeft + 2],
            a: data.data[topLeft + 3]
          },
          center: {
            r: data.data[center],
            g: data.data[center + 1],
            b: data.data[center + 2],
            a: data.data[center + 3]
          },
          bottomRight: {
            r: data.data[bottomRight],
            g: data.data[bottomRight + 1],
            b: data.data[bottomRight + 2],
            a: data.data[bottomRight + 3]
          }
        });
      };

      samplePixels(imageDataA, 'Canvas A');
      samplePixels(imageDataB, 'Canvas B');

      console.log('Calculating PSNR...');
      const psnr = calculatePSNR(imageDataA, imageDataB);

      console.log('Calculating SSIM...');
      const ssim = calculateSSIM(imageDataA, imageDataB);

      console.log(`Quality metrics - PSNR: ${psnr.toFixed(2)} dB, SSIM: ${ssim.toFixed(4)}`);

      setMetrics({
        psnr,
        ssim,
        capturedAt: new Date().toISOString(),
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Quality comparison failed:', errorMessage);
      setMetrics({
        psnr: null,
        ssim: null,
        capturedAt: null,
        error: errorMessage,
      });
    } finally {
      setIsComparing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMetrics({
      psnr: null,
      ssim: null,
      capturedAt: null,
      error: null,
    });
  }, []);

  return {
    metrics,
    isComparing,
    compareQuality,
    reset,
  };
}
