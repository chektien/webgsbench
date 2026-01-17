# Day 1 Morning Checklist - Abstract Submission

**Date**: 2026-01-17 (Tomorrow)  
**Time Estimate**: 30 minutes  
**Critical**: Abstract submission deadline

---

## ☑️ Pre-Submission (5 minutes)

### 1. Read Abstract One Final Time
**Location**: `main.tex` lines 23-25

```latex
While 3D Gaussian Splatting (3DGS) is advancing rapidly in reconstruction quality and compression efficiency, the research community lacks standardized tools to evaluate how these algorithms perform under web deployment constraints, where format fragmentation, browser heterogeneity, and hardware diversity create fundamentally different challenges than desktop evaluation.
We present WebGSBench, a benchmarking framework for systematic evaluation of 3DGS under web-specific conditions.
Our system measures: (1) perceptual quality degradation across web formats (.ply, .splat, .ksplat, .spz), (2) performance characteristics across browsers, and (3) temporal stability during user interaction, a quality dimension invisible to static image metrics.
Through experiments on standard benchmark scenes, we reveal trade-offs and failure modes that existing evaluation pipelines cannot capture.
Code and data are publicly available.
```

**Word Count**: 117 words ✅  
**Tone**: Professional, clear, specific ✅  
**Contributions**: 3 clearly stated ✅  

### 2. Extract Plain Text Version
Run this to get plain text (for web form):
```bash
cd /Users/chek/repos/webgsbench
grep -A 5 "begin{abstract}" main.tex | \
  grep -v "\\begin\|\\end" | \
  sed 's/\\cite{[^}]*}//g' | \
  tr '\n' ' ' | \
  sed 's/  */ /g'
```

Or manually copy-paste and remove LaTeX commands:
- Remove `\cite{...}` 
- Remove line breaks (one continuous paragraph)
- Remove any `~` (non-breaking spaces)

---

## 📝 Submission (10 minutes)

### 3. Log into SIGGRAPH Submission System
- URL: [Check SIGGRAPH website for exact portal]
- Credentials: [Have ready]
- Paper ID: [Note down after creation]

### 4. Fill Required Fields
- **Title**: WebGSBench: A Benchmarking Framework for Web-Based 3D Gaussian Splatting
- **Abstract**: [Paste plain text version from Step 2]
- **Keywords**: 
  - 3D Gaussian Splatting
  - Benchmarking
  - Web Graphics
  - Quality Metrics
  - Real-time Rendering
- **Category**: Systems / Tools (or equivalent)
- **Authors**: [Fill as needed - use "Anonymous" if double-blind]
- **Affiliation**: [Fill or use "Anonymous for Review"]

### 5. Verify Submission
- [ ] Abstract text matches `main.tex` version
- [ ] Word count within limit (usually 150-250 words, we have 117 ✅)
- [ ] No LaTeX commands remain in plain text
- [ ] Authors/affiliations correct (or properly anonymized)
- [ ] Keywords relevant to 3DGS and web graphics
- [ ] Email confirmation received

---

## 🔍 Quick Test (15 minutes)

After abstract submission, test the viewer before data collection:

### 6. Start Viewer (if not running)
```bash
cd /Users/chek/repos/webgsbench/webgsbench-app
npm run dev
```

Wait for: `Local: http://localhost:5174`

### 7. Load Test Scene
1. Open browser: http://localhost:5174
2. **Splat A**: Drag-drop or select `assets/bonsai.ply`
3. **Splat B**: Drag-drop or select `assets/bonsai.splat`
4. Wait for both to load (blue progress bars complete)

### 8. Test Camera Sync
1. Click and drag in Splat A (left side)
2. Verify Splat B (right side) follows camera movement
3. Check "Navigation Controls" panel visible at bottom-left

**Expected**: Both views rotate/pan/zoom together

### 9. Test Quality Metrics
1. Ensure both splats loaded and rendered
2. Click **"Compare Quality"** button (top-right)
3. Wait 2-3 seconds for calculation
4. Check Metrics Panel (right sidebar) shows:
   - **PSNR**: Should be 30-50 dB (reasonable range)
   - **SSIM**: Should be 0.85-1.0 (reasonable range)

**If NaN or 0**: 
- Reload page and try again
- Check browser console for errors
- Verify both splats at same camera position

### 10. Quick Verification
```bash
./scripts/verify_setup.sh
```

Should show all ✓ (green checkmarks)

---

## 📋 Decision Point

After testing, choose afternoon path:

### Option A: Data Collection (RECOMMENDED)
**Why**: Unblocks paper Results section  
**Time**: 2-3 hours  
**Output**: 45 data points in CSV  
**Follow**: `DATA_COLLECTION_PLAN.md`

**Go if**:
- All tests passed ✅
- You have 2-3 uninterrupted hours
- Priority is completing paper

### Option B: Arena UI Implementation
**Why**: Demo-ready feature for video  
**Time**: 4-6 hours  
**Output**: Anonymous A/B comparison interface  
**Follow**: `PRD.md` Section 4

**Go if**:
- Data collection can wait until Day 2
- Want polished demo first
- Have full afternoon available

### Option C: Both (Parallel)
**Why**: Maximize Day 1 progress  
**Time**: Full afternoon (4-6 hours)  
**Strategy**: 
- Start data collection in background
- Build Arena UI while benchmarks run
- Requires multitasking

---

## 🚨 Troubleshooting

### Issue: Viewer not loading files
**Check**:
```bash
ls -lh assets/bonsai.{ply,splat}
```

**Should see**: File sizes (56M and 7.1M)

**Fix**: If missing, check `assets/` directory or re-run conversion

### Issue: Quality metrics show NaN
**Likely Cause**: Camera desync or rendering incomplete

**Fix**:
1. Click "Clear All"
2. Reload both splats
3. Wait longer before clicking "Compare Quality" (5-10 seconds)
4. Ensure both views show rendered scene (not black screen)

### Issue: Camera sync not working
**Check**: Look for console errors in browser DevTools

**Fix**:
1. Refresh page (Cmd+R / Ctrl+R)
2. Verify both splats loaded successfully
3. Try smaller scene (bonsai instead of truck)

### Issue: SIGGRAPH submission portal issues
**Backup Plan**: 
- Save abstract text to separate file
- Take screenshot of any errors
- Note down timestamp of submission attempt
- Contact SIGGRAPH support if needed

---

## ✅ Success Criteria for Morning

- [x] Abstract submitted to SIGGRAPH ⭐ PRIMARY GOAL
- [ ] Email confirmation received
- [ ] Viewer loads and renders bonsai scene correctly
- [ ] Camera sync verified working
- [ ] Quality metrics calculation working (PSNR/SSIM appear)
- [ ] No blocking issues discovered

**If all checked**: ✅ READY for afternoon data collection

---

## 📞 Quick Reference

**Repository**: `/Users/chek/repos/webgsbench/`  
**Viewer**: http://localhost:5174  
**Abstract**: `main.tex` lines 23-25  
**Data Plan**: `DATA_COLLECTION_PLAN.md`  
**Verification**: `./scripts/verify_setup.sh`  

**Next Steps After Morning**:
1. If all tests pass → `DATA_COLLECTION_PLAN.md`
2. If issues found → Debug and test again
3. If UI desired → `PRD.md` Section 4 (Arena Mode)

---

**Good luck with the abstract submission! 🚀**

**Estimated Total Time**: 30 minutes  
**Critical Deadline**: Abstract submission (do not miss)  
**Next Priority**: Data collection (afternoon)
