# Paper Update Summary - Scene Selection Added

**Date**: 2026-01-16  
**Action**: Added Methodology section with scene selection rationale to main.tex

---

## ✅ What Was Updated

### 1. Main Paper (main.tex)
**New Section Added**: Section 7 - Methodology (lines 322-362)

**Structure**:
- `\section{Methodology}`
  - `\subsection{Scene Selection Strategy}` - Phenomenon-driven rationale
  - `\subsection{Curated Scene Portfolio}` - Table with 6 scenes

**Content**:
- Explains phenomenon-driven (not dataset benchmarking) approach
- Table~\ref{tab:scene-selection} with all 6 scenes
- Cross-dataset justification
- Stress factor coverage

**Page Count**: 6 pages (was 5, now 6)

---

### 2. References (references.bib)
**New Citation Added**:
```bibtex
@article{hedman2018deepblending,
  author = {Hedman, Peter and Philip, Julien and Price, True and Frahm, Jan-Michael and Drettakis, George and Brostow, Gabriel},
  title = {Deep Blending for Free-Viewpoint Image-Based Rendering},
  journal = {ACM Transactions on Graphics (SIGGRAPH Asia)},
  volume = {37},
  number = {6},
  pages = {257:1--257:15},
  year = {2018},
  month = {November},
  doi = {10.1145/3272127.3275084},
  url = {https://doi.org/10.1145/3272127.3275084}
}
```

**Total Citations**: 27 (was 26)

---

### 3. Paper Structure (Updated)

**Before**:
1. Introduction
2. Background and Related Work
3. Motivation: The Web Deployment Gap
4. Research Impact and Community Value
5. Proposed Contributions
6. Related Systems and Differentiation
7. Potential Challenges and Solutions
8. Conclusion

**After**:
1. Introduction
2. Background and Related Work
3. Motivation: The Web Deployment Gap
4. Research Impact and Community Value
5. Proposed Contributions
6. Related Systems and Differentiation
7. **Methodology** ✅ (NEW)
   - 7.1 Scene Selection Strategy
   - 7.2 Curated Scene Portfolio (with table)
8. Potential Challenges and Solutions
9. Conclusion

---

## 📊 Table Added to Paper

Table 1 (tab:scene-selection): Curated scenes and evaluation rationale

| Scene | Dataset | Characteristics | Stress Factor | Relevance | Size |
|-------|---------|----------------|---------------|-----------|------|
| bonsai | Mip-NeRF 360 | Indoor object, fine foliage | High-freq. detail | Compression artifacts on texture | 56 MB |
| garden | Mip-NeRF 360 | Outdoor, vegetation, depth | Depth complexity | Sorting artifacts during motion | 98 MB |
| playroom | Deep Blending | Indoor room, multi-object | Memory footprint | GPU memory limits, tab stability | 453 MB |
| truck | Tanks & Temples | Outdoor vehicle, specular | Temporal stability | Frame drops during interaction | 400 MB |
| train | Tanks & Temples | Large outdoor, geometric | Load time | Parsing overhead, network constraints | 175 MB |
| flower | Real-world | Small, thin geometry | Compression sens. | Quality degradation in .spz | 6 MB |

---

## 🎯 Key Messaging (SIGGRAPH-Appropriate)

**Phenomenon-Driven Selection**:
- ❌ "We benchmark these datasets"
- ✅ "Each scene isolates a specific stress factor"

**Cross-Dataset Validation**:
- ❌ "We use Mip-NeRF 360 like everyone else"
- ✅ "We draw from 4 datasets to avoid dataset-specific biases"

**Measurement Probe Framing**:
- ❌ "We test on standard scenes"
- ✅ "Each scene functions as a measurement probe for failure modes"

This framing is **much stronger for SIGGRAPH** (systems + perceptual focus) vs CVPR (pure dataset benchmarking).

---

## 📝 Compilation Status

**Compiled Successfully**: ✅
- `pdflatex main.tex` → OK
- `bibtex main` → OK (21 warnings about missing fields, not errors)
- `pdflatex main.tex` (2x) → OK
- **Final Output**: main.pdf (6 pages, 396 KB)

**No Errors**: All citations resolved correctly, table renders properly

---

## 🔧 Files Modified

1. **`main.tex`** - Added Section 7 (Methodology) at line 322
2. **`references.bib`** - Added hedman2018deepblending citation
3. **`PLAN.md`** - Updated paper status (5 pages → 6 pages, 26 → 27 citations)

---

## 📄 Current Paper Statistics

- **Pages**: 6 (target: 8-10 for full submission)
- **Sections**: 9 complete, 3 still TODO (Framework Design, Experiments, Results)
- **Citations**: 27 (all with DOIs)
- **Tables**: 1 (scene selection)
- **Figures**: 0 (will add with results)

---

## ⏭️ What's Still Needed

### Sections to Write (Days 4-5)
- Section 7.3: Framework Design (system architecture, metrics pipeline)
- Section 7.4: Experimental Setup (benchmark protocol, hardware)
- Section 8: Results & Analysis (quality, performance, temporal stability)

### Data to Collect (Days 1-3)
- Ground truth images: 15-30 (depending on 3 or 6 scenes)
- Quality metrics: 45-90 PSNR/SSIM values
- Performance metrics: 24-48 benchmark runs

### Figures to Create (Day 6)
- Figure 1: System architecture
- Figure 2: File size comparison (data ready)
- Figure 3: Quality vs size scatter plot (need data)
- Figure 4: Performance comparison (need data)
- Figure 5: Visual quality examples (need screenshots)

---

## ✅ Verification Checklist

- [x] Section 7 added to main.tex
- [x] Table compiles without errors
- [x] Deep Blending citation added to references.bib
- [x] All citations resolve (hedman2018deepblending works)
- [x] PDF renders correctly (6 pages)
- [x] PLAN.md updated with new status
- [x] No compilation errors or warnings (except minor bib field warnings)

---

## 🎉 Summary

**Paper is now more complete and SIGGRAPH-appropriate**:
- Methodology section establishes scientific rigor
- Scene selection rationale shows thoughtful design
- Cross-dataset approach strengthens generalizability claims
- Phenomenon-driven framing fits systems paper positioning

**Ready for**: Abstract submission tomorrow, then data collection and results writing.

---

**Last Updated**: 2026-01-16 23:45
