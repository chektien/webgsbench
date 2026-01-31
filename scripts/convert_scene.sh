#!/bin/bash
# Scene Conversion Helper for WebGSBench
# 
# This script helps convert scenes between formats using the supersplat tool
# 
# Usage: ./scripts/convert_scene.sh <scene_name> <input_format> <output_format>
# Example: ./scripts/convert_scene.sh garden ply splat

echo "=== WebGSBench Scene Conversion Helper ==="
echo ""

# Configuration
ASSETS_DIR="${ASSETS_DIR:-./assets}"
PUBLIC_DIR="${PUBLIC_DIR:-./webgsbench-app/public}"
SUPERSPLAT_CMD="${SUPERSPLAT_CMD:-npx supersplat}"

# Function to show usage
usage() {
    echo "Usage: $0 <scene_name> <input_format> <output_format>"
    echo ""
    echo "Scene names: bonsai, garden, playroom, truck, train, flower"
    echo "Formats: ply, splat, ksplat, spz"
    echo ""
    echo "Examples:"
    echo "  $0 garden ply splat      # Convert garden.ply to garden.splat"
    echo "  $0 flower splat ply      # Convert flower.splat to flower.ply"
    echo "  $0 train ply ksplat      # Convert train.ply to train.ksplat"
    echo ""
    echo "Batch conversion:"
    echo "  $0 --batch-all           # Convert all missing formats"
    exit 1
}

# Function to convert a single file
convert_file() {
    local scene_name="$1"
    local input_format="$2"
    local output_format="$3"
    
    # Handle garden-splatfacto.ply special case
    local input_file
    if [ "$scene_name" = "garden" ] && [ "$input_format" = "ply" ]; then
        if [ -f "$ASSETS_DIR/garden-splatfacto.ply" ]; then
            input_file="$ASSETS_DIR/garden-splatfacto.ply"
        else
            input_file="$ASSETS_DIR/garden.$input_format"
        fi
    else
        input_file="$ASSETS_DIR/${scene_name}.$input_format"
    fi
    
    local output_file="$ASSETS_DIR/${scene_name}.${output_format}"
    
    # Check if input exists
    if [ ! -f "$input_file" ]; then
        echo "❌ Error: Input file not found: $input_file"
        return 1
    fi
    
    echo "Converting: $input_file → $output_file"
    
    # Check if supersplat is available
    if ! command -v npx &> /dev/null; then
        echo "❌ Error: npx not found. Please install Node.js and npm."
        return 1
    fi
    
    # Perform conversion based on format
    case "$output_format" in
        "ply")
            echo "   → Converting to PLY format..."
            # Note: supersplat PLY export may have specific options
            npx supersplat "$input_file" --output "$output_file" --format ply 2>&1 | head -5
            ;;
        "splat")
            echo "   → Converting to SPLAT format..."
            npx supersplat "$input_file" --output "$output_file" --format splat 2>&1 | head -5
            ;;
        "ksplat")
            echo "   → Converting to KSPLAT format (level 0)..."
            npx supersplat "$input_file" --output "$output_file" --format ksplat --level 0 2>&1 | head -5
            ;;
        "spz")
            echo "   → Converting to SPZ format..."
            npx supersplat "$input_file" --output "$output_file" --format spz 2>&1 | head -5
            ;;
        *)
            echo "❌ Error: Unknown output format: $output_format"
            return 1
            ;;
    esac
    
    if [ -f "$output_file" ]; then
        local input_size=$(stat -f%z "$input_file" 2>/dev/null || stat -c%s "$input_file" 2>/dev/null)
        local output_size=$(stat -f%z "$output_file" 2>/dev/null || stat -c%s "$output_file" 2>/dev/null)
        local reduction=$((100 - (output_size * 100 / input_size)))
        echo "✅ Success: $output_file (${output_size} bytes, ${reduction}% reduction)"
        return 0
    else
        echo "❌ Error: Conversion failed"
        return 1
    fi
}

# Function to copy to public folder
copy_to_public() {
    local scene_name="$1"
    local format="$2"
    local source="$ASSETS_DIR/${scene_name}.${format}"
    local dest="$PUBLIC_DIR/${scene_name}.${format}"
    
    if [ -f "$source" ]; then
        cp "$source" "$dest"
        echo "📁 Copied to public: ${scene_name}.${format}"
    fi
}

# Function to check scene status
check_scene_status() {
    echo "=== Scene Conversion Status ==="
    echo ""
    
    for scene in bonsai garden playroom truck train flower; do
        echo -n "$scene: "
        local has_ply=""
        local has_splat=""
        local has_ksplat=""
        local has_spz=""
        
        # Check for garden-splatfacto.ply special case
        if [ "$scene" = "garden" ] && [ -f "$ASSETS_DIR/garden-splatfacto.ply" ]; then
            has_ply="✓"
        elif [ -f "$ASSETS_DIR/${scene}.ply" ]; then
            has_ply="✓"
        fi
        
        [ -f "$ASSETS_DIR/${scene}.splat" ] && has_splat="✓"
        [ -f "$ASSETS_DIR/${scene}.ksplat" ] && has_ksplat="✓"
        [ -f "$ASSETS_DIR/${scene}.spz" ] && has_spz="✓"
        
        echo -n "PLY:${has_ply:-✗} SPLAT:${has_splat:-✗} KSPLAT:${has_ksplat:-✗} SPZ:${has_spz:-✗}"
        echo ""
    done
    echo ""
    echo "Assets directory: $ASSETS_DIR"
    echo "Public directory: $PUBLIC_DIR"
}

# Handle batch conversion
batch_convert() {
    echo "=== Batch Converting Missing Formats ==="
    echo ""
    
    # Define conversions needed
    # Format: "scene_name input_format output_format"
    local conversions=(
        # Garden: PLY → others
        "garden ply splat"
        "garden ply ksplat"
        "garden ply spz"
        # Train: PLY → others
        "train ply splat"
        "train ply ksplat"
        "train ply spz"
        # Flower: SPLAT → others
        "flower splat ply"
        "flower splat ksplat"
        "flower splat spz"
    )
    
    local success_count=0
    local fail_count=0
    
    for conv in "${conversions[@]}"; do
        read -r scene input output <<< "$conv"
        
        # Skip if output already exists
        if [ -f "$ASSETS_DIR/${scene}.${output}" ]; then
            echo "⏭️  Skipping: ${scene}.${output} already exists"
            continue
        fi
        
        echo ""
        if convert_file "$scene" "$input" "$output"; then
            ((success_count++))
            copy_to_public "$scene" "$output"
        else
            ((fail_count++))
        fi
    done
    
    echo ""
    echo "=== Batch Conversion Complete ==="
    echo "✅ Successful: $success_count"
    echo "❌ Failed: $fail_count"
}

# Main script logic
case "$1" in
    "--status"|"-s")
        check_scene_status
        ;;
    "--batch-all"|"-b")
        batch_convert
        ;;
    "--help"|"-h"|"")
        usage
        ;;
    *)
        # Individual conversion
        if [ $# -ne 3 ]; then
            usage
        fi
        
        SCENE_NAME="$1"
        INPUT_FORMAT="$2"
        OUTPUT_FORMAT="$3"
        
        convert_file "$SCENE_NAME" "$INPUT_FORMAT" "$OUTPUT_FORMAT"
        if [ $? -eq 0 ]; then
            copy_to_public "$SCENE_NAME" "$OUTPUT_FORMAT"
        fi
        ;;
esac
