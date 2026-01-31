import { useState, useEffect, useRef } from 'react';
import { MetricsCollector } from '../lib/metrics/collector';
import type { BenchmarkMetrics } from '../types';

export function useMetrics() {
  const collectorRef = useRef(new MetricsCollector());
  const [metrics, setMetrics] = useState<BenchmarkMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    loadTime: 0,
    fileSize: 0,
    splatCount: 0,
    resolution: [0, 0],
    frameTimeVariance: 0,
    fps1PercentLow: 0,
    fps01PercentLow: 0,
    frameTimeP50: 0,
    frameTimeP95: 0,
    frameTimeP99: 0,
  });

  useEffect(() => {
    // Update metrics display every 500ms
    const interval = setInterval(() => {
      setMetrics(collectorRef.current.getMetrics());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const recordFrame = (deltaTime: number) => {
    collectorRef.current.recordFrame(deltaTime);
  };

  const setLoadTime = (loadTime: number) => {
    collectorRef.current.endLoad(loadTime);
  };

  const setFileInfo = (size: number, splatCount: number) => {
    collectorRef.current.setFileInfo(size, splatCount);
  };

  const setResolution = (width: number, height: number) => {
    collectorRef.current.setResolution(width, height);
  };

  const reset = () => {
    collectorRef.current.reset();
    setMetrics({
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      loadTime: 0,
      fileSize: 0,
      splatCount: 0,
      resolution: [0, 0],
      frameTimeVariance: 0,
      fps1PercentLow: 0,
      fps01PercentLow: 0,
      frameTimeP50: 0,
      frameTimeP95: 0,
      frameTimeP99: 0,
    });
  };

  const getCurrentMetrics = () => {
    return collectorRef.current.getMetrics();
  };

  return {
    metrics,
    recordFrame,
    setLoadTime,
    setFileInfo,
    setResolution,
    reset,
    getCurrentMetrics,
  };
}
