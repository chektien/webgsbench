# State of the Art Analysis: 3D Gaussian Splatting Web Deployment and Benchmarking

**Date:** January 29, 2026  
**Purpose:** Comprehensive analysis of recent advances in 3DGS compression, web rendering, and benchmarking for WebGSBench positioning

---

## Executive Summary

The 3D Gaussian Splatting (3DGS) field has experienced explosive growth in 2024-2025, with over 200+ papers published. However, a critical gap exists between academic research and practical web deployment. This analysis identifies four key research areas:

1. **Compression Methods** - achieving 10-100x size reduction
2. **Web Rendering** - WebGL/WebGPU implementations
3. **Benchmarking Tools** - quality assessment frameworks
4. **Format Standardization** - competing web formats (.splat, .spz, .ksplat)

**Key Finding:** While compression methods have matured rapidly, no existing benchmark provides comprehensive web deployment evaluation. This represents the primary opportunity for WebGSBench.

---

## 1. Recent 3DGS Compression Methods (2024-2025)

### 1.1 Major Compression Techniques

| Method | Venue | Year | Compression Ratio | Key Technique |
|--------|-------|------|-------------------|---------------|
| **Compressed 3DGS** | CVPR | 2024 | 31x | Vector quantization + entropy coding |
| **LightGaussian** | NeurIPS | 2024 | 15x | Pruning + distillation |
| **HAC** | ECCV | 2024 | 100x | Hash-grid assisted context |
| **HAC++** | arXiv | 2025 | 100x+ | Improved HAC with lattice quantization |
| **EAGLES** | ECCV | 2024 | 20x | Lightweight encodings + coarse-to-fine pruning |
| **FlexGaussian** | ACM MM | 2025 | 96.4% | Training-free flexible compression |
| **Compact3D** | arXiv | 2024 | 25x | Vector quantization |
| **Mini-Splatting** | arXiv | 2025 | 10x | Structure-aware pruning |

### 1.2 Key Papers and Contributions

#### 3DGS.zip: A Survey on 3D Gaussian Splatting Compression Methods (2025)
- **Venue:** Computer Graphics Forum (CGF)
- **Authors:** Bagdasarian et al.
- **Contribution:** Comprehensive taxonomy of compression methods
- **Key Finding:** Current methods achieve 10-100x compression with minimal quality loss

#### Compressed 3D Gaussian Splatting for Accelerated Novel View Synthesis (CVPR 2024)
- **Authors:** Niedermayr et al.
- **Contribution:** First major compression method achieving 31x compression
- **Technique:** 
  - Residual vector quantization for Gaussian parameters
  - Entropy coding with learned priors
  - Enables network streaming
- **Web Relevance:** Explicitly designed for streaming scenarios

#### HAC: Hash-grid Assisted Context for 3D Gaussian Splatting Compression (ECCV 2024)
- **Authors:** Chen et al.
- **Contribution:** State-of-the-art 100x compression
- **Technique:**
  - Uses hash-grid to capture spatial context
  - Residual coding between predicted and actual Gaussians
  - Maintains rendering quality at extreme compression
- **Web Relevance:** One of the highest compression ratios, suitable for web delivery

#### HAC++: Towards 100x Compression of 3D Gaussian Splatting (2025)
- **Authors:** Chen et al.
- **Contribution:** Improved HAC with lattice vector quantization
- **Technique:** Scene-adaptive lattice vector quantization (LVQ)
- **Key Advantage:** Better rate-distortion trade-off than uniform scalar quantization

#### LightGaussian: Unbounded 3D Gaussian Compression with 15x Reduction and 200+ FPS (NeurIPS 2024)
- **Authors:** Fan et al.
- **Contribution:** Pruning-based compression with quality preservation
- **Technique:**
  - Distillation-based pruning strategy
  - Octree-based organization for efficient rendering
  - Unbounded scene support
- **Web Relevance:** 200+ FPS rendering performance

#### EAGLES: Efficient Accelerated 3D Gaussians with Lightweight Encodings (ECCV 2024)
- **Authors:** Girish et al.
- **Contribution:** Memory-efficient representation
- **Technique:**
  - Coarse-to-fine pruning
  - Compact feature encodings
  - Reduced memory footprint

