# WebGSBench Data Collection Plan

## Overview
Systematic data collection for the SIGGRAPH paper using the implemented dual-pane viewer with camera-synced quality comparison.

**Timeline**: Day 1 afternoon (2-3 hours)
**Output**: CSV with PSNR/SSIM values for paper results section

---

## Test Setup

### Benchmark Scenes (3 for quick iteration, 6 for full)
**Quick Path (3 scenes)**:
1. **bonsai** (Mip-NeRF 360) - 56 MB → 3.6 MB compressed
   - Phenomenon: High-detail foliage, compression artifacts
2. **truck** (Tanks & Temples) - 400 MB → 33 MB compressed  
   - Phenomenon: Large scene, memory constraints
3. **flower** (Mip-NeRF 360) - Recommended if available
   - Phenomenon: Fine detail, color fidelity

**Full Path (6 scenes)** - Add these if time permits:
4. **playroom** (Mip-NeRF 360) - 453 MB → 44 MB compressed
5. **bicycle** (Mip-NeRF 360)
6. **garden** (Mip-NeRF 360)

### Test Matrix

For each scene, test:
- **Reference**: `.ply` (uncompressed, ground truth)
- **Formats**: `.splat`, `.ksplat`, `.spz`

Total comparisons per scene: 3 formats × 5 viewpoints = 15 measurements

**Full dataset**: 3 scenes × 15 = 45 measurements (Quick)
**Full dataset**: 6 scenes × 15 = 90 measurements (Complete)

---

## Viewpoints Per Scene (5 standard positions)

For consistency, capture at these canonical viewpoints:
1. **Front Center** - Default camera position
2. **Close-Up Detail** - Zoom into complex region
3. **Wide Angle** - Pull back to see entire scene
4. **Left Side** - Rotate 45° left
5. **Right Side** - Rotate 45° right

**Rationale**: These viewpoints capture:
- Overall reconstruction quality (front, wide)
- Detail preservation under compression (close-up)
- Consistency across angles (left, right)

---

## Data Collection Procedure

### Setup (One-time, 5 minutes)
1. Open viewer at http://localhost:5174
2. Create CSV file: `data/quality_results.csv`
3. CSV headers:
   ```csv
   scene,format,viewpoint,psnr,ssim,file_size_mb,compression_ratio
   ```

### Per Scene Workflow (20-30 min/scene)

#### Step 1: Load Reference (Splat A)
```
Load: assets/{scene}.ply into Splat A
Wait: Until fully loaded and rendered
```

#### Step 2: Test Each Format
For format in [splat, ksplat, spz]:

**a) Load Format (Splat B)**
```
Load: assets/{scene}.{format} into Splat B
Wait: Until fully loaded
Verify: Camera sync is working (both views move together)
```

**b) Navigate to Viewpoint 1 (Front Center)**
```
Action: Default position (no movement needed)
Click: "Compare Quality" button
Record: PSNR, SSIM values from Metrics Panel
```

**c) Navigate to Viewpoint 2 (Close-Up)**
```
Action: Scroll to zoom in on detailed region
Click: "Compare Quality"
Record: PSNR, SSIM
```

**d) Navigate to Viewpoint 3 (Wide Angle)**
```
Action: Scroll to zoom out
Click: "Compare Quality"
Record: PSNR, SSIM
```

**e) Navigate to Viewpoint 4 (Left Side)**
```
Action: Left-click + drag to rotate 45° left
Click: "Compare Quality"
Record: PSNR, SSIM
```

**f) Navigate to Viewpoint 5 (Right Side)**
```
Action: Continue rotating or reset and rotate right
Click: "Compare Quality"
Record: PSNR, SSIM
```

**g) Record Metadata**
```
File size: ls -lh assets/{scene}.{format}
Compression ratio: size_compressed / size_ply
```

#### Step 3: Next Format
```
Action: Load next format into Splat B
Repeat: Steps 2b-2g
```

---

## Data Recording Template

### Manual Recording (Copy-paste friendly)
```csv
scene,format,viewpoint,psnr,ssim,file_size_mb,compression_ratio
bonsai,splat,front_center,XX.XX,0.XXXX,7.1,0.127
bonsai,splat,close_up,XX.XX,0.XXXX,7.1,0.127
bonsai,splat,wide_angle,XX.XX,0.XXXX,7.1,0.127
bonsai,splat,left_side,XX.XX,0.XXXX,7.1,0.127
bonsai,splat,right_side,XX.XX,0.XXXX,7.1,0.127
```

