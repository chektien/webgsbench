# WebGSBench: Comprehensive Implementation Plan

**Date:** January 29, 2026  
**Version:** 1.0  
**Status:** Ready for Execution  

---

## Executive Summary

This document provides a detailed implementation plan for the WebGSBench app to facilitate paper submission with a powerful video demo. Based on comprehensive research into the state of the art, this plan addresses the critical gaps identified and positions WebGSBench as the first comprehensive web-native benchmark for 3D Gaussian Splatting.

**Key Research Findings:**
- Compression methods now achieve 100x+ reduction (HAC, FlexGaussian)
- Multiple web renderers exist but no systematic comparison
- Quality assessment tools (GS-QA, Splatwizard) focus on desktop only
- **Critical Gap:** No existing benchmark evaluates web deployment constraints

**WebGSBench Opportunity:**
- First web-native benchmark with real browser constraints
- Systematic multi-format comparison (.ply → .splat → .ksplat → .spz)
- Cross-browser, cross-device performance profiling
- Living benchmark with public leaderboards

---

## Part 1: Strategic Positioning

### 1.1 Current State of the Art Analysis

#### Compression Methods (2024-2025)
| Method | Venue | Compression | Key Innovation |
|--------|-------|-------------|----------------|
| HAC/HAC++ | ECCV 2024/arXiv | 100x | Hash-grid context modeling |
| LightGaussian | NeurIPS 2024 | 15x | Distillation-based pruning |
| Compressed 3DGS | CVPR 2024 | 31x | Vector quantization |
| FlexGaussian | ACM MM 2025 | 96.4% | Training-free compression |
| Mini-Splatting | arXiv 2025 | 10x | Structure-aware pruning |

#### Benchmarking Tools
| Tool | Focus | Web-Native | Gap |
|------|-------|------------|-----|
| Splatwizard | Compression eval | ❌ | Desktop only |
| GS-QA | Quality assessment | ❌ | 18 metrics, desktop |
| 3DGS-VBench | Video quality | ❌ | Dynamic scenes only |
| **WebGSBench** | Web deployment | ✅ | **First of its kind** |

### 1.2 Differentiation Strategy

**Unique Value Proposition:**
> "WebGSBench is the first and only benchmark that evaluates 3D Gaussian Splatting methods under real-world web deployment conditions, providing researchers and practitioners with actionable insights for format selection and deployment optimization."

**Competitive Advantages:**
1. **Web-Native Evaluation** - Real browser testing (not desktop emulation)
2. **Format Impact Analysis** - How methods degrade across formats
3. **Cross-Device Profiling** - Browser-specific, device-specific performance
4. **Living Benchmark** - Community submissions, public leaderboards
5. **Comprehensive Metrics** - Quality, size, FPS, load time, memory

### 1.3 Target Venues & Timeline

**Three-Paper Strategy:**

| Paper | Venue | Deadline | Focus |
|-------|-------|----------|-------|
| Paper 1 | SIGGRAPH Asia 2026 | May 2026 | Benchmarking foundation |
| Paper 2 | CHI 2027 | Sept 2026 | Arena methodology |
| Paper 3 | SIGGRAPH 2027 | Feb 2027 | Perceptual findings |

**Current Status:**
- ✅ Abstract ready (in main.tex)
- ✅ Infrastructure complete (SplattingArena v1.0)
- ⏳ Data collection pending
- ⏳ Paper sections 4-6 to write

---

## Part 2: Detailed Implementation Plan

### Phase 1: Data Collection Infrastructure (Days 1-3)

#### Day 1: Ground Truth Capture

**Objective:** Capture 15 reference images (3 scenes × 5 views)

**Scenes:**
1. **bonsai** (Mip-NeRF 360) - 56 MB, fine foliage detail
2. **playroom** (Deep Blending) - 453 MB, memory stress test
3. **truck** (Tanks & Temples) - 400 MB, temporal stability test

**Views per Scene:**
- view-front: Center, head-on
- view-right: 90° rotation to the right
- view-top: Looking down from above
- view-angle1: 45° diagonal, medium distance
- view-angle2: Close-up detail view

**Implementation:**
```bash
# Start viewer
./scripts/start_viewer.sh

# For each scene:
# 1. Load scene.ply (reference)
# 2. Position camera for each view
# 3. Take screenshot (Cmd+Shift+4)
# 4. Save as: assets/ground-truth/{scene}/{view}.png
# 5. Verify resolution: 1920×1080
```

