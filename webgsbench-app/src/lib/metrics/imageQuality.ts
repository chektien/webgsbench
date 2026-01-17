/**
 * Image Quality Metrics for comparing rendered Gaussian Splat views
 * Implements PSNR (Peak Signal-to-Noise Ratio) and SSIM (Structural Similarity Index)
 */

/**
 * Captures a WebGL canvas to ImageData by reading pixels directly from WebGL context
 * This works even with preserveDrawingBuffer: false by forcing a render immediately before capture
 * @param canvas - The WebGL canvas to capture
 * @param viewer - The GaussianSplats3D viewer instance to force render
 * @returns ImageData containing the canvas pixels
 */
export function captureCanvas(canvas: HTMLCanvasElement, viewer?: any): Promise<ImageData> {
  return new Promise<ImageData>((resolve, reject) => {
    // Capture in the next frame when rendering has occurred
    requestAnimationFrame(() => {
      try {
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) {
          reject(new Error('Failed to get WebGL context'));
          return;
        }

        // Force a render RIGHT BEFORE readPixels if viewer is available
        if (viewer) {
          console.log('Forcing render before capture...');
          viewer.update();
          viewer.render();
          // Ensure GPU commands complete before reading pixels
          gl.flush();
        }

        const width = canvas.width;
        const height = canvas.height;

        console.log(`Reading pixels from ${width}x${height} canvas...`);

        // Read pixels directly from WebGL framebuffer IMMEDIATELY after render
        const pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        // Create ImageData from the pixels
        // Note: WebGL pixels are flipped vertically, so we need to flip them back
        const imageData = new ImageData(width, height);
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const srcIdx = ((height - 1 - y) * width + x) * 4; // Flip Y
            const dstIdx = (y * width + x) * 4;
            imageData.data[dstIdx] = pixels[srcIdx];     // R
            imageData.data[dstIdx + 1] = pixels[srcIdx + 1]; // G
            imageData.data[dstIdx + 2] = pixels[srcIdx + 2]; // B
            imageData.data[dstIdx + 3] = pixels[srcIdx + 3]; // A
          }
        }

        // Check if we got valid data (not all transparent)
        let hasColor = false;
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] > 0) { // Check alpha channel
            hasColor = true;
            break;
          }
        }
        
        if (!hasColor) {
          console.warn('Captured canvas appears to be empty/transparent - all pixels have alpha=0');
          // Log first few pixels for debugging
          console.log('First 10 RGBA values:', Array.from(pixels.slice(0, 40)));
        } else {
          console.log('Successfully captured canvas with color data');
        }
        
        resolve(imageData);
      } catch (error) {
        reject(error as Error);
      }
    });
  });
}

/**
 * Calculate PSNR (Peak Signal-to-Noise Ratio) between two images
 * @param imageA - First image data
 * @param imageB - Second image data
 * @returns PSNR in decibels (dB). Higher is better. Infinity means identical images.
 */
export function calculatePSNR(imageA: ImageData, imageB: ImageData): number {
  // Validate dimensions match
  if (imageA.width !== imageB.width || imageA.height !== imageB.height) {
    throw new Error('Images must have the same dimensions for PSNR calculation');
  }

  const pixels = imageA.width * imageA.height;
  let mse = 0;

  // Calculate Mean Squared Error across RGB channels
  for (let i = 0; i < imageA.data.length; i += 4) {
    // Compare R, G, B channels (skip alpha at i+3)
    const diffR = imageA.data[i] - imageB.data[i];
    const diffG = imageA.data[i + 1] - imageB.data[i + 1];
    const diffB = imageA.data[i + 2] - imageB.data[i + 2];

    mse += diffR * diffR + diffG * diffG + diffB * diffB;
  }

  // Average MSE across all RGB pixels
  mse /= pixels * 3;

  // Handle identical images
  if (mse === 0) {
    return Infinity;
  }

  // PSNR formula: 10 * log10(MAX^2 / MSE)
  // MAX = 255 for 8-bit images
  const maxPixelValue = 255;
  return 10 * Math.log10((maxPixelValue * maxPixelValue) / mse);
}

/**
 * Convert ImageData to grayscale array using luminance formula
 * @param imageData - Input image data
 * @returns Flat array of grayscale values (0-255)
 */
function toGrayscale(imageData: ImageData): number[] {
  const gray = new Array(imageData.width * imageData.height);

  for (let i = 0, j = 0; i < imageData.data.length; i += 4, j++) {
    // Standard luminance formula: 0.299*R + 0.587*G + 0.114*B
    gray[j] =
      0.299 * imageData.data[i] +     // R
      0.587 * imageData.data[i + 1] + // G
      0.114 * imageData.data[i + 2];  // B
  }

  return gray;
}

/**
 * Calculate mean of an array
 */
function mean(arr: number[]): number {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

/**
 * Calculate variance of an array given its mean
 */
function variance(arr: number[], meanVal: number): number {
  const sumSquaredDiff = arr.reduce((sum, val) => {
    const diff = val - meanVal;
    return sum + diff * diff;
  }, 0);
  return sumSquaredDiff / arr.length;
}

/**
 * Calculate covariance between two arrays given their means
 */
function covariance(arrA: number[], arrB: number[], meanA: number, meanB: number): number {
  if (arrA.length !== arrB.length) {
    throw new Error('Arrays must have same length for covariance');
  }

  let sum = 0;
  for (let i = 0; i < arrA.length; i++) {
    sum += (arrA[i] - meanA) * (arrB[i] - meanB);
  }

  return sum / arrA.length;
}

/**
 * Calculate SSIM (Structural Similarity Index) between two images
 * Uses simplified whole-image SSIM (not windowed)
 * @param imageA - First image data
 * @param imageB - Second image data
 * @returns SSIM value between 0 and 1. Higher is better. 1.0 means identical.
 */
export function calculateSSIM(imageA: ImageData, imageB: ImageData): number {
  // Validate dimensions match
  if (imageA.width !== imageB.width || imageA.height !== imageB.height) {
    throw new Error('Images must have the same dimensions for SSIM calculation');
  }

  // SSIM constants (standard values)
  const L = 255; // Dynamic range for 8-bit images
  const K1 = 0.01;
  const K2 = 0.03;
  const C1 = (K1 * L) ** 2;
  const C2 = (K2 * L) ** 2;

  // Convert to grayscale
  const grayA = toGrayscale(imageA);
  const grayB = toGrayscale(imageB);

  // Calculate statistics
  const meanA = mean(grayA);
  const meanB = mean(grayB);
  const varA = variance(grayA, meanA);
  const varB = variance(grayB, meanB);
  const covAB = covariance(grayA, grayB, meanA, meanB);

  // Calculate standard deviations
  const sigmaA = Math.sqrt(varA);
  const sigmaB = Math.sqrt(varB);

  // SSIM formula
  const numerator = (2 * meanA * meanB + C1) * (2 * covAB + C2);
  const denominator = (meanA * meanA + meanB * meanB + C1) * (varA + varB + C2);

  return numerator / denominator;
}

/**
 * Find all Gaussian Splat viewer canvases in the document
 * @returns Array of canvas elements (up to 2 for side-by-side comparison)
 */
export function findViewerCanvases(): HTMLCanvasElement[] {
  const canvases = document.querySelectorAll('canvas[data-engine="three.js r182"]');
  return Array.from(canvases) as HTMLCanvasElement[];
}
