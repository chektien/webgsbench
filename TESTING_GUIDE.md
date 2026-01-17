# WebGSBench Testing Guide

## Quick Start: Verify Close-Range Quality Metrics

### Objective
Verify that PSNR/SSIM show proper discrimination between compressed formats at close inspection distance (not the inflated far-distance values).

### Expected Results at Close Distance (~2.7 units for bonsai)
- **PSNR**: 28-40 dB (NOT 50-60 dB)
- **SSIM**: 0.85-0.95 (NOT 0.99-1.00)
- **avgDiff**: 3-8 (NOT 0.07)
- **percentDifferent**: 10-30% (NOT <1%)

---

## Test Procedure

### 1. Start the Application

```bash
cd webgsbench-app
npm run dev
```

Open browser to: `http://localhost:5173/`

### 2. Load Test Files

**Splat A (Reference)**:
- Click or drag `assets/bonsai.ply` into the left pane
- Wait for load to complete

**Splat B (Compressed)**:
- Click or drag `assets/bonsai.ksplat` into the right pane
- Wait for load to complete

### 3. Position Camera at Close Distance

**Goal**: Position camera at **2.7 units** distance

**Method**:
1. Use mouse scroll (or trackpad pinch) to dolly **IN** (zoom in close)
2. Watch the **Camera Distance** panel in bottom-left corner
3. Current distance shows in **green/yellow/blue** based on range
4. Target: **Green "Close (Primary Metric)"** at **2.70 ± 0.30 units**

**Visual check**: The bonsai should fill most of the viewport - you're inspecting it closely.

### 4. Compare Quality

1. Click **"Compare Quality"** button (top-right, green button)
2. Wait 1-2 seconds for computation
3. Check results in **Metrics Panel** (right sidebar)

### 5. Verify Results

**Expected Console Output**:
```
=== Starting Quality Comparison ===
Splat A: bonsai.ply
Splat B: bonsai.ksplat
Camera distance: 2.7 units
Forcing render before capture... (×2)
Reading pixels from 800x600 canvas... (×2)
Successfully captured canvas with color data (×2)

Pixel difference statistics:
  avgDiff: 3.5-5.0 (average per-channel difference)
  maxDiff: 60-100 (maximum difference in any pixel/channel)
  percentDifferent: 15-25% (percentage of pixels with >1 difference)

SSIM calculation details:
  meanA: ~120-140 (average grayscale value)
  meanB: ~120-140
  sigmaA/B: ~60-80 (standard deviation)
  
SSIM components:
  ssim: 0.91-0.94 (NOT 0.9999!)

PSNR: 32-36 dB (NOT 58 dB!)
SSIM: 0.91-0.94 (NOT 1.0000!)
```

**UI Metrics Panel Should Show**:
```
Quality Comparison
  PSNR: 32.5 dB         [32-36 range is CORRECT]
  SSIM: 0.9234          [0.90-0.94 range is CORRECT]
```

---

## Testing Different Distances (View-Dependent Quality)

### Test 1: Close Distance (Primary Metric)
- **Distance**: 2.7 units (green indicator)
- **Expected PSNR**: 32-36 dB
- **Expected SSIM**: 0.90-0.94
- **Purpose**: Best discrimination between formats

### Test 2: Medium Distance (Typical Web Viewing)
- **Distance**: 6.3 units (yellow indicator)
- **Expected PSNR**: 40-50 dB
- **Expected SSIM**: 0.93-0.98
- **Purpose**: Real-world web viewing scenario

### Test 3: Far Distance (Perceptual Equivalence)
- **Distance**: 10.8 units (blue indicator)
- **Expected PSNR**: 50-60 dB
- **Expected SSIM**: 0.98-1.00
- **Purpose**: Demonstrate compression artifacts become imperceptible

### Procedure for Each Distance
1. Dolly to target distance (watch Camera Distance panel)
2. Click "Compare Quality"
3. Record PSNR/SSIM values
4. Note: Values should **increase** as you move **farther away**

