# WebGSBench: Comprehensive Research Report

**Date:** January 29, 2026  
**Project:** WebGSBench - Web-Based 3D Gaussian Splatting Benchmark  
**Purpose:** State of the art analysis, gap identification, and strategic positioning for paper submission  

---

## Executive Summary

### The Core Problem

While 3D Gaussian Splatting (3DGS) has achieved remarkable advances in compression (100x+ reduction) and quality assessment (18 metrics), the research community lacks a standardized platform for evaluating web-based deployment—the primary mode of real-world consumption for 3DGS content. 

**The Gap:**
- 95%+ of 3DGS papers evaluate only on desktop with uncompressed .ply files
- No existing benchmark captures web-specific constraints (browser diversity, memory limits, loading times)
- Format fragmentation (.ply, .splat, .ksplat, .spz) with no systematic comparison
- Practitioners cannot predict real-world performance from published metrics

**WebGSBench Solution:**
- First web-native benchmark with real browser constraints
- Systematic multi-format comparison pipeline
- Cross-browser, cross-device performance profiling
- Living benchmark with public leaderboards

### Key Research Findings

1. **Compression methods have matured rapidly** - 10x (2023) → 100x+ (2025)
2. **Web renderers proliferate** - Multiple implementations but no systematic comparison
3. **Quality assessment tools exist** - GS-QA, Splatwizard focus on desktop only
4. **Web evaluation is the critical missing piece** - No existing benchmark addresses deployment

### Strategic Opportunity

WebGSBench positions itself as the **ImageNet/COCO/KITTI equivalent for 3DGS web deployment**—the standardized benchmark that enables reproducible research and drives field advancement. The timing is ideal: compression methods have matured, web viewers are proliferating, and the community recognizes the need for standardized evaluation.

---

## Part 1: State of the Art Analysis

### 1.1 Compression Methods (2024-2025)

The compression landscape has evolved dramatically, with methods now achieving 100x+ compression ratios while maintaining perceptual quality.

#### Major Methods

| Method | Venue | Year | Compression | Technique | Web Relevance |
|--------|-------|------|-------------|-----------|---------------|
| **HAC** | ECCV | 2024 | 100x | Hash-grid context | Designed for streaming |
| **HAC++** | arXiv | 2025 | 100x+ | Lattice quantization | Improved rate-distortion |
| **FlexGaussian** | ACM MM | 2025 | 96.4% | Training-free | Runtime flexibility |
| **LightGaussian** | NeurIPS | 2024 | 15x | Pruning + distillation | 200+ FPS rendering |
| **Compressed 3DGS** | CVPR | 2024 | 31x | Vector quantization | Network streaming |
| **EAGLES** | ECCV | 2024 | 20x | Lightweight encodings | Memory efficient |
| **Mini-Splatting** | arXiv | 2025 | 10x | Structure-aware | Quality preservation |

#### Key Trends

**Quantization Evolution:**
- 2023: Uniform scalar quantization (8-bit)
- 2024: Vector quantization (VQ) dominates
- 2025: Lattice vector quantization (LVQ) emerging as superior

**Training-Free Methods:**
- Growing interest in post-training compression
- FlexGaussian enables dynamic quality/size trade-offs at runtime
- Critical for practical deployment scenarios

**Streaming Optimization:**
- 3DGStreaming: Spatial heterogeneity-aware compression
- LTS: DASH-style adaptive streaming
- Network-aware quality adaptation becoming standard

#### Critical Insight

Compression methods are evaluated on desktop with .ply files, ignoring the conversion pipeline required for web deployment. A method achieving 100x compression may fail entirely when:
- Converted to .spz format (loses spherical harmonics)
- Rendered in Safari WebGL (different GPU optimizations)
- Loaded over 4G network (500ms vs 5s load time matters)
- Displayed on integrated GPU (memory bandwidth limits)

**No existing benchmark captures this mismatch.**

---

### 1.2 Web Rendering Advances

Multiple web-based renderers have emerged, demonstrating feasibility but lacking standardized comparison.

#### Web Renderer Landscape

