# WebGSBench Quick Start Guide

**Goal:** Get you coding on Day 1 with clear, actionable tasks

---

## What You're Building (30-second version)

Transform **SplattingArena** (a comparison tool) into **WebGSBench** (a research framework) that:
1. Measures perceptual quality degradation across formats
2. Profiles browser-specific performance characteristics  
3. Identifies failure modes invisible to desktop evaluation
4. Generates evidence-based deployment guidelines

**The Paper's Core Claim:**
> "No existing benchmarking framework captures perceptual and systems-level behavior of 3DGS under Web constraints."

**Your Contribution:**
> First systematic study of 3DGS web deployment across formats, browsers, and quality/performance trade-offs.

---

## Current State (What Works Now)

✅ **SplattingArena App** (`webgsbench-app/`)
- Dual-pane comparison interface
- Loads .splat, .ply, .ksplat, .spz files
- Real-time FPS, memory, load time tracking
- **Camera sync between viewers** (Splat B follows Splat A) ← NEW
- **PSNR/SSIM quality metrics** (one-click comparison) ← NEW
- **Compare Quality button** (captures & analyzes both views) ← NEW
- ~25 test scenes in `assets/`

✅ **Paper Draft** (`main.tex`)
- Introduction, related work, motivation sections
- Table comparing formats
- References to key papers

✅ **Guidelines** (`AGENTS.md`)
- Citation verification requirements
- Academic writing best practices

---

## What's Missing (The Gap)

✅ **Perceptual Quality Metrics** ← DONE
- PSNR, SSIM calculations implemented
- Compare Quality button working
- Camera sync ensures identical viewpoint
- No ground truth images needed (A vs B comparison)

⏳ **Benchmark Data Collection**
- Need: Run benchmarks across 12 file comparisons
- UI is ready, just need to collect data
- Use existing Compare Quality button

❌ **Browser Profiling**
- Need: Detect browser, GPU, WebGL/WebGPU capabilities
- Why: Core to "systems-level behavior" claim

❌ **Automated Benchmarking**
- Need: Run tests automatically, save results
- Why: Reproducibility and comprehensive coverage

❌ **Failure Mode Analysis**
- Need: Identify when/why things break
- Why: Core novelty of the paper

---

## Day 1: Start Here (2-4 hours)

### Task 1: Set Up Your Dev Environment (30 min)

```bash
cd webgsbench-app
npm install
npm run dev
```

**Verify:** App loads at http://localhost:5174, can load a .splat file

### Task 2: Create Browser Profiler (1 hour)

**File:** `src/lib/profiling/browserDetect.ts`

```typescript
export interface BrowserProfile {
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Unknown';
  version: string;
  platform: string;
  gpu: string;
  webglVersion: string;
  webgpuSupported: boolean;
  deviceMemory?: number; // GB
}

export class BrowserProfiler {
  static getProfile(): BrowserProfile {
    const ua = navigator.userAgent;
    
    // Detect browser
    let browser: BrowserProfile['browser'] = 'Unknown';
    let version = '';
    
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      browser = 'Chrome';
      version = ua.match(/Chrome\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browser = 'Safari';
      version = ua.match(/Version\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Firefox')) {
      browser = 'Firefox';
      version = ua.match(/Firefox\/([\d.]+)/)?.[1] || '';
    } else if (ua.includes('Edg')) {
      browser = 'Edge';
      version = ua.match(/Edg\/([\d.]+)/)?.[1] || '';
    }
    
    // Detect GPU
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    let gpu = 'Unknown';
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
    
    // Detect WebGL version
    const webglVersion = gl ? 'WebGL 1.0' : 'None';
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      webglVersion = 'WebGL 2.0';
    }
    
    // Detect WebGPU
    const webgpuSupported = 'gpu' in navigator;
    
    // Detect device memory (Chrome only)
    const deviceMemory = (navigator as any).deviceMemory;
    
    return {
      browser,
      version,
      platform: navigator.platform,
      gpu,
      webglVersion,
      webgpuSupported,
      deviceMemory,
    };
  }
  
  static getProfileString(): string {
    const profile = this.getProfile();
    return `${profile.browser} ${profile.version} | ${profile.gpu} | ${profile.webglVersion}`;
  }
}
```

