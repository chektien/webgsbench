import { useEffect, useRef } from 'react';
import { useGSLoader } from '../../hooks/useGSLoader';
import type { GSFile } from '../../types';
import type * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

interface GSViewerProps {
  gsFile: GSFile | null;
  onLoadComplete?: (loadTime: number, splatCount: number) => void;
  onFrameUpdate?: (deltaTime: number) => void;
  onViewerReady?: (viewer: GaussianSplats3D.Viewer) => void;
}

export function GSViewer({ gsFile, onLoadComplete, onFrameUpdate, onViewerReady }: GSViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { viewer, loading, error, splatCount, loadProgress, loadFile, cleanup } = useGSLoader();

  useEffect(() => {
    if (gsFile && containerRef.current) {
      loadFile(gsFile, containerRef.current, (loadTime) => {
        if (onLoadComplete) {
          onLoadComplete(loadTime, splatCount);
        }
      });
    }

    return () => {
      cleanup();
    };
  }, [gsFile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent when viewer is ready
  useEffect(() => {
    if (viewer && onViewerReady) {
      onViewerReady(viewer);
    }
  }, [viewer, onViewerReady]);

  // Frame timing - measure frame intervals (time between frames)
  // This is the correct approach for measuring real rendering performance
  // because WebGL render calls are asynchronous (GPU work happens later)
  useEffect(() => {
    if (!viewer || !onFrameUpdate) return;

    let frameId: number;
    let lastFrameTime = performance.now();

    const renderLoop = () => {
      const currentTime = performance.now();
      const frameInterval = currentTime - lastFrameTime;
      
      // Update viewer state (camera, controls, etc.)
      viewer.update();
      
      // Render the scene (this queues GPU commands, doesn't wait for completion)
      viewer.render();
      
      // Report the frame interval as frame time
      // This represents the actual time between frames, which includes
      // all rendering work from the previous frame
      onFrameUpdate(frameInterval);
      
      lastFrameTime = currentTime;
      frameId = requestAnimationFrame(renderLoop);
    };

    frameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(frameId);
  }, [viewer, onFrameUpdate]);

  return (
    <div
      className="bg-gray-900"
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
    >
      {/* Viewer container - ONLY the viewer canvas goes here */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />

      {/* UI overlays as siblings - safe from innerHTML='' */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-95" style={{ zIndex: 10 }}>
          <div className="text-center max-w-md px-12">
            <div className="mb-8">
              <div className="inline-block p-5 bg-gray-800 rounded-full mb-6">
                <svg className="w-14 h-14 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="text-white text-2xl font-bold mb-3">Loading Gaussian Splat</div>
              {gsFile && <div className="text-sm mb-8 text-gray-400">{gsFile.name}</div>}
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="rounded-full h-3 mb-4 overflow-hidden bg-gray-700 bg-opacity-40">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(loadProgress * 100)}%` }}
                />
              </div>
              <div className="text-white text-lg font-semibold">{Math.round(loadProgress * 100)}%</div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-95" style={{ zIndex: 10 }}>
          <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-xl p-8 max-w-md mx-4">
            <div className="text-center">
              <svg className="mx-auto mb-4 w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl font-bold mb-3 text-white">Error Loading File</p>
              <p className="text-sm text-red-200">{error.message}</p>
            </div>
          </div>
        </div>
      )}

      {!gsFile && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
          <div className="text-gray-400 text-lg">No file loaded</div>
        </div>
      )}
    </div>
  );
}
