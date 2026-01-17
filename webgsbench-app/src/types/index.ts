import type * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { SplatMesh } from '@sparkjsdev/spark';

export interface BenchmarkMetrics {
  fps: number;
  frameTime: number; // ms
  memoryUsage: number; // MB
  loadTime: number; // ms
  fileSize: number; // MB
  splatCount: number;
  resolution: [number, number]; // [width, height]

  // Performance stability metrics
  frameTimeVariance: number; // ms (standard deviation)
  fps1PercentLow: number; // FPS
  fps01PercentLow: number; // FPS
  frameTimeP50: number; // ms (median)
  frameTimeP95: number; // ms (95th percentile)
  frameTimeP99: number; // ms (99th percentile)
}

export interface GSFile {
  file: File;
  name: string;
  size: number; // bytes
  format: '.ply' | '.splat' | '.ksplat' | '.spz';
}

export interface ImageQualityMetrics {
  psnr: number | null; // dB (decibels) - higher is better
  ssim: number | null; // 0-1 scale - higher is better
  capturedAt: string | null; // ISO timestamp
  error: string | null;
}

/**
 * Configuration options for SparkViewer
 */
export interface SparkViewerOptions {
  preserveDrawingBuffer?: boolean;  // Default: true for quality metrics
  controlsType?: 'orbit' | 'spark'; // Default: 'orbit'
  initialCameraDistance?: number;   // Default: 5
}

/**
 * Viewer context returned by SparkViewer
 * Replaces the old GaussianSplats3D.Viewer
 */
export interface SparkViewerContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  splatMesh: SplatMesh | null;
  canvas: HTMLCanvasElement;
  forceRender: () => void; // For quality metrics capture
}
