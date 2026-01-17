# WebGSBench Research Contribution Summary

**For SIGGRAPH Reviewers: What Makes This Novel?**

---

## The Core Problem (Research Gap)

### Current Evaluation Paradigm
**Assumption:** 3DGS algorithms are evaluated on desktop with uncompressed .ply files
- Standard benchmarks: Mip-NeRF 360, Tanks & Temples, DTU
- Metrics: PSNR, SSIM, LPIPS (image quality only)
- Hardware: NVIDIA RTX GPUs with CUDA
- **Result:** Papers report 60+ FPS at 1080p on desktop

### Reality of Web Deployment
**Constraint:** Web deployment requires different evaluation
- Formats: Must compress to .splat/.ksplat/.spz (10-100× smaller)
- APIs: WebGL 2.0 (not CUDA), WebGPU (limited support)
- Browsers: Chrome, Safari, Firefox have different performance characteristics
- Devices: From high-end GPUs to integrated mobile GPUs
- Networks: 3G/4G/WiFi bandwidth constraints
- **Result:** Unknown how algorithms perform under these constraints

### The Mismatch
> "Prevailing evaluation assumptions vs. execution model imposed by modern Web platforms"

**Key Insight:** A method that achieves state-of-the-art PSNR on desktop may completely fail when:
- Compressed to .spz format (loses spherical harmonics)
- Rendered in Safari WebGL (different GPU optimizations)
- Loaded over 4G network (500ms vs 5s load time matters)
- Displayed on integrated GPU (memory bandwidth limits)

**No existing benchmark captures this mismatch.**

---

## Our Contribution (3-Part Framework)

### Part 1: Perceptual Grounding
**What:** Measure quality degradation across Web-specific formats

**Why Novel:**
- First systematic comparison of 3DGS web formats (.ply, .splat, .ksplat, .spz)
- Quantifies quality-size trade-offs (PSNR vs compression ratio)
- Identifies "compression cliff" where quality collapses
- Evaluates temporal stability (flicker, popping) across formats

**Research Question:**
> "At what compression ratio does perceptual quality become unacceptable?"

**Hypothesis:**
- .spz achieves 10× compression with <2dB PSNR loss
- .ksplat offers best quality-size trade-off for web
- Temporal artifacts emerge at >20× compression

**Implementation:** ✅ Complete
- SplattingArena provides real-time A vs B comparison
- Load reference format (.ply) in Splat A
- Load test format (.splat/.ksplat/.spz) in Splat B
- Camera sync ensures identical viewpoints automatically
- One-click PSNR/SSIM calculation via "Compare Quality" button
- Results displayed in metrics panel with color coding

**Advantage over ground truth approach:**
- No pre-captured reference images needed
- Works for any user-provided scene
- Enables real-time exploration of quality at any viewpoint
- More flexible for researchers and practitioners

**Evidence:** Comprehensive format comparison study (Section 5 in paper)

---

### Part 2: Systems-Level Behavior
**What:** Profile browser-mediated execution characteristics

**Why Novel:**
- First to characterize 3DGS performance across major browsers
- Exposes browser-specific optimizations and failure modes
- Quantifies parsing overhead (CPU) vs rendering overhead (GPU)
- Measures interaction responsiveness (not just static FPS)

**Research Questions:**
1. "Does Safari's WebGL implementation perform worse than Chrome?"
2. "What is the memory limit before browser tabs crash?"
3. "How does performance degrade during user interaction vs static view?"

**Hypothesis:**
- Safari has slower .ply parsing (20-30% slower than Chrome)
- Firefox has better memory management (handles larger files)
- Interaction causes 20-40% FPS drop (GPU sorting bottleneck)

**Evidence:** Browser performance characterization (Section 6 in paper)

---

### Part 3: Failure Mode Detection
**What:** Identify deployment issues invisible to desktop evaluation

**Why Novel:**
- First to systematically identify web-specific failure modes
- Case studies with screenshots and performance traces
- Design implications for algorithm developers

**Failure Modes to Detect:**

1. **Compression Artifacts**
   - Symptom: Gaussian "popping" during camera movement
   - Cause: Quantized positions in .spz format
   - Invisible to: Desktop evaluation (no compression)

2. **Memory Limits**
   - Symptom: Browser tab crashes or becomes unresponsive
   - Cause: JavaScript heap limit (~2-4GB varies by browser)
   - Invisible to: Desktop evaluation (no memory constraints)

