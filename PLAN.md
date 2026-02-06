# WebGSBench: Multi-Paper Publication Strategy

**Last Updated**: 2026-01-16 (Three-Paper Strategy Finalized)  
**Target Conferences**: SIGGRAPH Asia 2026 → CHI 2027 → SIGGRAPH 2027

---

## 📋 Publication Strategy

This project follows a **three-paper strategy** to maximize impact across graphics and HCI communities:

1. **SIGGRAPH Asia 2026** (Dec 2026): Benchmarking foundation paper
   - Focus: Objective metrics, performance benchmarks, framework
   - Deadline: May 2026

2. **CHI 2027** (Apr 2027): Arena Mode methodology paper
   - Focus: Crowdsourced perceptual evaluation system
   - Deadline: September 4, 2026
   - See: **[ARENA_STRATEGY.md](./ARENA_STRATEGY.md)** for detailed strategy

3. **SIGGRAPH 2027** (July 2027): Perceptual findings paper
   - Focus: What humans prefer vs what metrics predict
   - Deadline: February 2027
   - Fallback: Combined paper if CHI rejects

**User Study**: MTurk-based crowdsourced evaluation (~540 HITs, $300 budget)
- See: **[MTURK_STUDY.md](./MTURK_STUDY.md)** for detailed protocol

---

## 📍 Current Status

### ✅ What's Complete

**Infrastructure**:
- ✅ All 12 benchmark files converted (bonsai, playroom, truck × 4 formats)
- ✅ File size analysis with paper-ready LaTeX table
- ✅ Browser profiler implemented (`webgsbench-app/src/lib/profiling/browserDetect.ts`)
- ✅ Ground truth directory structure created
- ✅ Viewer app working (dual-pane comparison, metrics collection)
- ✅ PSNR/SSIM quality metrics UI implemented (`webgsbench-app/src/lib/metrics/imageQuality.ts`)
- ✅ Camera sync between viewers (Splat B follows Splat A)
- ✅ "Compare Quality" button with real-time calculation
- ✅ Quality results display in MetricsPanel
- ✅ Arena-style perceptual assessment feature specified in PRD (UI-only for demo)
- ✅ **NEW**: Data collection plan documented (`DATA_COLLECTION_PLAN.md`)
- ✅ **NEW**: Setup verification script (`scripts/verify_setup.sh`)
- ✅ **NEW**: CSV template ready (`data/quality_results.csv`)
- ✅ **NEW**: Viewer service running at http://localhost:5174

**Paper**:
- ✅ Abstract ready for submission (117 words, in `main.tex` lines 23-25) - ⭐ READY TO SUBMIT
- ✅ Sections 1-7 complete (Introduction, Background, Motivation, Research Impact, Contributions, Related Systems, Methodology)
- ✅ Section 8: Future Work (perceptual user studies with ITU-R BT.500, Bradley-Terry model)
- ✅ References complete (33 citations with DOIs - added ITU-R BT.500, Bradley-Terry, Chatbot Arena, real-world examples)
- ✅ Arena-style perceptual assessment mentioned in Infrastructure Contributions
- ✅ Real-world deployment examples added to Introduction (e-commerce, cultural heritage, NYT, AWS)
- ✅ Current length: 6 pages

**Documentation**:
- ✅ AGENTS.md updated with PDF compilation guidelines (only compile when necessary)
- ✅ DATA_COLLECTION_PLAN.md created with detailed procedure
- ✅ Verification script confirms all systems ready

**File Sizes (For Paper Table)**:
| Scene | .ply | .splat | .ksplat | .spz |
|-------|------|--------|---------|------|
| bonsai | 56 MB | 7.1 MB (0.13×) | 5.4 MB (0.10×) | 3.6 MB (0.06×) |
| playroom | 453 MB | 58 MB (0.13×) | 88 MB (0.19×) | 44 MB (0.10×) |
| truck | 400 MB | 52 MB (0.13×) | 78 MB (0.20×) | 33 MB (0.08×) |

### ⏳ What's Missing

