import { useState, useCallback } from 'react';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import type { GSFile } from '../types';

export function useGSLoader() {
  const [viewer, setViewer] = useState<GaussianSplats3D.Viewer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [splatCount, setSplatCount] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);

  const loadFile = useCallback(async (
    gsFile: GSFile,
    container: HTMLElement,
    onLoadComplete?: (loadTime: number) => void
  ) => {
    // Dispose of any existing viewer first
    if (viewer) {
      viewer.dispose();
      setViewer(null);
    }

    setLoading(true);
    setError(null);
    setLoadProgress(0);
    const startTime = performance.now();

    // Helper to hide library's default UI elements
    const hideLibraryUI = (rootElement: HTMLElement) => {
      const messageDivs = rootElement.querySelectorAll('div');
      messageDivs.forEach((div) => {
        const text = div.textContent?.toLowerCase() || '';
        if (text.includes('loading') || text.includes('processing') || div.className.includes('loading')) {
          div.style.display = 'none';
        }
      });
    };

    try {
      // Don't wait for container dimensions - just create viewer
      // We'll fix the canvas size after loading
      const newViewer = new GaussianSplats3D.Viewer({
        cameraUp: [0, -1, 0], // Flip Y axis to fix inverted view
        initialCameraPosition: [10, 10, 50], // Much farther away
        initialCameraLookAt: [0, 0, 0],
        sharedMemoryForWorkers: false,
        enableSplatMeshHover: false, // Disable raycasting to prevent stack overflow
        ignoreDevicePixelRatio: false,
        selfDrivenMode: false, // We'll drive the render loop manually for accurate timing
      });

      // Mount viewer to container
      container.innerHTML = '';
      container.appendChild(newViewer.rootElement);

      // Hide any default loading UI elements from the library
      hideLibraryUI(newViewer.rootElement);

      // Get canvas and check its size
      const canvas = newViewer.rootElement.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        console.log('Canvas natural size:', rect.width, 'x', rect.height);
        console.log('Canvas position in viewport:', rect);

        // Check parent chain
        console.log('Canvas parent (rootElement):', newViewer.rootElement.getBoundingClientRect());
        console.log('Container:', container.getBoundingClientRect());
        let el: HTMLElement | null = container;
        let depth = 0;
        while (el && depth < 5) {
          const computedPosition = window.getComputedStyle(el).position;
          console.log(`  Parent ${depth}:`, el.className, `position: ${computedPosition}`, el.getBoundingClientRect());
          el = el.parentElement;
          depth++;
        }
      }

      // Create object URL from file
      const url = URL.createObjectURL(gsFile.file);

      // Map file format to SceneFormat enum
      const formatMap: Record<string, any> = {
        '.ply': GaussianSplats3D.SceneFormat.Ply,
        '.splat': GaussianSplats3D.SceneFormat.Splat,
        '.ksplat': GaussianSplats3D.SceneFormat.KSplat,
        '.spz': GaussianSplats3D.SceneFormat.Spz,
      };

      const sceneFormat = formatMap[gsFile.format];

      // Add the scene with the GS file and explicit format
      try {
        await newViewer.addSplatScene(url, {
          format: sceneFormat,
          splatAlphaRemovalThreshold: 5,
          showLoadingUI: false, // Use our own loading UI instead
          position: [0, 0, 0],
          rotation: [0, 0, 0, 1],
          scale: [1, 1, 1],
          onProgress: (progress: number, message: string) => {
            // Progress comes as 0-100, convert to 0-1 for state
            const normalizedProgress = Math.min(Math.max(progress, 0), 100) / 100;
            setLoadProgress(normalizedProgress);
            console.log(`Loading: ${Math.round(progress)}% - ${message}`);
          },
        });
      } catch (loadError) {
        // Clean up viewer on load error
        newViewer.dispose();
        URL.revokeObjectURL(url);

        // Provide helpful error message for .ksplat format issues
        if (gsFile.format === '.ksplat') {
          const formatError = new Error(
            `Failed to load ${gsFile.format} file. ` +
            `This may be due to incompatible .ksplat format variant. ` +
            `Try converting with a different tool or use .splat or .spz format instead.`
          );
          (formatError as any).originalError = loadError;
          throw formatError;
        }
        throw loadError;
      }

      // Don't call start() - we're in manual mode (selfDrivenMode: false)
      // The parent component will drive the render loop

      // Get splat count
      const scene = newViewer.splatMesh.scenes[0];
      const count = scene ? scene.splatBuffer.getSplatCount() : 0;
      setSplatCount(count);

      console.log('Scene loaded with', count, 'splats');

      // Hide any UI elements that appeared during loading
      hideLibraryUI(newViewer.rootElement);

      // Check canvas size after loading
      if (canvas) {
        const finalRect = canvas.getBoundingClientRect();
        console.log('Canvas final size:', finalRect.width, 'x', finalRect.height);
        console.log('Canvas should now be visible - try dragging to rotate');
      }

      // Clean up object URL after everything is loaded
      URL.revokeObjectURL(url);

      setViewer(newViewer);
      const loadTime = performance.now() - startTime;

      if (onLoadComplete) {
        onLoadComplete(loadTime);
      }
    } catch (e) {
      console.error('Failed to load GS file:', e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [viewer]);

  const cleanup = useCallback(() => {
    setViewer((currentViewer) => {
      if (currentViewer) {
        currentViewer.dispose();
      }
      return null;
    });
  }, []);

  return {
    viewer,
    loading,
    error,
    splatCount,
    loadProgress,
    loadFile,
    cleanup,
  };
}