#### FlexGaussian: Flexible and Cost-Effective Training-Free Compression (ACM MM 2025)
- **Authors:** Tian et al.
- **Contribution:** Training-free compression achieving 96.4% size reduction
- **Technique:** Flexible compression targets without retraining
- **Web Relevance:** Enables dynamic quality/size trade-offs at runtime

### 1.3 Compression Trends

**Quantization Techniques:**
- Vector quantization (VQ) dominates high-compression methods
- Lattice vector quantization (LVQ) emerging as superior to uniform scalar quantization
- 8-bit and lower precision quantization common

**Pruning Strategies:**
- Opacity-based pruning most common
- Distillation-based methods preserve quality better
- Structure-aware pruning (Scaffold-GS inspired) gaining traction

**Entropy Coding:**
- Learned priors for arithmetic/range coding
- Context-adaptive coding (HAC)
- Huffman coding for faster decoding

---

## 2. Web Rendering Advances

### 2.1 Web-Based Renderers

| Implementation | Backend | Features | Performance |
|----------------|---------|----------|-------------|
| **antimatter15/splat** | WebGL + CPU sort | .splat format, basic viewer | ~30-60 FPS |
| **mkkellogg/GaussianSplats3D** | WebGL + GPU sort | .ksplat format, GPU sorting | ~60-120 FPS |
| **cvlab-epfl/gaussian-splatting-web** | WebGPU | Full SH support | ~100+ FPS |
| **Visionary** | WebGPU | XR support, streaming | Real-time |
| **WebGS360** | WebGPU | Panoramic images, 100+ FPS | High |
| **StreamSplat** | WebGL/WebGPU | Hybrid client-server | Adaptive |

### 2.2 Key Papers

#### WebGS360: Towards Web-Based Visualization of Gaussian Splatting from Panoramic Images (2025)
- **Venue:** Computers & Graphics
- **Authors:** Zhang et al.
- **Contribution:** 
  - WebGPU-based panoramic rendering
  - 100+ FPS performance
  - Tile-based rendering optimization
  - Surpasses WebGL-based methods

#### Visionary: The World Model Carrier Built on WebGPU-Powered Gaussian Splatting Platform (2025)
- **Authors:** Gong et al.
- **Contribution:**
  - WebGPU-native implementation
  - No installation required (browser-based)
  - Mobile WebGL 2.0 compatibility
  - Comparison with SparkJS (WebGL)

#### StreamSplat: A Hybrid Client-Server Architecture for Neural Graphics (2025)
- **Venue:** ACM Web3D
- **Authors:** Park et al.
- **Contribution:**
  - Hybrid rendering architecture
  - Depth-based fusion on the web
  - High-fidelity splatting in browsers
  - Adaptive quality based on bandwidth

#### Rendering 3D Gaussian Splatting in Web Browser (2025)
- **Venue:** IEEE Access
- **Authors:** Zhu & Liu
- **Contribution:**
  - WebGL-based rendering analysis
  - Impact of Spherical Harmonics (SH) on performance
  - Gaussian count optimization
  - Browser-specific optimizations

### 2.3 Rendering Optimizations

**WebGPU vs WebGL:**
- WebGPU: 2-3x performance improvement
- Compute shader support for GPU sorting
- Better memory management
- Limited browser support (Chrome/Edge)

**Sorting Strategies:**
- CPU sorting: Simple but CPU-intensive
- GPU sorting: Fast but complex implementation
- Approximate sorting: Trade accuracy for speed

**Level-of-Detail (LOD):**
- FLoD: Flexible LOD for customizable rendering
- Scaffold-GS inspired anchor-based LOD
- Distance-based Gaussian culling

---

## 3. Benchmarking Approaches

### 3.1 Quality Assessment Benchmarks

| Benchmark | Focus | Metrics | Scenes |
|-----------|-------|---------|--------|
| **GS-QA** | Quality assessment | 18 metrics | Diverse |
| **3DGS-IEval-15K** | Image quality | PSNR/SSIM/LPIPS | 15K images |
| **3DGS-VBench** | Video quality | 15 QA metrics | Multiple |
| **Splatwizard** | Compression | Size/FPS/Quality | Standard |
| **CAT-3DGSPro** | Efficient compression | Rate-distortion | Custom |
| **Perceptual QA Study** | Subjective quality | Human ratings | Various |