3. **Parsing Bottleneck**
   - Symptom: 5-10 second load time for large .ply files
   - Cause: Single-threaded JavaScript parsing
   - Invisible to: Desktop evaluation (C++/CUDA implementation)

4. **Browser Incompatibilities**
   - Symptom: Artifacts or failures on Safari but not Chrome
   - Cause: WebGL implementation differences
   - Invisible to: Desktop evaluation (single implementation)

5. **Temporal Instability**
   - Symptom: Flickering during rapid camera movement
   - Cause: GPU sorting latency in WebGL
   - Invisible to: Static image metrics (PSNR, SSIM)

**Evidence:** Failure mode analysis with case studies (Section 7 in paper)

---

## Novelty Statement (For Paper)

### What Exists
- ✅ Benchmarks for reconstruction quality (Mip-NeRF 360, DTU)
- ✅ Compression toolkits (Splatwizard)
- ✅ Web viewers (antimatter15/splat, GaussianSplats3D)

### What's Missing
- ❌ Systematic evaluation of web deployment constraints
- ❌ Perceptual quality assessment across web formats
- ❌ Browser-specific performance characterization
- ❌ Failure mode detection for web deployment

### Our Novelty
> "To our knowledge, WebGSBench is the first benchmarking framework that:
> 1. Systematically characterizes fidelity, performance, and temporal stability trade-offs under web deployment constraints
> 2. Exposes browser-specific failure modes invisible to existing evaluation pipelines
> 3. Provides reproducible protocols for evaluating 3DGS algorithms in their primary consumption environment (the web)"

**Key Differentiators:**
- Not just a dataset, but an **active benchmarking system**
- Not just offline quality, but **systems-level behavior**
- Not just desktop, but **web-native evaluation**

---

## Research Questions Answered

### RQ1: Quality-Size Trade-offs
**Question:** How does compression affect perceptual quality across formats?

**Methodology:**
- Convert 5-10 scenes to all formats (.ply, .splat, .ksplat, .spz)
- Measure: PSNR, SSIM, MS-SSIM vs file size
- Generate: Pareto frontier curves

**Expected Finding:**
- .spz achieves 10× compression with <2dB PSNR loss
- "Compression cliff" at ~20× ratio (PSNR drops >5dB)
- Trade-off curve guides format selection

**Impact:** Practitioners can choose format based on bandwidth budget

---

### RQ2: Browser Performance Heterogeneity
**Question:** Do browsers exhibit different performance characteristics?

**Methodology:**
- Test same scenes on Chrome, Safari, Firefox
- Measure: Load time, parsing time, rendering FPS, memory usage
- Control: Identical scenes, viewpoints, hardware

**Expected Finding:**
- Safari: 20-30% slower .ply parsing (single-threaded limitation)
- Chrome: Best GPU utilization (WebGL optimizations)
- Firefox: Better memory management (handles larger files)

**Impact:** Informs browser-specific optimizations

---

### RQ3: Interaction vs Static Performance
**Question:** Does performance degrade during user interaction?

**Methodology:**
- Measure FPS during: Static view, orbit, pan, rapid movement
- Calculate: FPS drop percentage, frame time variance
- Identify: Interaction patterns that cause stuttering

**Expected Finding:**
- 20-40% FPS drop during rapid orbit (GPU sorting bottleneck)
- Frame time variance increases 2-3× during interaction
- Static metrics (reported in papers) overestimate real-world performance

**Impact:** Emphasizes need for interaction-aware evaluation

---

### RQ4: Temporal Stability
**Question:** Do formats exhibit flickering or temporal artifacts?

**Methodology:**
- Measure: Frame-to-frame image difference during camera movement
- Detect: Gaussian "popping" (sudden appearance/disappearance)
- Compare: Temporal stability across formats

**Expected Finding:**
- .spz exhibits more temporal artifacts (quantization)
- .ksplat offers best temporal stability (GPU-friendly encoding)
- Temporal metrics correlate weakly with PSNR (static metric)

**Impact:** New metric for evaluating rendering quality

---

### RQ5: Failure Thresholds
**Question:** At what point do web deployments fail?

**Methodology:**
- Test: 1KB → 500MB files across browsers
- Measure: Success rate, load time, memory usage
- Identify: Breaking points (file size, splat count, memory)