**Data Collection** (Blocks paper writing):
- ❌ Ground truth images (15 images: 3 scenes × 5 views) - **Optional**: Can use A vs B comparison instead
- ⏳ Quality metrics: **UI ready**, need to run benchmarks for 12 file comparisons
- ❌ Performance benchmarks (FPS, load time, memory for 12 files)
- ❌ Browser compatibility data (Chrome vs Firefox)

**Optional Enhancements** (Nice-to-have for demo video):
- ⏳ Arena Mode UI: Basic anonymous A/B preference selection (4-6 hours implementation)
  - Note: Full user study (data collection/analysis) is explicitly future work in the paper

**Paper Sections** (Need above data):
- ❌ Section 4: Framework/System Design
- ❌ Section 5: Experiments Setup  
- ❌ Section 6: Results & Analysis
- ❌ Figures (quality charts, performance graphs)

---

## 🎯 The 3 Core Contributions (From Abstract)

Our paper measures these **3 specific things**:

### 1. Perceptual Quality Degradation Across Web Formats
**What**: PSNR/SSIM comparison of .ply vs .splat vs .ksplat vs .spz
**How**: 
- Capture ground truth images from .ply (5 views per scene)
- Render same views from other formats (.splat, .ksplat, .spz)
- Calculate PSNR/SSIM difference
- Document: "Format X loses Y dB PSNR but gains Z% file size reduction"

**Data to Collect**:
- 15 ground truth images (1920×1080 PNG)
- 45 test images (3 scenes × 3 formats × 5 views)
- 45 PSNR values
- 45 SSIM values

**Expected Results**:
- .splat: −0.5 to −1.0 dB PSNR vs .ply (87% smaller)
- .ksplat: −1.0 to −2.0 dB PSNR vs .ply (80-90% smaller)
- .spz: −2.0 to −3.0 dB PSNR vs .ply (92% smaller)

---

### 2. Performance Characteristics Across Browsers
**What**: FPS, load time, memory usage on Chrome vs Firefox
**How**:
- Load each file (12 files) in Chrome and Firefox
- Record FPS (average, 1% low, variance)
- Record load time
- Record memory usage
- Document: "Browser X renders format Y at Z FPS"

**Data to Collect**:
- 24 tests (12 files × 2 browsers)
- Per test: FPS, load time, memory
- Total: 72 data points

**Expected Results**:
- Chrome faster on .ply (better binary parsing)
- Firefox similar on compressed formats
- Safari (optional) slower overall

---

### 3. Temporal Stability During User Interaction
**What**: FPS drop when camera moves (static vs interactive)
**How**:
- Measure FPS during 5-second static view
- Measure FPS during 5-second camera rotation
- Calculate % drop
- Document: "Interactive rendering causes X% FPS drop"

**Data to Collect**:
- 12 tests (one per file)
- Per test: static FPS, interactive FPS, % drop
- Total: 36 data points

**Expected Results**:
- 20-40% FPS drop during interaction
- Larger files have bigger drops (GPU sorting overhead)
- .spz might have less drop (smaller data transfer)

---

## 📅 7-Day Timeline

### Day 1 (Tomorrow) - Abstract + Start Data Collection
**Time**: 4-5 hours

**Tasks**:
1. ✅ **Submit abstract** (already ready in `main.tex`)
2. **Capture ground truth images** (1-2 hours)
   - Load bonsai.ply, capture 5 views, save PNGs
   - Load playroom.ply, capture 5 views, save PNGs
   - Load truck.ply, capture 5 views, save PNGs
   - **Deliverable**: 15 PNG files in `assets/ground-truth/{scene}/`
3. **Test viewer with all formats** (1 hour)
   - Verify all 12 files load without errors
   - Check rendering quality visually
   - Note any bugs/issues
   - **Deliverable**: Verified all formats work

**How to Capture Ground Truth**:
```bash
# Start viewer
cd webgsbench-app && npm run dev

# For each scene (bonsai, playroom, truck):
# 1. Load scene.ply file
# 2. Position camera for each view:
#    - view-front: Center, head-on
#    - view-right: 90° rotation to the right
#    - view-top: Looking down from above
#    - view-angle1: 45° diagonal, medium distance
#    - view-angle2: Close-up detail view
# 3. Take screenshot (Cmd+Shift+4 on macOS)
# 4. Save as: assets/ground-truth/{scene}/{view}.png
# 5. Verify resolution: 1920×1080
```