### Automated Recording (If time permits)
Create a simple script to:
1. Parse Metrics Panel DOM
2. Extract PSNR/SSIM values
3. Append to CSV automatically

---

## Quality Control Checklist

Before recording each measurement:
- [ ] Both splats are fully loaded (no loading indicators)
- [ ] Camera sync is enabled (both views match)
- [ ] Viewpoint is stable (no ongoing animation)
- [ ] "Compare Quality" completed (metrics displayed)
- [ ] Values look reasonable (PSNR: 20-50, SSIM: 0.8-1.0)

---

## Expected Results

### File Sizes (Pre-computed)
- **bonsai**: 56 MB (ply) → 7.1 MB (splat), 5.4 MB (ksplat), 3.6 MB (spz)
- **truck**: 400 MB (ply) → 52 MB (splat), 78 MB (ksplat), 33 MB (spz)
- **playroom**: 453 MB (ply) → 58 MB (splat), 88 MB (ksplat), 44 MB (spz)

### Compression Ratios
- **splat**: ~12-15% of original
- **ksplat**: ~10-20% of original (varies)
- **spz**: ~6-10% of original (best compression)

### Quality Expectations (Rough estimates)
- **splat**: PSNR 35-45, SSIM 0.95-0.99 (minimal loss)
- **ksplat**: PSNR 30-40, SSIM 0.92-0.97 (moderate loss)
- **spz**: PSNR 28-38, SSIM 0.90-0.96 (higher compression, more loss)

*Note*: Actual values depend on scene complexity and viewpoint.

---

## Deliverables

### Primary Output
**File**: `data/quality_results.csv`
**Rows**: 45 (quick) or 90 (full)
**Columns**: scene, format, viewpoint, psnr, ssim, file_size_mb, compression_ratio

### Secondary Outputs (Optional)
1. **Screenshots**: Save reference images for each viewpoint (for paper figures)
2. **Performance Logs**: FPS data from Metrics Panel (if paper includes performance section)

---

## Time Estimates

### Per Scene Breakdown
- Load reference (ply): 2 min
- Test 3 formats × 5 viewpoints: 15 min
- Record metadata: 1 min
- **Total per scene**: ~20 min

### Full Timeline
- **3 scenes (quick)**: 1 hour + 30 min buffer = 1.5 hours
- **6 scenes (full)**: 2 hours + 30 min buffer = 2.5 hours

### Setup Time
- Initial setup: 5 min
- CSV creation: 2 min
- Verify viewer works: 3 min
- **Total setup**: 10 min

**Grand Total**:
- Quick path: ~2 hours
- Full path: ~3 hours

---

## Troubleshooting

### Issue: Camera sync not working
**Fix**: Click "Clear All" and reload both splats

### Issue: Quality metrics show NaN or 0
**Fix**: 
- Ensure both splats are at same viewpoint
- Wait for rendering to complete
- Try clicking "Compare Quality" again

### Issue: Very low PSNR (<20)
**Possible causes**:
- Camera desync (views not matching)
- Different scene scales
- Format incompatibility

**Fix**: Reload and verify camera positions match

### Issue: File loading fails
**Fix**:
- Check file exists: `ls -lh assets/{scene}.{format}`
- Check file size (should not be 0 bytes)
- Check browser console for errors

---

## Next Steps After Data Collection

1. **Data Analysis** (30 min)
   - Import CSV into Python/Pandas
   - Compute per-format averages
   - Identify outliers

2. **Paper Integration** (1 hour)
   - Create results table (LaTeX)
   - Generate quality plots (matplotlib)
   - Write analysis section

3. **Figures** (1-2 hours)
   - System architecture diagram
   - Quality comparison charts
   - Example scene renderings

---

## Notes

- **Camera sync is critical** - Without it, quality metrics are meaningless
- **Viewpoint naming** - Keep consistent for CSV analysis
- **Format order** - Always test in same order (splat, ksplat, spz)
- **Reference stability** - Keep .ply loaded in Splat A for entire scene
- **Browser consistency** - Use same browser for all tests (Chrome recommended)

---

**Status**: Ready to start
**Created**: 2026-01-16
**Last Updated**: 2026-01-16