**Deliverables:**
- 15 PNG files in `assets/ground-truth/{scene}/`
- Resolution: 1920×1080
- Format: PNG with transparency

**Time Estimate:** 1.5 hours

---

#### Day 2: Quality Metrics Collection

**Objective:** Collect PSNR/SSIM data for 45 comparisons (3 scenes × 3 formats × 5 views)

**Process (Using SplattingArena):**
```
For each scene (bonsai, playroom, truck):
  1. Load {scene}.ply in Splat A (reference)
  
  For each format (.splat, .ksplat, .spz):
    1. Load {scene}.{format} in Splat B
    2. Camera syncs automatically to reference
    3. Navigate to ground truth viewpoint
    4. Click "Compare Quality" button
    5. Record PSNR/SSIM values
    6. Repeat for all 5 views
```

**Data Structure:**
```csv
scene,format,view,psnr,ssim
bonsai,splat,view-front,32.5,0.95
bonsai,splat,view-right,31.8,0.94
...
playroom,spz,view-angle2,28.3,0.89
```

**Expected Results:**
| Format | PSNR Loss vs PLY | SSIM | File Size |
|--------|------------------|------|-----------|
| .splat | -0.5 to -1.0 dB | 0.98 | 0.13× |
| .ksplat | -1.0 to -2.0 dB | 0.96 | 0.10-0.20× |
| .spz | -2.0 to -3.0 dB | 0.94 | 0.08× |

**Implementation Enhancement:**
Add "Export CSV" button to MetricsPanel for automated data collection.

**Time Estimate:** 2-3 hours

---

#### Day 3: Performance Benchmarks

**Objective:** Collect FPS, load time, memory for 24 tests (12 files × 2 browsers)

**Metrics to Collect:**
- Load time (seconds)
- Static FPS (5-second average)
- Interactive FPS (during camera rotation)
- FPS drop percentage
- Memory usage (MB)
- 1% low FPS
- Frame time variance

**Browsers:**
- Chrome (primary)
- Firefox (comparison)
- Safari (if time permits)

**Implementation:**
Add "Run Performance Benchmark" button that:
1. Loads file
2. Waits for complete load, records load time
3. Measures FPS for 5 seconds (static)
4. Auto-rotates camera for 5 seconds
5. Measures FPS during rotation (interactive)
6. Records memory usage
7. Exports to CSV

**Data Structure:**
```csv
scene,format,browser,load_time_s,static_fps,interactive_fps,fps_drop_pct,memory_mb,one_pct_low_fps,variance_ms
bonsai,ply,Chrome,1.2,60,45,25,120,35,2.1
...
```

**Time Estimate:** 3-4 hours

---

### Phase 2: Core Features for Paper (Days 4-7)

#### Day 4: Export & Reporting System

**Feature 1: CSV Export**
- Add "Export Results" button to header
- Export all collected metrics to CSV
- Include timestamp, browser info, scene names

**Feature 2: Screenshot Capture**
- Add camera icon to each viewer pane
- Capture high-resolution screenshot (1920×1080)
- Download as PNG
- Use case: Figure generation for paper

**Feature 3: Batch Testing UI**
- Simple queue interface
- Load multiple file pairs
- Automated metrics collection
- Aggregated results table

**Implementation:**
```typescript
// New component: ExportPanel.tsx
interface ExportPanelProps {
  metricsA: MetricsData;
  metricsB: MetricsData;
  qualityResults: QualityMetrics;
}

// Functions:
- exportToCSV(): void
- captureScreenshot(viewer: 'A' | 'B'): Promise<Blob>
- generateReport(): PDF
```

**Time Estimate:** 4-6 hours

---

#### Day 5: Arena Mode UI (Demo Version)

**Objective:** Implement anonymous A/B comparison UI for paper demo

**Features:**
1. **Arena Toggle:** Hide format labels, show "Left" vs "Right"
2. **Preference Selection:**
   - Question: "Which rendering looks better?"
   - Options: "Left", "Right", "No Preference"
3. **Multiple Rounds:** Navigate through comparison pairs
4. **Visual Feedback:** Clear selection indicators

**UI Mockup:**
```
┌─────────────────────────────────────────────────────┐
│  ARENA MODE                    [Exit Arena]         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐          ┌──────────────┐        │
│  │   [Viewer A] │          │   [Viewer B] │        │
│  │   (Left)     │          │   (Right)    │        │
│  └──────────────┘          └──────────────┘        │
│                                                     │
│         Which looks better?                         │
│                                                     │
│    [Left]    [No Preference]    [Right]            │
│                                                     │
│              [Next Comparison →]                    │
└─────────────────────────────────────────────────────┘
```