**Test:** Add to `MetricsPanel.tsx` temporarily:
```typescript
import { BrowserProfiler } from '../../lib/profiling/browserDetect';

// Inside component:
const profile = BrowserProfiler.getProfile();
console.log('Browser Profile:', profile);
```

**Success:** Console shows browser info correctly

---

### Task 3: Implement PSNR Calculation (1 hour)

**File:** `src/lib/metrics/imageQuality.ts` (expand existing)

```typescript
export class ImageQualityCalculator {
  /**
   * Calculate Peak Signal-to-Noise Ratio (PSNR) between two images
   * Higher is better (>30 dB is good, >40 dB is excellent)
   */
  static calculatePSNR(
    imageA: ImageData,
    imageB: ImageData
  ): number {
    if (imageA.width !== imageB.width || imageA.height !== imageB.height) {
      throw new Error('Images must have same dimensions');
    }
    
    const dataA = imageA.data;
    const dataB = imageB.data;
    let sumSquaredError = 0;
    
    // Calculate MSE (Mean Squared Error)
    for (let i = 0; i < dataA.length; i += 4) {
      // RGB channels only (skip alpha)
      const errorR = dataA[i] - dataB[i];
      const errorG = dataA[i + 1] - dataB[i + 1];
      const errorB = dataA[i + 2] - dataB[i + 2];
      
      sumSquaredError += errorR * errorR + errorG * errorG + errorB * errorB;
    }
    
    const numPixels = (dataA.length / 4) * 3; // 3 channels per pixel
    const mse = sumSquaredError / numPixels;
    
    // PSNR = 10 * log10((MAX^2) / MSE)
    // MAX = 255 for 8-bit images
    if (mse === 0) return Infinity; // Perfect match
    
    const psnr = 10 * Math.log10((255 * 255) / mse);
    return psnr;
  }
  
  /**
   * Capture canvas as ImageData for comparison
   */
  static captureCanvas(canvas: HTMLCanvasElement): ImageData {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get 2D context');
    
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  
  /**
   * Compare two viewer canvases
   */
  static compareViewers(
    canvasA: HTMLCanvasElement,
    canvasB: HTMLCanvasElement
  ): { psnr: number } {
    const imageA = this.captureCanvas(canvasA);
    const imageB = this.captureCanvas(canvasB);
    
    const psnr = this.calculatePSNR(imageA, imageB);
    
    return { psnr };
  }
}
```

**Test:** Add button in `AppLayout.tsx`:
```typescript
const handleTestPSNR = () => {
  const canvases = document.querySelectorAll('canvas[data-engine="three.js r182"]');
  if (canvases.length >= 2) {
    const result = ImageQualityCalculator.compareViewers(
      canvases[0] as HTMLCanvasElement,
      canvases[1] as HTMLCanvasElement
    );
    console.log('PSNR:', result.psnr, 'dB');
    alert(`PSNR: ${result.psnr.toFixed(2)} dB`);
  }
};

// Add button in header
<button onClick={handleTestPSNR}>Test PSNR</button>
```

**Success:** Load same scene in both viewers → PSNR = ∞ (perfect match)
Load different scenes → PSNR = 20-40 dB

---

### Task 4: Update Types (15 min)

**File:** `src/types/index.ts`

```typescript
// Add to existing types:

export interface BrowserProfile {
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Unknown';
  version: string;
  platform: string;
  gpu: string;
  webglVersion: string;
  webgpuSupported: boolean;
  deviceMemory?: number;
}

export interface QualityMetrics {
  psnr?: number;
  ssim?: number;
  msssim?: number;
  temporalStability?: number;
}

export interface BenchmarkMetrics {
  // Existing metrics...
  fps: number;
  frameTime: number;
  memoryUsage: number;
  loadTime: number;
  fileSize: number;
  splatCount: number;
  resolution: [number, number];
  frameTimeVariance: number;
  fps1PercentLow: number;
  fps01PercentLow: number;
  frameTimeP50: number;
  frameTimeP95: number;
  frameTimeP99: number;
  
  // New metrics:
  browserProfile?: BrowserProfile;
  qualityMetrics?: QualityMetrics;
}
```