---

### Day 2 - Quality Benchmarks
**Time**: 2-3 hours

**Tasks**:
1. **Quality comparison UI** ✅ DONE
   - "Compare Quality" button implemented
   - PSNR/SSIM calculations working
   - Camera sync ensures same viewpoint
2. **Run quality benchmarks** (2-3 hours)
   - For each scene (3):
     - For each format (.splat, .ksplat, .spz):
       - For each view (5):
         - Load format, position camera to match ground truth
         - Capture screenshot
         - Calculate PSNR/SSIM vs ground truth
         - Record values
   - **Deliverable**: CSV with 45 rows (3×3×5) of PSNR/SSIM data
3. **Start Section 6 (Results)** (1 hour)
   - Write file size comparison subsection (already have data)
   - Create LaTeX table for quality metrics

**Expected CSV Format**:
```csv
scene,format,view,psnr,ssim
bonsai,splat,view-front,32.5,0.95
bonsai,splat,view-right,31.8,0.94
...
```

---

### Day 3 - Performance Benchmarks
**Time**: 4-6 hours

**Tasks**:
1. **Integrate browser profiler into UI** (1 hour)
   - Display detected browser, GPU, WebGL version
   - Export profile data with benchmark results
2. **Run performance benchmarks** (2-3 hours)
   - For each file (12):
     - For each browser (Chrome, Firefox):
       - Load file, wait for complete load
       - Record: load time, FPS (avg, 1% low, variance), memory
       - Rotate camera for 5 seconds, record interactive FPS
   - **Deliverable**: CSV with 24 rows (12×2) of performance data
3. **Continue Section 6** (1 hour)
   - Write performance comparison subsection
   - Create LaTeX table for performance metrics

**Expected CSV Format**:
```csv
scene,format,browser,load_time_s,static_fps,interactive_fps,memory_mb
bonsai,ply,Chrome,1.2,60,45,120
bonsai,ply,Firefox,1.4,58,43,115
...
```

---

### Day 4 - Write Sections 4-5
**Time**: 6-8 hours (full writing day)

**Tasks**:
1. **Section 4: Framework Design** (3-4 hours)
   - Subsection 4.1: System Architecture
     - Describe viewer app components
     - Explain metrics collection pipeline
     - Show browser profiling system
   - Subsection 4.2: Benchmark Protocol
     - Define test scenes (bonsai, playroom, truck)
     - Define formats (.ply, .splat, .ksplat, .spz)
     - Define metrics (PSNR, SSIM, FPS, load time, memory)
   - Subsection 4.3: Implementation
     - WebGL-based rendering
     - Client-side metrics calculation
     - Data export and reproducibility

2. **Section 5: Experimental Setup** (2-3 hours)
   - Subsection 5.1: Test Scenes
     - Describe bonsai, playroom, truck
     - Source datasets (Mip-NeRF 360, Tanks & Temples)
     - Scene characteristics (size, complexity, indoor/outdoor)
   - Subsection 5.2: Format Characteristics
     - .ply: Original 3DGS format, full SH
     - .splat: Simplified SH, 0.13× compression
     - .ksplat: Variable compression with spatial clustering
     - .spz: Best compression at 0.08×, fixed 64 bytes/splat
   - Subsection 5.3: Evaluation Protocol
     - Hardware: Document via browser profiler
     - Browsers: Chrome, Firefox
     - Views: 5 per scene
     - Metrics: PSNR, SSIM, FPS, load time

3. **Create figures placeholders** (1 hour)
   - Figure 1: System architecture diagram
   - Figure 2: File size comparison bar chart
   - Figure 3: Quality vs file size scatter plot
   - Figure 4: Performance comparison (FPS bar chart)

**Target**: Sections 4-5 complete, ~2-3 pages added

---

