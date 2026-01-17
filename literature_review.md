# Web-Based Gaussian Splatting Benchmark: Literature Review and Motivation

## Abstract

While 3D Gaussian Splatting (3DGS) has revolutionized real-time neural rendering, the research community lacks a standardized platform for evaluating web-based deployment—the primary mode of real-world consumption for 3DGS content. We propose **WebGSBench**, a comprehensive benchmarking system that enables reproducible comparison of Gaussian splatting algorithms across multiple web formats, rendering backends, and quality-performance trade-offs. Unlike existing benchmarks focused on offline reconstruction quality, our system addresses the critical gap between academic development and practical deployment, providing researchers with automated tools to evaluate their methods under realistic web constraints.

---

## 1. Introduction

The rapid adoption of 3D Gaussian Splatting [Kerbl et al., 2023] has fundamentally changed the landscape of real-time novel view synthesis. Unlike previous neural rendering approaches that require expensive volumetric ray marching, 3DGS achieves real-time rendering through efficient point-based splatting, making it particularly suitable for web-based applications. However, the research community currently lacks a unified framework for evaluating how novel 3DGS algorithms perform when deployed to the web—where file size constraints, browser limitations, and hardware diversity create fundamentally different challenges than offline rendering.

This gap between academic development and practical deployment has led to several critical issues:
1. **Inconsistent Evaluation**: Papers report quality metrics (PSNR, SSIM, LPIPS) on desktop implementations but ignore web-specific constraints
2. **Format Fragmentation**: At least 5+ incompatible formats (.ply, .splat, .ksplat, .spz, compressed variants) exist with no systematic comparison
3. **Non-Reproducible Comparisons**: Researchers lack standardized test scenes and evaluation protocols for web deployment
4. **Missing Performance Metrics**: Loading time, memory footprint, and browser-specific rendering performance are rarely reported

We argue that addressing these gaps requires not just a dataset, but a **living benchmarking system**—analogous to how Papers with Code transformed machine learning reproducibility, or how the KITTI benchmark standardized autonomous driving evaluation.

---

## 2. Background and Related Work

### 2.1 Evolution of Neural Rendering and 3D Gaussian Splatting

**Neural Radiance Fields (NeRF)** [Mildenhall et al., 2020] introduced the paradigm of learning continuous scene representations via volumetric rendering and neural networks. While achieving photorealistic novel view synthesis, NeRF's requirement for hundreds of samples per ray made real-time rendering infeasible, limiting practical deployment.

**3D Gaussian Splatting** [Kerbl et al., 2023] addressed this limitation by representing scenes as collections of 3D Gaussians with learnable parameters (position, covariance, opacity, spherical harmonic coefficients). By leveraging differentiable point-based rasterization, 3DGS achieves:
- Real-time rendering at >100 FPS on consumer GPUs
- Explicit scene representation enabling faster training
- Compatibility with standard graphics pipelines

The real-time capability of 3DGS has triggered explosive research growth, with over 200+ papers in 2024-2025 extending the method to dynamic scenes [Luiten et al., 2023], sparse views [Xiong et al., 2024], compression [Li et al., 2024], and relighting [Jiang et al., 2024].

### 2.2 Existing Benchmarking Efforts

**Traditional NeRF/3DGS Benchmarks** focus primarily on reconstruction quality:
- **Mip-NeRF 360** [Barron et al., 2022]: 9 scenes with outdoor/indoor captures, evaluated on PSNR/SSIM/LPIPS
- **Tanks and Temples** [Knapitsch et al., 2017]: Multi-view stereo benchmark adapted for NeRF evaluation
- **DTU** [Jensen et al., 2014]: Controlled captures with ground truth geometry

These benchmarks established quality evaluation standards but do not address web deployment concerns.

**Recent Compression & Efficiency Benchmarks**:
- **Splatwizard** [2024]: Unified toolkit for evaluating 3DGS compression methods, measuring file size, rendering FPS, and quality metrics. However, it focuses on offline compression pipelines rather than web-native evaluation.
- **GS-QA** [2025]: Comprehensive quality assessment analyzing 18 objective metrics across diverse scenes. Lacks performance/deployment evaluation.
- **SIGGRAPH Asia 2025 3DGS Challenge**: Focuses on reconstruction speed (<60s) and PSNR, not web deployment.

**Web Viewer Implementations** (not benchmarks):
- antimatter15/splat: WebGL viewer with CPU sorting
- mkkellogg/GaussianSplats3D: Three.js with GPU-accelerated sorting
- cvlab-epfl/gaussian-splatting-web: WebGPU implementation

These viewers demonstrate feasibility but lack standardized evaluation protocols or comparative analysis across formats and rendering backends.