**Note:** This is UI-only for demo purposes. Full user study with data collection is future work (CHI 2027).

**Time Estimate:** 4-6 hours

---

#### Day 6: Visualization & Charts

**Feature 1: Real-time Charts**
- FPS time-series graph during interaction
- Memory usage gauge
- Load time progress bar

**Feature 2: Pareto Frontier Visualization**
- Quality vs file size scatter plot
- Pareto frontier line
- Format labeling

**Feature 3: Browser Comparison Chart**
- Bar chart comparing Chrome vs Firefox
- Metrics: FPS, load time, memory

**Implementation:**
Use Chart.js or Recharts for React integration.

```typescript
// New component: PerformanceCharts.tsx
interface ChartProps {
  data: BenchmarkData[];
  type: 'pareto' | 'browser' | 'temporal';
}
```

**Time Estimate:** 6-8 hours

---

#### Day 7: Polish & Bug Fixes

**Tasks:**
1. Fix any UI overflow issues
2. Optimize rendering performance
3. Add loading states for all async operations
4. Improve error handling
5. Test all 12 benchmark files
6. Verify camera sync accuracy
7. Test on multiple browsers

**Deliverables:**
- Stable v1.0 release
- All 12 files load correctly
- Metrics display accurately
- UI responsive and polished

**Time Estimate:** 4-6 hours

---

### Phase 3: Paper Writing Support (Days 8-14)

#### Days 8-9: Data Analysis

**Analysis Tasks:**
1. **File Size Analysis** (already complete)
   - Document compression ratios
   - Identify outliers

2. **Quality Analysis**
   - Calculate average PSNR/SSIM per format
   - Identify quality degradation patterns
   - Statistical significance testing

3. **Performance Analysis**
   - Browser comparison (Chrome vs Firefox)
   - FPS drop analysis (static vs interactive)
   - Memory usage patterns

4. **Correlation Analysis**
   - File size vs quality
   - FPS vs splat count
   - Load time vs file size

**Tools:**
- Python with pandas, matplotlib, seaborn
- Jupyter notebooks for reproducibility

**Deliverables:**
- `analysis/quality_analysis.ipynb`
- `analysis/performance_analysis.ipynb`
- `analysis/figures/` (PNG/SVG for paper)

---

#### Days 10-11: Figure Generation

**Figures for Paper:**

**Figure 1: System Architecture**
- Type: Block diagram
- Shows: Components, data flow, metrics pipeline
- Tool: draw.io or Figma

**Figure 2: File Size Comparison**
- Type: Grouped bar chart
- Shows: Size per scene across formats
- Data: Already collected

**Figure 3: Quality vs File Size (Pareto)**
- Type: Scatter plot with Pareto line
- Shows: PSNR vs compression ratio
- Highlights: Optimal trade-off point

**Figure 4: Browser Performance**
- Type: Grouped bar chart
- Shows: FPS, load time, memory per browser
- Comparison: Chrome vs Firefox vs Safari

**Figure 5: Temporal Stability**
- Type: Line chart
- Shows: FPS over time during interaction
- Highlights: Frame drops, variance

**Figure 6: Visual Quality Comparison**
- Type: Side-by-side screenshots
- Shows: .ply vs .spz quality difference
- Scene: bonsai or flower (high detail)

**Figure 7: Arena Mode UI**
- Type: Screenshot
- Shows: Anonymous comparison interface
- Purpose: Demonstrate perceptual evaluation capability

---

#### Days 12-14: Section Writing

**Section 4: Framework Design (Day 12)**
- 4.1: System Architecture
- 4.2: Benchmark Protocol
- 4.3: Implementation Details

**Section 5: Experimental Setup (Day 12-13)**
- 5.1: Test Scenes (describe bonsai, playroom, truck)
- 5.2: Format Characteristics
- 5.3: Evaluation Protocol

**Section 6: Results & Analysis (Day 13-14)**
- 6.1: File Size Analysis
- 6.2: Quality Metrics
- 6.3: Performance Characteristics
- 6.4: Temporal Stability

---

## Part 3: Video Demo Strategy

### 3.1 Demo Structure (3-4 Minutes)