### Day 5 - Write Section 6 (Results)
**Time**: 6-8 hours (full writing day)

**Tasks**:
1. **Section 6.1: File Size Analysis** (1 hour)
   - Table with compression ratios ✅ (already have)
   - Key finding: .spz achieves 92% reduction
   - Unexpected finding: .ksplat worse on large scenes

2. **Section 6.2: Quality Metrics** (2-3 hours)
   - Table with PSNR/SSIM values (use Day 2 data)
   - Analysis: Quality vs compression trade-off
   - Finding: .splat preserves >30dB PSNR at 87% reduction
   - Figure: Quality vs file size scatter plot

3. **Section 6.3: Performance Characteristics** (2-3 hours)
   - Table with FPS, load time, memory (use Day 3 data)
   - Analysis: Browser differences
   - Finding: Interactive FPS drops 20-40%
   - Figure: Performance comparison bar chart

4. **Section 6.4: Temporal Stability** (1 hour)
   - Analysis of FPS variance and 1% low FPS
   - Finding: Larger files have less stable FPS
   - Implications for user experience

**Target**: Section 6 complete, ~3-4 pages added

---

### Day 6 - Figures & Polish
**Time**: 6-8 hours

**Tasks**:
1. **Create all figures** (4-5 hours)
   - Figure 1: System architecture (draw.io or similar)
   - Figure 2: File size comparison (Python matplotlib or similar)
   - Figure 3: Quality vs file size scatter (Python)
   - Figure 4: Performance bar chart (Python)
   - Figure 5: Visual quality comparison (side-by-side screenshots)

2. **Polish paper** (2-3 hours)
   - Check all citations have DOIs ✅ (already verified)
   - Fix LaTeX formatting issues
   - Remove overfull boxes (use tips from AGENTS.md lines 450-550)
   - Consistent terminology throughout
   - Remove AI-sounding language (avoid em-dashes, flowery transitions)

3. **Final read-through**
   - Check abstract matches contributions
   - Verify all tables referenced in text
   - Ensure figures have captions

**Target**: 8-10 pages, camera-ready quality

---

### Day 7 - Submit
**Time**: 2-4 hours (buffer day)

**Tasks**:
1. **Final checks** (1 hour)
   - Compile PDF 3 times (pdflatex → bibtex → pdflatex × 2)
   - Check for undefined references
   - Verify all figures appear
   - Confirm page count within limits

2. **Prepare supplementary materials** (1 hour)
   - ZIP benchmark data (CSVs)
   - Include ground truth images
   - Add README with instructions

3. **Submit** (30 min)
   - Upload PDF to submission system
   - Upload supplementary ZIP
   - Fill out metadata (title, abstract, authors)

4. **Buffer time** (1-2 hours)
   - Last-minute fixes
   - Response to any submission issues

---

## 📊 Data Collection Summary

### What We Need to Collect

**Ground Truth Images** (Day 1):
- 15 PNG files (1920×1080)
- Storage: ~50-100 MB total
- Time: 1-2 hours (manual capture)

**Quality Metrics** (Day 2):
- 45 PSNR/SSIM comparisons (3 scenes × 3 formats × 5 views)
- Storage: 1 CSV file (~5 KB)
- Time: 2-3 hours (semi-automated)

**Performance Metrics** (Day 3):
- 24 benchmark runs (12 files × 2 browsers)
- Per run: FPS, load time, memory, interaction FPS
- Storage: 1 CSV file (~5 KB)
- Time: 2-3 hours (mostly automated, need manual browser switching)

**Total Data**: ~100 MB (mostly images), ~10 KB CSV data

---

## 🔧 How to Collect Each Type of Data

### Ground Truth Images (Manual, Day 1) - OPTIONAL

**Alternative**: Use A vs B comparison with camera sync (✅ implemented)

**If using traditional ground truth approach**:
```bash
./scripts/start_viewer.sh
```

**Process** (repeat for bonsai, playroom, truck):
1. Load {scene}.ply in viewer
2. For each view (front, right, top, angle1, angle2):
   - Position camera
   - Press screenshot key (Cmd+Shift+4)
   - Save as: `assets/ground-truth/{scene}/{view}.png`