---

## Testing File Swapping Feature

### Objective
Test efficient workflow for comparing multiple format pairs without reloading reference.

### Procedure

1. **Load initial pair**:
   - Splat A: `bonsai.ply` (reference)
   - Splat B: `bonsai.ksplat`
   - Position at close distance (2.7 units)
   - Compare Quality → Record results

2. **Swap Splat B only**:
   - Click **"Change"** button next to "Splat B" label (top-right of right pane)
   - Splat B clears, Splat A stays loaded
   - Load `bonsai.spz` into Splat B
   - Quality metrics automatically reset
   - Camera stays at same distance (2.7 units)
   - Compare Quality → Record results

3. **Continue testing**:
   - Repeat step 2 with other formats (.splat, .ksplat, .spz)
   - Reference (Splat A) never needs reloading
   - Camera position maintained across swaps

**Expected Behavior**:
- ✅ Reference file (Splat A) stays loaded
- ✅ Camera position preserved
- ✅ Quality metrics reset to "N/A" when file changes
- ✅ "Compare Quality" button re-enables after swap
- ✅ New comparison works correctly after swap

---

## Troubleshooting

### Issue: PSNR still shows 50-60 dB at close distance

**Diagnosis**: Camera is still too far away

**Solution**:
1. Check Console: `viewer.camera.position.length()`
2. If > 3.0 units, dolly IN closer (scroll in)
3. Target: 2.5-2.9 units for bonsai
4. Try again

### Issue: SSIM still shows 0.9999 or 1.0000

**Diagnosis**: Same as above - camera too far

**Solution**: 
1. Dolly IN until distance is 2.5-2.9 units
2. Compression artifacts only visible up close
3. At far distances, artifacts become sub-pixel (this is correct behavior!)

### Issue: Canvas appears black or quality comparison fails

**Diagnosis**: Canvas capture issue (should be fixed)

**Solution**:
1. Check Console for errors
2. Ensure both files are fully loaded (progress bars complete)
3. Try clicking "Compare Quality" again
4. Check that viewers are rendering (rotate camera - does view update?)

### Issue: Camera distance not updating in UI

**Diagnosis**: Viewer not initialized or display component issue

**Solution**:
1. Check if Camera Distance panel appears (bottom-left)
2. Reload page if panel missing
3. Check Console for React errors

### Issue: Both viewers show same file (PSNR = Infinity)

**Diagnosis**: Accidentally loaded same file in both panes

**Solution**:
1. Console warning: "⚠️ WARNING: Both viewers loaded the SAME FILE!"
2. Click "Change" on Splat B
3. Load a different format

---

## Data Collection Workflow

### Pilot Study (9 measurements)

**Scene**: bonsai
**Format Pairs**: 3 pairs
- PLY vs KSPLAT
- PLY vs SPZ
- KSPLAT vs SPZ

**Distances**: 3 per pair
- Close (2.7 units)
- Medium (6.3 units)
- Far (10.8 units)

**Total**: 3 pairs × 3 distances = 9 measurements

### Recording Template

Create a spreadsheet or CSV with columns:
```
SceneA, FormatA, SceneB, FormatB, Distance, PSNR, SSIM, AvgDiff, PercentDiff, Notes
```

**Example Row**:
```
bonsai, ply, bonsai, ksplat, 2.7, 33.24, 0.9142, 3.8, 18.2, "Primary metric - good discrimination"
```

### Efficient Data Collection with File Swapping

1. **Load reference once**: `bonsai.ply` in Splat A
2. **Set close distance**: 2.7 units
3. **Test all formats in Splat B**:
   - Load ksplat → Compare → Record
   - Change → Load spz → Compare → Record
   - Change → Load splat → Compare → Record
4. **Set medium distance**: 6.3 units
5. **Repeat step 3** for medium distance
6. **Set far distance**: 10.8 units
7. **Repeat step 3** for far distance

