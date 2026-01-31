import { useState } from 'react';
import type { ViewpointPreset } from '../../lib/camera/cameraPresets';
import { STANDARD_VIEWPOINTS, getScenePresets } from '../../lib/camera/cameraPresets';
import type { SparkViewerContext } from '../../types';

interface CameraPresetPanelProps {
  viewerContext: SparkViewerContext | null;
  sceneName?: string; // e.g., "bonsai", "truck"
  onPresetApplied?: (preset: ViewpointPreset) => void;
}

export function CameraPresetPanel({ 
  viewerContext, 
  sceneName,
  onPresetApplied 
}: CameraPresetPanelProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  
  // Get presets - either scene-specific or standard
  const presets = sceneName 
    ? getScenePresets(sceneName)
    : STANDARD_VIEWPOINTS;

  const handleApplyPreset = (preset: ViewpointPreset) => {
    if (!viewerContext) return;
    
    const { camera, controls } = viewerContext;
    
    // Apply the preset
    const targetPos = {
      x: preset.position.x,
      y: preset.position.y,
      z: preset.position.z,
    };
    
    camera.position.set(targetPos.x, targetPos.y, targetPos.z);
    controls.target.set(preset.target.x, preset.target.y, preset.target.z);
    
    if (preset.fov) {
      camera.fov = preset.fov;
      camera.updateProjectionMatrix();
    }
    
    controls.update();
    
    setActivePreset(preset.id);
    
    // Notify parent
    onPresetApplied?.(preset);
    
    // Log for debugging
    console.log(`[CameraPreset] Applied: ${preset.name}`, {
      position: camera.position.toArray(),
      distance: camera.position.length().toFixed(2),
    });
  };

  const handleSaveCustom = () => {
    if (!viewerContext) return;
    
    const { camera, controls } = viewerContext;
    
    const customPreset: ViewpointPreset = {
      id: `custom_${Date.now()}`,
      name: 'Custom',
      description: 'Current camera position',
      position: {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      target: {
        x: controls.target.x,
        y: controls.target.y,
        z: controls.target.z,
      },
    };
    
    // In a full implementation, this would save to localStorage or backend
    console.log('[CameraPreset] Saved custom view:', customPreset);
    alert(`Saved custom view at distance ${camera.position.length().toFixed(2)}`);
  };

  if (!viewerContext) {
    return (
      <div className="bg-gray-800 rounded-lg p-3 opacity-50">
        <div className="text-xs text-gray-400">Load a scene to use camera presets</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-3" style={{ fontFamily: 'Arvo, serif' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold" style={{ color: '#B39DFF' }}>
          Viewpoints
        </div>
        {sceneName && (
          <div className="text-xs text-gray-400" title={`Scene: ${sceneName}`}>
            {sceneName}
          </div>
        )}
      </div>
      
      {/* Preset buttons */}
      <div className="space-y-1">
        {presets.map((preset, index) => (
          <button
            key={preset.id}
            onClick={() => handleApplyPreset(preset)}
            className={`
              w-full text-left text-xs py-1.5 px-2 rounded transition-colors
              flex items-center justify-between
              ${activePreset === preset.id 
                ? 'bg-purple-600 text-white' 
                : 'hover:bg-gray-700 text-gray-200'
              }
            `}
          >
            <span>
              <span className="opacity-50 mr-1">{index + 1}.</span>
              {preset.name}
            </span>
            {activePreset === preset.id && (
              <span className="text-xs opacity-75">●</span>
            )}
          </button>
        ))}
      </div>
      
      {/* Custom view option */}
      <div className="mt-3 pt-2 border-t border-gray-700">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1"
        >
          <span>{showCustom ? '▼' : '▶'}</span>
          Custom
        </button>
        
        {showCustom && (
          <div className="mt-2 space-y-2">
            <button
              onClick={handleSaveCustom}
              className="w-full text-xs py-1.5 px-2 rounded bg-gray-700 hover:bg-gray-600 text-gray-200"
            >
              Save Current View
            </button>
            <div className="text-xs text-gray-500 px-1">
              Distance: {viewerContext.camera.position.length().toFixed(2)} units
            </div>
          </div>
        )}
      </div>
      
      {/* Keyboard shortcuts hint */}
      <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-500">
        Press 1-5 to quick-select
      </div>
    </div>
  );
}