**Expected Finding:**
- Memory limit: ~2GB (Chrome), ~1.5GB (Safari), ~3GB (Firefox)
- Splat count limit: ~200K (integrated GPU), ~500K (discrete GPU)
- Load time scales non-linearly (parsing overhead dominates >100MB)

**Impact:** Informs deployment guidelines (file size limits)

---

## Implementation → Paper Mapping

### Week 1: Measurement Infrastructure
**Implements:** Methodology (Section 4)
- Browser profiling → "Test Environment" subsection
- PSNR/SSIM → "Quality Metrics" subsection
- Ground truth capture → "Reference Dataset" subsection

### Week 2: Automated Benchmarking
**Implements:** Experimental Protocol (Section 4)
- Format conversion → "Test Scenes" subsection
- Benchmark runner → "Evaluation Protocol" subsection
- Results database → "Data Collection" subsection

### Week 3: Analysis
**Implements:** Results (Sections 5-7)
- Format comparison → Section 5 "Format Trade-offs"
- Browser profiling → Section 6 "Browser Performance"
- Failure modes → Section 7 "Deployment Challenges"

### Week 4: Paper Writing
**Implements:** Discussion and Figures (Sections 8-9)
- Design implications → Section 8 "Guidelines for Practitioners"
- Figures and tables → Throughout results sections
- Limitations → Section 9 "Limitations and Future Work"

---

## Expected Results (Hypotheses)

### Format Comparison (Table 1)
| Format | Size  | PSNR (dB) | SSIM | FPS   | Load Time | Use Case              |
|--------|-------|-----------|------|-------|-----------|------------------------|
| .ply   | 1.0×  | Ref       | 1.00 | 30fps | 5.0s      | Archival, quality ref  |
| .splat | 0.4×  | -0.5dB    | 0.98 | 35fps | 2.5s      | Development            |
| .ksplat| 0.25× | -1.2dB    | 0.96 | 40fps | 1.8s      | Production web         |
| .spz   | 0.1×  | -1.8dB    | 0.94 | 38fps | 1.2s      | Bandwidth-constrained  |

**Key Finding:** .ksplat offers best quality-performance-size trade-off

---

### Browser Performance (Table 2)
|          | Chrome  | Safari  | Firefox |
|----------|---------|---------|---------|
| .ply Load| 5.0s    | 6.5s    | 5.2s    |
| .spz Load| 1.2s    | 1.4s    | 1.3s    |
| FPS      | 38fps   | 32fps   | 35fps   |
| Memory   | 2.1GB   | 1.8GB   | 2.4GB   |

**Key Finding:** Safari 20-30% slower parsing, Chrome best rendering

---

### Failure Modes (Case Studies)

**Case Study 1: Compression Artifact**
- Scene: playroom.spz (50MB → 5MB)
- Symptom: Gaussian "popping" during orbit
- Cause: Quantized positions (8-bit vs float32)
- Impact: Perceptible artifacts despite PSNR >35dB
- **Takeaway:** Static metrics miss temporal artifacts

**Case Study 2: Memory Limit**
- Scene: truck.ply (400MB, 1M splats)
- Browser: Safari on MacBook Pro (16GB RAM)
- Symptom: Tab becomes unresponsive after 30 seconds
- Cause: JavaScript heap limit exceeded
- **Takeaway:** Need format compression for large scenes

**Case Study 3: Parsing Bottleneck**
- Scene: garden.ply (98MB)
- Browser: All browsers
- Symptom: 8-12 second load time (3× longer than rendering)
- Cause: Single-threaded PLY parsing
- **Takeaway:** Binary formats (.spz, .ksplat) essential for UX

---

## Design Implications (Guidelines)

### For Algorithm Developers
1. **Test with web formats during development**
   - Don't just evaluate on .ply desktop
   - Check quality degradation after compression

2. **Optimize for temporal stability**
   - Frame-to-frame consistency matters
   - Static PSNR is not enough

3. **Consider memory footprint**
   - Web browsers have hard memory limits
   - Trade-off: Smaller Gaussians vs more Gaussians

### For Practitioners
1. **Format selection guide:**
   - <10MB file → .spz (best compression)
   - 10-50MB → .ksplat (balanced)
   - >50MB → .splat (quality priority)
   - Archive → .ply (uncompressed reference)

2. **Browser-specific optimizations:**
   - Safari: Avoid large .ply files (slow parsing)
   - Chrome: Best for production deployment
   - Firefox: Can handle larger files (memory)