**Time estimate**: ~30-45 seconds per measurement = 7-10 minutes total for pilot

---

## Validation Checks

### Repeatability Test
- Load same pair (e.g., PLY vs KSPLAT)
- Measure 3 times at same distance
- Expected variance: ±0.5 dB PSNR, ±0.005 SSIM
- If larger variance → camera position not consistent

### Distance Dependence Test
- Same format pair
- Measure at 3 distances
- Expected trend: PSNR increases as distance increases
- Close (32 dB) → Medium (45 dB) → Far (58 dB)
- If reversed or flat → something wrong

### Format Discrimination Test
- PLY (reference) vs various compressed formats
- At close distance, should see clear ranking:
  - PLY vs PLY: PSNR = ∞, SSIM = 1.0000
  - PLY vs SPZ: PSNR = 30-34, SSIM = 0.88-0.92
  - PLY vs KSPLAT: PSNR = 32-36, SSIM = 0.90-0.94
  - PLY vs SPLAT: PSNR = 34-38, SSIM = 0.92-0.96

---

## Success Criteria

### ✅ System is Working Correctly If:

1. **Close distance (2.7 units)**:
   - PLY vs KSPLAT: PSNR = 30-40 dB, SSIM = 0.85-0.95
   - Clear differences between formats visible in metrics

2. **Distance dependence**:
   - PSNR increases as camera moves farther away
   - Far distance converges to near-perfect scores (SSIM >0.98)

3. **Console output**:
   - "Successfully captured canvas with color data"
   - Pixel differences show avgDiff = 3-8, percentDifferent = 10-30%
   - No warnings about empty/black canvases

4. **UI functionality**:
   - Camera Distance panel updates in real-time
   - Color indicators (green/yellow/blue) match distance ranges
   - File swapping preserves camera position
   - Quality metrics reset correctly after file changes

---

## Next Steps After Verification

Once close-range metrics are verified (PSNR 32-36 dB, SSIM 0.90-0.94):

1. ✅ **Collect pilot data**: 1 scene × 3 pairs × 3 distances
2. **Validate repeatability**: 3 replicates per configuration
3. **Expand to full dataset**: 3 scenes × 6 pairs × 3 distances × 3 replicates
4. **Export data**: CSV format for analysis
5. **Generate plots**: PSNR vs distance curves
6. **Draft paper**: Results section with Table 1 and Figure 1

---

## Quick Console Commands

```javascript
// Check current camera distance
viewer.camera.position.length()

// Check camera position (x, y, z)
viewer.camera.position

// List all canvases (should be 2)
document.querySelectorAll('canvas[data-engine="three.js r182"]').length

// Force a quality comparison (if button not working)
imageQuality.compareQuality(viewerA, viewerB)

// Check if viewers are defined
console.log('ViewerA:', typeof viewerA, 'ViewerB:', typeof viewerB)
```

---

## Known Behaviors (NOT Bugs)

### SSIM = 1.0000 at far distances
- ✅ **CORRECT**: Actually 0.9999+, rounded to 4 decimals
- Compression artifacts imperceptible at distance
- This is the view-dependent quality discovery!

### PSNR increases when zooming out
- ✅ **CORRECT**: Artifacts become sub-pixel at distance
- Example: Close 32 dB → Far 58 dB
- Valid phenomenon for lossy compression

### avgDiff near zero at far distances
- ✅ **CORRECT**: Per-pixel differences become tiny
- Close: 3-5 average difference
- Far: 0.07 average difference
- Shows compression quality is view-dependent

---

## Contact

If issues persist after following this guide:
1. Check Console for error messages
2. Verify dev server is running (`lsof -ti:5173`)
3. Try clearing browser cache and reloading
4. Check that all asset files exist in `assets/` directory

**Remember**: The goal is to see PSNR = 32-36 dB and SSIM = 0.90-0.94 at close distance, proving the quality metrics can discriminate between formats!
