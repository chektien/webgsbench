# WebGSBench Scene Selection Strategy

## Dataset Selection and Scene Rationale

Our objective is not to benchmark datasets or establish method rankings, but to examine how Web-based execution conditions influence the perceptual and systems-level behavior of 3D Gaussian Splatting during interactive use. We therefore adopt a **curated, phenomenon-driven scene selection strategy**, drawing scenes from multiple widely used datasets rather than relying on a single benchmark.

Each selected scene is chosen to **isolate a specific rendering or perceptual stress factor** relevant to browser-mediated execution, including memory pressure, depth complexity, temporal stability, and sensitivity to high-frequency detail. By curating scenes across diverse sources, we avoid overfitting our analysis to the characteristics of any single dataset and instead focus on behaviors that consistently emerge under Web deployment constraints.

We emphasize that our selection does not aim for exhaustive dataset coverage or statistical representativeness. Instead, **each scene functions as a measurement probe** designed to reveal failure modes and trade-offs that are obscured by conventional offline evaluation pipelines. This design enables focused, interpretable analysis of how scene properties interact with Web-specific execution constraints.

---

## Curated Scene Portfolio

### Selection Criteria

For each scene, we identify:
1. **Primary Stress Factor**: What rendering challenge does this scene expose?
2. **Scene Characteristics**: Geometry complexity, texture detail, scale, environment type
3. **Relevance to Web-3DGS**: Why this matters for browser deployment
4. **File Size Range**: Memory footprint across formats (.ply → .spz)

---

### Selected Scenes (6 scenes across 4 datasets)

| Scene ID | Source Dataset | Scene Characteristics | Primary Stress Factor | Relevance to Web-3DGS | File Size (.ply) |
|----------|----------------|----------------------|----------------------|------------------------|------------------|
| **bonsai** | Mip-NeRF 360 | Small indoor object with fine-grained foliage | **High-frequency detail** | Tests compression artifacts on complex texture; small file ideal for mobile | 56 MB |
| **garden** | Mip-NeRF 360 | Medium outdoor scene with vegetation and depth | **Depth complexity** | Exposes sorting artifacts during camera motion; mid-range memory footprint | 98 MB |
| **playroom** | Deep Blending | Large indoor room with multiple objects | **Memory footprint** | Stresses GPU memory limits; tests browser tab stability under load | 453 MB |
| **truck** | Tanks & Temples | Large outdoor vehicle with specular surfaces | **Temporal stability** | Reveals frame drops during interaction; high splat count challenges real-time sorting | 400 MB |
| **train** | Tanks & Temples | Large-scale outdoor scene with geometric detail | **Load time** | Tests parsing and upload overhead; extreme case for network-constrained deployment | 175 MB |
| **flower** | Real-world capture | Small object with thin geometry (petals) | **Compression sensitivity** | Exposes quality degradation in aggressive formats (.spz); thin structures prone to artifacts | 6.4 MB |

---

## Rationale for Cross-Dataset Selection

### Why Not a Single Benchmark?

**Problem with Single-Dataset Evaluation**:
- Mip-NeRF 360: Biased toward indoor, well-lit scenes
- Tanks & Temples: Primarily outdoor, texture-rich
- Using one dataset → findings may be dataset-specific, not generalizable

**Our Approach**:
- Select scenes that **span multiple failure modes**
- Prioritize **orthogonal stress factors** (memory vs detail vs stability)
- Ensure results reflect **Web deployment realities**, not dataset quirks

### Stress Factor Coverage Matrix

| Stress Factor | Scene(s) | Why This Matters for Web |
|---------------|----------|-------------------------|
| **High-frequency detail** | bonsai, flower | Compression algorithms struggle with fine texture → visible artifacts |
| **Depth complexity** | garden, train | Large depth range → more splats per pixel → GPU overdraw |
| **Memory footprint** | playroom, truck | Browsers have strict memory limits → tab crashes, OOM errors |
| **Temporal stability** | truck, train | Camera motion → splat reordering → frame drops, stuttering |
| **Load time** | train, playroom | Large files → slow parsing/upload → poor user experience on 4G |
| **Compression sensitivity** | flower, bonsai | Thin geometry → quantization errors → perceptual artifacts |

