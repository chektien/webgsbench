import { useEffect } from 'react';
import type * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

interface CameraSyncOptions {
  sourceViewer: GaussianSplats3D.Viewer | null;
  targetViewer: GaussianSplats3D.Viewer | null;
  enabled: boolean;
}

/**
 * Synchronize camera movement from source viewer to target viewer
 * @param options - Configuration for camera sync
 * @param options.sourceViewer - The viewer to copy camera from (usually Splat A)
 * @param options.targetViewer - The viewer to sync camera to (usually Splat B)
 * @param options.enabled - Whether sync is enabled
 */
export function useCameraSync({ sourceViewer, targetViewer, enabled }: CameraSyncOptions) {
  useEffect(() => {
    if (!sourceViewer || !targetViewer || !enabled) {
      return;
    }

    // Function to copy camera state from source to target
    const syncCamera = () => {
      const sourceCamera = sourceViewer.camera;
      const targetCamera = targetViewer.camera;
      const sourceControls = sourceViewer.controls;
      const targetControls = targetViewer.controls;

      // Copy camera position
      targetCamera.position.copy(sourceCamera.position);

      // Copy camera rotation (quaternion for accurate orientation)
      targetCamera.quaternion.copy(sourceCamera.quaternion);

      // Copy orbit target (the point the camera orbits around)
      targetControls.target.copy(sourceControls.target);

      // Update controls to apply changes
      targetControls.update();
    };

    // Listen to source controls change event
    sourceViewer.controls.addEventListener('change', syncCamera);

    // Perform initial sync
    syncCamera();

    console.log('Camera sync enabled: Splat B will follow Splat A camera');

    // Cleanup: remove event listener
    return () => {
      sourceViewer.controls.removeEventListener('change', syncCamera);
      console.log('Camera sync disabled');
    };
  }, [sourceViewer, targetViewer, enabled]);
}
