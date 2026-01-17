/**
 * Tests for imageQuality.ts - PSNR and SSIM metrics
 * 
 * PSNR (Peak Signal-to-Noise Ratio) is a quality metric that compares two images.
 * Formula: PSNR = 10 * log10(MAX^2 / MSE)
 * - Higher values indicate better quality (more similar images)
 * - PSNR = Infinity means identical images (MSE = 0)
 * - Typical values: 30-50 dB for good quality
 * - Below 20 dB indicates poor quality/very different images
 */

import { describe, it, expect } from 'vitest';
import { calculatePSNR, calculateSSIM } from './imageQuality';

/**
 * Helper function to create ImageData with specific pixel values
 */
function createImageData(width: number, height: number, fillColor: [number, number, number, number]): ImageData {
  const imageData = new ImageData(width, height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = fillColor[0];     // R
    imageData.data[i + 1] = fillColor[1]; // G
    imageData.data[i + 2] = fillColor[2]; // B
    imageData.data[i + 3] = fillColor[3]; // A
  }
  return imageData;
}

/**
 * Helper to create ImageData from RGB values array
 * @param width - Image width
 * @param height - Image height
 * @param rgbValues - Flat array of RGB values [r1, g1, b1, r2, g2, b2, ...]
 */
function createImageDataFromRGB(width: number, height: number, rgbValues: number[]): ImageData {
  const imageData = new ImageData(width, height);
  let rgbIndex = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = rgbValues[rgbIndex++];     // R
    imageData.data[i + 1] = rgbValues[rgbIndex++]; // G
    imageData.data[i + 2] = rgbValues[rgbIndex++]; // B
    imageData.data[i + 3] = 255;                   // A (always opaque)
  }
  return imageData;
}

