# WebGSBench Dataset Inventory

## Current Assets Summary

You have **24 3DGS scenes** already downloaded in `<REPO_ROOT>/assets/`

### By Format

| Format | Count | Total Size |
|--------|-------|------------|
| `.ply` | 7 files | ~1.4 GB |
| `.splat` | 17 files | ~255 MB |

### By Size Category

**Large Scenes (>100MB)**:
- `playroom.ply` - 453 MB
- `truck.ply` - 400 MB
- `train-big.ply` - 254 MB
- `train.ply` - 175 MB

**Medium Scenes (10-100MB)**:
- `garden-splatfacto.ply` - 98 MB
- `5playroom.splat` - 50 MB
- `truck-splatfacto.ply` - 33 MB
- `family-splatfacto.ply` - 33 MB
- `actus-new-year.splat` - 18 MB
- `2firePit.splat` - 17 MB
- `buggies.splat` - 13 MB
- `6kotofuri.splat` - 11 MB
- `0plants.splat` - 11 MB
- `eon-mall-spring.splat` - 11 MB

**Small Scenes (<10MB)**:
- `car-toyota-white.splat` - 9.0 MB
- `cotton-mirror.splat` - 8.3 MB
- `3sqwakers.splat` - 7.8 MB
- `bonsai.splat` - 7.1 MB
- `6bonsai.splat` - 7.1 MB
- `flower.splat` - 6.4 MB
- `blu-groom.splat` - 6.0 MB
- `baby_yoda.splat` - 5.1 MB
- `1skull.splat` - 5.0 MB
- `bridal-dress.splat` - 3.9 MB

---

## Recommended Scenes for Benchmarking

Based on standard 3DGS benchmarks (Mip-NeRF 360, Tanks & Temples, Deep Blending):

### For Paper Experiments (3 scenes minimum)

**Scene 1: Bonsai** (Small, Indoor, Object-centric)
- File: `bonsai.splat` (7.1 MB)
- Scene type: Indoor object
- From: Mip-NeRF 360 dataset
- Why: Standard benchmark scene, widely recognized

**Scene 2: Playroom** (Large, Indoor, Complex)
- File: `playroom.ply` (453 MB)
- Scene type: Indoor room
- Why: Tests memory constraints, large-scale performance

**Scene 3: Truck** (Large, Outdoor, Vehicle)
- File: `truck.ply` (400 MB)
- Scene type: Outdoor vehicle
- From: Tanks & Temples dataset
- Why: Standard benchmark, tests outdoor lighting

### Alternative/Additional Scenes

**Train** (Large, Outdoor)
- File: `train.ply` (175 MB)
- Scene type: Outdoor train
- From: Tanks & Temples dataset

**Garden** (Medium, Outdoor)
- File: `garden-splatfacto.ply` (98 MB)
- Scene type: Outdoor garden
- From: Mip-NeRF 360 dataset

---

## What You're Missing

### Formats to Generate

For comprehensive format comparison, you need to convert these to:
- `.ksplat` (compressed, variable levels)
- `.spz` (Niantic format, ~0.1× size)
- Compressed PLY (quantized)

### Conversion Tools Available

1. **SuperSplat** (PlayCanvas)
   - Converts to `.ksplat` format
   - URL: https://playcanvas.com/supersplat/editor

2. **antimatter15/splat**
   - Converts PLY ↔ SPLAT
   - URL: https://github.com/antimatter15/splat

3. **SPZ Tools** (Niantic)
   - Converts to `.spz` format
   - URL: https://scaniverse.com/ (may require Scaniverse app)

### Ground Truth Images

You need reference images for PSNR/SSIM calculation:
- 5 viewpoints per scene (front, side, top, angle-1, angle-2)
- 1920×1080 resolution
- Stored in `assets/ground-truth/{scene}/`

---

## Canonical Mip-NeRF 360 Dataset

The official Mip-NeRF 360 dataset contains **9 scenes**:

### Indoor (4 scenes)
1. **bonsai** ✓ (you have this)
2. **counter**
3. **kitchen**
4. **room**

### Outdoor (5 scenes)
5. **bicycle**
6. **flowers**
7. **garden** ✓ (you have this)
8. **stump**
9. **treehill**

### Download Link

Full dataset: https://jonbarron.info/mipnerf360/
- Size: ~10 GB (raw images + camera parameters)
- Note: These are input images, not pre-trained 3DGS models

### Pre-trained 3DGS Models

Official 3DGS repo provides pre-trained models:
- URL: https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/datasets/pretrained/models.zip
- Size: 14 GB
- Contains: Trained .ply files for all benchmark scenes

---

## Strategy for Your Paper (7-day deadline)

### Option A: Use What You Have (Fastest)
✅ **Recommended for deadline pressure**

1. Use existing scenes:
   - `bonsai.splat` (7 MB)
   - `playroom.ply` (453 MB)
   - `truck.ply` (400 MB)

2. Convert to missing formats:
   - Use online tools (SuperSplat, etc.)
   - Takes 1-2 hours per scene

3. Capture ground truth:
   - Load in viewer, screenshot 5 views
   - Takes ~30 min per scene

**Total time: 1 day**

### Option B: Download Canonical Dataset (Complete)
⏱️ **Better for thoroughness**

1. Download pre-trained Mip-NeRF 360 models (14 GB)
2. Use all 9 scenes from the standard benchmark
3. Convert to all formats
4. Capture ground truth for all

**Total time: 3-4 days**

---

## Recommendation

**For your abstract deadline tomorrow**: Use what you have (Option A)

**For the full paper in 7 days**: Start with Option A, add more scenes if time permits

Your current dataset is sufficient for a strong paper. The scenes you have (bonsai, playroom, truck) are from recognized benchmarks and span different categories (small/large, indoor/outdoor).

---

## Next Steps

1. **Today**: Finalize abstract (done ✓)
2. **Tomorrow**: Convert 3 scenes to all formats
3. **Day 3**: Capture ground truth images
4. **Day 4-5**: Run benchmarks
5. **Day 6-7**: Write results section

---

**Last Updated**: 2026-01-16
**Total Assets**: 24 files, ~1.65 GB
