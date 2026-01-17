import { useState, useEffect } from 'react';
import type * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

interface CameraDistanceProps {
  viewer: GaussianSplats3D.Viewer | null;
  sceneName?: string;
}

/**
 * Displays the current camera distance from the scene center
 * Shows color-coded guidelines for standardized evaluation distances
 */
export function CameraDistance({ viewer, sceneName }: CameraDistanceProps) {
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    if (!viewer) {
      setDistance(0);
      return;
    }

    // Update distance every 100ms
    const interval = setInterval(() => {
      const position = viewer.camera.position;
      const dist = Math.sqrt(
        position.x * position.x + 
        position.y * position.y + 
        position.z * position.z
      );
      setDistance(dist);
    }, 100);

    return () => clearInterval(interval);
  }, [viewer]);

  if (!viewer || distance === 0) {
    return null;
  }

  // Standardized distances for bonsai (radius ~1.8 units)
  // TODO: Calculate these dynamically based on scene bounding sphere
  const closeDistance = 2.7;   // 1.5× radius
  const mediumDistance = 6.3;  // 3.5× radius
  const farDistance = 10.8;    // 6.0× radius

  // Determine which range we're in
  let rangeColor = '#FDFDFB';
  let rangeLabel = 'Custom';
  
  const tolerance = 0.3; // ±0.3 units tolerance

  if (Math.abs(distance - closeDistance) < tolerance) {
    rangeColor = '#BEFF74';
    rangeLabel = 'Close (Primary Metric)';
  } else if (Math.abs(distance - mediumDistance) < tolerance) {
    rangeColor = '#FFD59B';
    rangeLabel = 'Medium (Web Viewing)';
  } else if (Math.abs(distance - farDistance) < tolerance) {
    rangeColor = '#B39DFF';
    rangeLabel = 'Far (Perceptual Equiv.)';
  }

  return (
    <div className="px-4 py-3 rounded-lg text-xs" style={{ backgroundColor: 'rgba(62, 62, 62, 0.9)', fontFamily: 'Arvo, serif' }}>
      <div className="font-semibold mb-2" style={{ color: '#B39DFF' }}>Camera Distance</div>
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span style={{ color: '#FDFDFB' }}>Current:</span>
          <span className="font-mono font-bold" style={{ color: rangeColor }}>
            {distance.toFixed(2)} units
          </span>
        </div>
        <div className="text-xs font-medium" style={{ color: rangeColor }}>
          {rangeLabel}
        </div>
        <div className="pt-2 mt-2 space-y-1" style={{ borderTop: '1px solid #555', color: '#FDFDFB' }}>
          <div className="flex justify-between">
            <span style={{ color: '#BEFF74' }}>Close:</span>
            <span className="font-mono">{closeDistance.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: '#FFD59B' }}>Medium:</span>
            <span className="font-mono">{mediumDistance.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: '#B39DFF' }}>Far:</span>
            <span className="font-mono">{farDistance.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
