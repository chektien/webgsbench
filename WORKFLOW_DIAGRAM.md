# WebGSBench Researcher Workflow

## Three Modes for Different Research Stages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         WEBGSBENCH WORKFLOWS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│  WORKFLOW 1:         │      │  WORKFLOW 2:         │      │  WORKFLOW 3:         │
│  Iterative Dev       │ ───▶ │  Paper Evaluation    │ ───▶ │  Method Submission   │
│  (Interactive Mode)  │      │  (Batch Mode)        │      │  (API Mode)          │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
         │                             │                              │
         │                             │                              │
         ▼                             ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│ • Quick validation   │      │ • Complete 6-scene   │      │ • Standardized       │
│ • 1-2 scenes         │      │   benchmark          │      │   protocol           │
│ • Visual debugging   │      │ • All 5 viewpoints   │      │ • Public leaderboard │
│ • Immediate feedback │      │ • Statistical rigor  │      │ • Version control    │
│                      │      │ • 3 replicates       │      │                      │
│ HOTKEYS:             │      │                      │      │                      │
│ 1-5 = Viewpoints     │      │ TEMPLATE:            │      │ OUTPUT:              │
│ C = Capture          │      │ paper-evaluation     │      │ Leaderboard entry    │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
         │                             │                              │
         └──────────────┬──────────────┴──────────────┬───────────────┘
                        │                             │
                        ▼                             ▼
           ┌──────────────────────┐      ┌──────────────────────┐
           │  PUBLICATION-READY   │      │  REPRODUCIBILITY     │
           │  OUTPUTS             │      │  PACKAGE             │
           ├──────────────────────┤      ├──────────────────────┤
           │ • Figures (PNG)      │      │ • Complete metadata  │
           │ • Tables (CSV)       │      │ • Browser/GPU info   │
           │ • LaTeX format       │      │ • Camera positions   │
           │ • Side-by-sides      │      │ • Timestamps         │
           └──────────────────────┘      └──────────────────────┘