---

## Day 1 Success Criteria

At the end of Day 1, you should have:

✅ Browser profiling working (can detect browser, GPU)
✅ PSNR calculation working (can compare two images)
✅ Understanding of codebase structure
✅ Confidence in next steps

**Time Investment:** 2-4 hours

---

## Day 2-3: Ground Truth Capture (Next Priority)

### Task 5: Create Ground Truth Directory Structure

```bash
mkdir -p assets/ground-truth
```

**Structure:**
```
assets/ground-truth/
├── bonsai/
│   ├── front.png
│   ├── side.png
│   ├── top.png
│   ├── angle-1.png
│   ├── angle-2.png
│   └── metadata.json
├── playroom/
│   ├── front.png
│   └── ...
└── manifest.json
```

### Task 6: Write Ground Truth Capture Script

**File:** `scripts/capture-ground-truth.ts`

```typescript
import * as fs from 'fs';
import * as path from 'path';

interface CameraPosition {
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

const standardViews: CameraPosition[] = [
  { name: 'front', position: [0, 0, 5], target: [0, 0, 0] },
  { name: 'side', position: [5, 0, 0], target: [0, 0, 0] },
  { name: 'top', position: [0, 5, 0], target: [0, 0, 0] },
  { name: 'angle-1', position: [3, 3, 3], target: [0, 0, 0] },
  { name: 'angle-2', position: [-3, 3, 3], target: [0, 0, 0] },
];

// Use Playwright to automate capture
async function captureGroundTruth(sceneName: string, plyFile: string) {
  // Implementation: Load scene, position camera, capture screenshot
  // Save to assets/ground-truth/{sceneName}/{view}.png
}
```

**Manual Alternative (Simpler for MVP):**
1. Load scene in SplattingArena
2. Position camera at standard viewpoints
3. Use browser DevTools: `canvas.toDataURL()` to save image
4. Save manually to `assets/ground-truth/`

**Priority:** Do 3 scenes first (bonsai, playroom, truck)

---

## Day 4-5: Format Conversion (Parallel Work)

### Task 7: Convert Test Scenes to All Formats

**Option A: Manual Conversion** (Recommended for MVP)

1. **Pick 5 representative scenes:**
   - Small: `bonsai.splat` (7MB)
   - Medium: `playroom.splat` (50MB)
   - Large: `truck.ply` (400MB)
   - Object: `baby_yoda.splat` (5MB)
   - Outdoor: `garden-splatfacto.ply` (98MB)

2. **Convert using existing tools:**
   - **PLY → SPLAT**: Use antimatter15/splat viewer export
   - **PLY → KSPLAT**: Use SuperSplat (PlayCanvas)
   - **PLY → SPZ**: Use Scaniverse CLI (if available)

3. **Organize:**
   ```
   assets/test-scenes/
   ├── bonsai/
   │   ├── bonsai.ply
   │   ├── bonsai.splat
   │   ├── bonsai.ksplat
   │   └── bonsai.spz
   ├── playroom/
   │   └── ...
   └── manifest.json
   ```

**Time Estimate:** 1-2 days for manual conversion

**Option B: Automated Conversion** (Defer to Week 2)
- Write Python scripts for batch conversion
- Document conversion parameters for reproducibility

---

## Week 1 Goal

By end of Week 1, you should have:

✅ **Metrics Infrastructure**
- [ ] Browser profiling working
- [ ] PSNR calculation working
- [ ] Types updated

✅ **Ground Truth Dataset**
- [ ] 3 scenes captured (5 views each)
- [ ] Directory structure set up
- [ ] Metadata files created

✅ **Test Scenes Prepared**
- [ ] 5 scenes identified
- [ ] At least 2 scenes converted to all formats
- [ ] File organization complete

✅ **Confidence**
- [ ] Understand what you're building
- [ ] Know next steps for Week 2
- [ ] Have working foundation

---

## Common Issues & Solutions