```
0:00-0:20  | HOOK: Problem Statement
           | Show beautiful 3D scene rotating smoothly
           | Text: "3DGS runs at 60 FPS on desktop..."
           | Cut to mobile browser struggling (5 FPS)
           | Text: "...but web deployment is broken"

0:20-0:45  | SETUP: The Gap
           | Split screen: Desktop vs Web
           | Same scene, very different results
           | Show format fragmentation (.ply, .splat, .ksplat, .spz)
           | Text: "No standardized way to evaluate"

0:45-2:00  | SOLUTION: WebGSBench Demo
           | Launch SplattingArena
           | Load bonsai.ply in Splat A
           | Load bonsai.spz in Splat B
           | Demonstrate synced camera navigation
           | Click "Compare Quality" → show PSNR/SSIM
           | Switch browsers (Chrome → Safari → Firefox)
           | Show performance metrics updating

2:00-2:45  | RESULTS: Key Findings
           | Animated Pareto curve (quality vs size)
           | Browser performance comparison
           | Temporal stability visualization
           | Arena Mode: Anonymous comparison UI

2:45-3:15  | IMPACT: Guidelines
           | Quick format selection flowchart
           | Performance budget recommendations
           | Text: "10× smaller with only 1dB loss"

3:15-3:30  | CONCLUSION: Call to Action
           | Text: "WebGSBench: Evaluate before you deploy"
           | GitHub URL / QR code
           | Fade to black
```

### 3.2 Key Visual Moments

**Moment 1: The Crash (0:15)**
- Show browser tab becoming unresponsive
- Memory gauge hitting limit
- Dramatic freeze frame
- Text: "This is why we need benchmarks"

**Moment 2: Synced Navigation (1:00)**
- Smooth camera orbit
- Both viewers moving in perfect sync
- Metrics updating in real-time
- Text: "Apples-to-apples comparison"

**Moment 3: Quality Reveal (1:20)**
- Click "Compare Quality"
- PSNR number animating up
- Color-coded result (green = excellent)
- Split-screen wipe showing difference

**Moment 4: Browser Surprise (1:45)**
- Same file, three browsers side-by-side
- Safari 30% slower than Chrome
- Text: "Browser matters as much as format"

**Moment 5: Arena Mode (2:30)**
- Anonymous comparison UI
- User selecting preference
- Text: "What do humans actually prefer?"

### 3.3 Technical Production

**Recording Setup:**
- Resolution: 1920×1080 (4K if possible)
- Frame rate: 60 FPS capture, 30 FPS output
- Software: OBS Studio or ScreenFlow
- Audio: Separate narration track

**Visual Style:**
- Dark background (matches app)
- Clean, minimal UI chrome
- Animated text overlays
- Smooth transitions (0.5s)
- Color coding consistent with app

**Editing Guidelines:**
- 15-30 seconds per concept
- Speed up during technical details
- Slow down for impact moments
- Background music: subtle, electronic
- Add captions for accessibility

### 3.4 Export Versions

**Version 1: Full Demo (3:30)**
- Complete narrative
- All features shown
- For paper supplementary material

**Version 2: Conference Teaser (1:00)**
- Problem → Solution → Impact
- Fast-paced, high energy
- For social media, Twitter

**Version 3: GIF Clips (5-10 seconds)**
- Synced navigation
- Quality comparison
- Browser difference
- For embedded in paper/presentations

---

## Part 4: Advanced Features (Post-Submission)

### 4.1 Automated Benchmarking Pipeline

**Feature:** One-click full benchmark run

**Implementation:**
```typescript
// AutomatedBenchmark.ts
class AutomatedBenchmark {
  async runFullBenchmark(sceneFiles: string[]): Promise<BenchmarkReport> {
    for (const scene of sceneFiles) {
      for (const format of ['ply', 'splat', 'ksplat', 'spz']) {
        await this.loadFile(scene, format);
        await this.collectQualityMetrics();
        await this.collectPerformanceMetrics();
      }
    }
    return this.generateReport();
  }
}
```

### 4.2 Leaderboard System

**Feature:** Public leaderboard with filters

**Components:**
- Submission form (upload .ply, get benchmarked)
- Leaderboard table (sortable, filterable)
- Scene-specific leaderboards
- Format-specific comparisons

### 4.3 Perceptual Study Infrastructure

**Feature:** Full user study system for CHI 2027

**Components:**
- User consent form
- Attention checks
- 2AFC protocol (ITU-R BT.500)
- Bradley-Terry model implementation
- Elo rating calculation
- Statistical analysis dashboard

### 4.4 Additional Format Support

**Formats to Add:**
- Compressed 3DGS format
- HAC format
- LightGaussian format
- Custom researcher formats

---

## Part 5: Risk Mitigation

### Risk 1: Data Collection Takes Too Long

