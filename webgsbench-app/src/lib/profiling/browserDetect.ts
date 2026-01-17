/**
 * Browser and Hardware Detection for WebGSBench
 * 
 * Detects browser, GPU, WebGL/WebGPU support for benchmarking
 */

export interface BrowserProfile {
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Unknown';
  version: string;
  platform: string;
  gpu: string;
  webglVersion: string;
  webgpuSupported: boolean;
  deviceMemory?: number; // GB
}

export class BrowserProfiler {
  static getProfile(): BrowserProfile {
    const ua = navigator.userAgent;
    
    // Detect browser
    let browser: BrowserProfile['browser'] = 'Unknown';
    let version = '';
    
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      browser = 'Chrome';
      version = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browser = 'Safari';
      version = ua.match(/Version\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Firefox')) {
      browser = 'Firefox';
      version = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Edg')) {
      browser = 'Edge';
      version = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
    }
    
    // Detect GPU
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    let gpu = 'Unknown';
    let webglVersion = 'None';
    
    if (gl && gl instanceof WebGLRenderingContext) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
      webglVersion = 'WebGL 1.0';
    }
    
    // Detect WebGL 2.0
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      webglVersion = 'WebGL 2.0';
    }
    
    // Detect WebGPU
    const webgpuSupported = 'gpu' in navigator;
    
    // Detect device memory (Chrome only)
    const deviceMemory = (navigator as any).deviceMemory;
    
    return {
      browser,
      version,
      platform: navigator.platform,
      gpu,
      webglVersion,
      webgpuSupported,
      deviceMemory,
    };
  }
  
  static getProfileString(): string {
    const profile = this.getProfile();
    return `${profile.browser} ${profile.version} | ${profile.gpu} | ${profile.webglVersion}`;
  }
  
  static getProfileJSON(): string {
    return JSON.stringify(this.getProfile(), null, 2);
  }
  
  /**
   * Check if the current environment is suitable for benchmarking
   */
  static isBenchmarkReady(): { ready: boolean; issues: string[] } {
    const profile = this.getProfile();
    const issues: string[] = [];
    
    if (profile.browser === 'Unknown') {
      issues.push('Unknown browser - results may be unreliable');
    }
    
    if (profile.gpu === 'Unknown') {
      issues.push('GPU not detected - WebGL may not be hardware accelerated');
    }
    
    if (profile.webglVersion === 'None') {
      issues.push('WebGL not supported - 3DGS rendering will fail');
    }
    
    if (profile.deviceMemory && profile.deviceMemory < 4) {
      issues.push(`Low device memory (${profile.deviceMemory}GB) - may cause OOM on large scenes`);
    }
    
    return {
      ready: issues.length === 0,
      issues,
    };
  }
}
