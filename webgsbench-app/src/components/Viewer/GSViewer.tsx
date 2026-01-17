import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useGSLoader } from '../../hooks/useGSLoader';
import type { GSFile, SparkViewerContext } from '../../types';

interface GSViewerProps {
  gsFile: GSFile | null;
  onLoadComplete?: (loadTime: number, splatCount: number) => void;
  onFrameUpdate?: (deltaTime: number) => void;
  onViewerReady?: (context: SparkViewerContext) => void;
}

export function GSViewer({ gsFile, onLoadComplete, onFrameUpdate, onViewerReady }: GSViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<SparkViewerContext | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  const { splatMesh, loading, error, loadProgress, loadFile, cleanup } = useGSLoader();

  // Setup Three.js scene and load splat
  useEffect(() => {
    if (!gsFile || !containerRef.current) return;

    const container = containerRef.current;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Spark recommends false for performance
      preserveDrawingBuffer: true, // Required for quality metrics capture
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Create scene
    const scene = new THREE.Scene();
    scene.background = null; // Use default Spark background

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      60, // FOV
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5); // Start closer to splat
    camera.up.set(0, -1, 0); // Flip Y-axis for correct orientation

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0);
    controls.update();

    // Create viewer context
    const forceRender = () => {
      renderer.render(scene, camera);
      const gl = renderer.getContext();
      gl.flush();
    };

    const context: SparkViewerContext = {
      scene,
      camera,
      renderer,
      controls,
      splatMesh: null,
      canvas: renderer.domElement,
      forceRender,
    };

    contextRef.current = context;

    // Load the splat file
    loadFile(gsFile, (loadTime, splatCount) => {
      if (onLoadComplete) {
        onLoadComplete(loadTime, splatCount);
      }
    });

    // Handle window resize
    const handleResize = () => {
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      controls.dispose();
      renderer.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      cleanup();
      contextRef.current = null;
    };
  }, [gsFile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Add splat mesh to scene when loaded
  useEffect(() => {
    if (!splatMesh || !contextRef.current) return;

    const context = contextRef.current;
    context.scene.add(splatMesh);
    context.splatMesh = splatMesh;

    console.log('SplatMesh added to scene');

    // Notify parent that viewer is ready
    if (onViewerReady) {
      onViewerReady(context);
    }

    return () => {
      if (context.scene && splatMesh) {
        context.scene.remove(splatMesh);
      }
    };
  }, [splatMesh, onViewerReady]);

  // Render loop
  useEffect(() => {
    if (!contextRef.current || !splatMesh) return;

    const context = contextRef.current;
    lastFrameTimeRef.current = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const frameInterval = currentTime - lastFrameTimeRef.current;

      // Update controls
      context.controls.update();

      // Render scene
      context.renderer.render(context.scene, context.camera);

      // Report frame time
      if (onFrameUpdate) {
        onFrameUpdate(frameInterval);
      }

      lastFrameTimeRef.current = currentTime;
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
    };
  }, [splatMesh, onFrameUpdate]);

  return (
    <div
      className="bg-gray-900"
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
    >
      {/* Viewer container */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />

      {/* Loading UI */}
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

      {/* Error UI */}
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

      {/* No file loaded */}
      {!gsFile && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
          <div className="text-gray-400 text-lg">No file loaded</div>
        </div>
      )}
    </div>
  );
}
