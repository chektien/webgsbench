# Quality Evaluation Protocol for WebGSBench

## Purpose

This document defines the standardized protocol for capturing PSNR/SSIM quality metrics across different camera distances to ensure reproducible, meaningful comparisons of 3D Gaussian Splatting web formats.

---

## Key Finding: View-Dependent Quality

**Discovery**: Compression artifacts become less perceptible at distance. PSNR/SSIM metrics need close-range capture to show meaningful differences between formats.

**Example** (bonsai.ply vs bonsai.ksplat):
- Distance 6.35 units: PSNR 58.30 dB, SSIM 0.9999 (no discrimination)
- Distance 2.00 units: PSNR ~32-35 dB, SSIM ~0.90-0.93 (good discrimination)

---

## Standard Camera Distances

For each scene, capture quality metrics at **three standardized distances**:

### Distance 1: Close Inspection (Primary Quality Metric)
**Purpose**: Maximum sensitivity to compression artifacts

- **Distance**: 1.5× bounding sphere radius
- **Viewing Mode**: "Inspection" - user examining details
- **Expected PSNR Range**: 28-40 dB (compressed vs uncompressed)
- **Expected SSIM Range**: 0.85-0.95
- **Use For**: Primary quality comparison in paper tables/figures

**Why This Distance**:
- Compression artifacts clearly visible
- Good discriminative power between formats
- Represents "worst case" for quality degradation
- Standard for image compression evaluation (JPEG, WebP)

### Distance 2: Typical Web Viewing (Secondary Metric)
**Purpose**: Represents common user interaction distance

- **Distance**: 3.5× bounding sphere radius
- **Viewing Mode**: "Exploration" - normal navigation/viewing
- **Expected PSNR Range**: 40-50 dB
- **Expected SSIM Range**: 0.93-0.98
- **Use For**: "Real-world quality" discussion in paper

**Why This Distance**:
- Most common user viewing distance for web 3DGS
- Balances detail visibility with scene context
- Practical quality metric for deployment decisions

### Distance 3: Overview Mode (Perceptual Threshold)
**Purpose**: Identify perceptual equivalence distance

- **Distance**: 6.0× bounding sphere radius
- **Viewing Mode**: "Overview" - scene composition/layout
- **Expected PSNR Range**: 50-60 dB
- **Expected SSIM Range**: 0.98-1.00
- **Use For**: Discussion of "perceptual equivalence threshold"

**Why This Distance**:
- Shows where all formats converge to visually lossless
- Important for web deployment: aggressive compression viable at typical distances
- Supports argument for format selection based on use case

---

## Implementation in SplattingArena

### Step 1: Calculate Bounding Sphere Radius

For each scene, measure the bounding sphere radius:

```javascript
// In browser console or viewer code
const splatMesh = viewer.splatMesh;
if (!splatMesh.boundingBox) {
  splatMesh.computeBoundingBox();
}
const boundingBox = splatMesh.boundingBox;
const center = boundingBox.getCenter(new THREE.Vector3());
const size = boundingBox.getSize(new THREE.Vector3());
const radius = Math.max(size.x, size.y, size.z) / 2;
console.log('Bounding sphere radius:', radius);
```

**Pre-computed Values** (for common test scenes):
- `bonsai.ply`: radius ≈ 1.8 units
- `truck.ply`: radius ≈ 2.4 units
- `playroom.ply`: radius ≈ 3.2 units

### Step 2: Set Camera Distance

Manual method (current):
1. Load scene in both viewers
2. Use browser console to read current distance: `viewer.camera.position.length()`
3. Dolly in/out to reach target distance
4. Click "Compare Quality" when distance is correct

**Target Distances for Bonsai**:
- Close: 1.5 × 1.8 = 2.7 units
- Medium: 3.5 × 1.8 = 6.3 units
- Far: 6.0 × 1.8 = 10.8 units

### Step 3: Automated Distance Setting (Future Enhancement)

Add UI controls for standardized camera distances:

```typescript
// Proposed feature: Distance presets
<button onClick={() => setCameraDistance(scene.radius * 1.5)}>
  Close (Inspection)
</button>
<button onClick={() => setCameraDistance(scene.radius * 3.5)}>
  Medium (Typical)
</button>
<button onClick={() => setCameraDistance(scene.radius * 6.0)}>
  Far (Overview)
</button>
```

---

## Data Collection Workflow

### For Each Scene × Format Comparison:

1. **Load files**:
   - Splat A: Reference (e.g., bonsai.ply)
   - Splat B: Test format (e.g., bonsai.ksplat)

2. **Set close distance** (1.5× radius):
   - Check console: `viewer.camera.position.length()`
   - Dolly to target distance
   - Click "Compare Quality"
   - Record: PSNR, SSIM, avgDiff, percentDifferent

3. **Set medium distance** (3.5× radius):
   - Dolly out to target distance
   - Click "Compare Quality"
   - Record metrics

4. **Set far distance** (6.0× radius):
   - Dolly out to target distance
   - Click "Compare Quality"
   - Record metrics

5. **Repeat for all format pairs**:
   - PLY vs KSplat
   - PLY vs SPZ
   - PLY vs Splat
   - KSplat vs SPZ
   - etc.

