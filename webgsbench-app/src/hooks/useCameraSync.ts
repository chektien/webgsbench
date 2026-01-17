import { useEffect } from 'react';
import type { SparkViewerContext } from '../types';

interface CameraSyncOptions {
  sourceContext: SparkViewerContext | null;
  targetContext: SparkViewerContext | null;
  enabled: boolean;
}

/**
 * Synchronize camera movement from source viewer to target viewer
 * @param options - Configuration for camera sync
 * @param options.sourceContext - The viewer context to copy camera from (usually Splat A)
 * @param options.targetContext - The viewer context to sync camera to (usually Splat B)
 * @param options.enabled - Whether sync is enabled
 */
export function useCameraSync({ sourceContext, targetContext, enabled }: CameraSyncOptions) {
  useEffect(() => {
    if (!sourceContext || !targetContext || !enabled) {
      return;
    }

    // Function to copy camera state from source to target
    const syncCamera = () => {
      const sourceCamera = sourceContext.camera;
      const targetCamera = targetContext.camera;
      const sourceControls = sourceContext.controls;
      const targetControls = targetContext.controls;

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
    sourceContext.controls.addEventListener('change', syncCamera);

    // Perform initial sync
    syncCamera();

    console.log('Camera sync enabled: Splat B will follow Splat A camera');

    // Cleanup: remove event listener
    return () => {
      sourceContext.controls.removeEventListener('change', syncCamera);
      console.log('Camera sync disabled');
    };
  }, [sourceContext, targetContext, enabled]);
}