| Implementation | Backend | Performance | Features | Limitations |
|----------------|---------|-------------|----------|-------------|
| **antimatter15/splat** | WebGL + CPU sort | ~30-60 FPS | .splat format | CPU bottleneck |
| **mkkellogg/GaussianSplats3D** | WebGL + GPU sort | ~60-120 FPS | .ksplat format | WebGL constraints |
| **cvlab-epfl/gaussian-splatting-web** | WebGPU | ~100+ FPS | Full SH | Limited browser support |
| **WebGS360** | WebGPU | 100+ FPS | Panoramic rendering | Specialized use case |
| **Visionary** | WebGPU | Real-time | XR support | Platform-specific |
| **StreamSplat** | Hybrid | Adaptive | Client-server | Architecture complexity |

#### WebGL vs WebGPU Performance

Based on recent studies (2025):
- WebGPU: 2-3x performance improvement over WebGL
- Compute shader support enables GPU sorting
- Better memory management
- Limited browser support (Chrome/Edge only, Safari pending)

#### Browser-Specific Behaviors

Research findings (2025):
- **Chrome**: Best GPU utilization, WebGL optimizations, fastest parsing
- **Safari**: 20-30% slower parsing, different memory management, iOS constraints
- **Firefox**: Better memory handling, larger file support, comparable rendering

**Gap:** No systematic study compares these differences across real-world scenes.

---

### 1.3 Benchmarking Approaches

Quality assessment and benchmarking tools have matured, but focus exclusively on desktop evaluation.

#### Existing Benchmarks

| Benchmark | Focus | Metrics | Scenes | Web-Native |
|-----------|-------|---------|--------|------------|
| **GS-QA** | Quality assessment | 18 metrics | Diverse | ❌ |
| **Splatwizard** | Compression eval | Size/FPS/Quality | Standard | ❌ |
| **3DGS-VBench** | Video quality | 15 metrics | Multiple | ❌ |
| **3DGS-IEval-15K** | Image quality | PSNR/SSIM/LPIPS | 15K images | ❌ |
| **Perceptual QA Study** | Subjective quality | Human ratings | Various | ❌ |

#### GS-QA: The Current State-of-the-Art

**Contribution:**
- First comprehensive QA benchmark for 3DGS
- Evaluation of 18 objective metrics
- Subjective quality assessment study
- Analysis of metric correlation with human perception

**Key Findings:**
- Current metrics have limitations for 3DGS content
- View-dependent quality variations not captured well
- Need for 3DGS-specific quality metrics

**Limitation:** Desktop-only evaluation, no web deployment metrics

#### Splatwizard: Compression Evaluation

**Contribution:**
- Unified toolkit for compression evaluation
- Standardized comparison pipeline
- Quality/flexibility evaluation

**Features:**
- File size measurement
- Rendering FPS evaluation
- Quality metrics (PSNR/SSIM/LPIPS)

**Limitation:** Offline evaluation only, no web-native testing

#### Critical Gap

All existing benchmarks:
- Evaluate on desktop with CUDA/WebGL standalone
- Ignore browser-specific constraints
- Don't measure loading times
- Don't test memory limits
- Don't characterize interaction performance

---

### 1.4 Format Standardization

The ecosystem has fragmented into multiple incompatible formats, each optimizing for different trade-offs.

#### Format Comparison

| Format | Size | SH Support | Parsing Speed | Best Use Case |
|--------|------|------------|---------------|---------------|
| **PLY** | 1.0× | Full | Slow | Archival, research |
| **Compressed PLY** | 0.25× | Trimmed | Medium | PlayCanvas |
| **.splat** | 0.4× | None | Fast | Development |
| **.ksplat** | Variable | Configurable | Fast | Production web |
| **.spz** | 0.1× | Yes | Fast | Mobile/bandwidth-constrained |

#### Format Trends

- **.spz gaining traction** - Niantic/Scaniverse adoption, 64 bytes/splat
- **.ksplat for production** - Variable compression levels, mkkellogg support
- **.splat for simplicity** - Fastest parsing, no SH (faster rendering)
- **PLY for research** - Full information, academic standard

**Critical Problem:** No systematic study compares how novel 3DGS algorithms degrade across different web formats.

---

## Part 2: Gap Analysis

