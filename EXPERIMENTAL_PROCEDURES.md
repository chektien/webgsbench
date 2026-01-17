# WebGSBench Experimental Procedures

**Project**: WebGSBench - A Benchmark for Evaluating 3D Gaussian Splatting Web Deployment Formats

**Target Conference**: SIGGRAPH Asia 2026 (Paper 1), CHI 2027 (Paper 2), SIGGRAPH 2027 (Paper 3)

**Last Updated**: January 17, 2026

---

## Overview

This document outlines the complete experimental methodology for evaluating 3D Gaussian Splatting web deployment formats across **objective (computed) metrics** and **subjective (human perception) evaluation**.

**Core Hypothesis**: Computed metrics (PSNR/SSIM) may not fully predict human perception of quality differences. We validate this through controlled human studies.

---

## Experimental Design: Two-Phase Approach

### Phase 1: Objective Metrics (Computational)
**Purpose**: Establish baseline quality measurements using standard image quality metrics

**Metrics**:
- PSNR (Peak Signal-to-Noise Ratio)
- SSIM (Structural Similarity Index)
- Pixel-level statistics (avgDiff, percentDifferent)

**Output**: Quantitative quality rankings of formats

### Phase 2: Subjective Evaluation (Human Perception)
**Purpose**: Validate whether computed differences correlate with human-perceived quality

**Method**: Pairwise preference testing via SplattingArena

**Output**: Perceptual quality rankings from human judgments

### Research Question

**Can humans perceive quality differences predicted by PSNR/SSIM?**

**Hypothesis**: 
- High SSIM difference (>0.05): Humans can perceive difference
- Medium SSIM difference (0.02-0.05): Humans may perceive difference (depends on scene/viewing conditions)
- Low SSIM difference (<0.02): Humans cannot reliably perceive difference

---

## Phase 1: Objective Metrics - Computational Quality Evaluation

### 1.1 Setup & Configuration

**Tool**: SplattingArena (webgsbench-app)

**Test Scenes**:
- `bonsai.ply` - Organic geometry, fine details (56.2 MB)
- `truck.ply` - Geometric/mechanical structures (400+ MB)
- `playroom.ply` - Indoor scene, varied textures (200+ MB)

**Format Comparisons**:
- Reference: `.ply` (uncompressed, ground truth)
- Test formats: `.splat`, `.ksplat`, `.spz`

**Comparison Pairs** (per scene):
1. PLY vs Splat
2. PLY vs KSplat
3. PLY vs SPZ
4. Splat vs KSplat
5. Splat vs SPZ
6. KSplat vs SPZ

**Total**: 3 scenes × 6 pairs = **18 format comparisons**

### 1.2 Camera Distance Protocol

**See**: `QUALITY_EVALUATION_PROTOCOL.md` for detailed methodology

**Critical Finding**: PSNR/SSIM are view-dependent. Must capture at close range for meaningful discrimination.

**Standard Distances** (per scene):

1. **Close Inspection** (Primary): 1.5× bounding sphere radius
   - Bonsai: 2.7 units
   - Truck: 3.6 units
   - Playroom: 4.8 units
   - **Use this for paper tables**

2. **Medium Viewing** (Secondary): 3.5× bounding sphere radius
   - Bonsai: 6.3 units
   - Truck: 8.4 units
   - Playroom: 11.2 units
   - **Use this for "real-world" discussion**

3. **Far Overview** (Threshold): 6.0× bounding sphere radius
   - Bonsai: 10.8 units
   - Truck: 14.4 units
   - Playroom: 19.2 units
   - **Use this to show perceptual equivalence**

### 1.3 Data Collection Procedure

**For each scene × format pair × distance:**

1. **Load files**:
   - Splat A: Reference format (e.g., bonsai.ply)
   - Splat B: Test format (e.g., bonsai.ksplat)

2. **Set camera position**:
   - Check distance: Open console, run `viewer.camera.position.length()`
   - Dolly in/out to reach target distance (±0.2 units tolerance)
   - Ensure camera sync is enabled (Splat B follows Splat A)

3. **Verify alignment**:
   - Both viewers show identical camera position
   - Same scene orientation
   - Same resolution (check console output)

4. **Capture metrics**:
   - Click "Compare Quality" button
   - Wait for completion (~500ms)
   - Check console for detailed output