### Issue 1: "Canvas is blank when capturing"
**Cause:** Three.js renders on next frame
**Solution:** Add delay before capture
```typescript
setTimeout(() => {
  const imageData = captureCanvas(canvas);
  // Process...
}, 100);
```

### Issue 2: "PSNR calculation is slow"
**Cause:** JavaScript is not optimized for image processing
**Solution:** 
- Reduce resolution if needed (1280×720 vs 1920×1080)
- Consider Web Workers for parallel processing
- Acceptable for now, optimize later

### Issue 3: "Don't have tools for format conversion"
**Cause:** Ecosystem is fragmented
**Solution:**
- Start with formats you can easily convert
- Document process for reproducibility
- Manual conversion is acceptable for MVP

### Issue 4: "Don't have Mac for Safari testing"
**Cause:** Safari requires macOS
**Solution:**
- Use BrowserStack for cloud testing (paid)
- Borrow a Mac
- Focus on Chrome/Firefox first, defer Safari

---

## Quick Reference: File Locations

```
webgsbench/
├── assets/                      # Test scenes (existing)
│   ├── *.splat, *.ply          # Current scenes
│   └── ground-truth/           # NEW: Reference images
│       └── {scene}/
│           ├── front.png
│           └── metadata.json
│
├── webgsbench-app/
│   └── src/
│       ├── lib/
│       │   ├── metrics/
│       │   │   └── imageQuality.ts    # NEW: PSNR/SSIM
│       │   └── profiling/             # NEW: Browser detection
│       │       └── browserDetect.ts
│       │
│       ├── hooks/
│       │   ├── useMetrics.ts          # EXPAND: Add quality metrics
│       │   └── useImageQuality.ts     # EXPAND: Add PSNR
│       │
│       └── types/
│           └── index.ts               # UPDATE: Add new types
│
├── scripts/                     # NEW: Automation scripts
│   └── capture-ground-truth.ts
│
├── IMPLEMENTATION_PLAN.md       # Detailed plan
├── ROADMAP.md                   # Visual roadmap
└── QUICKSTART.md                # This file
```

---

## Daily Progress Tracking

Use this template to track your work:

```markdown
## Day 1 - [Date]
### Completed
- [x] Browser profiling implemented
- [x] PSNR calculation working
- [x] Tested on Chrome and Firefox

### In Progress
- [ ] Ground truth capture for bonsai scene

### Blockers
- Need to figure out format conversion for .spz

### Tomorrow
- [ ] Capture ground truth for 2 more scenes
- [ ] Start format conversion
```

---

## Resources

### Implementation References
- **SSIM Algorithm**: https://en.wikipedia.org/wiki/Structural_similarity
- **WebGL Info**: `gl.getParameter(gl.VERSION)`
- **Canvas Capture**: `canvas.toDataURL('image/png')`

### Format Conversion Tools
- **SuperSplat**: https://github.com/playcanvas/supersplat
- **antimatter15/splat**: https://github.com/antimatter15/splat
- **Scaniverse**: https://scaniverse.com/

### Testing
- **Load test scenes**: Drag into SplattingArena
- **Check metrics**: MetricsPanel shows all values
- **Verify quality**: PSNR > 30 dB is good

---

## Questions? Debug Tips

### "Where do I start?"
→ Task 1: Set up dev environment (30 min)

### "What's the most important task?"
→ Task 2: Browser profiling (core to paper claim)

### "I'm stuck on X"
→ Skip it, move to next task. Come back later.

### "How do I test if it's working?"
→ Each task has a "Success" criteria. Check console logs.

### "Can I skip ground truth capture?"
→ No, it's required for PSNR/SSIM. But start with 1 scene, not 10.

### "Do I need all formats immediately?"
→ No, start with 2 formats (.ply and .splat). Add more later.

---

## Next Steps After Quick Start

Once you complete Day 1-5:

1. Review ROADMAP.md for Week 2 plan
2. Start automated benchmark runner
3. Run first comprehensive benchmark
4. Begin analysis (Week 3)

**You're now on track to complete the SIGGRAPH contribution!**

---

**Last Updated:** 2026-01-15
**Estimated Time to Complete Quick Start:** 2-5 days
**Next Milestone:** End of Week 1 deliverables