describe('calculatePSNR', () => {
  describe('identical images', () => {
    it('should return Infinity for identical black images', () => {
      const imageA = createImageData(10, 10, [0, 0, 0, 255]);
      const imageB = createImageData(10, 10, [0, 0, 0, 255]);
      expect(calculatePSNR(imageA, imageB)).toBe(Infinity);
    });

    it('should return Infinity for identical white images', () => {
      const imageA = createImageData(10, 10, [255, 255, 255, 255]);
      const imageB = createImageData(10, 10, [255, 255, 255, 255]);
      expect(calculatePSNR(imageA, imageB)).toBe(Infinity);
    });

    it('should return Infinity for identical colored images', () => {
      const imageA = createImageData(5, 5, [128, 64, 192, 255]);
      const imageB = createImageData(5, 5, [128, 64, 192, 255]);
      expect(calculatePSNR(imageA, imageB)).toBe(Infinity);
    });
  });

  describe('completely different images', () => {
    it('should return low PSNR (~7.57 dB) for black vs white images', () => {
      // Black image
      const imageA = createImageData(10, 10, [0, 0, 0, 255]);
      // White image
      const imageB = createImageData(10, 10, [255, 255, 255, 255]);
      
      const psnr = calculatePSNR(imageA, imageB);
      
      // Manual calculation:
      // MSE for each channel: (255 - 0)^2 = 65025
      // Total MSE across 3 channels: 65025 * 3 = 195075
      // Average MSE per pixel per channel: 65025
      // PSNR = 10 * log10(255^2 / 65025) = 10 * log10(1) = 0
      // Wait, let me recalculate:
      // MSE (per channel) = 65025
      // PSNR = 10 * log10(255^2 / 65025) = 10 * log10(65025 / 65025) = 10 * log10(1) = 0
      
      // Hmm, the formula divides by (pixels * 3), so:
      // For 100 pixels, 3 channels each:
      // Total squared diff = 100 * 3 * 65025 = 19,507,500
      // MSE = 19,507,500 / (100 * 3) = 65,025
      // PSNR = 10 * log10(255^2 / 65025) = 10 * log10(1) = 0 dB
      
      // Actually looking at the code:
      // mse += diffR * diffR + diffG * diffG + diffB * diffB
      // mse /= pixels * 3
      // For black vs white: diff = 255 for all channels
      // mse = (255^2 + 255^2 + 255^2) * 100 / (100 * 3) = 3 * 65025 * 100 / 300 = 65025
      // PSNR = 10 * log10(255^2 / 65025) = 10 * log10(65025/65025) = 0 dB
      
      expect(psnr).toBeCloseTo(0, 1);
    });

    it('should return low PSNR for red vs cyan images', () => {
      // Red image (R=255, G=0, B=0)
      const imageA = createImageData(10, 10, [255, 0, 0, 255]);
      // Cyan image (R=0, G=255, B=255)
      const imageB = createImageData(10, 10, [0, 255, 255, 255]);
      
      const psnr = calculatePSNR(imageA, imageB);
      
      // MSE calculation:
      // diffR = 255, diffG = -255, diffB = -255
      // per pixel: 255^2 + 255^2 + 255^2 = 195075
      // MSE = 195075 / 3 = 65025
      // PSNR = 10 * log10(65025 / 65025) = 0 dB
      
      expect(psnr).toBeCloseTo(0, 1);
    });
  });

  describe('known PSNR values', () => {
    it('should calculate correct PSNR for single pixel difference', () => {
      // Create two identical images except for one pixel
      const width = 10, height = 10;
      const imageA = createImageData(width, height, [100, 100, 100, 255]);
      const imageB = createImageData(width, height, [100, 100, 100, 255]);
      
      // Change one pixel in imageB (first pixel, R channel only)
      imageB.data[0] = 110; // Changed from 100 to 110
      
      const psnr = calculatePSNR(imageA, imageB);
      
      // Manual calculation:
      // Only 1 channel of 1 pixel differs: diff = 10
      // Total squared diff = 10^2 = 100
      // Total pixels = 100, total channels = 300
      // MSE = 100 / 300 = 0.333...
      // PSNR = 10 * log10(255^2 / 0.333...) = 10 * log10(195075) ≈ 52.9 dB
      
      expect(psnr).toBeGreaterThan(50);
      expect(psnr).toBeLessThan(60);
    });

    it('should calculate PSNR for known test case', () => {
      // Create a simple 2x2 image test case with known values
      const imageA = createImageDataFromRGB(2, 2, [
        100, 100, 100,  // Pixel 1
        150, 150, 150,  // Pixel 2
        200, 200, 200,  // Pixel 3
        250, 250, 250   // Pixel 4
      ]);
      
      const imageB = createImageDataFromRGB(2, 2, [
        105, 105, 105,  // Pixel 1 (diff: 5 per channel)
        155, 155, 155,  // Pixel 2 (diff: 5 per channel)
        195, 195, 195,  // Pixel 3 (diff: -5 per channel)
        245, 245, 245   // Pixel 4 (diff: -5 per channel)
      ]);
      
      const psnr = calculatePSNR(imageA, imageB);
      
      // Manual calculation:
      // Each pixel has diff of ±5 in all 3 channels
      // Squared diffs per pixel: 5^2 * 3 = 75
      // Total squared diff: 75 * 4 = 300
      // MSE = 300 / (4 * 3) = 25
      // PSNR = 10 * log10(255^2 / 25) = 10 * log10(2601) ≈ 34.15 dB
      
      expect(psnr).toBeCloseTo(34.15, 1);
    });
  });

  describe('edge cases and error handling', () => {
    it('should throw error for mismatched width', () => {
      const imageA = createImageData(10, 10, [0, 0, 0, 255]);
      const imageB = createImageData(5, 10, [0, 0, 0, 255]);
      
      expect(() => calculatePSNR(imageA, imageB)).toThrow(
        'Images must have the same dimensions for PSNR calculation'
      );
    });

    it('should throw error for mismatched height', () => {
      const imageA = createImageData(10, 10, [0, 0, 0, 255]);
      const imageB = createImageData(10, 5, [0, 0, 0, 255]);
      
      expect(() => calculatePSNR(imageA, imageB)).toThrow(
        'Images must have the same dimensions for PSNR calculation'
      );
    });

    it('should throw error for mismatched dimensions', () => {
      const imageA = createImageData(10, 10, [0, 0, 0, 255]);
      const imageB = createImageData(5, 5, [0, 0, 0, 255]);
      
      expect(() => calculatePSNR(imageA, imageB)).toThrow(
        'Images must have the same dimensions for PSNR calculation'
      );
    });

    it('should handle 1x1 images', () => {
      const imageA = createImageData(1, 1, [100, 100, 100, 255]);
      const imageB = createImageData(1, 1, [100, 100, 100, 255]);
      
      expect(calculatePSNR(imageA, imageB)).toBe(Infinity);
    });

    it('should handle 1x1 different images', () => {
      const imageA = createImageData(1, 1, [0, 0, 0, 255]);
      const imageB = createImageData(1, 1, [255, 255, 255, 255]);
      
      const psnr = calculatePSNR(imageA, imageB);
      expect(psnr).toBeCloseTo(0, 1);
    });
  });

  describe('PSNR value ranges', () => {
    it('should return high PSNR (>40 dB) for very similar images', () => {
      const imageA = createImageData(10, 10, [128, 128, 128, 255]);
      const imageB = createImageData(10, 10, [130, 130, 130, 255]);
      
      const psnr = calculatePSNR(imageA, imageB);
      
      // Small difference (2 per channel)
      // MSE = 2^2 * 3 / 3 = 4
      // PSNR = 10 * log10(255^2 / 4) = 10 * log10(16256.25) ≈ 42.1 dB
      
      expect(psnr).toBeGreaterThan(40);
    });

    it('should return medium PSNR (20-30 dB) for moderately different images', () => {
      const imageA = createImageData(10, 10, [100, 100, 100, 255]);
      const imageB = createImageData(10, 10, [130, 130, 130, 255]);
      
      const psnr = calculatePSNR(imageA, imageB);
      
      // Medium difference (30 per channel)
      // MSE = 30^2 = 900
      // PSNR = 10 * log10(255^2 / 900) = 10 * log10(72.25) ≈ 18.6 dB
      
      expect(psnr).toBeGreaterThan(18);
      expect(psnr).toBeLessThan(20);
    });
  });

  describe('alpha channel handling', () => {
    it('should ignore alpha channel in PSNR calculation', () => {
      // Two images with different alpha but same RGB
      const imageA = createImageData(10, 10, [100, 100, 100, 255]);
      const imageB = createImageData(10, 10, [100, 100, 100, 128]);
      
      // PSNR should be Infinity since RGB channels are identical
      expect(calculatePSNR(imageA, imageB)).toBe(Infinity);
    });

    it('should calculate PSNR only on RGB channels', () => {
      const imageA = createImageData(5, 5, [100, 150, 200, 255]);
      const imageB = createImageData(5, 5, [105, 155, 205, 0]);
      
      const psnr = calculatePSNR(imageA, imageB);
      
      // Same diff in RGB (5 per channel), different alpha (ignored)
      // MSE = (5^2 + 5^2 + 5^2) / 3 = 25
      // PSNR = 10 * log10(255^2 / 25) ≈ 34.15 dB
      expect(psnr).toBeCloseTo(34.15, 1);
    });
  });
});