5. **Record data**:
   ```
   Scene: bonsai
   Format A: ply
   Format B: ksplat
   Distance: 2.7 units
   PSNR: 33.2 dB
   SSIM: 0.912
   avgDiff: 4.2
   percentDifferent: 18.5%
   Timestamp: 2026-01-17T17:03:44
   ```

6. **Repeat measurements**: 3 independent captures per configuration
   - Reload files between captures
   - Report: Mean ± StdDev

### 1.4 Expected Results

**Close Distance** (1.5× radius):
- PLY vs KSplat: PSNR 32-35 dB, SSIM 0.90-0.93
- PLY vs SPZ: PSNR 30-33 dB, SSIM 0.88-0.91
- PLY vs Splat: PSNR 35-38 dB, SSIM 0.93-0.95
- KSplat vs SPZ: PSNR 38-42 dB, SSIM 0.94-0.96

**Medium Distance** (3.5× radius):
- All formats: PSNR 45-50 dB, SSIM 0.95-0.98

**Far Distance** (6.0× radius):
- All formats: PSNR 55-60 dB, SSIM 0.98-1.00 (perceptual equivalence)

### 1.5 Data Export

Export to CSV with columns:
```csv
timestamp,scene,formatA,formatB,distance,distanceMultiplier,psnr,ssim,avgDiff,percentDiff,resolution
2026-01-17T17:03:44,bonsai,ply,ksplat,2.7,1.5x,33.2,0.912,4.2,18.5%,544x1470
```

**Location**: `data/objective_metrics.csv`

---

## Phase 2: Subjective Evaluation - Human Perception Study

### 2.1 Study Overview

**Goal**: Determine if humans can perceive the quality differences predicted by PSNR/SSIM computed metrics.

**Method**: Pairwise comparison using SplattingArena interface

**Platform**: Amazon Mechanical Turk (see `MTURK_STUDY.md` for full protocol)

**Timeline**: June-August 2026 (post-SIGGRAPH Asia submission)

### 2.2 Linking Objective & Subjective Evaluation

**Key Innovation**: Use Phase 1 computed metrics to guide Phase 2 human study design.

**Selection Criteria**: Choose format pairs with **varying SSIM differences** to test perceptual thresholds.

#### Format Pair Selection Strategy

Based on Phase 1 results, select pairs representing three SSIM difference ranges:

**High Difference** (SSIM delta >0.05):
- Example: PLY vs SPZ (SSIM 0.89 vs 1.00 → delta 0.11)
- **Hypothesis**: Humans will strongly prefer higher quality format
- **Expected Agreement**: >80% preference consistency

**Medium Difference** (SSIM delta 0.02-0.05):
- Example: PLY vs KSplat (SSIM 0.91 vs 1.00 → delta 0.09)
- **Hypothesis**: Humans will perceive difference, moderate agreement
- **Expected Agreement**: 60-80% preference consistency

**Low Difference** (SSIM delta <0.02):
- Example: KSplat vs Splat at medium distance (SSIM 0.96 vs 0.98 → delta 0.02)
- **Hypothesis**: Humans cannot reliably perceive difference
- **Expected Agreement**: ~50% (random/no preference)

**Control Pair** (Identical formats):
- Example: PLY vs PLY (SSIM 1.00 vs 1.00 → delta 0.00)
- **Purpose**: Attention check, establish noise floor
- **Expected**: 50% ± 5% (no systematic bias)

### 2.3 Human Study Protocol

**See `MTURK_STUDY.md` for complete implementation details.**

#### Study Design Summary

**Task**: Pairwise comparison - "Which scene has better visual quality?"

**Interface**: SplattingArena with side-by-side viewers
- Left viewer: Format A
- Right viewer: Format B
- Camera sync enabled (synchronized rotation/zoom)
- Random assignment (A/B positions counterbalanced)

**Questions per HIT**:
1. Which scene has better overall visual quality? (Left / Right / No difference)
2. Confidence rating: (Very confident / Somewhat confident / Guessing)
3. Which scene appears sharper/clearer? (Left / Right / No difference)
4. Attention check: Did both scenes show the same object? (Yes / No)

**Viewing Conditions**:
- **Fixed camera distance**: Use "Close Inspection" distance (1.5× radius) from Phase 1
- **Fixed scene**: Pre-set camera position (no manual navigation to ensure consistency)
- **Viewing time**: Minimum 10 seconds per pair before response enabled
- **Free rotation**: Allow orbit rotation to examine scene from multiple angles