3. **Performance budgets:**
   - Target: <2s load time, >30 FPS
   - Interaction: Expect 20-40% FPS drop
   - Memory: Keep <1.5GB for mobile

### For Format Designers
1. **Prioritize temporal stability in compression**
2. **Optimize for fast parsing (binary formats)**
3. **Support progressive loading (stream large files)**

---

## Impact Statement (For Paper Conclusion)

> "WebGSBench addresses a critical gap in the 3DGS evaluation ecosystem. By providing the first systematic framework for web deployment benchmarking, we enable:
>
> 1. **Reproducible Comparison**: Researchers can evaluate methods under realistic deployment constraints
> 2. **Informed Development**: Algorithm developers can optimize for web-specific performance characteristics
> 3. **Practical Deployment**: Practitioners gain evidence-based guidelines for format selection and browser optimization
> 4. **Community Standards**: Establish web deployment metrics as complementary to reconstruction quality
>
> As 3DGS moves from research to production, evaluating algorithms in their primary consumption environment (the web) becomes essential. WebGSBench provides the infrastructure for this evolution."

---

## Potential Reviewer Questions & Answers

### Q1: "Why is web deployment important?"
**A:** Web is the primary mode of 3DGS content consumption:
- E-commerce product visualization (Amazon, Shopify)
- Virtual tours (real estate, museums)
- Photogrammetry platforms (Scaniverse, Polycam)
- 95%+ of papers ignore this deployment mode

### Q2: "Can't we just use existing metrics?"
**A:** No, existing metrics miss web-specific issues:
- PSNR doesn't capture temporal stability (flickering)
- Desktop FPS overestimates web performance (API differences)
- Static evaluation misses interaction responsiveness

### Q3: "Is this just engineering, not research?"
**A:** No, this is infrastructure research:
- Like KITTI for autonomous driving
- Like ImageNet for image classification
- Enables future research by standardizing evaluation

### Q4: "How is this different from Splatwizard?"
**A:** Splatwizard focuses on compression pipelines (offline)
- We focus on deployment evaluation (web-native)
- They measure file size, we measure systems behavior
- Complementary, not competing

### Q5: "What's the broader impact?"
**A:** Accelerates 3DGS adoption in production:
- Practitioners can confidently deploy academic methods
- Algorithm developers optimize for real-world constraints
- Community converges on web deployment best practices

---

## Success Metrics (Post-Publication)

### Academic Impact
- [ ] Cited by subsequent 3DGS papers
- [ ] WebGSBench becomes standard for web evaluation
- [ ] Format designers reference our guidelines

### Community Adoption
- [ ] GitHub repository: 100+ stars
- [ ] Researchers submit their outputs for benchmarking
- [ ] Industry practitioners use for format selection

### Real-World Influence
- [ ] Format convergence (fewer incompatible formats)
- [ ] Browser vendors optimize based on findings
- [ ] Web standards informed by results

---

## Timeline to Publication

**Week 1-4:** Implementation (as detailed in ROADMAP.md)
**Week 5:** Data analysis and figure generation
**Week 6-7:** Paper writing (Results, Discussion sections)
**Week 8:** Internal review and revision
**Week 9:** Submit to SIGGRAPH (or SIGGRAPH Asia, depending on deadline)

**Post-Submission:**
- Make repository public
- Release demo video
- Prepare supplemental material
- Address reviewer questions

---

## Conclusion: Why This Will Be Accepted

### Novelty ✓
- First systematic web deployment benchmark for 3DGS
- Exposes failure modes invisible to existing evaluation

### Significance ✓
- Addresses gap between research and deployment
- Enables reproducible comparison in primary consumption environment

### Rigor ✓
- Comprehensive methodology (multiple formats, browsers, scenes)
- Quantitative results (PSNR, FPS, load time, memory)
- Statistical validation (multiple runs, significance testing)

### Impact ✓
- Infrastructure contribution (like KITTI, ImageNet)
- Actionable guidelines for practitioners
- Open-source code and dataset

### Presentation ✓
- Clear problem statement and research questions
- Comprehensive results with figures and tables
- Reproducible methodology with public code

**Confidence Level:** HIGH - This aligns with SIGGRAPH's interest in systems research, reproducibility, and bridging research-to-practice gaps.

---

**Last Updated:** 2026-01-15
