#!/bin/bash

# WebGSBench Setup Verification Script
# Checks that all required files and services are ready for data collection

set -e

echo "=================================================="
echo "WebGSBench Setup Verification"
echo "=================================================="
echo ""

# Check directory
echo "1. Checking working directory..."
if [ ! -d "webgsbench-app" ]; then
  echo "❌ Error: Not in webgsbench root directory"
  exit 1
fi
echo "✓ In correct directory: $(pwd)"
echo ""

# Check benchmark files
echo "2. Checking benchmark scene files..."
SCENES=("bonsai" "truck" "playroom")
FORMATS=("ply" "splat" "ksplat" "spz")

missing_files=0
for scene in "${SCENES[@]}"; do
  for format in "${FORMATS[@]}"; do
    file="assets/${scene}.${format}"
    if [ -f "$file" ]; then
      size=$(ls -lh "$file" | awk '{print $5}')
      echo "✓ $file ($size)"
    else
      echo "❌ Missing: $file"
      missing_files=$((missing_files + 1))
    fi
  done
done

if [ $missing_files -gt 0 ]; then
  echo ""
  echo "⚠️  Warning: $missing_files files missing"
  echo "   Data collection may be incomplete"
else
  echo ""
  echo "✓ All benchmark files present (12 files)"
fi
echo ""

# Check data directory
echo "3. Checking data collection directory..."
if [ -d "data" ]; then
  echo "✓ data/ directory exists"
  if [ -f "data/quality_results.csv" ]; then
    lines=$(wc -l < data/quality_results.csv)
    echo "✓ quality_results.csv exists ($lines lines)"
  else
    echo "❌ quality_results.csv not found"
  fi
else
  echo "❌ data/ directory not found"
fi
echo ""

# Check viewer service
echo "4. Checking viewer service..."
if curl -s http://localhost:5174 > /dev/null; then
  echo "✓ Viewer running at http://localhost:5174"
else
  echo "⚠️  Viewer not responding"
  echo "   Run: cd webgsbench-app && npm run dev"
fi
echo ""

# Check Node.js
echo "5. Checking Node.js version..."
if command -v node &> /dev/null; then
  node_version=$(node --version)
  echo "✓ Node.js $node_version"
else
  echo "❌ Node.js not found"
fi
echo ""

# Summary
echo "=================================================="
echo "Setup Verification Complete"
echo "=================================================="
echo ""

if [ $missing_files -eq 0 ]; then
  echo "✅ Ready for data collection!"
  echo ""
  echo "Next steps:"
  echo "1. Open browser: http://localhost:5174"
  echo "2. Follow: DATA_COLLECTION_PLAN.md"
  echo "3. Record results in: data/quality_results.csv"
else
  echo "⚠️  Setup incomplete - please resolve issues above"
fi
echo ""