#### Comparison Matrix

**Scenes**: 3 (bonsai, truck, playroom)

**Format Pairs** (selected based on Phase 1 SSIM):
1. PLY vs KSplat (medium difference)
2. PLY vs SPZ (high difference)
3. KSplat vs SPZ (low difference)
4. PLY vs PLY (control, attention check)

**Total**: 3 scenes × 4 pairs = **12 unique comparisons**

**Redundancy**: 30 workers per comparison (for statistical power)

**Total HITs**: 12 × 30 = **360 HITs**

**Cost Estimate**:
```
Worker payment:   $0.30 × 360 = $108
MTurk fees (40%): $108 × 0.40 = $43
Bonus pool:       $20
Total:            ~$171 (~$200 with buffer)
```

#### Statistical Analysis Plan

**Per format pair, calculate**:

1. **Preference Rate**: % of workers preferring Format A vs B vs No Difference
   - Binomial test: Is preference significantly different from 50%?

2. **Inter-rater Agreement**: Fleiss' Kappa
   - κ > 0.6: Substantial agreement → Perceptible difference
   - κ < 0.4: Poor agreement → Imperceptible difference

3. **Correlation with SSIM**:
   - Spearman rank correlation between SSIM difference and preference strength
   - Question: Does larger SSIM delta predict stronger human preference?

4. **Perceptual Threshold**:
   - Identify minimum SSIM delta where >70% of workers agree on quality difference
   - Report: "SSIM differences <0.XX are imperceptible to humans"

### 2.4 Expected Outcomes

**Primary Research Finding**:

> "While objective metrics (PSNR/SSIM) predict quality differences at close inspection distances, human perception studies reveal that SSIM differences <0.03 are imperceptible in pairwise comparisons. This establishes a perceptual equivalence threshold for web deployment: formats differing by <0.03 SSIM at typical viewing distances are indistinguishable to users."

**Secondary Findings**:

1. **View-Dependent Perception**:
   - Close distance: Humans perceive differences (validates objective metrics)
   - Medium distance: Perception threshold rises (some differences become imperceptible)
   - Far distance: All formats perceptually equivalent (SSIM >0.98)

2. **Scene-Dependent Sensitivity**:
   - Organic scenes (bonsai): Higher perceptual sensitivity to compression
   - Geometric scenes (truck): Lower sensitivity (artifacts less noticeable)
   - Textured scenes (playroom): Medium sensitivity

3. **Format Recommendations**:
   - Based on perceptual threshold, recommend format selection by use case:
     - Close inspection: Use Splat (highest quality)
     - General web viewing: Use KSplat (10× compression, imperceptible loss)
     - Bandwidth-constrained: Use SPZ (highest compression, acceptable quality)

---

## Phase 3: Cross-Validation & Robustness

### 3.1 Browser/Device Variation

**Test on multiple platforms**:
- Chrome (desktop)
- Firefox (desktop)
- Safari (macOS)
- Chrome (Android mobile)
- Safari (iOS mobile)

**Metrics to compare**:
- Do PSNR/SSIM values change across browsers? (should be identical)
- Do human preferences change across devices? (test perceptual consistency)

### 3.2 Scene Diversity

**Add additional test scenes** to validate generalizability:
- Outdoor scenes (e.g., garden, bicycle)
- Indoor scenes (e.g., kitchen, room)
- Large-scale scenes (e.g., counter, stump)

**Analysis**:
- Do perceptual thresholds hold across scene types?
- Scene complexity vs compression sensitivity

### 3.3 Longitudinal Analysis

**Repeat human study 6 months later** (December 2026):
- Same participants (if possible) via MTurk Worker IDs
- Test if preferences change over time
- Control for learning effects

---

## Data Collection Timeline

### January 2026 (Current)
- ✅ Canvas capture fix implemented and verified
- ✅ Quality evaluation protocol established
- ✅ View-dependent quality behavior documented
- 🔄 Phase 1 objective metrics collection (in progress)

### February 2026
- Complete Phase 1 data collection (18 format comparisons × 3 distances × 3 scenes)
- Analyze results, identify format pairs with varying SSIM deltas
- Draft Phase 1 results section for paper

### March-April 2026
- Write SIGGRAPH Asia 2026 paper draft
- Focus on objective metrics, view-dependent quality, format comparison
- Prepare submission (Deadline: ~April 2026)