```

## Interface Modes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INTERFACE MODES                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│   INTERACTIVE MODE      │  │     BATCH MODE          │  │      API MODE           │
│   (Web Browser)         │  │   (Automated)           │  │   (Programmatic)        │
├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤
│                         │  │                         │  │                         │
│  ┌─────┐   ┌─────┐     │  │  Queue:                 │  │  REST API:              │
│  │ A   │   │ B   │     │  │  • 6 scenes             │  │  POST /api/submit       │
│  │     │   │     │     │  │  • 3 formats            │  │                         │
│  └─────┘   └─────┘     │  │  • 5 viewpoints         │  │  CLI:                   │
│                         │  │  • 3 replicates         │  │  webgsbench submit      │
│  Drag-and-drop files    │  │                         │  │                         │
│  Click camera presets   │  │  Runs: Overnight        │  │  Python:                │
│  Click export buttons   │  │  Output: Full report    │  │  client.submit()        │
│                         │  │                         │  │                         │
│  BEST FOR:              │  │  BEST FOR:              │  │  BEST FOR:              │
│  • Development          │  │  • Paper evaluation     │  │  • CI/CD integration    │
│  • Quick tests          │  │  • Comprehensive study  │  │  • Automated pipelines  │
│  • Visual comparison    │  │  • Reproducible data    │  │  • Systematic studies   │
│                         │  │                         │  │                         │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

## Flexibility: Any Scene, Any Reference

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLEXIBLE DATASET INTEGRATION                              │
└─────────────────────────────────────────────────────────────────────────────┘

  RESEARCHER'S SCENE        WEBGSBENCH PROCESSING           OUTPUT
  ────────────────────      ─────────────────────           ───────

  ┌─────────────────┐       ┌─────────────────┐            ┌─────────────────┐
  │ my_capture.ply  │──────▶│  Auto-detect    │───────────▶│ Quality metrics │
  │                 │       │  scene type     │            │ • PSNR          │
  │ Custom capture  │       │                 │            │ • SSIM          │
  │ from lab        │       │ Apply camera    │            │                 │
  │                 │       │ presets         │            │ Performance     │
  └─────────────────┘       │                 │            │ • FPS           │
                            │ Generate        │            │ • Memory        │
  ┌─────────────────┐       │ comparison      │            │                 │
  │ product_scan.   │──────▶│ report          │            │ Comparison      │
  │ splat           │       │                 │            │ vs baseline     │
  │                 │       └─────────────────┘            └─────────────────┘
  │ E-commerce      │
  │ dataset         │
  └─────────────────┘

  ┌─────────────────┐
  │ method_output.  │      ┌─────────────────┐
  │ ksplat          │─────▶│ Use any format  │
  │                 │      │ as reference    │
  │ Your algorithm  │      │ (not just PLY)  │
  │ output          │      │                 │
  └─────────────────┘      └─────────────────┘
```

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE DATA FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

  INPUT                          PROCESSING                       OUTPUT
  ─────                          ──────────                       ───────

  ┌──────────────┐
  │ bonsai.ply   │               ┌──────────────────┐
  │ (Reference)  │──────────────▶│  Load in Viewer  │
  └──────────────┘               │  A               │
                                 └────────┬─────────┘
                                          │
  ┌──────────────┐                        │
  │ bonsai.spz   │               ┌────────▼─────────┐
  │ (Compressed) │──────────────▶│  Load in Viewer  │
  └──────────────┘               │  B               │
                                 └────────┬─────────┘
                                          │
                                          ▼
                                 ┌──────────────────┐
                                 │ Camera Sync:     │
                                 │ B follows A      │
                                 └────────┬─────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              │                           │                           │
              ▼                           ▼                           ▼
    ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
    │ 1. Front View   │        │ 2. Close-Up     │        │ 3. Wide Angle   │
    │    (Press 1)    │        │    (Press 2)    │        │    (Press 3)    │
    └────────┬────────┘        └────────┬────────┘        └────────┬────────┘
             │                          │                          │
             └──────────────────────────┼──────────────────────────┘
                                        │
                                        ▼
                            ┌─────────────────────┐
                            │ CAPTURE ACTIONS     │
                            │ • Press C: Screenshot
                            │ • Press E: CSV Export
                            │ • Auto: PSNR/SSIM   │
                            └──────────┬──────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │ Screenshot      │    │ CSV Data        │    │ Quality Report  │
    │ • 1920×1080 PNG │    │ • 35+ columns   │    │ • PSNR: 34.2 dB │
    │ • Auto-named    │    │ • All metadata  │    │ • SSIM: 0.97    │
    │ • Side×Side     │    │ • Reproducible  │    │ • Browser info  │
    └─────────────────┘    └─────────────────┘    └─────────────────┘

    FILENAME:                  COLUMNS:
    bonsai_spz_front_          timestamp, scene, format,
    A_2026-01-30.png           psnr, ssim, fps, memory,
                               browser, gpu, camera_pos...
```

## Keyboard Shortcuts Reference

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      KEYBOARD SHORTCUTS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

   SHORTCUT        ACTION                    CONTEXT
   ────────        ──────                    ───────

   1-5             Apply camera preset       Anytime (not in input)
                   1 = Front Center
                   2 = Close-Up Detail
                   3 = Wide Angle
                   4 = Left 45°
                   5 = Right 45°

   C               Open Export tab           Anytime
                   (Capture screenshot)

   E               Open Export tab           Anytime
                   (Export CSV data)

   B               Open Batch Test tab       Anytime

   M               Open Metrics tab          Anytime

   P               Toggle camera preset      Anytime
                   panel visibility

   Navigation:
   ───────────
   Left-click +    Rotate camera
   Drag

   Right-click +   Pan camera
   Drag

   Scroll /        Dolly (zoom) in/out
   Pinch
```