### 3.2 Key Papers

#### GS-QA: Comprehensive Quality Assessment Benchmark for Gaussian Splatting View Synthesis (2025)
- **Authors:** Martin et al.
- **arXiv:** 2502.13196
- **Contribution:**
  - First comprehensive QA benchmark for 3DGS
  - Subjective quality assessment study
  - Evaluation of 18 objective metrics
  - Analysis of metric correlation with human perception
- **Findings:**
  - Current metrics have limitations for 3DGS content
  - View-dependent quality variations not captured well
  - Need for 3DGS-specific quality metrics

#### Splatwizard: A Benchmark Toolkit for 3D Gaussian Splatting Compression (2025)
- **Authors:** Liu et al.
- **arXiv:** 2512.24742
- **Contribution:**
  - Unified toolkit for compression evaluation
  - Standardized comparison pipeline
  - Quality/flexibility evaluation
- **Features:**
  - File size measurement
  - Rendering FPS evaluation
  - Quality metrics (PSNR/SSIM/LPIPS)
- **Limitation:** Offline evaluation only, no web-native testing

#### 3DGS-VBench: A Comprehensive Video Quality Evaluation Benchmark for 3DGS Compression (2025)
- **Authors:** Xing et al.
- **arXiv:** 2508.07038
- **Contribution:**
  - Video quality evaluation for dynamic 3DGS
  - 15 quality assessment metrics
  - Weakness analysis of current QA methods

#### 3DGS-IEval-15K: A Large-Scale Image Quality Evaluation Database (2025)
- **Authors:** Xing et al.
- **Venue:** ACM MMSys
- **Contribution:**
  - 15K images for IQA
  - First large-scale benchmark for 3DGS
  - Addresses view-dependent quality variations

#### Perceptual Quality Assessment of 3D Gaussian Splatting: A Subjective Dataset and Prediction Metric (2025)
- **Authors:** Wan et al.
- **arXiv:** 2511.08032
- **Contribution:**
  - Subjective dataset for perceptual evaluation
  - Novel prediction metric for 3DGS quality
  - Analysis of existing metric effectiveness

#### Benchmarking 3D Gaussian Splatting Rendering (2025)
- **Venue:** IEEE Access
- **Authors:** Samudrala & Kondguli
- **Contribution:**
  - Performance benchmarking study
  - Average PSNR of 37 across benchmarks
  - Quality/performance trade-off analysis
  - 100 FPS achievable with quality trade-offs

### 3.3 Evaluation Metrics Used

**Standard Metrics:**
- PSNR (Peak Signal-to-Noise Ratio)
- SSIM (Structural Similarity)
- LPIPS (Learned Perceptual Image Patch Similarity)

**Emerging Metrics:**
- IV-PSNR (View-dependent PSNR)
- Perceptual metrics for 3DGS-specific artifacts
- Human evaluation scores (subjective studies)

**Performance Metrics:**
- File size (MB)
- Compression ratio
- Rendering FPS
- Loading time
- Memory footprint
- GPU utilization

---

## 4. Related Benchmarks and Tools

### 4.1 Existing Tools

| Tool/Format | Type | Description |
|-------------|------|-------------|
| **.splat** | Format | Simplified format without SH, antimatter15 |
| **.ksplat** | Format | Compressed with variable levels, mkkellogg |
| **.spz** | Format | Niantic/Scaniverse format, 64 bytes/splat |
| **Compressed PLY** | Format | PlayCanvas quantization |
| **Splatwizard** | Toolkit | Compression evaluation toolkit |
| **GS-QA** | Benchmark | Quality assessment benchmark |

### 4.2 Format Comparison

| Format | Relative Size | SH Support | Features |
|--------|--------------|------------|----------|
| PLY (original) | 1.0x | Full | Academic standard |
| Compressed PLY | 0.25x | Trimmed | PlayCanvas |
| .splat | 0.4x | None | Simple, fast |
| .ksplat | Variable | Configurable | Multiple levels |
| .spz | 0.1x | Yes | Niantic optimized |

---

## 5. Compression Evaluation Studies

### 5.1 Major Surveys