### 2.3 Format Landscape and Fragmentation

The 3DGS ecosystem has fragmented into multiple incompatible formats, each optimizing for different trade-offs:

| Format | Size (relative) | Features | Adoption |
|--------|-----------------|----------|----------|
| PLY (original) | 1.0x | Full SH, uncompressed | Academic standard |
| Compressed PLY | 0.25x | Quantized, trimmed SH | PlayCanvas |
| .splat | 0.4x | No SH, simplified | antimatter15 viewer |
| .ksplat | Variable | Compression levels, fast loading | mkkellogg/GaussianSplats3D |
| .spz (Niantic) | 0.1x | 64 bytes/splat, SH preserved | Scaniverse |

**Critical Problem**: Research papers typically report results on .ply files evaluated offline, but web deployment requires format conversion with poorly understood quality-performance trade-offs. No systematic study compares how novel 3DGS algorithms degrade across different web formats.

### 2.4 The Dataset Contribution Model

Highly-cited benchmark papers in computer vision typically provide:
1. **Standardized Data**: Curated, diverse, and challenging (ImageNet, COCO, KITTI)
2. **Evaluation Protocols**: Metrics, splits, and comparison methodology
3. **Leaderboards/Infrastructure**: Tools for reproducible comparison
4. **Community Adoption**: Becomes the de facto standard

Examples:
- **ImageNet** [Deng et al., 2009]: 14M images enabling reproducible image classification comparison → 100k+ citations
- **COCO** [Lin et al., 2014]: Object detection/segmentation benchmark with standardized metrics → 50k+ citations
- **ScanNet** [Dai et al., 2017]: Indoor RGB-D dataset with reconstruction benchmarks → 5k+ citations

Our proposed system extends this model beyond passive datasets to **active benchmarking infrastructure**—researchers can submit their 3DGS outputs and immediately receive standardized web deployment metrics.

---

## 3. Motivation: The Web Deployment Gap

### 3.1 Why Web-Based Evaluation Matters

**Real-World Consumption Pattern**: The primary mode of 3DGS content consumption is web-based:
- E-commerce 3D product visualization (Amazon, Shopify)
- Virtual tours and digital twins (real estate, museums)
- AR/VR experiences via WebXR
- Photogrammetry sharing platforms (Scaniverse, Polycam)

**Web Constraints Differ Fundamentally from Desktop**:
1. **File Size**: Network bandwidth limitations favor 10-100x compression
2. **Memory**: Mobile browsers have strict memory limits (often <4GB)
3. **API Variability**: WebGL 2.0 vs WebGPU performance varies drastically
4. **Browser Diversity**: Chrome, Safari, Firefox have different optimization characteristics
5. **Hardware Range**: From high-end desktop GPUs to integrated mobile GPUs

**Current Research Gap**: 95%+ of 3DGS papers evaluate only on desktop with .ply files, ignoring the conversion/compression pipeline required for web deployment. This creates a "reproducibility crisis" for practitioners attempting to deploy academic methods.

### 3.2 Fragmentation Hinders Progress

**Format Incompatibility**: Converting a novel sparse-view 3DGS method to .spz format may destroy the quality gains reported in the paper. Researchers currently have no way to know without manual implementation and testing.