---

## Scene Characteristics Summary

### By Size Category

**Small (<100 MB PLY)**:
- **bonsai** (56 MB): Detail probe
- **flower** (6.4 MB): Compression probe
- → Fast to load, ideal for testing quality degradation

**Medium (100-200 MB PLY)**:
- **train** (175 MB): Load time probe
- → Tests parsing overhead and progressive loading

**Large (>200 MB PLY)**:
- **garden** (98 MB): Depth probe (counted as medium-large)
- **playroom** (453 MB): Memory probe
- **truck** (400 MB): Stability probe
- → Stresses browser memory limits and rendering performance

### By Environment Type

**Indoor** (3 scenes):
- bonsai, playroom
- Controlled lighting, bounded geometry
- Tests: Memory, detail preservation

**Outdoor** (3 scenes):
- garden, truck, train
- Unbounded scenes, complex lighting
- Tests: Depth handling, temporal stability

**Objects** (1 scene):
- flower
- Isolated subject, minimal background
- Tests: Compression sensitivity on thin geometry

---

## Expected Behavior Across Formats

### Per-Scene Format Performance Predictions

| Scene | .ply (baseline) | .splat (0.13×) | .ksplat (0.10-0.20×) | .spz (0.08×) |
|-------|----------------|----------------|----------------------|--------------|
| **bonsai** | High quality, slow load | Good balance | Best compression | Visible artifacts in foliage |
| **garden** | Baseline | Negligible loss | Moderate compression | Depth artifacts during motion |
| **playroom** | May crash browser | Stable | Good for large scenes | Best for memory-constrained |
| **truck** | Stuttering on interaction | Smooth | Variable performance | Best temporal stability |
| **train** | 10-15s load time | 2-3s load time | 1-2s load time | <1s load time |
| **flower** | Pristine petals | Minor petal blur | Petal collapse risk | Severe petal artifacts |

---

## Justification for 6-Scene Selection

### Why Not 3 Scenes?

**3 scenes** (minimum viable):
- Sufficient for proof-of-concept
- ❌ Risk of missing critical failure modes
- ❌ Weak claims about generalizability

**6 scenes** (recommended):
- ✅ Covers all major stress factors (2 scenes per category)
- ✅ Cross-dataset validation (4 datasets)
- ✅ Enables subsection analysis (small vs large, indoor vs outdoor)
- ✅ Still feasible within 7-day timeline

### Why Not 9+ Scenes?

**9+ scenes** (comprehensive):
- ⏱️ Too time-consuming for 7-day deadline
- 📊 Diminishing returns on insights
- 📄 Paper becomes data dump, loses focus

**Our choice**: 6 scenes balances **rigor** and **feasibility**

---

## Alternative: 3-Scene Minimal Configuration

If time is extremely constrained, these 3 scenes provide maximum coverage:

| Scene | Rationale |
|-------|-----------|
| **bonsai** | Small, indoor, detail-rich → compression probe |
| **truck** | Large, outdoor, complex → memory + stability probe |
| **flower** | Tiny, thin geometry → extreme compression test |

This minimal set still spans:
- 3 size categories (tiny, small, large)
- 2 environments (indoor, outdoor)
- 3 stress factors (detail, memory, compression)

---

## Data Collection Implications

### Per-Scene Workload (6 scenes)

**Ground Truth Capture**:
- 6 scenes × 5 views = **30 images** (vs 15 for 3 scenes)
- Time: ~15 min per scene = **1.5 hours total**

**Quality Benchmarks**:
- 6 scenes × 3 formats × 5 views = **90 PSNR/SSIM values** (vs 45)
- Time: ~3-4 hours (semi-automated)

**Performance Benchmarks**:
- 6 scenes × 4 formats × 2 browsers = **48 tests** (vs 24)
- Time: ~3-4 hours (mostly automated)

**Total Additional Time**: +2-3 hours vs 3-scene configuration

**Decision Point**: 
- ✅ Use 6 scenes if Days 1-2 go smoothly
- ⚠️ Fall back to 3 scenes (bonsai, truck, flower) if behind schedule