3. Verify all 5 images are 1920×1080

**Time**: 15 min per scene × 3 = 45 min

---

### Quality Metrics (Now Automated, Day 2)

**Code Implemented**: `webgsbench-app/src/lib/metrics/imageQuality.ts` ✅

**Process** (A vs B Comparison - Recommended):
1. For each scene (bonsai, playroom, truck):
   - Load {scene}.ply in Splat A (reference)
   - For each format (.splat, .ksplat, .spz):
     - Load {scene}.{format} in Splat B
     - Camera syncs automatically to Splat A
     - Navigate to desired viewpoint
     - Click "Compare Quality" button
     - Record PSNR/SSIM values from metrics panel
     - Repeat for 5 different viewpoints
2. Export results to CSV (manually record or add export feature)

**Time**: 1-2 hours (UI already implemented, just data collection)

---

### Performance Metrics (Mostly automated, Day 3)

**Code Partially Exists**: Metrics already collected in viewer

**Process**:
1. Add UI button: "Run Performance Benchmark"
2. For each file:
   - Load file
   - Wait for load complete, record load time
   - Measure FPS for 5 seconds (static)
   - Auto-rotate camera for 5 seconds
   - Measure FPS during rotation (interactive)
   - Record memory usage
   - Append to CSV
3. Download CSV
4. Switch browser (Chrome → Firefox)
5. Repeat steps 2-3

**Time**: 2-3 hours (semi-automated, need manual browser switching)

---

## 📄 Paper Structure (Target 8-10 pages)

### Current (5 pages)
- Abstract (120 words) ✅
- Section 1: Introduction (1 page) ✅
- Section 2: Background and Related Work (1.5 pages) ✅
- Section 3: Motivation (1.5 pages) ✅
- References (1 page) ✅

### To Add (3-5 pages)
- Section 4: Framework Design (1-1.5 pages) - Day 4
- Section 5: Experimental Setup (1 page) - Day 4
- Section 6: Results & Analysis (2-3 pages) - Day 5
  - 6.1: File Size Analysis (0.5 page) ✅ data ready
  - 6.2: Quality Metrics (0.75 page) - needs Day 2 data
  - 6.3: Performance Characteristics (0.75 page) - needs Day 3 data
  - 6.4: Temporal Stability (0.5 page) - needs Day 3 data
- Section 7: Discussion (0.5 page) - Day 6
- Section 8: Conclusion (0.5 page) ✅ already written

### Figures (5-6 total)
- Figure 1: System architecture - Day 6
- Figure 2: File size comparison - Day 6 ✅ data ready
- Figure 3: Quality vs file size - Day 6, needs Day 2 data
- Figure 4: Performance comparison - Day 6, needs Day 3 data
- Figure 5: Visual quality - Day 6, needs Day 1+2 images

---

## 📍 File Locations

### Documentation (Keep These)
- **This file**: `PLAN.md` - 7-day plan and data collection guide
- `RESEARCH_CONTRIBUTION.md` - Research framing and novelty
- `QUICKSTART.md` - Day-by-day implementation guide (older, week-based)
- `BENCHMARK_FILE_SIZES.md` - File size analysis (reference only)
- `CONVERSION_TOOLS.md` - Tool documentation (reference only)
- `DATASET_INVENTORY.md` - Asset inventory (reference only)
- `CITATIONS_VERIFICATION.md` - Literature review (reference only)
- `webgsbench-app/PRD.md` - Product requirements (reference only)

### Paper
- `main.tex` - LaTeX source (5 pages)
- `references.bib` - 26 citations with DOIs
- `main.pdf` - Compiled output

### Data Files
- `assets/` - 12 benchmark files ✅
- `assets/ground-truth/` - Will contain 15 PNG images
- Results CSVs (to be created):
  - `results/quality_metrics.csv` (Day 2)
  - `results/performance_metrics.csv` (Day 3)

### Code
- `webgsbench-app/src/lib/profiling/browserDetect.ts` ✅
- `webgsbench-app/src/lib/metrics/imageQuality.ts` ✅
- `webgsbench-app/` - React viewer app ✅

