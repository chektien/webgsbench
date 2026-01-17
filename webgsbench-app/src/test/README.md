# WebGSBench Test Suite

This directory contains the test suite for the WebGSBench project, focusing on validating the correctness of image quality metrics used for benchmarking 3D Gaussian Splatting viewers.

## Overview

The test suite currently validates:
- **PSNR (Peak Signal-to-Noise Ratio)** metric implementation
- **SSIM (Structural Similarity Index)** metric implementation

These metrics are critical for comparing the quality of rendered Gaussian Splat views in the benchmarking application.

## Test Framework

- **Testing Framework**: Vitest (recommended for Vite projects)
- **Test Environment**: happy-dom (browser-like environment)
- **Test Utilities**: @testing-library/react, @testing-library/jest-dom

## Running Tests

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage (if configured)
npm run test:coverage
```

## Test Structure

### PSNR Tests (`imageQuality.test.ts`)

The PSNR tests validate the `calculatePSNR()` function with the following test cases:

#### 1. Identical Images
- Black images → PSNR = Infinity ✓
- White images → PSNR = Infinity ✓
- Colored images → PSNR = Infinity ✓

#### 2. Completely Different Images
- Black vs White → PSNR ≈ 0 dB ✓
- Red vs Cyan → PSNR ≈ 0 dB ✓

#### 3. Known PSNR Values
- Single pixel difference → PSNR > 50 dB ✓
- Known test case (2x2 image with ±5 difference) → PSNR ≈ 34.15 dB ✓

#### 4. Edge Cases and Error Handling
- Mismatched width → throws error ✓
- Mismatched height → throws error ✓
- Mismatched dimensions → throws error ✓
- 1x1 identical images → PSNR = Infinity ✓
- 1x1 different images → PSNR ≈ 0 dB ✓

#### 5. PSNR Value Ranges
- Very similar images (diff=2) → PSNR > 40 dB ✓
- Moderately different images (diff=30) → PSNR 18-20 dB ✓

#### 6. Alpha Channel Handling
- Different alpha, same RGB → PSNR = Infinity ✓
- Same RGB diff, different alpha → Same PSNR ✓

### SSIM Tests (`imageQuality.test.ts`)

The SSIM tests validate the `calculateSSIM()` function:

#### 1. Identical Images
- Identical grayscale → SSIM = 1.0 ✓
- Identical colored → SSIM = 1.0 ✓

#### 2. Different Images
- Completely different (black vs white) → SSIM < 0.5 ✓
- Moderately different → 0 < SSIM < 1 ✓

#### 3. Error Handling
- Mismatched dimensions → throws error ✓

## PSNR Formula Verification

The PSNR implementation uses the standard formula:

```
PSNR = 10 * log10(MAX² / MSE)
```

Where:
- `MAX = 255` (for 8-bit images)
- `MSE = Mean Squared Error` across RGB channels (alpha ignored)

The tests verify this formula with known inputs and expected outputs.

### Example Calculation

For two 2x2 images with a difference of ±5 in all RGB channels:

```
MSE = (5² + 5² + 5²) / 3 = 25
PSNR = 10 * log10(255² / 25) = 10 * log10(2601) ≈ 34.15 dB
```

## Test Coverage

Currently tested:
- ✅ PSNR correctness with various inputs
- ✅ PSNR edge cases and error handling
- ✅ SSIM correctness with various inputs
- ✅ SSIM error handling
- ✅ Alpha channel is correctly ignored in both metrics

Not yet tested (future work):
- [ ] `captureCanvas()` function (requires mocking WebGL context)
- [ ] `findViewerCanvases()` function (requires DOM mocking)
- [ ] Integration tests with actual rendered images

## Adding New Tests

To add new tests:

1. Create a new test file in the same directory as the code being tested
2. Name it `*.test.ts` (e.g., `myFeature.test.ts`)
3. Import test utilities from Vitest:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myFeature';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction(input);
    expect(result).toBe(expectedValue);
  });
});
```

## Continuous Integration

The test suite is designed to run in CI environments:

```bash
# CI-friendly command
npm run test:run
```

This will:
- Run all tests once (no watch mode)
- Exit with code 0 if all tests pass
- Exit with code 1 if any tests fail

## Known Limitations

1. **WebGL Mocking**: The `captureCanvas()` function cannot be fully tested without mocking WebGL contexts, which is complex and not yet implemented.

2. **Browser-Specific APIs**: Some browser APIs (like `requestAnimationFrame`) are not fully available in the test environment and may need additional polyfills for comprehensive testing.

3. **ImageData Polyfill**: The test setup includes a simple polyfill for `ImageData` since it's not available in Node.js environments. This polyfill is sufficient for testing the metrics but doesn't include all browser-specific optimizations.

## Contributing

When adding new features that use image quality metrics:

1. **Write tests first** - Add test cases before implementing the feature
2. **Validate correctness** - Include tests with known expected values
3. **Test edge cases** - Consider boundary conditions and error cases
4. **Run tests locally** - Ensure all tests pass before committing
5. **Update documentation** - Add test descriptions to this README

## References

- [PSNR (Wikipedia)](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio)
- [SSIM (Wikipedia)](https://en.wikipedia.org/wiki/Structural_similarity)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