#### Compression in 3D Gaussian Splatting: A Survey of Methods, Trends, and Future Directions (2025)
- **Authors:** Ali et al.
- **arXiv:** 2502.19457
- **Contribution:** Comprehensive survey of compression techniques
- **Taxonomy:**
  - Quantization-based methods
  - Pruning-based methods
  - Neural compression methods
  - Hybrid approaches
- **Trends Identified:**
  - Move toward 100x+ compression ratios
  - Increasing focus on web deployment
  - Need for standardized evaluation

#### 3DGS.zip: A Survey on 3D Gaussian Splatting Compression Methods (2025)
- **Venue:** Computer Graphics Forum
- **Authors:** Bagdasarian et al.
- **Focus:** Compression and compaction techniques
- **Key Finding:** Balance between compression ratio, visual quality, and rendering performance

### 5.2 Streaming and Progressive Loading

#### 3DGStreaming: Spatial Heterogeneity Aware 3DGS Compression and Streaming (2025)
- **Authors:** Zhang et al.
- **Contribution:** Streaming-optimized framework
- **Technique:** Spatial heterogeneity-aware compression levels

#### LTS: A DASH Streaming System for Dynamic Multi-Layer 3DGS Scenes (2025)
- **Venue:** ACM MMSys
- **Authors:** Sun et al.
- **Contribution:** DASH-style adaptive streaming for 3DGS
- **Technique:** Multi-layer representation with quality adaptation

#### On the Efficient Adaptive Streaming of 3D Gaussian Splatting over Dynamic Networks (2025)
- **Authors:** Wang et al.
- **Contribution:** Adaptive streaming over variable networks
- **Technique:** Network-aware quality adaptation

---

## 6. Relationship to WebGSBench

### 6.1 How Existing Work Relates

**Compression Methods:**
- ✓ Well-studied with clear benchmarks
- ✗ Web deployment evaluation missing
- ✗ Cross-format quality comparison not standardized

**Web Renderers:**
- ✓ Multiple implementations exist
- ✗ No systematic performance comparison
- ✗ No standardized test protocol

**Benchmarks:**
- ✓ Quality assessment tools exist (GS-QA, Splatwizard)
- ✗ No web-native evaluation
- ✗ No format conversion impact study
- ✗ No cross-browser/device testing

### 6.2 Gaps That WebGSBench Addresses

| Gap | Existing Work | WebGSBench Solution |
|-----|---------------|---------------------|
| **Web-native evaluation** | Desktop-only testing | Browser-based testing with real constraints |
| **Format comparison** | Individual format studies | Systematic multi-format pipeline |
| **Cross-device testing** | Single hardware evaluation | Multi-device, multi-browser profiling |
| **Compression trade-offs** | Quality vs file size only | Quality vs size vs performance vs load time |
| **Real-world conditions** | Idealized settings | Network throttling, memory limits |
| **Reproducibility** | Manual conversion | Automated pipeline |

### 6.3 Opportunities for Differentiation

**Unique Contributions WebGSBench Can Make:**

1. **First Web-Native Benchmark:**
   - Evaluate methods in actual browser environments
   - Test with real WebGL/WebGPU constraints
   - Measure loading times and memory usage

2. **Format-Agnostic Evaluation:**
   - Compare how methods degrade across formats
   - Identify format-specific failure modes
   - Recommend optimal format for each use case

3. **Comprehensive Performance Profiling:**
   - Browser-specific performance characterization
   - Device-specific profiling (mobile vs desktop)
   - Memory footprint analysis

4. **Real-World Constraints:**
   - Network bandwidth simulation
   - Progressive loading evaluation
   - Mobile browser testing

5. **Living Benchmark:**
   - Continuous updates with new methods
   - Community submissions
   - Public leaderboards

---

## 7. Key Findings and Trends

### 7.1 Compression Trends

1. **Rapid Progress:** Compression ratios improved from 15x (2023) to 100x+ (2025)
2. **Quantization Dominance:** Vector quantization most effective technique
3. **Training-Free Methods:** Growing interest in post-training compression (FlexGaussian)
4. **Web-Optimized:** Increasing focus on streaming and progressive loading

### 7.2 Web Deployment Trends