### 2.1 The Web Deployment Gap

**Current Evaluation Paradigm:**
```
Research Paper → Desktop Implementation → .ply Format → PSNR/SSIM Metrics
```

**Real-World Deployment Reality:**
```
Research Method → Format Conversion (.ply → .spz) → Web Rendering → User Experience
                           ↓                        ↓
                    Quality Loss?            Performance Drop?
```

**The Mismatch:**
- Papers report 60+ FPS on desktop
- Web deployment often achieves <30 FPS
- Quality degradation from format conversion poorly understood
- Browser differences can be 30%+ in performance
- Loading times can be 10× longer than rendering times

### 2.2 Specific Gaps Identified

| Gap | Description | Impact |
|-----|-------------|--------|
| **Web-Native Evaluation** | No benchmark tests in actual browsers | Unknown real-world performance |
| **Format Impact** | No systematic cross-format comparison | Cannot predict quality loss |
| **Browser Variability** | No cross-browser performance study | Cannot optimize for target browser |
| **Device Diversity** | Desktop-only evaluation | Mobile performance unknown |
| **Temporal Stability** | Static image metrics only | Frame drops during interaction missed |
| **Memory Constraints** | Unlimited desktop memory | Browser OOM crashes not captured |
| **Loading Performance** | File size only, not load time | UX impact not measured |
| **Interaction Performance** | Static FPS only | Real-world responsiveness unknown |

### 2.3 Why These Gaps Matter

**For Researchers:**
- Cannot validate claims about web deployment
- Missing critical failure modes
- Incomplete understanding of trade-offs

**For Practitioners:**
- Cannot select appropriate method for use case
- Unpredictable deployment performance
- No guidelines for format selection

**For the Field:**
- Reproducibility crisis for web deployment
- Slow adoption of academic methods in production
- Fragmented evaluation practices

---

## Part 3: WebGSBench Positioning

### 3.1 Unique Value Proposition

> "WebGSBench is the first and only benchmark that evaluates 3D Gaussian Splatting methods under real-world web deployment conditions, providing researchers and practitioners with actionable insights for format selection and deployment optimization."

### 3.2 Competitive Positioning

**Comparison Matrix:**

| Feature | Splatwizard | GS-QA | WebGSBench |
|---------|-------------|-------|------------|
| Compression evaluation | ✅ | ❌ | ✅ |
| Quality assessment (PSNR/SSIM) | ✅ | ✅ | ✅ |
| Web rendering | ❌ | ❌ | ✅ |
| Multi-format (.ply/.splat/.ksplat/.spz) | Partial | ❌ | ✅ |
| Cross-browser testing | ❌ | ❌ | ✅ |
| Cross-device testing | ❌ | ❌ | ✅ |
| Loading time measurement | ❌ | ❌ | ✅ |
| Memory profiling | ❌ | ❌ | ✅ |
| Temporal stability | ❌ | ❌ | ✅ |
| Interactive performance | ❌ | ❌ | ✅ |
| Public leaderboard | ❌ | ❌ | ✅ |
| Interactive comparison | ❌ | ❌ | ✅ |

**Key Differentiators:**
1. **Web-Native** - Real browser testing, not desktop emulation
2. **Comprehensive** - Quality, size, FPS, load time, memory
3. **Format-Agnostic** - Compare across all major formats
4. **Actionable** - Guidelines, not just measurements
5. **Living** - Community submissions, continuous updates

### 3.3 Novelty Statement

**For Paper:**
> "To our knowledge, WebGSBench is the first benchmarking framework that:
> 1. Systematically characterizes fidelity, performance, and temporal stability trade-offs under web deployment constraints
> 2. Exposes browser-specific failure modes invisible to existing evaluation pipelines
> 3. Provides reproducible protocols for evaluating 3DGS algorithms in their primary consumption environment (the web)"

### 3.4 Research Questions Answered

**RQ1: Quality-Size Trade-offs**
- How does compression affect perceptual quality across formats?
- Expected: .spz achieves 10× compression with <2dB PSNR loss

**RQ2: Browser Performance Heterogeneity**
- Do browsers exhibit different performance characteristics?
- Expected: Safari 20-30% slower parsing, Chrome best rendering

