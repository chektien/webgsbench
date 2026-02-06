# 3D Gaussian Splatting Format Conversion Tools

## CLI Tools Found

### 1. 3dgsconverter (Recommended - Most Complete)
**GitHub**: https://github.com/francescofugazzi/3dgsconverter
**Language**: Python
**Features**:
- ✅ N-to-N conversion between ALL formats
- ✅ Supports: .ply, .splat, .ksplat, .spz, .sog, Compressed PLY, Parquet, CloudCompare
- ✅ GPU-accelerated filtering (SOR, Density)
- ✅ Advanced filtering (bbox, sphere, alpha/opacity)
- ✅ Cross-platform (Windows, Linux, macOS)
- ✅ SH degree control (0-3)
- ✅ Compression level control (0-10)

**Installation**:
```bash
pip install 3dgsconverter
```

**Usage Examples**:
```bash
# PLY → SPLAT
3dgsconverter -i scene.ply -o scene.splat -f splat

# PLY → KSPLAT
3dgsconverter -i scene.ply -o scene.ksplat -f ksplat --compression_level 5

# PLY → SPZ
3dgsconverter -i scene.ply -o scene.spz -f spz

# PLY → Compressed PLY
3dgsconverter -i scene.ply -o scene.compressed.ply -f 3dgs --compression_level 7

# With filtering (remove transparent splats)
3dgsconverter -i scene.ply -o scene.splat -f splat --alpha 0.1

# Crop to bounding box
3dgsconverter -i scene.ply -o scene.splat -f splat --bbox -2 -2 -2 2 2 2
```

---

### 2. gsbox (Simple, Fast)
**GitHub**: https://github.com/gotoeasy/gsbox
**Language**: Go (single binary)
**Features**:
- ✅ Simple, fast conversions
- ✅ Supports: .ply, .splat, .spx, .spz, .sog, .ksplat (read-only)
- ✅ Cross-platform (single binary download)
- ✅ View file info

**Installation**:
```bash
# Download from releases page
# https://github.com/gotoeasy/gsbox/releases
# Choose: gsbox-macos (for macOS)
chmod +x gsbox-macos
```

**Usage Examples**:
```bash
# PLY → SPLAT
gsbox p2s input.ply output.splat

# PLY → SPZ
gsbox p2z input.ply output.spz

# SPLAT → PLY
gsbox s2p input.splat output.ply

# View file info
gsbox info input.ply
```

---

### 3. splat-transform (PlayCanvas - Production Ready)
**GitHub**: https://github.com/playcanvas/splat-transform
**Language**: JavaScript/Node.js
**Features**:
- ✅ Read: PLY, Compressed PLY, SOG, SPLAT, KSPLAT, SPZ, LCC
- ✅ Write: PLY, Compressed PLY, SOG, CSV, HTML Viewer
- ✅ Transform: translate, rotate, scale
- ✅ Filter: NaN, bounding box, sphere, value filters
- ✅ Merge multiple splats
- ✅ Statistical summaries
- ✅ GPU-accelerated SOG compression (WebGPU)

**Installation**:
```bash
npm install -g @playcanvas/splat-transform
```

**Usage Examples**:
```bash
# PLY → SPLAT
splat-transform input.ply output.splat

# PLY → SOG (compressed, GPU-accelerated)
splat-transform input.ply output.sog

# PLY → Compressed PLY
splat-transform input.ply output.compressed.ply

# With transformations
splat-transform input.ply -s 0.5 -t 0,0,10 -r 0,90,0 output.ply

# Filter and optimize
splat-transform input.ply --filter-nan --filter-harmonics 2 output.splat

# Merge multiple files
splat-transform input1.ply input2.ply merged.ply

# Generate statistics
splat-transform input.ply --summary output.ply
```

---

### 4. GaussForge (Library + CLI)
**GitHub**: https://github.com/3dgscloud/GaussForge
**Language**: C++ (library + CLI)
**Features**:
- ✅ Lossless conversion
- ✅ Supports: PLY, compressed.ply, SPLAT, KSPLAT, SPZ, SOG
- ✅ High-performance C++ implementation

**Installation**:
```bash
# Download binary from releases
# https://github.com/3dgscloud/GaussForge/releases
```

**Usage Examples**:
```bash
# Basic conversion (auto-detects formats)
./gfconvert input.ply output.spz

# Manually specify formats
./gfconvert input.dat output.dat --in-format ply --out-format spz
```

---

## Comparison Table

| Tool | PLY | SPLAT | KSPLAT | SPZ | SOG | Compressed PLY | Install | Speed | GPU |
|------|-----|-------|--------|-----|-----|----------------|---------|-------|-----|
| **3dgsconverter** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | pip | Fast | ✅ |
| **gsbox** | ✅ | ✅ | 👁️ | ✅ | ✅ | ❌ | Binary | Very Fast | ❌ |
| **splat-transform** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | npm | Fast | ✅ |
| **GaussForge** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Binary | Very Fast | ❌ |