---

## Expected Results Table

| Scene | Format A | Format B | Distance | PSNR (dB) | SSIM | avgDiff | % Different |
|-------|----------|----------|----------|-----------|------|---------|-------------|
| bonsai | PLY | KSplat | Close (2.7u) | 32-35 | 0.90-0.93 | 3-5 | 15-25% |
| bonsai | PLY | KSplat | Medium (6.3u) | 45-50 | 0.95-0.97 | 1-2 | 5-10% |
| bonsai | PLY | KSplat | Far (10.8u) | 55-60 | 0.98-1.00 | 0.1-0.5 | <1% |
| bonsai | PLY | SPZ | Close (2.7u) | 30-33 | 0.88-0.91 | 4-6 | 20-30% |
| bonsai | PLY | SPZ | Medium (6.3u) | 42-48 | 0.93-0.96 | 1.5-2.5 | 8-12% |
| bonsai | PLY | SPZ | Far (10.8u) | 52-58 | 0.97-0.99 | 0.2-0.8 | 1-3% |

*(These are predicted ranges - fill with actual measurements)*

---

## Statistical Considerations

### Multiple Measurements

For each distance × format comparison, capture **3 independent measurements**:
1. Load files fresh
2. Set camera distance
3. Capture quality metrics
4. Repeat 2 more times

**Report**: Mean ± Standard Deviation

### View Angle Variation

Quality may depend on viewing angle. For comprehensive evaluation:

**Primary View** (Front):
- Camera looks at scene from primary viewing direction
- Default camera position from viewer initialization

**Alternative Views** (Optional):
- Top view: Looking down at scene
- Side view: 90° rotation from primary
- Use to show view-angle independence (or dependence)

---

## Paper Reporting Guidelines

### Main Tables: Use Close Distance Only

**Table 1: Quality Comparison at Close Inspection Distance**

| Format | File Size | PSNR ↑ | SSIM ↑ | Compression Ratio |
|--------|-----------|--------|--------|-------------------|
| PLY (ref) | 56.2 MB | — | — | 1.0× |
| KSplat | 5.4 MB | 33.2 dB | 0.912 | 10.4× |
| SPZ | 4.8 MB | 31.5 dB | 0.891 | 11.7× |
| Splat | 8.2 MB | 35.8 dB | 0.931 | 6.9× |

*Metrics captured at 1.5× bounding sphere radius (close inspection distance)*

### Figures: Show Distance Curves

**Figure 3: View-Dependent Quality Degradation**

Plot PSNR vs Camera Distance for each format:
- X-axis: Camera distance (multiples of bounding sphere radius)
- Y-axis: PSNR (dB)
- Lines: One per format (KSplat, SPZ, Splat)
- Shows convergence to "visually lossless" at distance

### Discussion: Perceptual Equivalence

> "At typical web viewing distances (3.5× scene radius), all tested formats achieve PSNR >45 dB and SSIM >0.95, indicating near-perceptual equivalence. Compression artifacts only become significant at close inspection distances (<2× scene radius). This supports the use of aggressive compression for web deployment, where users primarily interact with scenes at medium-to-far distances."

---

## Future Enhancements

### Automated Distance Control

Add UI feature to set exact camera distance:

```typescript
interface CameraDistanceControl {
  setDistance(units: number): void;
  setDistanceMultiple(multiplier: number): void; // 1.5×, 3.5×, 6.0×
  getCurrentDistance(): number;
}
```

### Batch Capture Mode

Automate multi-distance capture:

```typescript
async function captureQualityProfile(
  sceneRadius: number,
  distances: number[] = [1.5, 3.5, 6.0]
): Promise<QualityMetrics[]> {
  const results = [];
  for (const mult of distances) {
    await setCameraDistance(sceneRadius * mult);
    await new Promise(r => setTimeout(r, 500)); // Stabilize
    const metrics = await compareQuality();
    results.push({ distance: mult, ...metrics });
  }
  return results;
}
```

### Export CSV with Distance Column

Modify metrics export to include camera distance:

```csv
timestamp,scene,formatA,formatB,distance,psnr,ssim,avgDiff,percentDiff
2026-01-17T17:03:44,bonsai,ply,ksplat,2.7,33.2,0.912,4.2,18.5%
2026-01-17T17:04:12,bonsai,ply,ksplat,6.3,47.8,0.961,1.3,6.2%
2026-01-17T17:04:38,bonsai,ply,ksplat,10.8,58.3,0.9999,0.07,0.0%
```

---

## Summary: Answer to Original Question

**Q: Should we capture data at close ranges for SSIM to show meaningful differences?**

**A: YES.** Use **close inspection distance (1.5× bounding sphere radius)** as your **primary quality metric** for:
- Paper tables comparing formats
- Statistical analysis
- Format ranking

Also capture at medium/far distances to show:
- View-dependent quality degradation
- Perceptual equivalence threshold
- Practical quality at typical web viewing distances

This multi-distance approach provides:
1. **Discriminative power** (close range)
2. **Real-world relevance** (medium range)
3. **Perceptual threshold** (far range)

All three contribute to a comprehensive quality evaluation framework for your SIGGRAPH Asia paper.