1. **WebGPU Adoption:** New implementations favor WebGPU over WebGL
2. **Format Convergence:** .spz gaining traction as web-optimized format
3. **Hybrid Architectures:** Client-server split rendering emerging
4. **Mobile Focus:** Increasing attention to mobile browser constraints

### 7.3 Benchmarking Trends

1. **Quality Assessment Maturity:** GS-QA and 3DGS-IEval provide solid foundation
2. **Subjective Studies:** Recognition that metrics don't capture all artifacts
3. **Performance Gaps:** File size well-studied, but rendering performance less so
4. **Web Evaluation Missing:** No existing benchmark addresses web deployment

---

## 8. Recommendations for WebGSBench

### 8.1 Must-Have Features

Based on gaps identified:

1. **Multi-Format Pipeline:**
   - Automated conversion: PLY → .splat → .ksplat → .spz
   - Quality tracking across conversions
   - Size and performance metrics per format

2. **Web-Native Testing:**
   - Browser-based rendering evaluation
   - WebGL and WebGPU backends
   - Real loading time measurements

3. **Device Coverage:**
   - Desktop (high-end and low-end)
   - Mobile (iOS Safari, Android Chrome)
   - Tablet devices

4. **Compression Method Coverage:**
   - Include all major methods: HAC, LightGaussian, EAGLES, Compact3D
   - Training-free methods: FlexGaussian
   - Streaming methods: 3DGStreaming

5. **Comprehensive Metrics:**
   - Quality: PSNR, SSIM, LPIPS
   - Size: File size, compression ratio
   - Performance: FPS, load time, memory
   - Perceptual: Human study integration

### 8.2 Competitive Positioning

**WebGSBench vs Existing Tools:**

| Feature | Splatwizard | GS-QA | WebGSBench |
|---------|-------------|-------|------------|
| Compression evaluation | ✓ | ✗ | ✓ |
| Quality assessment | ✓ | ✓ | ✓ |
| Web rendering | ✗ | ✗ | ✓ |
| Multi-format | Partial | ✗ | ✓ |
| Cross-device | ✗ | ✗ | ✓ |
| Public leaderboard | ✗ | ✗ | ✓ |
| Interactive comparison | ✗ | ✗ | ✓ |

**Unique Value Proposition:**
"WebGSBench is the first and only benchmark that evaluates 3D Gaussian Splatting methods under real-world web deployment conditions, providing researchers and practitioners with actionable insights for format selection and deployment optimization."

---

## 9. Key Papers Summary

### Must-Read Papers for WebGSBench

1. **Kerbl et al. (2023)** - Original 3DGS paper [Foundation]
2. **Niedermayr et al. (CVPR 2024)** - Compressed 3DGS [Compression baseline]
3. **Chen et al. (ECCV 2024)** - HAC [SOTA compression]
4. **Fan et al. (NeurIPS 2024)** - LightGaussian [Pruning approach]
5. **Girish et al. (ECCV 2024)** - EAGLES [Memory efficiency]
6. **Martin et al. (2025)** - GS-QA [Quality assessment]
7. **Liu et al. (2025)** - Splatwizard [Benchmark toolkit]
8. **Zhang et al. (2025)** - WebGS360 [Web rendering]
9. **Ali et al. (2025)** - Compression survey [Comprehensive overview]
10. **Tian et al. (2025)** - FlexGaussian [Training-free compression]

---

## 10. Conclusion

The 3D Gaussian Splatting field has made remarkable progress in compression and quality assessment, but a critical gap exists in web deployment evaluation. WebGSBench addresses this gap by providing:

1. **First comprehensive web-native benchmark**
2. **Multi-format comparison pipeline**
3. **Cross-device performance profiling**
4. **Real-world constraint evaluation**

The timing is ideal: compression methods have matured, web viewers are proliferating, and the community recognizes the need for standardized evaluation. WebGSBench can become the de facto standard for 3DGS web deployment evaluation, similar to how ImageNet transformed computer vision benchmarking.

**Next Steps:**
- Implement multi-format conversion pipeline
- Develop web-based evaluation framework
- Curate diverse test scenes
- Establish evaluation protocols
- Build interactive comparison interface

---

*This analysis is based on papers found through arXiv, Google Scholar, and conference proceedings. All papers were published between 2023-2025, with emphasis on 2024-2025 work relevant to web deployment and benchmarking.*