👁️ = Read-only support

---

## Recommended Installation

For your paper deadline, I recommend installing **all three** to maximize compatibility:

### 1. Install 3dgsconverter (Primary Tool)
```bash
pip install 3dgsconverter
```

### 2. Install splat-transform (Backup + Advanced Features)
```bash
npm install -g @playcanvas/splat-transform
```

### 3. Download gsbox (Fast Binary Backup)
```bash
cd <REPO_ROOT>/tools
curl -L -o gsbox https://github.com/gotoeasy/gsbox/releases/latest/download/gsbox-macos
chmod +x gsbox
```

---

## Conversion Strategy for Your Paper

### Target: 3 scenes × 4 formats = 12 files

**Scenes**:
1. `bonsai.splat` (7 MB) - Already in SPLAT format
2. `playroom.ply` (453 MB)
3. `truck.ply` (400 MB)

**Target Formats**:
- `.ply` (original, uncompressed)
- `.splat` (antimatter15 format)
- `.ksplat` (compressed, level 5)
- `.spz` (Niantic format, 10x compression)

### Conversion Commands

**For Bonsai** (already .splat, need .ply, .ksplat, .spz):
```bash
# SPLAT → PLY
3dgsconverter -i bonsai.splat -o bonsai.ply -f 3dgs

# SPLAT → KSPLAT
3dgsconverter -i bonsai.splat -o bonsai.ksplat -f ksplat --compression_level 5

# SPLAT → SPZ
3dgsconverter -i bonsai.splat -o bonsai.spz -f spz
```

**For Playroom** (already .ply, need .splat, .ksplat, .spz):
```bash
# PLY → SPLAT
3dgsconverter -i playroom.ply -o playroom.splat -f splat

# PLY → KSPLAT
3dgsconverter -i playroom.ply -o playroom.ksplat -f ksplat --compression_level 5

# PLY → SPZ
3dgsconverter -i playroom.ply -o playroom.spz -f spz
```

**For Truck** (already .ply, need .splat, .ksplat, .spz):
```bash
# PLY → SPLAT
3dgsconverter -i truck.ply -o truck.splat -f splat

# PLY → KSPLAT
3dgsconverter -i truck.ply -o truck.ksplat -f ksplat --compression_level 5

# PLY → SPZ
3dgsconverter -i truck.ply -o truck.spz -f spz
```

---

## Batch Conversion Script

Create `scripts/convert_all.sh`:

```bash
#!/bin/bash
# Convert all benchmark scenes to all formats

ASSETS="<REPO_ROOT>/assets"
cd "$ASSETS"

echo "Converting bonsai..."
3dgsconverter -i bonsai.splat -o bonsai.ply -f 3dgs
3dgsconverter -i bonsai.splat -o bonsai.ksplat -f ksplat --compression_level 5
3dgsconverter -i bonsai.splat -o bonsai.spz -f spz

echo "Converting playroom..."
3dgsconverter -i playroom.ply -o playroom.splat -f splat
3dgsconverter -i playroom.ply -o playroom.ksplat -f ksplat --compression_level 5
3dgsconverter -i playroom.ply -o playroom.spz -f spz

echo "Converting truck..."
3dgsconverter -i truck.ply -o truck.splat -f splat
3dgsconverter -i truck.ply -o truck.ksplat -f ksplat --compression_level 5
3dgsconverter -i truck.ply -o truck.spz -f spz

echo "Done! Listing all files:"
ls -lh bonsai.* playroom.* truck.*
```

---

## Expected File Sizes (Estimates)

Based on typical compression ratios:

| Scene | .ply | .splat | .ksplat (L5) | .spz |
|-------|------|--------|--------------|------|
| Bonsai | ~20 MB | 7 MB ✅ | ~3-4 MB | ~2 MB |
| Playroom | 453 MB ✅ | ~180 MB | ~90 MB | ~45 MB |
| Truck | 400 MB ✅ | ~160 MB | ~80 MB | ~40 MB |

**Total storage needed**: ~1.5 GB

---

## Next Steps

1. **Install tools** (5 min)
2. **Test conversion on 1 scene** (5 min)
3. **Run batch conversion** (30-60 min depending on file sizes)
4. **Verify conversions load in viewer** (10 min)
5. **Document file sizes for paper** (5 min)

**Total time**: ~1-2 hours

---

## Troubleshooting

### If 3dgsconverter fails:
```bash
# Try splat-transform instead
splat-transform input.ply output.splat
```

### If conversion is too slow:
```bash
# Use gsbox for quick conversions
./gsbox p2s input.ply output.splat
```

### If file format is not recognized:
```bash
# Check file info first
3dgsconverter -i input.ply --info
```

---

**Last Updated**: 2026-01-16
**Status**: Ready to install and test