## Batch Test Templates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BATCH TEST TEMPLATES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

  TEMPLATE              SCENES    FORMATS    VIEWPOINTS    REPLICATES   TIME
  ────────              ──────    ───────    ──────────    ──────────   ────

  ┌─────────────────┐   6         All 3      All 5         3            ~2 hrs
  │ Paper           │   (full)    (.splat,   (front,       (statistical
  │ Evaluation      │             .ksplat,   close,        rigor)
  │                 │             .spz)      wide, L45,
  └─────────────────┘                        R45)

  ┌─────────────────┐   2         1          2             1            ~5 min
  │ Quick           │   (subset)  (.spz)     (front,       (quick
  │ Validation      │                        close)        check)
  │                 │
  └─────────────────┘

  ┌─────────────────┐   6         1          All 5         3            ~45 min
  │ Single Format   │   (full)    (choose    (all)         (deep dive
  │ Deep Dive       │             one)                     on format)
  │                 │
  └─────────────────┘

  ┌─────────────────┐   2-3       All 3      1             5            ~30 min
  │ Performance     │   (large    (.splat,   (front)       (FPS
  │ Profiling       │    scenes)  .ksplat,                 stability)
  │                 │             .spz)
  └─────────────────┘
```

## File Naming Convention

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FILE NAMING CONVENTION                                    │
└─────────────────────────────────────────────────────────────────────────────┘

  SCREENSHOTS:
  ────────────
  Format: {scene}_{format}_{viewpoint}_{side}_{date}.png

  Example: bonsai_spz_front_A_2026-01-30.png
           ───── ──── ───── ─ ───────────
           scene fmt  view  side date

  COMPARISON:
  ───────────
  Format: {scene}_comparison_{viewpoint}_{date}.png

  Example: bonsai_comparison_front_2026-01-30.png

  CSV DATA:
  ─────────
  Format: webgsbench_{scene}_{format}_{timestamp}.csv

  Example: webgsbench_bonsai_spz_20260130_143022.csv
```

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   WEBGSBENCH SYSTEM ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

  LAYER 1: USER INTERFACES
  ────────────────────────
  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
  │ Interactive Web │  │ Batch Runner    │  │ REST API        │
  │ (React + Vite)  │  │ (Automated)     │  │ (Future)        │
  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
           │                    │                    │
           └────────────────────┼────────────────────┘
                                │
  LAYER 2: CORE SERVICES        ▼
  ─────────────────────────
  ┌─────────────────────────────────────────────────────────────┐
  │  Camera Presets  │  Batch Testing  │  Export System         │
  │  • 5 viewpoints  │  • Templates    │  • Screenshots         │
  │  • Auto-detect   │  • Queue mgmt   │  • CSV export          │
  │  • Shortcuts     │  • Progress     │  • Metadata            │
  └─────────────────────────────────────────────────────────────┘
                                │
  LAYER 3: METRICS & QUALITY    ▼
  ─────────────────────────────
  ┌─────────────────────────────────────────────────────────────┐
  │  Performance          │  Quality              │  System      │
  │  • FPS (avg, 1% low)  │  • PSNR calculation   │  • Browser   │
  │  • Frame time         │  • SSIM calculation   │  • GPU       │
  │  • Memory usage       │  • Canvas capture     │  • WebGL     │
  │  • Load time          │  • Diff visualization │  • Timestamp │
  └─────────────────────────────────────────────────────────────┘
                                │
  LAYER 4: RENDERING            ▼
  ───────────────────
  ┌─────────────────────────────────────────────────────────────┐
  │                    Three.js + WebGL                         │
  │              Gaussian Splatting Renderer                    │
  │                    (@mkkellogg/gs3d)                        │
  └─────────────────────────────────────────────────────────────┘
                                │
  LAYER 5: STORAGE              ▼
  ────────────────
  ┌─────────────────────────────────────────────────────────────┐
  │  Input Files        │  Output Files                         │
  │  • .ply (reference) │  • Screenshots (PNG)                  │
  │  • .splat           │  • Data (CSV)                         │
  │  • .ksplat          │  • Reports (JSON)                     │
  │  • .spz             │                                       │
  └─────────────────────────────────────────────────────────────┘
```
