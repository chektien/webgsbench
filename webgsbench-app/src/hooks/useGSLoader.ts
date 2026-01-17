import { useState, useCallback } from 'react';
import { SplatMesh, SplatFileType } from '@sparkjsdev/spark';
import type { GSFile } from '../types';

export function useGSLoader() {
  const [splatMesh, setSplatMesh] = useState<SplatMesh | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [splatCount, setSplatCount] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);

  const loadFile = useCallback(async (
    gsFile: GSFile,
    onLoadComplete?: (loadTime: number, splatCount: number) => void
  ) => {
    // Dispose of any existing mesh first
    if (splatMesh) {
      splatMesh.dispose();
      setSplatMesh(null);
    }

    setLoading(true);
    setError(null);
    setLoadProgress(0);
    const startTime = performance.now();

    // Map file format to SplatFileType enum (outside try/catch for error logging)
    let fileType: SplatFileType | undefined = undefined;
    if (gsFile.format === '.ply') {
      fileType = SplatFileType.PLY;
    } else if (gsFile.format === '.splat') {
      fileType = SplatFileType.SPLAT;
    } else if (gsFile.format === '.ksplat') {
      fileType = SplatFileType.KSPLAT;
    } else if (gsFile.format === '.spz') {
      fileType = SplatFileType.SPZ;
    }

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await gsFile.file.arrayBuffer();
      const fileBytes = new Uint8Array(arrayBuffer);

      // Create SplatMesh with fileBytes and fileType
      const mesh = new SplatMesh({
        fileBytes,
        fileType,
        fileName: gsFile.file.name,
      });

      // Set up progress tracking during initialization
      let lastProgress = 0;
      const progressInterval = setInterval(() => {
        // Estimate progress based on time (rough approximation)
        lastProgress = Math.min(lastProgress + 0.1, 0.95);
        setLoadProgress(lastProgress);
      }, 100);

      // Wait for initialization to complete
      await mesh.initialized;
      
      // Clear progress interval
      clearInterval(progressInterval);
      setLoadProgress(1);

      // Get splat count
      const count = mesh.numSplats;
      setSplatCount(count);
      console.log('Scene loaded with', count, 'splats');

      setSplatMesh(mesh);
      const loadTime = performance.now() - startTime;

      if (onLoadComplete) {
        onLoadComplete(loadTime, count); // Pass splat count to callback
      }
    } catch (e) {
      // Log detailed error information
      const error = e as Error;
      console.error('Failed to load GS file:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        format: gsFile.format,
        fileName: gsFile.file.name,
        fileSize: gsFile.file.size,
        fileType: fileType,
      });
      
      // Provide helpful error message for .ksplat format issues
      if (gsFile.format === '.ksplat') {
        const formatError = new Error(
          `Failed to load ${gsFile.format} file. ` +
          `This may be due to incompatible .ksplat format variant. ` +
          `Try converting with a different tool or use .splat or .spz format instead.`
        );
        (formatError as any).originalError = e;
        setError(formatError);
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [splatMesh]);

  const cleanup = useCallback(() => {
    setSplatMesh((currentMesh) => {
      if (currentMesh) {
        currentMesh.dispose();
      }
      return null;
    });
  }, []);

  return {
    splatMesh,
    loading,
    error,
    splatCount,
    loadProgress,
    loadFile,
    cleanup,
  };
}