---

## LaTeX Table for Paper

```latex
\begin{table*}[t]
\caption{Curated scenes and evaluation rationale. Each scene isolates a specific stress factor relevant to browser-mediated 3DGS execution.}
\label{tab:scene-selection}
\small
\begin{tabular}{@{}llllp{4.5cm}c@{}}
\toprule
\textbf{Scene} & \textbf{Dataset} & \textbf{Characteristics} & \textbf{Stress Factor} & \textbf{Relevance to Web-3DGS} & \textbf{Size} \\
\midrule
bonsai & Mip-NeRF 360 & Indoor object, fine foliage & High-freq. detail & Compression artifacts on complex texture & 56 MB \\
garden & Mip-NeRF 360 & Outdoor, vegetation & Depth complexity & Sorting artifacts during camera motion & 98 MB \\
playroom & Deep Blending & Indoor room, multi-object & Memory footprint & GPU memory limits, browser stability & 453 MB \\
truck & Tanks \& Temples & Outdoor vehicle, specular & Temporal stability & Frame drops during interaction & 400 MB \\
train & Tanks \& Temples & Large outdoor, geometric & Load time & Parsing overhead, network constraints & 175 MB \\
flower & Real-world & Small, thin geometry & Compression sens. & Quality degradation in .spz format & 6 MB \\
\bottomrule
\end{tabular}
\end{table*}
```

**Note**: This is a full-width table (`table*`) to accommodate the detailed columns.

---

## Recommendations for PLAN.md Update

### Update Timeline with 6-Scene Option

**Day 1 Ground Truth**:
- Original: 3 scenes × 5 views = 15 images (45 min)
- Updated: 6 scenes × 5 views = 30 images (1.5 hours)

**Day 2 Quality Benchmarks**:
- Original: 45 PSNR/SSIM comparisons (2-3 hours)
- Updated: 90 comparisons (3-4 hours)

**Day 3 Performance Benchmarks**:
- Original: 24 tests (2-3 hours)
- Updated: 48 tests (3-4 hours)

### Decision Tree

```
Start of Day 1
├─ Abstract submitted ✓
├─ Check time remaining
│  ├─ If >4 hours available → Use 6 scenes
│  └─ If <4 hours available → Use 3 scenes (bonsai, truck, flower)
└─ Proceed with scene conversion
```

---

## Files to Convert

### 3-Scene Configuration (Minimal)
- ✅ `bonsai.ply` → .splat, .ksplat, .spz (already done)
- ✅ `truck.ply` → .splat, .ksplat, .spz (already done)
- ❌ `flower.splat` → .ply, .ksplat, .spz (need conversion)

### 6-Scene Configuration (Recommended)
- ✅ bonsai (all 4 formats done)
- ✅ playroom (all 4 formats done)
- ✅ truck (all 4 formats done)
- ❌ garden: Need to convert `garden-splatfacto.ply` → .splat, .ksplat, .spz
- ❌ train: Need to convert `train.ply` → .splat, .ksplat, .spz
- ❌ flower: Need to convert `flower.splat` → .ply, .ksplat, .spz

**Conversion Time**: ~1-1.5 hours for 3 additional scenes

---

## Summary

**Phenomenon-Driven Selection**:
- Not dataset benchmarking → Stress factor isolation
- Not ranking methods → Understanding Web constraints
- Not statistical coverage → Interpretable failure mode analysis

**Scene Portfolio**:
- 6 scenes (or 3 minimal) across 4 datasets
- Each scene = measurement probe for specific failure mode
- Spans size, complexity, environment types

**Justification**:
- Cross-dataset validation prevents overfitting
- Orthogonal stress factors enable focused analysis
- Sufficient for strong SIGGRAPH contribution
- Feasible within 7-day timeline

**Next Steps**:
1. Decide: 3 or 6 scenes based on Day 1 progress
2. Convert missing scenes (garden, train, flower if needed)
3. Update PLAN.md with chosen configuration
4. Proceed with ground truth capture

---

**Last Updated**: 2026-01-16
