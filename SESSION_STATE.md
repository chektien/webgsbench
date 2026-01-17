# Session State - 2026-01-16 Evening

**Last Activity**: Finalized naming strategy and MTurk study protocol

---

## ✅ What We Just Completed

### 1. Updated Chatbot Arena Citation
- Changed from arXiv preprint to **ICML 2024** publication
- File: `references.bib` lines 282-292
- Now properly cites peer-reviewed conference paper

### 2. Three-Paper Strategy Finalized
**Created comprehensive documentation**:
- **`ARENA_STRATEGY.md`**: Complete publication strategy for all 3 papers
  - SIGGRAPH Asia 2026 (benchmarking)
  - CHI 2027 (methodology) → SIGGRAPH 2027 (findings) fallback
  - Timeline, risk mitigation, content boundaries

- **`MTURK_STUDY.md`**: Complete MTurk protocol
  - 540 HITs, $300 budget
  - IRB application guide
  - Technical implementation plan
  - Quality control measures
  - Data analysis workflow

- **`PLAN.md`**: Updated header with links to both strategy docs

### 3. Naming Decision: Split Strategy ✅
**Final decision**: WebGSBench → SplatArena split
- **WebGSBench** = SIGGRAPH Asia paper (objective benchmarking)
- **SplatArena** = CHI/SIGGRAPH papers (perceptual evaluation)
- Semantic clarity: infrastructure vs human evaluation
- No changes needed now - continue with WebGSBench for first paper

---

## 📋 Current Project State

### Repository: `/Users/chek/repos/webgsbench/`

**Status**: Ready for data collection (SIGGRAPH Asia paper)

**Services Running**:
- ✅ Viewer app: http://localhost:5174 (Vite dev server)
- ✅ Node.js v24.12.0
- ✅ All 12 benchmark files present and verified

**Paper Status** (`main.tex`):
- ✅ Abstract ready (117 words, lines 23-25)
- ✅ 6 pages complete (Sections 1-10)
- ✅ 33 citations with DOIs (including ICML 2024 Chatbot Arena)
- ⏳ Missing: Results section (needs data from benchmarking)

**Data Collection**:
- ✅ Template ready: `data/quality_results.csv`
- ✅ Procedure documented: `DATA_COLLECTION_PLAN.md`
- ⏳ Not started yet (2-3 weeks of work)

---

## 🎯 Three-Paper Publication Strategy

### Paper 1: SIGGRAPH Asia 2026 (Dec 2026)
**Name**: WebGSBench
**Title**: "WebGSBench: Benchmarking 3D Gaussian Splatting for Web Deployment"
**Focus**: Objective metrics, performance benchmarks, framework
**Deadline**: May 2026
**Status**: In progress (need to collect data)

### Paper 2: CHI 2027 (Apr 2027)
**Name**: SplatArena
**Title**: "SplatArena: Crowdsourced Perceptual Quality Assessment of 3D Gaussian Splatting"
**Focus**: Arena Mode methodology, MTurk study design
**Deadline**: September 4, 2026
**Status**: Strategy documented, waits for SIGGRAPH Asia submission

### Paper 3: SIGGRAPH 2027 (July 2027)
**Name**: SplatArena (findings)
**Title**: "When Metrics Fail: Perceptual Findings from SplatArena"
**Focus**: Human preferences vs objective metrics
**Deadline**: February 2027
**Status**: Contingent on CHI outcome (combined paper if CHI rejects)

---

## 📊 MTurk Study Details

**Platform**: Amazon Mechanical Turk
**Study Design**: Pairwise comparisons (A vs B)
**Scale**: 540 HITs (3 scenes × 6 pairs × 3 viewpoints × 10 workers)
**Budget**: ~$300 USD
**Timeline**: 
- June 2026: IRB approval, deploy interface
- July 2026: Run study (1-2 weeks for data collection)
- August 2026: Analysis + write CHI paper
- Sept 4, 2026: Submit CHI 2027

**Why MTurk Works**:
- ✅ Simple task (no expertise needed)
- ✅ Scalable and fast (days, not months)
- ✅ Cost-effective ($300 vs $1000s for lab study)
- ✅ Strong precedent (Chatbot Arena used crowdsourcing)

---

## 🎨 Naming Strategy

### Split Approach (Decided)

**WebGSBench** (SIGGRAPH Asia):
- Infrastructure/framework
- Objective metrics
- Web deployment focus
- Professional/technical branding

**SplatArena** (CHI + SIGGRAPH):
- Perceptual evaluation platform
- Crowdsourced methodology
- Human preferences
- Fun/memorable branding

**Citation Chain**:
```
SIGGRAPH Asia 2026: WebGSBench (infrastructure)
       ↓ cites
CHI 2027: SplatArena (built on WebGSBench)
       ↓ cites both
SIGGRAPH 2027: SplatArena findings
```

**Domain Strategy**:
- webgsbench.org (optional) - documentation
- splatarena.com (register for CHI) - public platform

---

## 📁 Key Files Updated This Session

1. **`references.bib`** (line 282-292)
   - Updated Chatbot Arena citation to ICML 2024
   
2. **`ARENA_STRATEGY.md`** (NEW)
   - Complete three-paper strategy
   - Timeline and decision points
   - Content boundaries to avoid overlap
   
