# WebGSBench File Size Analysis

**Generated**: 2026-01-16  
**Purpose**: Actual file sizes for benchmark scenes across all web formats

---

## File Size Comparison Table

| Scene | Description | .ply | .splat | .ksplat | .spz |
|-------|-------------|------|--------|---------|------|
| **bonsai** | Small, indoor, object | 56 MB | 7.1 MB | 5.4 MB | 3.6 MB |
| **playroom** | Large, indoor, complex | 453 MB | 58 MB | 88 MB | 44 MB |
| **truck** | Large, outdoor, vehicle | 400 MB | 52 MB | 78 MB | 33 MB |

---

## Compression Ratios (relative to .ply)

| Scene | .splat | .ksplat | .spz |
|-------|--------|---------|------|
| **bonsai** | 0.13× (87% smaller) | 0.10× (90% smaller) | 0.06× (94% smaller) |
| **playroom** | 0.13× (87% smaller) | 0.19× (81% smaller) | 0.10× (90% smaller) |
| **truck** | 0.13× (87% smaller) | 0.20× (80% smaller) | 0.08× (92% smaller) |
| **Average** | **0.13×** | **0.16×** | **0.08×** |

---

## Key Observations

### Format Characteristics

1. **.ply (baseline)**
   - Original 3DGS format from Kerbl et al. 2023
   - Stores full spherical harmonics (SH) coefficients
   - ASCII or binary encoding
   - Largest file size

2. **.splat (antimatter15)**
   - **Consistently 0.13× of .ply size** across all scenes
   - Simplified SH representation (fewer bands)
   - Optimized for web streaming
   - Most predictable compression

3. **.ksplat (Kevin Kwok)**
   - **Variable compression**: 0.10× - 0.20× of .ply
   - Better on small scenes (bonsai: 0.10×)
   - Less effective on large scenes (playroom: 0.19×, truck: 0.20×)
   - Uses spatial clustering and quantization

4. **.spz (Niantic)**
   - **Best compression**: 0.06× - 0.10× of .ply (average 0.08×)
   - Fixed 64 bytes per splat
   - Proprietary encoding with aggressive quantization
   - Smallest file size consistently

### Scene-Specific Patterns

**Bonsai (small scene)**:
- All formats achieve strong compression
- .ksplat performs best relative to .ply (0.10×)
- .spz achieves 94% size reduction

**Playroom (large indoor)**:
- .ksplat less effective (0.19× vs 0.13× for .splat)
- .spz still maintains 90% reduction
- Complex geometry reduces compression efficiency

**Truck (large outdoor)**:
- Similar pattern to playroom
- .ksplat compression ratio drops to 0.20×
- .spz remains most efficient at 0.08×

---

## Implications for Web Deployment

### Network Transfer
- **Mobile 4G** (~10 Mbps): 
  - bonsai.spz: 3 seconds
  - playroom.ply: 6 minutes ❌
  - playroom.spz: 35 seconds ✅

- **Wi-Fi** (~50 Mbps):
  - bonsai formats: <2 seconds (all)
  - playroom.ply: 72 seconds ❌
  - playroom.spz: 7 seconds ✅

### Browser Memory
- Decompressed in-memory representation is similar across formats
- However, .spz may require GPU decompression pass
- .splat directly renderable with minimal processing

### Quality-Size Trade-off
- All formats claim "perceptually lossless" compression
- Quantitative evaluation needed: PSNR, SSIM, LPIPS
- **Next step**: Capture ground truth images for comparison

---

## LaTeX Table for Paper

```latex
\begin{table}[htbp]
\caption{File size comparison of 3DGS web formats across benchmark scenes.}
\label{tab:file-sizes}
\small
\begin{tabular}{@{}lcccc@{}}
\toprule
Scene & .ply & .splat & .ksplat & .spz \\
\midrule
bonsai & 56 MB & 7.1 MB & 5.4 MB & 3.6 MB \\
       & (1.0×) & (0.13×) & (0.10×) & (0.06×) \\
playroom & 453 MB & 58 MB & 88 MB & 44 MB \\
         & (1.0×) & (0.13×) & (0.19×) & (0.10×) \\
truck & 400 MB & 52 MB & 78 MB & 33 MB \\
      & (1.0×) & (0.13×) & (0.20×) & (0.08×) \\
\midrule
\textbf{Avg. compression} & — & \textbf{0.13×} & \textbf{0.16×} & \textbf{0.08×} \\
\bottomrule
\end{tabular}
\end{table}
```

---

## Status

- ✅ All 12 files generated successfully
- ✅ File sizes documented
- ⏳ Next: Verify files load in viewer
- ⏳ Next: Capture ground truth images
- ⏳ Next: Measure quality metrics (PSNR, SSIM)

---

## References

- **PLY**: Kerbl et al., "3D Gaussian Splatting for Real-Time Radiance Field Rendering", SIGGRAPH 2023
- **SPLAT**: antimatter15/splat viewer, GitHub (2023)
- **KSPLAT**: Kevin Kwok compressed format
- **SPZ**: Niantic Scaniverse format (2024)