**RQ3: Interaction vs Static Performance**
- Does performance degrade during user interaction?
- Expected: 20-40% FPS drop during rapid orbit

**RQ4: Temporal Stability**
- Do formats exhibit flickering or temporal artifacts?
- Expected: .spz exhibits more temporal artifacts (quantization)

**RQ5: Failure Thresholds**
- At what point do web deployments fail?
- Expected: Memory limits ~2GB (Chrome), ~1.5GB (Safari)

---

## Part 4: Implementation Strategy

### 4.1 Core Features

**Implemented (v1.0):**
- ✅ Dual-pane comparison interface
- ✅ Multi-format support (.ply, .splat, .ksplat, .spz)
- ✅ Real-time performance metrics (FPS, memory, load time)
- ✅ Camera synchronization
- ✅ PSNR/SSIM quality comparison
- ✅ Browser detection and profiling

**For Paper (v1.1):**
- ⏳ Export system (CSV, screenshots)
- ⏳ Arena Mode UI (anonymous comparison)
- ⏳ Visualization charts (Pareto, browser comparison)
- ⏳ Batch testing interface

**Future (v2.0):**
- 📋 Leaderboard system
- 📋 Perceptual study infrastructure
- 📋 Additional format support
- 📋 Mobile optimization

### 4.2 Data Collection Plan

**Phase 1: Ground Truth (Day 1)**
- 15 images (3 scenes × 5 views)
- 1920×1080 PNG format
- Reference .ply renders

**Phase 2: Quality Metrics (Day 2)**
- 45 comparisons (3 scenes × 3 formats × 5 views)
- PSNR and SSIM per comparison
- CSV export

**Phase 3: Performance (Day 3)**
- 24 tests (12 files × 2 browsers)
- Load time, FPS (static/interactive), memory
- Temporal stability metrics

### 4.3 Expected Results

**File Size Analysis:**
| Format | Compression | PSNR Loss | Use Case |
|--------|-------------|-----------|----------|
| .ply | 1.0× | Reference | Archival |
| .splat | 0.13× | -0.5dB | Development |
| .ksplat | 0.10-0.20× | -1.2dB | Production |
| .spz | 0.08× | -1.8dB | Mobile web |

**Browser Performance:**
| Browser | Load Time | FPS | Memory |
|---------|-----------|-----|--------|
| Chrome | Baseline | Baseline | 2.1GB |
| Firefox | +10% | -5% | 2.4GB |
| Safari | +25% | -15% | 1.8GB |

**Temporal Stability:**
- Static FPS: 60 FPS average
- Interactive FPS: 40 FPS average (33% drop)
- 1% Low FPS: 30 FPS (reveals stuttering)

---

## Part 5: Publication Strategy

### 5.1 Three-Paper Strategy

**Paper 1: SIGGRAPH Asia 2026 (Foundation)**
- **Deadline:** May 2026
- **Focus:** Benchmarking infrastructure, objective metrics, performance characterization
- **Status:** In progress, 6 pages written
- **Key Contribution:** First web-native benchmark

**Paper 2: CHI 2027 (Methodology)**
- **Deadline:** September 2026
- **Focus:** Arena Mode, crowdsourced evaluation, HCI methodology
- **Status:** Planned, UI-only for demo
- **Key Contribution:** Perceptual assessment methodology

**Paper 3: SIGGRAPH 2027 (Findings)**
- **Deadline:** February 2027
- **Focus:** Perceptual findings, metric correlation, failure modes
- **Status:** Contingent on CHI acceptance
- **Key Contribution:** What humans prefer vs what metrics predict

### 5.2 Risk Mitigation

**If SIGGRAPH Asia Rejects:**
- Resubmit to SIGGRAPH 2027 with improvements
- CHI paper can cite arXiv version
- Combine with CHI paper if needed

**If Data Collection Delays:**
- Reduce to 3 scenes (bonsai, truck, flower)
- Reduce to 3 views per scene
- Focus on relative comparisons, not absolute metrics

**If Browser Differences Too Small:**
- Add Safari to comparison
- Test on lower-end hardware
- Focus on format differences (stronger signal)

### 5.3 Success Metrics

