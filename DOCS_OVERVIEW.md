# WebGSBench Documentation Overview

**Last Updated**: 2026-01-16

---

## 📍 Single Source of Truth

**Use This**: `PLAN.md` - Your 7-day paper plan with day-by-day tasks

---

## 📚 All Documentation Files

### Primary Planning Document (READ THIS)
1. **`PLAN.md`** ⭐ **START HERE**
   - 7-day timeline with daily tasks
   - Data collection guide (what, how, when)
   - Paper structure (5 pages → 8-10 pages)
   - Risk mitigation strategies
   - **This is your single source of truth**

---

### Scene Selection & Dataset Strategy (NEW)
2. **`SCENE_SELECTION.md`** 📊 **NEW - Important for Paper**
   - Phenomenon-driven scene selection rationale
   - 6-scene portfolio (or 3-scene minimal)
   - Stress factor coverage matrix
   - Cross-dataset justification
   - **Decision**: Use 3 or 6 scenes based on Day 1 progress
   
3. **`paper_scene_selection.tex`** 📝 **LaTeX for Paper**
   - Ready-to-insert section for main.tex
   - Table with all 6 scenes
   - Includes new Deep Blending citation
   - Insert after line 320 in main.tex (before "Potential Challenges")

---

### Research Context (Reference Only)
4. **`RESEARCH_CONTRIBUTION.md`**
   - Detailed research framing
   - 3 core contributions explained
   - Hypothesis for each contribution
   - Failure modes to detect

5. **`CITATIONS_VERIFICATION.md`**
   - Literature review verification
   - All 26+1 citations checked with DOIs
   - Second-order hallucination prevention

6. **`literature_review.md`**
   - Full literature analysis
   - Related work comparison

---

### Technical Reference
7. **`QUICKSTART.md`**
   - Week-by-week implementation guide (older)
   - Code snippets (browser profiler, etc.)
   - Still useful for code examples

8. **`BENCHMARK_FILE_SIZES.md`**
   - File size analysis for 3 scenes (bonsai, playroom, truck)
   - Compression ratios documented
   - LaTeX table ready for paper

9. **`CONVERSION_TOOLS.md`**
   - Tool documentation (gsconverter, splat-transform)
   - Conversion commands
   - Tool capabilities

10. **`DATASET_INVENTORY.md`**
    - All 24 scenes you have
    - Size categories
    - Canonical dataset info (Mip-NeRF 360, Tanks & Temples)

11. **`webgsbench-app/PRD.md`**
    - Product requirements for viewer app
    - Feature list
    - User personas

---

### Agent Instructions (For Claude)
12. **`AGENTS.md`**
    - Academic writing guidelines
    - Citation verification rules
    - LaTeX formatting tips

13. **`CLAUDE.md`**
    - Similar to AGENTS.md
    - Backup copy

---

## 🎯 The 3 Core Contributions (Quick Reference)

From the paper abstract (main.tex lines 23-25):

1. **Perceptual quality degradation** across web formats (.ply, .splat, .ksplat, .spz)
2. **Performance characteristics** across browsers (Chrome, Firefox)
3. **Temporal stability** during user interaction (static vs interactive FPS)

**Data Needed**:
- Contribution #1 → 45 or 90 PSNR/SSIM values (3 or 6 scenes)
- Contribution #2 → 24 or 48 browser benchmarks (3 or 6 scenes)
- Contribution #3 → 12 or 24 stability tests (3 or 6 scenes)

---

## 📊 Scene Selection Decision Tree

### Option A: 3 Scenes (Minimal, Faster)
**Scenes**: bonsai, truck, flower
**Time**: 45 min ground truth, 2-3 hours benchmarks
**Coverage**: Good (3 stress factors, 3 sizes, 2 environments)
**Paper Strength**: Sufficient for acceptance

**Choose This If**:
- Day 1 takes longer than expected
- Abstract submission delayed
- Any unexpected blockers

### Option B: 6 Scenes (Recommended, Stronger)
**Scenes**: bonsai, garden, playroom, truck, train, flower
**Time**: 1.5 hours ground truth, 4-5 hours benchmarks
**Coverage**: Excellent (6 stress factors, 4 datasets, comprehensive)
**Paper Strength**: Stronger claims, better cross-dataset validation

**Choose This If**:
- Day 1 goes smoothly
- Abstract submitted early
- No major blockers

**Decision Point**: End of Day 1 after ground truth capture starts

---

## 📝 How to Use the Scene Selection in Your Paper

### Step 1: Add Citation to references.bib
✅ **Already done** - Deep Blending citation added as `hedman2018deepblending`

### Step 2: Insert Section into main.tex
Location: After line 320 (after "Related Systems and Differentiation")

```bash
# Open the paper
vim /Users/chek/repos/webgsbench/main.tex

# Go to line 321 (before "Potential Challenges")
# Insert contents of paper_scene_selection.tex
```

