/**
 * Test setup file for Vitest
 * This file runs before all tests
 */

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test case (e.g., clearing DOM)
afterEach(() => {
  cleanup();
});

// Polyfill ImageData for testing environment if not available
if (typeof ImageData === 'undefined') {
  (globalThis as any).ImageData = class ImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;

    constructor(width: number, height: number);
    constructor(data: Uint8ClampedArray, width: number, height?: number);
    constructor(dataOrWidth: Uint8ClampedArray | number, width: number, height?: number) {
      if (typeof dataOrWidth === 'number') {
        // ImageData(width, height)
        this.width = dataOrWidth;
        this.height = width;
        this.data = new Uint8ClampedArray(this.width * this.height * 4);
      } else {
        // ImageData(data, width, height?)
        this.data = dataOrWidth;
        this.width = width;
        this.height = height !== undefined ? height : dataOrWidth.length / (4 * width);
      }
    }
  };
}