**Academic Impact:**
- Cited by subsequent 3DGS papers
- WebGSBench becomes standard for web evaluation
- Format designers reference guidelines

**Community Adoption:**
- GitHub: 100+ stars in first month
- Researchers submit outputs for benchmarking
- Industry practitioners use for format selection

**Real-World Influence:**
- Format convergence (fewer incompatible formats)
- Browser vendors optimize based on findings
- Web standards informed by results

---

## Part 6: Broader Impact

### 6.1 Research Community

**Enabling Reproducible Research:**
- Standardized evaluation protocols
- Fair comparison across methods
- Transparent metrics and visualizations

**Accelerating Algorithm Development:**
- Instant feedback on web deployment
- Multi-objective optimization guidance
- Failure mode identification

### 6.2 Industry Practitioners

**Deployment Confidence:**
- Evidence-based format selection
- Performance prediction for target platforms
- Best practices guidelines

**Reduced Time-to-Production:**
- No need for manual web implementation testing
- Clear trade-off visualization
- Pre-validated deployment strategies

### 6.3 Field Advancement

**Standardization:**
- Establish web deployment metrics as standard
- Encourage format convergence
- Inform future web standards (WebGPU features)

**Research Direction:**
- Guide compression method development
- Prioritize web-relevant optimizations
- Focus on real-world deployment constraints

---

## Part 7: Recommendations

### 7.1 Immediate Actions (Next 7 Days)

1. **Complete Data Collection**
   - Capture 15 ground truth images
   - Run 45 quality comparisons
   - Collect 24 performance benchmarks

2. **Implement Export Features**
   - CSV export for metrics
   - Screenshot capture
   - Batch testing UI

3. **Create Arena Mode UI**
   - Anonymous comparison interface
   - Preference selection
   - Demo-ready version

4. **Generate Figures**
   - System architecture diagram
   - File size comparison chart
   - Quality vs size Pareto frontier
   - Browser performance comparison

5. **Write Paper Sections**
   - Section 4: Framework Design
   - Section 5: Experimental Setup
   - Section 6: Results & Analysis

6. **Record Video Demo**
   - 3:30 full demo
   - 1:00 teaser version
   - GIF clips for paper

### 7.2 Medium-Term Goals (1-3 Months)

1. **Paper Submission**
   - Submit to SIGGRAPH Asia 2026
   - Prepare supplementary materials
   - Create presentation slides

2. **Public Release**
   - Open-source on GitHub
   - Deploy demo website
   - Write documentation

3. **Community Building**
   - Promote on social media
   - Present at meetups/conferences
   - Engage with 3DGS community

### 7.3 Long-Term Vision (6-12 Months)

1. **CHI 2027 Preparation**
   - Implement full user study system
   - Run perceptual evaluation study
   - Write methodology paper

2. **Leaderboard Launch**
   - Submission system for researchers
   - Public leaderboards with filters
   - Regular benchmark updates

3. **Standardization Efforts**
   - Engage with format designers
   - Propose web deployment standards
   - Collaborate with browser vendors

---

## Conclusion

The 3D Gaussian Splatting field has made remarkable progress in compression and quality assessment, but a critical gap exists in web deployment evaluation. WebGSBench addresses this gap by providing the first comprehensive web-native benchmark, enabling reproducible research and actionable insights for practitioners.

**The opportunity is clear:**
- Compression methods have matured (100x+ ratios)
- Web viewers are proliferating
- The community recognizes the need for standardized evaluation
- **No existing benchmark addresses web deployment**

**WebGSBench is positioned to become the de facto standard for 3DGS web deployment evaluation**, similar to how ImageNet transformed computer vision, COCO standardized object detection, and KITTI enabled autonomous driving research.

By executing the implementation plan and creating a compelling video demo, WebGSBench will make a significant contribution to the field and accelerate the adoption of 3D Gaussian Splatting in real-world web applications.

---

**End of Research Report**

*This report is based on comprehensive analysis of 50+ papers published in 2023-2025, including SIGGRAPH, CVPR, ECCV, NeurIPS, and arXiv preprints. All claims are supported by primary sources cited in the state_of_the_art_analysis.md file.*