Or programmatically:
```bash
# The section is ready in paper_scene_selection.tex
# It includes:
# - Section 4: Scene Selection and Evaluation Methodology
# - Table X: Curated Scenes (6 scenes)
# - Cross-dataset justification
# - Stress factor coverage
```

### Step 3: Update Paper Structure
After insertion, your paper will have:
- Section 1: Introduction ✅
- Section 2: Background ✅
- Section 3: Motivation ✅
- Section 4: Scene Selection ✅ (NEW)
- Section 5: Proposed Contributions ✅
- Section 6: Related Systems ✅
- Section 7: Framework Design (TODO - Day 4)
- Section 8: Experiments (TODO - Day 4)
- Section 9: Results (TODO - Day 5)
- Section 10: Conclusion ✅

---

## 🚀 Immediate Next Steps

### Tomorrow (Day 1)
1. ✅ Submit abstract (ready in main.tex)
2. **Decide**: 3 or 6 scenes?
3. **If 6 scenes**: Convert 3 more scenes (garden, train, flower)
   ```bash
   # Garden: already have garden-splatfacto.ply
   gsconverter -i assets/garden-splatfacto.ply -o assets/garden.splat -f splat
   gsconverter -i assets/garden-splatfacto.ply -o assets/garden.ksplat -f ksplat
   gsconverter -i assets/garden-splatfacto.ply -o assets/garden.spz -f spz
   
   # Train: already have train.ply
   gsconverter -i assets/train.ply -o assets/train.splat -f splat
   gsconverter -i assets/train.ply -o assets/train.ksplat -f ksplat
   gsconverter -i assets/train.ply -o assets/train.spz -f spz
   
   # Flower: have flower.splat, need others
   gsconverter -i assets/flower.splat -o assets/flower.ply -f ply
   gsconverter -i assets/flower.splat -o assets/flower.ksplat -f ksplat
   gsconverter -i assets/flower.splat -o assets/flower.spz -f spz
   ```
   Time: ~1-1.5 hours

4. **Capture ground truth** (15 or 30 images)
5. **Insert scene selection section** into main.tex

### Day 2-7
Follow PLAN.md timeline

---

## 📌 Key Files Summary

| File | Purpose | Status | Action |
|------|---------|--------|--------|
| `PLAN.md` | 7-day timeline | ✅ Complete | **Use this as your guide** |
| `SCENE_SELECTION.md` | Scene rationale | ✅ Complete | Read for context |
| `paper_scene_selection.tex` | LaTeX section | ✅ Ready | Insert into main.tex |
| `main.tex` | Paper draft | ⏳ 5 pages | Add scene selection section |
| `references.bib` | Citations | ✅ 27 citations | Deep Blending added |
| `BENCHMARK_FILE_SIZES.md` | File sizes | ✅ 3 scenes | Reference for tables |

---

## ❓ Quick FAQ

**Q: Should I use 3 or 6 scenes?**
A: Start with 3 (bonsai, truck, flower). If Day 1 goes well, convert 3 more (garden, train already done, just need flower).

**Q: Where do I find the scene selection rationale for the paper?**
A: In `paper_scene_selection.tex` - ready to insert into main.tex

**Q: What's the difference between PLAN.md and SCENE_SELECTION.md?**
A: PLAN.md = What to do each day. SCENE_SELECTION.md = Why we chose these scenes (for paper writing).

**Q: Do I need all these documentation files?**
A: No. **Primary**: PLAN.md. **Secondary**: SCENE_SELECTION.md. **Reference**: Everything else.

**Q: Which scenes are already converted to all formats?**
A: Bonsai, playroom, truck (all 4 formats ✅)

**Q: Which scenes need conversion?**
A: Garden (have .ply, need .splat/.ksplat/.spz), Train (have .ply, need .splat/.ksplat/.spz), Flower (have .splat, need .ply/.ksplat/.spz)

---

## 🎓 For SIGGRAPH Reviewers (Paper Positioning)

**Our Approach**: Phenomenon-driven scene selection
- ❌ Not dataset benchmarking
- ❌ Not method ranking
- ✅ Stress factor isolation
- ✅ Web deployment failure mode analysis

**Why Cross-Dataset**:
- Avoids dataset-specific biases
- Shows Web constraints are universal, not dataset-specific
- Each scene = measurement probe for specific failure mode

**Justification in Paper**:
- Section 4 (new): Explains rationale
- Table X: Lists all scenes with stress factors
- Subsections: Cross-dataset justification, stress factor coverage

**Strength**:
- Novel approach for SIGGRAPH (non-CVPR benchmarking)
- Focus on interpretable failure modes
- Actionable insights for practitioners

---

**Last Updated**: 2026-01-16
**Next Update**: After Day 1 (scene selection decision made)