### Scripts
- `scripts/start_viewer.sh` ✅ - Launch viewer
- `scripts/verify_files.sh` ✅ - Verify all files exist
- `scripts/convert_benchmark_scenes.sh` ✅ - Already executed
- `scripts/setup_ground_truth.sh` ✅ - Already executed

---

## ⚠️ Risks & Mitigation

### Risk 1: Ground Truth Capture Takes Too Long
**Impact**: Blocks quality benchmarks (Day 2)  
**Mitigation**: Reduce from 5 views to 3 views per scene (front, angle, top) = 9 images instead of 15  
**Time Saved**: ~30 minutes

### Risk 2: Quality Differences Too Small
**Impact**: Weak results section  
**Mitigation**: Emphasize file size savings and performance gains, quality is "acceptable" even with compression  
**Alternative Contribution**: Focus on deployment trade-offs, not just quality

### Risk 3: Browser Differences Minimal
**Impact**: Contribution #2 weak  
**Mitigation**: Test on lower-end hardware (integrated GPU), add Safari if available to show larger gaps  
**Alternative**: Focus on format differences (stronger signal)

### Risk 4: Run Out of Time
**Impact**: Incomplete paper  
**Mitigation Plan**:
- **If Day 3-4**: Skip Safari, reduce to Chrome only (still publishable)
- **If Day 5**: Reduce scenes to 2 (bonsai + playroom, skip truck)
- **If Day 6**: Use simpler figures (tables only, no fancy plots)
- **If Day 7**: Submit with "work in progress" note, emphasize framework contribution

---

## 🎯 Success Criteria

### Minimum Viable Paper (6 pages)
- ✅ Abstract
- ✅ Sections 1-3
- ✅ Section 4 (Framework)
- ✅ Section 5 (Experiments)
- ✅ Section 6 (Results) - at least file size + one quality OR performance metric
- ✅ 2-3 figures (system diagram + file size chart + one other)

### Target Paper (8-10 pages)
- All of above
- ✅ Section 6 complete with both quality AND performance
- ✅ 5-6 figures
- ✅ Temporal stability analysis
- ✅ Browser comparison

### Stretch Paper (10+ pages)
- All of above
- ✅ Failure mode case studies
- ✅ Design guidelines for practitioners
- ✅ Future work section with specific research questions

---

## 📞 Quick Start Commands

**Start viewer**:
```bash
./scripts/start_viewer.sh
```

**Verify all files**:
```bash
./scripts/verify_files.sh
```

**Check paper compiles**:
```bash
cd <REPO_ROOT>
pdflatex main.tex && bibtex main && pdflatex main.tex && pdflatex main.tex
```

**View current paper**:
```bash
open main.pdf
```

---

## ✅ Daily Checklist

### Day 1 (Tomorrow)
- [ ] Submit abstract
- [ ] Capture 15 ground truth images (or 9 if time-constrained)
- [ ] Verify all 12 files load in viewer
- [ ] Document any bugs/issues

### Day 2
- [ ] Implement ground truth comparison UI
- [ ] Run quality benchmarks (45 comparisons)
- [ ] Export quality_metrics.csv
- [ ] Start Section 6.1-6.2

### Day 3
- [ ] Integrate browser profiler display
- [ ] Run performance benchmarks (24 tests)
- [ ] Export performance_metrics.csv
- [ ] Continue Section 6.3-6.4

### Day 4
- [ ] Write Section 4 (Framework Design)
- [ ] Write Section 5 (Experimental Setup)
- [ ] Create figure placeholders

### Day 5
- [ ] Complete Section 6 (Results)
- [ ] Write all subsections with data from Days 2-3
- [ ] Draft Discussion section

### Day 6
- [ ] Create all figures
- [ ] Polish paper (formatting, language, citations)
- [ ] Final read-through

### Day 7
- [ ] Final checks and compilation
- [ ] Prepare supplementary materials
- [ ] Submit

---

**This is your single source of truth for the next 7 days. Everything else is reference material.**