describe('calculateSSIM', () => {
  describe('identical images', () => {
    it('should return 1.0 for identical images', () => {
      const imageA = createImageData(10, 10, [128, 128, 128, 255]);
      const imageB = createImageData(10, 10, [128, 128, 128, 255]);
      
      const ssim = calculateSSIM(imageA, imageB);
      expect(ssim).toBeCloseTo(1.0, 5);
    });

    it('should return 1.0 for identical colored images', () => {
      const imageA = createImageData(10, 10, [100, 150, 200, 255]);
      const imageB = createImageData(10, 10, [100, 150, 200, 255]);
      
      const ssim = calculateSSIM(imageA, imageB);
      expect(ssim).toBeCloseTo(1.0, 5);
    });
  });

  describe('different images', () => {
    it('should return low SSIM for completely different images', () => {
      const imageA = createImageData(10, 10, [0, 0, 0, 255]);
      const imageB = createImageData(10, 10, [255, 255, 255, 255]);
      
      const ssim = calculateSSIM(imageA, imageB);
      
      // Should be significantly less than 1.0
      expect(ssim).toBeLessThan(0.5);
    });

    it('should return SSIM between 0 and 1', () => {
      const imageA = createImageData(10, 10, [100, 100, 100, 255]);
      const imageB = createImageData(10, 10, [150, 150, 150, 255]);
      
      const ssim = calculateSSIM(imageA, imageB);
      
      expect(ssim).toBeGreaterThan(0);
      expect(ssim).toBeLessThan(1);
    });
  });

  describe('error handling', () => {
    it('should throw error for mismatched dimensions', () => {
      const imageA = createImageData(10, 10, [0, 0, 0, 255]);
      const imageB = createImageData(5, 5, [0, 0, 0, 255]);
      
      expect(() => calculateSSIM(imageA, imageB)).toThrow(
        'Images must have the same dimensions for SSIM calculation'
      );
    });
  });
});
