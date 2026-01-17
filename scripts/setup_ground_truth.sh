#!/bin/bash

# WebGSBench Ground Truth Image Capture
# Purpose: Generate reference images for PSNR/SSIM calculation
# 
# This script creates a directory structure for storing ground truth images
# and provides instructions for manual capture using the viewer.

set -e

ASSETS_DIR="/Users/chek/repos/webgsbench/assets"
GT_DIR="${ASSETS_DIR}/ground-truth"

echo "=================================================="
echo "WebGSBench Ground Truth Setup"
echo "=================================================="
echo ""

# Create directory structure
mkdir -p "${GT_DIR}"

SCENES=("bonsai" "playroom" "truck")
VIEWS=("view-front" "view-right" "view-top" "view-angle1" "view-angle2")

for scene in "${SCENES[@]}"; do
    scene_dir="${GT_DIR}/${scene}"
    mkdir -p "${scene_dir}"
    echo "✅ Created: ${scene_dir}/"
done

echo ""
echo "=================================================="
echo "Directory Structure Created"
echo "=================================================="
echo ""
tree -L 2 "${GT_DIR}" 2>/dev/null || find "${GT_DIR}" -type d | sed 's|[^/]*/| |g'

echo ""
echo "=================================================="
echo "Manual Capture Instructions"
echo "=================================================="
echo ""
echo "For EACH scene (bonsai, playroom, truck):"
echo "  1. Open viewer: cd webgsbench-app && npm run dev"
echo "  2. Load the .ply file (highest quality reference)"
echo "  3. Position camera for each view and screenshot"
echo ""
echo "Views to capture (5 per scene):"
echo "  - view-front:  Center, head-on view"
echo "  - view-right:  90° rotation, side view"
echo "  - view-top:    Looking down from above"
echo "  - view-angle1: 45° diagonal, medium distance"
echo "  - view-angle2: Close-up detail view"
echo ""
echo "Screenshot settings:"
echo "  - Resolution: 1920×1080 (Full HD)"
echo "  - Format: PNG (lossless)"
echo "  - Filename: assets/ground-truth/{scene}/{view}.png"
echo ""
echo "Example for bonsai:"
echo "  assets/ground-truth/bonsai/view-front.png"
echo "  assets/ground-truth/bonsai/view-right.png"
echo "  assets/ground-truth/bonsai/view-top.png"
echo "  assets/ground-truth/bonsai/view-angle1.png"
echo "  assets/ground-truth/bonsai/view-angle2.png"
echo ""
echo "=================================================="
echo "Automated Capture (Alternative)"
echo "=================================================="
echo ""
echo "If you want to automate screenshot capture:"
echo "  1. Install Playwright: npm install -D @playwright/test"
echo "  2. Run: scripts/capture_ground_truth.js"
echo "  3. Requires predefined camera positions in JSON"
echo ""
echo "For now, manual capture is fastest for 15 images."
echo ""
echo "=================================================="
echo "Camera Position Recording"
echo "=================================================="
echo ""
echo "To ensure reproducible views:"
echo "  1. In the viewer, add a 'Copy Camera Position' button"
echo "  2. Save camera matrix to JSON file"
echo "  3. Format: { position: [x,y,z], target: [x,y,z], up: [0,1,0] }"
echo "  4. Store in: assets/ground-truth/{scene}/camera-positions.json"
echo ""
echo "This allows reproducing exact views for other formats."
echo ""
echo "=================================================="
echo "Next Steps After Capture"
echo "=================================================="
echo ""
echo "Once you have all 15 ground truth images:"
echo "  1. Verify resolution: 1920×1080 for all images"
echo "  2. Run quality benchmarks comparing formats to ground truth"
echo "  3. Calculate PSNR/SSIM using existing code in:"
echo "     webgsbench-app/src/lib/metrics/imageQuality.ts"
echo ""
echo "✅ Setup complete! Ready for ground truth capture."
echo ""
