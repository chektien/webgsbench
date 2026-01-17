#!/bin/bash

# WebGSBench File Verification Script
# Purpose: Verify all converted files are valid and readable

set -e

ASSETS_DIR="/Users/chek/repos/webgsbench/assets"

echo "=================================================="
echo "WebGSBench File Verification"
echo "=================================================="
echo ""

SCENES=("bonsai" "playroom" "truck")
FORMATS=("ply" "splat" "ksplat" "spz")

total_files=0
valid_files=0
invalid_files=0

for scene in "${SCENES[@]}"; do
    echo "Scene: ${scene}"
    echo "----------------------------------------"
    
    for format in "${FORMATS[@]}"; do
        file="${ASSETS_DIR}/${scene}.${format}"
        
        if [ -f "$file" ]; then
            size=$(du -h "$file" | cut -f1)
            
            # Basic validation: file size > 0
            if [ -s "$file" ]; then
                echo "  ✅ ${scene}.${format} - ${size}"
                ((valid_files++))
            else
                echo "  ❌ ${scene}.${format} - EMPTY FILE"
                ((invalid_files++))
            fi
        else
            echo "  ❌ ${scene}.${format} - MISSING"
            ((invalid_files++))
        fi
        
        ((total_files++))
    done
    
    echo ""
done

echo "=================================================="
echo "Verification Summary"
echo "=================================================="
echo "Total files expected: ${total_files}"
echo "Valid files: ${valid_files}"
echo "Invalid/Missing: ${invalid_files}"
echo ""

if [ $invalid_files -eq 0 ]; then
    echo "✅ All files verified successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Test files in viewer: cd webgsbench-app && npm run dev"
    echo "  2. Capture ground truth images"
    echo "  3. Run benchmarks"
else
    echo "⚠️  Some files are missing or invalid."
    echo "Run: scripts/convert_benchmark_scenes.sh"
fi
echo ""
