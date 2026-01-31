/**
 * Camera Preset System for WebGSBench
 * 
 * Defines canonical viewpoints for consistent, reproducible evaluation
 * across all scenes. Supports both standard 5-view protocol and
 * custom researcher-defined viewpoints.
 */

import * as THREE from 'three';

export interface ViewpointPreset {
  id: string;
  name: string;
  description: string;
  // Position relative to scene center (will be scaled by scene radius)
  position: { x: number; y: number; z: number };
  // Look-at target (usually scene center)
  target: { x: number; y: number; z: number };
  // Field of view (optional, defaults to 60)
  fov?: number;
}

/**
 * Standard 5-viewpoint evaluation protocol
 * Based on experimental procedures documented in EXPERIMENTAL_PROCEDURES.md
 */
export const STANDARD_VIEWPOINTS: ViewpointPreset[] = [
  {
    id: 'front',
    name: 'Front Center',
    description: 'Default head-on view at medium distance',
    position: { x: 0, y: 0, z: 3.5 },
    target: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'close',
    name: 'Close-Up Detail',
    description: 'Zoomed in for texture detail inspection',
    position: { x: 0, y: 0, z: 1.5 },
    target: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'wide',
    name: 'Wide Angle',
    description: 'Full scene overview from elevated position',
    position: { x: 0, y: 2, z: 6 },
    target: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'left45',
    name: 'Left 45°',
    description: '45-degree rotation to the left',
    position: { x: -2.5, y: 0, z: 2.5 },
    target: { x: 0, y: 0, z: 0 },
  },
  {
    id: 'right45',
    name: 'Right 45°',
    description: '45-degree rotation to the right',
    position: { x: 2.5, y: 0, z: 2.5 },
    target: { x: 0, y: 0, z: 0 },
  },
];

/**
 * Scene-specific camera configurations
 * These multipliers adjust the standard viewpoints based on scene scale
 */
export interface SceneCameraConfig {
  sceneId: string;
  // Multiplier for camera distance from center
  // Higher values = camera further back
  distanceMultiplier: number;
  // Scene bounding box radius (estimated)
  estimatedRadius: number;
  // Custom adjustments for this scene
  customPresets?: ViewpointPreset[];
}

export const SCENE_CAMERA_CONFIGS: Record<string, SceneCameraConfig> = {
  'bonsai': {
    sceneId: 'bonsai',
    distanceMultiplier: 1.2,
    estimatedRadius: 1.5,
  },
  'garden': {
    sceneId: 'garden',
    distanceMultiplier: 2.0,
    estimatedRadius: 3.0,
  },
  'playroom': {
    sceneId: 'playroom',
    distanceMultiplier: 2.5,
    estimatedRadius: 4.0,
  },
  'truck': {
    sceneId: 'truck',
    distanceMultiplier: 1.8,
    estimatedRadius: 2.5,
  },
  'train': {
    sceneId: 'train',
    distanceMultiplier: 1.6,
    estimatedRadius: 2.2,
  },
  'flower': {
    sceneId: 'flower',
    distanceMultiplier: 0.8,
    estimatedRadius: 0.8,
  },
};

/**
 * Get camera presets for a specific scene
 * Applies scene-specific distance multipliers to standard viewpoints
 */
export function getScenePresets(sceneName: string): ViewpointPreset[] {
  const config = SCENE_CAMERA_CONFIGS[sceneName.toLowerCase()];
  const multiplier = config?.distanceMultiplier ?? 1.5;
  
  return STANDARD_VIEWPOINTS.map(preset => ({
    ...preset,
    position: {
      x: preset.position.x * multiplier,
      y: preset.position.y * multiplier,
      z: preset.position.z * multiplier,
    },
  }));
}

/**
 * Calculate scene bounding sphere from splat data
 * This can be used to auto-generate camera presets for custom scenes
 */
export function estimateSceneRadius(splatPositions: Float32Array): number {
  let maxDistance = 0;
  
  for (let i = 0; i < splatPositions.length; i += 3) {
    const x = splatPositions[i];
    const y = splatPositions[i + 1];
    const z = splatPositions[i + 2];
    const distance = Math.sqrt(x * x + y * y + z * z);
    maxDistance = Math.max(maxDistance, distance);
  }
  
  return maxDistance;
}

/**
 * Auto-generate camera presets for an unknown scene
 * Uses estimated bounding radius to scale standard viewpoints
 */
export function generatePresetsForScene(
  _sceneName: string,
  estimatedRadius: number
): ViewpointPreset[] {
  // Use 3.5× radius as baseline for "front" view
  const multiplier = estimatedRadius > 0 ? 3.5 / estimatedRadius : 1.5;
  
  return STANDARD_VIEWPOINTS.map(preset => ({
    ...preset,
    position: {
      x: preset.position.x * multiplier,
      y: preset.position.y * multiplier,
      z: preset.position.z * multiplier,
    },
  }));
}

/**
 * Apply a camera preset to a Three.js camera and controls
 */
export function applyCameraPreset(
  camera: THREE.PerspectiveCamera,
  controls: any, // OrbitControls
  preset: ViewpointPreset
): void {
  // Apply camera position
  camera.position.set(
    preset.position.x,
    preset.position.y,
    preset.position.z
  );
  controls.target.set(
    preset.target.x,
    preset.target.y,
    preset.target.z
  );
  
  if (preset.fov) {
    camera.fov = preset.fov;
    camera.updateProjectionMatrix();
  }
  
  controls.update();
}

/**
 * Get current camera state as a preset object
 * Useful for saving custom viewpoints
 */
export function captureCurrentView(
  camera: THREE.PerspectiveCamera,
  controls: any
): ViewpointPreset {
  return {
    id: `custom_${Date.now()}`,
    name: 'Custom View',
    description: 'User-defined viewpoint',
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    },
    target: {
      x: controls.target.x,
      y: controls.target.y,
      z: controls.target.z,
    },
    fov: camera.fov,
  };
}

/**
 * Calculate camera distance from scene center
 * Useful for verifying correct positioning
 */
export function getCameraDistance(camera: THREE.PerspectiveCamera): number {
  return camera.position.length();
}

/**
 * Format distance for display
 */
export function formatDistance(distance: number): string {
  return `${distance.toFixed(2)} units`;
}
