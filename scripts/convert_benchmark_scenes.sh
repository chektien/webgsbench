#!/bin/bash
# Convert benchmark scenes to all required formats for WebGSBench paper
# Converts: bonsai, playroom, truck to .ply, .splat, .ksplat, .spz

set -e  # Exit on error

ASSETS="<REPO_ROOT>/assets"
cd "$ASSETS"

echo "=================================================="
echo "WebGSBench Format Conversion Script"
echo "=================================================="
echo ""
echo "Target scenes: bonsai, playroom, truck"
echo "Target formats: .ply, .splat, .ksplat, .spz"
echo ""

# Function to convert a file
convert_file() {
    local input="$1"
    local output="$2"
    local format="$3"
    local tool="$4"
    
    if [ -f "$output" ]; then
        echo "  ⏭️  Skipping $output (already exists)"
        return
    fi
    
    echo "  🔄 Converting: $(basename $input) → $(basename $output)"
    
    if [ "$tool" = "gsconverter" ]; then
        gsconverter -i "$input" -o "$output" -f "$format" --force --compression_level 5 2>&1 | grep -E "(Completed|Size:)" || true
    elif [ "$tool" = "splat-transform" ]; then
        splat-transform "$input" "$output" -w 2>&1 | grep -E "(done in|Loaded)" || true
    fi
    
    if [ -f "$output" ]; then
        local size=$(ls -lh "$output" | awk '{print $5}')
        echo "  ✅ Created: $(basename $output) ($size)"
    else
        echo "  ❌ Failed to create: $(basename $output)"
    fi
    echo ""
}

# ====================
# Scene 1: BONSAI
# ====================
echo "==================================================  "
echo "Scene 1: BONSAI (small, indoor, object-centric)"
echo "=================================================="
echo ""

# Bonsai already has: .splat (7.1 MB)
# Need to generate: .ply, .ksplat, .spz

echo "Source: bonsai.splat (7.1 MB)"
echo ""

# SPLAT → PLY
convert_file "bonsai.splat" "bonsai.ply" "3dgs" "gsconverter"

# SPLAT → KSPLAT
convert_file "bonsai.splat" "bonsai.ksplat" "ksplat" "gsconverter"

# SPLAT → SPZ
convert_file "bonsai.splat" "bonsai.spz" "spz" "gsconverter"

# ====================
# Scene 2: PLAYROOM
# ====================
echo "=================================================="
echo "Scene 2: PLAYROOM (large, indoor, complex)"
echo "=================================================="
echo ""

# Playroom already has: .ply (453 MB)
# Need to generate: .splat, .ksplat, .spz

echo "Source: playroom.ply (453 MB)"
echo "⚠️  Warning: This will take 5-10 minutes due to large file size"
echo ""

# PLY → SPLAT
convert_file "playroom.ply" "playroom.splat" "splat" "gsconverter"

# PLY → KSPLAT
convert_file "playroom.ply" "playroom.ksplat" "ksplat" "gsconverter"

# PLY → SPZ
convert_file "playroom.ply" "playroom.spz" "spz" "gsconverter"

# ====================
# Scene 3: TRUCK
# ====================
echo "=================================================="
echo "Scene 3: TRUCK (large, outdoor, vehicle)"
echo "=================================================="
echo ""

# Truck already has: .ply (400 MB)
# Need to generate: .splat, .ksplat, .spz

echo "Source: truck.ply (400 MB)"
echo "⚠️  Warning: This will take 5-10 minutes due to large file size"
echo ""

# PLY → SPLAT
convert_file "truck.ply" "truck.splat" "splat" "gsconverter"

# PLY → KSPLAT
convert_file "truck.ply" "truck.ksplat" "ksplat" "gsconverter"

# PLY → SPZ
convert_file "truck.ply" "truck.spz" "spz" "gsconverter"

# ====================
# Summary
# ====================
echo "=================================================="
echo "Conversion Summary"
echo "=================================================="
echo ""

for scene in bonsai playroom truck; do
    echo "Scene: $scene"
    for ext in ply splat ksplat spz; do
        file="${scene}.${ext}"
        if [ -f "$file" ]; then
            size=$(ls -lh "$file" | awk '{print $5}')
            printf "  %-15s %s\n" "$file" "$size"
        else
            printf "  %-15s %s\n" "$file" "MISSING"
        fi
    done
    echo ""
done

echo "=================================================="
echo "✅ Conversion complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Verify files load in viewer: cd webgsbench-app && npm run dev"
echo "2. Capture ground truth images for PSNR/SSIM calculation"
echo "3. Run benchmarks across formats and browsers"