**Mitigation:**
- Reduce from 5 views to 3 views per scene (15 → 9 images)
- Use automated screenshot capture
- Parallelize across browsers

**Fallback:**
- Use A vs B comparison (no ground truth needed)
- Focus on relative comparisons, not absolute metrics

### Risk 2: Browser Differences Too Small

**Mitigation:**
- Test on lower-end hardware (integrated GPU)
- Add Safari to comparison (larger gaps expected)
- Test on mobile browsers

**Fallback:**
- Focus on format differences (stronger signal)
- Emphasize quality/size trade-offs

### Risk 3: Quality Differences Too Subtle

**Mitigation:**
- Use flower scene (thin geometry, high compression artifacts)
- Use playroom (large file, memory pressure)
- Show temporal artifacts (flickering during motion)

**Fallback:**
- Emphasize file size savings
- Focus on performance gains
- Quality is "acceptable" even with compression

### Risk 4: Video Production Issues

**Mitigation:**
- Record early, iterate often
- Have backup recording software
- Create storyboard before recording
- Practice narration

**Fallback:**
- Use screen recordings with captions
- Simpler demo structure
- Focus on screenshots + narration

---

## Part 6: Success Metrics

### Technical Metrics
- [ ] All 12 benchmark files load correctly
- [ ] PSNR/SSIM calculations accurate
- [ ] FPS tracking within 5% of ground truth
- [ ] Camera sync accurate (<1° error)
- [ ] Export functions working

### Paper Metrics
- [ ] 8-10 pages complete
- [ ] 5-6 figures generated
- [ ] 2-3 tables with data
- [ ] All sections written
- [ ] Citations verified

### Demo Metrics
- [ ] 3:30 minute video complete
- [ ] 1:00 teaser version
- [ ] 3 GIF clips
- [ ] Professional quality
- [ ] Clear narrative

### Adoption Metrics
- [ ] GitHub repository public
- [ ] Documentation complete
- [ ] 100+ stars in first month
- [ ] Community submissions

---

## Appendix A: File Structure

```
webgsbench-app/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   └── AppLayout.tsx
│   │   ├── Viewer/
│   │   │   └── GSViewer.tsx
│   │   ├── FileLoader/
│   │   │   └── FileDropzone.tsx
│   │   ├── Metrics/
│   │   │   ├── MetricsPanel.tsx
│   │   │   └── QualityMetrics.tsx
│   │   ├── Arena/
│   │   │   └── ArenaMode.tsx          # NEW
│   │   ├── Charts/
│   │   │   ├── ParetoChart.tsx        # NEW
│   │   │   └── BrowserComparison.tsx  # NEW
│   │   └── Export/
│   │       ├── ExportPanel.tsx        # NEW
│   │       └── ScreenshotCapture.tsx  # NEW
│   ├── hooks/
│   │   ├── useGSLoader.ts
│   │   ├── useMetrics.ts
│   │   └── useBenchmark.ts            # NEW
│   ├── lib/
│   │   ├── metrics/
│   │   │   ├── imageQuality.ts
│   │   │   └── performance.ts
│   │   ├── profiling/
│   │   │   └── browserDetect.ts
│   │   └── export/
│   │       ├── csvExport.ts           # NEW
│   │       └── reportGenerator.ts     # NEW
│   └── types/
│       └── index.ts
├── assets/
│   └── ground-truth/                  # NEW
│       ├── bonsai/
│       ├── playroom/
│       └── truck/
├── analysis/                          # NEW
│   ├── quality_analysis.ipynb
│   ├── performance_analysis.ipynb
│   └── figures/
└── demo/                              # NEW
    ├── full-demo.mp4
    ├── teaser.mp4
    └── clips/
```

---

## Appendix B: Dependencies to Add

```json
{
  "dependencies": {
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "papaparse": "^5.4.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1"
  }
}
```

---

## Appendix C: Key Citations to Add

**Compression:**
- HAC (Chen et al., ECCV 2024)
- LightGaussian (Fan et al., NeurIPS 2024)
- FlexGaussian (Tian et al., ACM MM 2025)

**Benchmarking:**
- GS-QA (Martin et al., 2025)
- Splatwizard (Liu et al., 2025)

**Web Rendering:**
- WebGS360 (Zhang et al., 2025)
- Visionary (Gong et al., 2025)

---

**End of Implementation Plan**

This plan provides a comprehensive roadmap for completing the WebGSBench app and creating a compelling paper submission with a powerful video demo. Execute in phases, adapt as needed, and focus on the core contributions that make WebGSBench unique.