### May 2026
- Submit IRB protocol for human study (Phase 2)
- Develop MTurk HIT interface (SplattingArena deployment)
- Pilot study with 5-10 participants

### June-July 2026 (Post-submission)
- Run full Phase 2 human perception study (360 HITs)
- Collect and analyze human preference data
- Calculate perceptual threshold

### August 2026
- Write Phase 2 results
- Cross-reference with Phase 1 objective metrics
- Prepare extended version with human study results

### September-October 2026
- If SIGGRAPH Asia paper accepted: Prepare camera-ready with Phase 2 results
- If not accepted: Incorporate Phase 2 into resubmission (CHI 2027)

---

## Success Criteria

### Phase 1: Objective Metrics
- ✅ Reliable PSNR/SSIM measurements (±1 dB PSNR, ±0.01 SSIM across 3 captures)
- ✅ Clear format ranking at close distance
- ✅ Distance-dependent quality curves

### Phase 2: Subjective Evaluation
- ✅ Significant preference (p<0.05) for high-SSIM pairs
- ✅ No significant preference for low-SSIM pairs (perceptual threshold)
- ✅ Correlation between SSIM delta and preference strength (ρ > 0.6)
- ✅ Inter-rater agreement κ > 0.6 for high-difference pairs

### Overall Contribution
- ✅ First benchmark correlating objective and subjective quality for 3DGS web formats
- ✅ Established perceptual equivalence threshold for web deployment
- ✅ Evidence-based format selection guidelines

---

## Data Management

### File Organization

```
webgsbench/
├── data/
│   ├── objective_metrics.csv       # Phase 1 computed metrics
│   ├── human_preferences.csv       # Phase 2 MTurk results
│   ├── cross_validation.csv        # Phase 3 browser/device tests
│   └── analysis/
│       ├── psnr_vs_distance.png    # Figures for paper
│       ├── ssim_correlation.png
│       └── perceptual_threshold.png
├── assets/                         # Test scene files
├── webgsbench-app/                 # SplattingArena tool
└── scripts/
    ├── collect_metrics.sh          # Automated data collection
    └── analyze_results.R           # Statistical analysis
```

### Data Format Standards

**Objective Metrics CSV**:
```csv
timestamp,scene,formatA,formatB,distance,distance_multiplier,psnr_db,ssim,avg_diff,pct_different,resolution,camera_x,camera_y,camera_z,replicate
2026-01-17T17:03:44,bonsai,ply,ksplat,2.7,1.5,33.2,0.912,4.2,18.5,544x1470,1.45,1.18,6.06,1
```

**Human Preferences CSV**:
```csv
hit_id,worker_id,scene,formatA,formatB,distance,ssim_delta,preference,confidence,sharpness,attention_check,duration_sec,timestamp
H123,W456,bonsai,ply,ksplat,2.7,0.088,left,very_confident,left,yes,28.4,2026-06-15T10:23:11
```

---

## Ethical Considerations

### IRB Requirements

**Study Title**: Perceptual Quality Evaluation of 3D Web Graphics

**Participant Population**: Adult internet users (18+) via MTurk

**Consent**: Informed consent form displayed before task

**Data Privacy**:
- Anonymous worker IDs (no PII collected)
- No tracking beyond task completion
- Data used only for research publication

**Risks**: Minimal (viewing 3D scenes on screen)

**Benefits**: Contributes to improved web graphics quality standards

### Compensation

**Fair Payment**: $0.30 per HIT (~2 min) = $9/hour effective rate
- Above MTurk minimum wage guidelines
- Competitive with academic studies

**Bonus Pool**: $20 for high-quality workers (attention check accuracy >95%)

---

## References to Other Documents

- **QUALITY_EVALUATION_PROTOCOL.md**: Detailed camera distance methodology
- **MTURK_STUDY.md**: Complete MTurk study implementation guide
- **PLAN.md**: Overall project roadmap and paper strategy
- **QUICKSTART.md**: Getting started with SplattingArena tool

---

## Summary: Experimental Workflow

**Phase 1** → Compute PSNR/SSIM at close range → Establish quantitative quality rankings

**↓**

**Phase 2** → Human perception study with varying SSIM pairs → Test if humans perceive computed differences

**↓**

**Outcome** → Perceptual equivalence threshold for web deployment → Evidence-based format recommendations

**Key Innovation**: Bridging objective metrics and subjective perception to validate that SSIM differences predict human-perceivable quality loss.
