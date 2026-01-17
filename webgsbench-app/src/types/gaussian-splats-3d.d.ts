declare module '@mkkellogg/gaussian-splats-3d' {
  export enum SceneFormat {
    Ply = 0,
    Splat = 1,
    KSplat = 2,
  }

  export interface ViewerOptions {
    cameraUp?: number[];
    initialCameraPosition?: number[];
    initialCameraLookAt?: number[];
    sharedMemoryForWorkers?: boolean;
    selfDrivenMode?: boolean;
    rootElement?: HTMLElement;
    renderWidth?: number;
    renderHeight?: number;
  }

  export interface SceneOptions {
    format?: SceneFormat;
    splatAlphaRemovalThreshold?: number;
    showLoadingUI?: boolean;
    position?: number[];
    rotation?: number[];
    scale?: number[];
    onProgress?: (progress: number, message: string, type: number) => void;
  }

  export interface SplatBuffer {
    getSplatCount(): number;
  }

  export interface Scene {
    splatBuffer: SplatBuffer;
  }

  export interface SplatMesh {
    scenes: Scene[];
    boundingBox?: any;
    computeBoundingBox?: () => void;
  }

  export interface Camera {
    aspect: number;
    position: any;
    updateProjectionMatrix(): void;
  }

  export interface Controls {
    target: any;
    update(): void;
  }

  export class Viewer {
    rootElement: HTMLElement;
    splatMesh: SplatMesh;
    camera?: Camera;
    controls?: Controls;

    constructor(options?: ViewerOptions);
    addSplatScene(path: string, options?: SceneOptions): Promise<void>;
    start(): void;
    dispose(): void;
  }
}