**Non-Standard Evaluation**: Different papers use different:
- Test scenes (Mip-NeRF 360 vs custom captures)
- Quality metrics (some report LPIPS, others don't)
- Performance metrics (FPS on NVIDIA A100 vs RTX 3090)
- Rendering implementations (CUDA vs WebGL vs WebGPU)

This makes it **impossible to fairly compare** methods across papers.

### 3.3 What's Missing: A Unified Benchmarking System

Drawing inspiration from successful benchmarking systems in adjacent fields:

**MLPerf** (ML performance benchmarking):
- Standardized model implementations
- Hardware-agnostic measurement protocols
- Automated submission and validation
- Public leaderboards

**Hugging Face Spaces** (ML model deployment):
- Unified interface for model comparison
- Interactive visualization
- Reproducible environment

**Our Proposed System** combines these ideas for 3DGS:
1. **Standardized Test Scenes**: Curated dataset spanning diverse scene types, complexity levels, and capture conditions
2. **Multi-Format Pipeline**: Automated conversion to all major web formats with quality/size reporting
3. **Web-Native Evaluation**: Performance profiling across WebGL/WebGPU, multiple browsers, and devices
4. **Interactive Comparison**: Side-by-side visualization of quality-performance trade-offs
5. **Automated Metrics**: PSNR, SSIM, LPIPS, file size, load time, FPS, memory footprint
6. **Researcher-Friendly Submission**: Upload .ply → receive comprehensive benchmark report

---

## 4. Research Impact and Community Value

### 4.1 Enabling Reproducible Research

By providing a standardized platform, we enable:
- **Fair Comparison**: All methods evaluated on identical test scenes, formats, and rendering conditions
- **Reproducibility**: Researchers can verify claims by submitting their outputs
- **Transparency**: Public metrics and visualizations reveal true deployment trade-offs

This addresses the reproducibility crisis identified in recent ML/CV meta-research [Pineau et al., 2021].

### 4.2 Accelerating Algorithm Development

**Feedback Loop**: Currently, researchers spend weeks implementing web deployment to test their methods. Our system provides instant feedback, accelerating iteration cycles.

**Multi-Objective Optimization**: Researchers can simultaneously optimize for:
- Visual quality (PSNR/SSIM/LPIPS)
- File size (.ply → .spz conversion efficiency)
- Rendering performance (FPS across devices)
- Loading time (critical for UX)

**Identifying Failure Modes**: Automated testing across formats may reveal degradation patterns invisible in desktop evaluation.

### 4.3 Bridging Academia and Industry

Industry practitioners currently struggle to:
1. **Select Methods**: Which 3DGS variant works best for their use case?
2. **Predict Performance**: Will this method meet our 60 FPS target on mobile?
3. **Deployment Guidance**: Which format should we use for our constraints?

Our benchmark provides evidence-based answers, increasing the real-world impact of academic research.

### 4.4 Driving Standardization

Similar to how COCO metrics became the de facto standard for object detection, our benchmark can:
- Establish standard web deployment metrics
- Encourage format convergence or interoperability
- Inform development of future web standards (WebGPU features, compression APIs)

---

## 5. Proposed Contributions

Our system makes the following novel contributions:

### 5.1 Infrastructure Contributions
1. **Curated Test Dataset**: Diverse, challenging scenes with ground truth for reproducible evaluation
2. **Automated Benchmarking Pipeline**: End-to-end conversion, rendering, and metric computation
3. **Web-Based Comparison Interface**: Interactive visualization of quality-performance trade-offs
4. **Open-Source Toolkit**: Extensible codebase for community-driven improvement

### 5.2 Scientific Contributions
1. **Comprehensive Format Study**: First systematic comparison of 3DGS web formats across quality/performance axes
2. **Deployment Performance Characterization**: Profiling across browsers, devices, and rendering backends
3. **Compression Trade-off Analysis**: Quantifying quality degradation vs file size for different 3DGS variants
4. **Best Practices**: Evidence-based guidelines for web deployment of 3DGS content

### 5.3 Community Impact
1. **Reproducible Comparisons**: Researchers can verify and compare methods objectively
2. **Lower Barrier to Entry**: Newcomers can quickly understand format/deployment landscape
3. **Industry Adoption**: Practitioners gain confidence in deploying academic methods
4. **Future-Proofing**: Extensible system can incorporate new formats and metrics as the field evolves

---

## 6. Related Systems and Differentiation

### 6.1 Machine Learning Benchmarks

**Papers with Code** provides leaderboards for ML tasks but:
- Relies on author-reported metrics (not automated)
- Doesn't provide deployment/inference benchmarking
- Our system: Automated evaluation with web-specific metrics

**Hugging Face Spaces** enables model deployment but:
- Focuses on NLP/vision models, not 3D rendering
- No standardized performance benchmarking
- Our system: Standardized 3DGS-specific evaluation

### 6.2 3D Vision Benchmarks

**ScanNet/Matterport3D** provide datasets but:
- Focus on RGB-D reconstruction, not novel view synthesis
- No rendering performance evaluation
- Our system: Neural rendering quality + web deployment performance

**KITTI/Waymo** for autonomous driving:
- Excellent model but domain-specific
- Our system: Adapts multi-metric, leaderboard-driven approach to 3DGS

### 6.3 Graphics Performance Benchmarks

**GFXBench/3DMark** measure GPU performance but:
- Use fixed synthetic workloads
- Not relevant to neural rendering
- Our system: Real 3DGS content with scientifically meaningful metrics

---

## 7. Potential Challenges and Solutions

### 7.1 Dataset Curation
**Challenge**: Selecting representative test scenes that span the diversity of 3DGS applications.

**Solution**: Multi-tier dataset:
- **Tier 1**: Standard scenes (Mip-NeRF 360) for compatibility with existing papers
- **Tier 2**: Challenging cases (reflective surfaces, sparse views, dynamic content)
- **Tier 3**: Domain-specific (product scanning, faces, large-scale outdoor)

### 7.2 Maintaining Relevance
**Challenge**: Fast-moving field with new formats and methods appearing constantly.

**Solution**:
- Modular architecture allowing easy integration of new formats
- Community contribution model (like Hugging Face)
- Regular benchmark updates (quarterly)

### 7.3 Ground Truth Acquisition
**Challenge**: Some metrics require ground truth images not always available.

**Solution**:
- Multi-view captures with held-out views for PSNR/SSIM/LPIPS
- Reference-free metrics (FID, KID) for cases without GT
- User studies for perceptual quality validation

### 7.4 Browser/Device Variability
**Challenge**: Infinite combinations of browsers, OS, and hardware.

**Solution**:
- Focus on representative configurations (Chrome/Safari/Firefox on desktop/mobile)
- Provide raw performance data for community analysis
- Crowdsource additional device testing via open API

---

## 8. Conclusion

The 3D Gaussian Splatting research community has achieved remarkable progress in reconstruction quality and training speed, but lacks the infrastructure to evaluate real-world web deployment—the primary consumption mode for 3DGS content. Existing benchmarks focus on offline quality metrics while ignoring format fragmentation, browser constraints, and performance variability that practitioners face.

We propose **WebGSBench**, a comprehensive benchmarking system that:
1. Provides standardized test scenes and evaluation protocols
2. Automates conversion across web formats with quality/performance profiling
3. Enables reproducible comparison of research methods under realistic deployment conditions
4. Bridges the gap between academic development and practical deployment

By following the successful model of ImageNet, COCO, and MLPerf, our system can become the de facto standard for 3DGS web deployment evaluation, accelerating research progress and increasing real-world impact. This contribution is timely—as the field matures, standardized evaluation infrastructure becomes critical for continued advancement.

---

## References

**Core 3DGS Papers:**
- Kerbl et al. (2023). "3D Gaussian Splatting for Real-Time Radiance Field Rendering." SIGGRAPH.
- Mildenhall et al. (2020). "NeRF: Representing Scenes as Neural Radiance Fields for View Synthesis." ECCV.

**Recent Benchmarking Work:**
- Splatwizard (2024). "A Benchmark Toolkit for 3D Gaussian Splatting Compression." arXiv:2512.24742.
- GS-QA (2025). "Comprehensive Quality Assessment Benchmark for Gaussian Splatting View Synthesis." arXiv:2502.13196.

**Dataset Benchmark Papers:**
- Deng et al. (2009). "ImageNet: A Large-Scale Hierarchical Image Database." CVPR.
- Lin et al. (2014). "Microsoft COCO: Common Objects in Context." ECCV.
- Dai et al. (2017). "ScanNet: Richly-annotated 3D Reconstructions of Indoor Scenes." CVPR.

**Compression Formats:**
- PlayCanvas Blog (2024). "Compressing Gaussian Splats."
- Niantic/Scaniverse (2024). "SPZ: Open-Source Gaussian Splat File Format."

**Web Viewers:**
- antimatter15/splat: https://github.com/antimatter15/splat
- mkkellogg/GaussianSplats3D: https://github.com/mkkellogg/GaussianSplats3D
- cvlab-epfl/gaussian-splatting-web: https://github.com/cvlab-epfl/gaussian-splatting-web

**Evaluation Metrics:**
- Radiance Fields. "What are the NeRF Metrics?" https://radiancefields.com/what-are-the-nerf-metrics
- Zhang et al. (2018). "The Unreasonable Effectiveness of Deep Features as a Perceptual Metric." CVPR. [LPIPS]

**Reproducibility:**
- Pineau et al. (2021). "Improving Reproducibility in Machine Learning Research." JMLR.

---

## Notes for Requirements Specification

Based on this literature review, the requirements spec should include:

**Core Features:**
1. Test scene dataset with diversity across scene types, complexity, and capture conditions
2. Automated format conversion pipeline (.ply → .splat, .ksplat, .spz, compressed PLY)
3. Multi-backend rendering evaluation (WebGL, WebGPU)
4. Automated metric computation (PSNR, SSIM, LPIPS, file size, FPS, load time, memory)
5. Interactive web interface for side-by-side comparison
6. Submission system for researchers to benchmark their outputs
7. Public leaderboards with filtering/sorting capabilities

**Technical Requirements:**
- Browser compatibility (Chrome, Firefox, Safari)
- Device testing infrastructure (desktop, mobile)
- Reproducible evaluation environment
- Open-source implementation
- Extensible architecture for new formats/metrics

**Evaluation Protocol:**
- Standard train/test splits
- Multiple rendering resolutions
- Consistent hardware baselines
- Statistical significance testing

**Deliverables:**
- Web platform with interactive benchmarking
- Test dataset with ground truth
- Open-source evaluation toolkit
- Benchmark paper with comprehensive format comparison study
- Documentation and API for community contributions