3. **`MTURK_STUDY.md`** (NEW)
   - Detailed MTurk protocol
   - IRB guidance
   - HIT design mockups
   - Quality control measures
   - Data analysis plan
   
4. **`PLAN.md`** (header updated)
   - Now links to ARENA_STRATEGY.md and MTURK_STUDY.md
   - Shows three-paper strategy

---

## ⏭️ Next Steps (Priority Order)

### Immediate (After Reboot)
1. Verify services still running:
   ```bash
   cd /Users/chek/repos/webgsbench
   ./scripts/verify_setup.sh
   ```
2. If viewer stopped, restart:
   ```bash
   cd webgsbench-app && npm run dev
   ```

### Current Focus: SIGGRAPH Asia Paper
**Priority**: Data collection (2-3 weeks)
1. Follow `DATA_COLLECTION_PLAN.md` procedure
2. Collect PSNR/SSIM for 45 comparisons
3. Record FPS, load time, memory usage
4. Test across Chrome, Firefox, Safari

### After Data Collection
1. Write Results section
2. Write Framework/System Design section
3. Create 5-6 figures
4. Polish and submit (May 2026)

### After SIGGRAPH Asia Submission (May 2026)
1. Submit IRB application
2. Deploy Arena Mode on HTTPS
3. Run MTurk pilot (10 workers)
4. Run full study (540 HITs)
5. Write CHI paper (August 2026)
6. Submit CHI (Sept 4, 2026)

---

## 🔗 Important Links

**Documentation**:
- Main plan: `PLAN.md`
- Arena strategy: `ARENA_STRATEGY.md`
- MTurk protocol: `MTURK_STUDY.md`
- Data collection: `DATA_COLLECTION_PLAN.md`
- Scene selection: `SCENE_SELECTION.md`
- Academic guidelines: `AGENTS.md`

**Paper Files**:
- LaTeX: `main.tex` (6 pages)
- References: `references.bib` (33 citations)
- PDF: `main.pdf` (last compiled)

**Data**:
- Template: `data/quality_results.csv`
- Assets: `assets/` (12 files: bonsai, truck, playroom × 4 formats)

**App**:
- Source: `webgsbench-app/src/`
- Metrics: `webgsbench-app/src/lib/metrics/imageQuality.ts`
- Running: http://localhost:5174

---

## 💡 Key Decisions Made

1. ✅ **Three-paper strategy** instead of two
2. ✅ **MTurk for user study** (not lab participants)
3. ✅ **Split naming**: WebGSBench (infrastructure) + SplatArena (perceptual)
4. ✅ **CHI 2027 first**, then SIGGRAPH 2027 (with fallback if CHI rejects)
5. ✅ **Chatbot Arena citation updated** to ICML 2024
6. ✅ **540 HITs, $300 budget** for MTurk study

---

## 🚫 Not Changing Yet

**Keep current approach for now**:
- Repository name: `webgsbench` ✅
- Paper name: "WebGSBench" ✅
- Focus: SIGGRAPH Asia data collection ✅

**Changes come later** (after May 2026 submission):
- Add `arena/` directory for SplatArena code
- Register splatarena.com domain
- Implement MTurk interface
- Run user study

---

## 🎯 Success Criteria

**Minimum (1 paper)**:
- ✅ SIGGRAPH Asia 2026 accepted

**Good (2 papers)**:
- ✅ SIGGRAPH Asia + CHI accepted
- OR ✅ SIGGRAPH Asia + SIGGRAPH 2027 accepted

**Excellent (3 papers)**:
- ✅ All three accepted (infrastructure + methodology + findings)

---

## 📊 Budget Summary

**SIGGRAPH Asia paper**: $0 (just time)
**MTurk study**: ~$300 (worker pay + platform fees)
**Hosting** (Arena Mode): ~$20-30/month (Vercel + database)
**Total**: ~$350 for all three papers

---

## ⏰ Timeline Summary

```
Now - February 2026 (4 weeks):
  → Data collection for SIGGRAPH Asia

March - April 2026 (8 weeks):
  → Write missing sections (Results, Framework)
  → Create figures

May 2026:
  → Submit SIGGRAPH Asia ✅
  → Start IRB application

June - July 2026:
  → Deploy Arena Mode
  → Run MTurk study (1-2 weeks)

August 2026:
  → Write CHI paper
  
September 4, 2026:
  → Submit CHI 2027 ✅

September 2026:
  → SIGGRAPH Asia notification

December 2026:
  → Present at SIGGRAPH Asia (if accepted)

January 2027:
  → CHI notification
  → Start writing SIGGRAPH 2027 paper

February 2027:
  → Submit SIGGRAPH 2027 ✅

July 2027:
  → Present at SIGGRAPH 2027 (if accepted)
```

---

## 🔄 When You Return

**Quick checklist**:
1. [ ] Services running? (check http://localhost:5174)
2. [ ] All documentation reviewed? (read ARENA_STRATEGY.md and MTURK_STUDY.md)
3. [ ] Ready to start data collection? (follow DATA_COLLECTION_PLAN.md)
4. [ ] Any questions about the three-paper strategy?

**Main focus**: Get SIGGRAPH Asia paper data collected (2-3 weeks of work)

**Don't worry about**: Arena Mode implementation, MTurk, CHI paper (all after May 2026)

---

**Session saved**: 2026-01-16 23:45
**Ready to continue after reboot** ✅
