import { useState } from 'react';
import type { BenchmarkMetrics, ImageQualityMetrics } from '../../types';

interface MetricsPanelProps {
  metricsA: BenchmarkMetrics;
  metricsB: BenchmarkMetrics;
  showComparison: boolean;
  qualityMetrics?: ImageQualityMetrics;
}

export function MetricsPanel({ metricsA, metricsB, showComparison, qualityMetrics }: MetricsPanelProps) {
  const formatNumber = (num: number, decimals: number = 1) => {
    return num.toFixed(decimals);
  };

  const formatMemory = (mb: number) => {
    return `${formatNumber(mb, 1)} MB`;
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${formatNumber(ms, 0)} ms`;
    return `${formatNumber(ms / 1000, 2)} s`;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${formatNumber(count / 1000000, 2)}M`;
    }
    if (count >= 1000) {
      return `${formatNumber(count / 1000, 1)}K`;
    }
    return count.toString();
  };

  const formatDelta = (a: number, b: number) => {
    if (b === 0) return 'N/A';
    const delta = ((a - b) / b) * 100;
    const sign = delta > 0 ? '+' : '';
    return `${sign}${formatNumber(delta, 1)}%`;
  };

  const getDeltaColor = (a: number, b: number, higherIsBetter: boolean = true) => {
    if (b === 0) return '#FDFDFB';
    const delta = a - b;
    if (Math.abs(delta) < 0.01) return '#FDFDFB';
    const isPositive = delta > 0;
    if (higherIsBetter) {
      return isPositive ? '#BEFF74' : '#FF575F';
    } else {
      return isPositive ? '#FF575F' : '#BEFF74';
    }
  };

  if (!showComparison) {
    // Show only Splat A metrics when only one file is loaded
    const metrics = metricsA.fps > 0 ? metricsA : metricsB;
    const side = metricsA.fps > 0 ? 'A' : 'B';

    return (
      <div className="w-full h-full overflow-y-auto" style={{ backgroundColor: '#3E3E3E', color: '#FDFDFB', fontFamily: 'Arvo, serif' }}>
        <div className="px-10 py-8">
          <h2 className="text-xl mb-8" style={{ color: '#B39DFF' }}>
            Splat {side} Metrics
          </h2>

          {/* Basic Performance */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: '#FFACBF' }}>Basic</h3>
            <div className="space-y-2">
              <MetricItem
                label="FPS"
                value={formatNumber(metrics.fps, 1)}
                color={metrics.fps >= 30 ? '#BEFF74' : metrics.fps >= 15 ? '#FFD59B' : '#FF575F'}
                tooltip="Frames Per Second - Higher is better. Shows how smoothly the scene renders."
              />

              <MetricItem
                label="Frame Time (Avg)"
                value={`${formatNumber(metrics.frameTime, 2)} ms`}
                tooltip="Average time to render one frame - Lower is better. At 60 FPS, each frame takes ~16.67ms."
              />

              {metrics.memoryUsage > 0 && (
                <MetricItem
                  label="Memory"
                  value={formatMemory(metrics.memoryUsage)}
                  tooltip="JavaScript heap memory usage - Shows how much RAM the scene uses. Chrome only."
                />
              )}
            </div>
          </div>

        {/* Stability Metrics */}
        {metrics.frameTimeVariance > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: '#FFACBF' }}>Stability</h3>
            <div className="space-y-2">
              <MetricItem
                label="Frame Time σ"
                value={`${formatNumber(metrics.frameTimeVariance, 2)} ms`}
                tooltip="Standard deviation of frame times - Lower is better. Measures performance consistency."
              />

              <MetricItem
                label="1% Low FPS"
                value={formatNumber(metrics.fps1PercentLow, 1)}
                color={metrics.fps1PercentLow >= 30 ? '#BEFF74' : metrics.fps1PercentLow >= 15 ? '#FFD59B' : '#FF575F'}
                tooltip="Average FPS of worst 1% of frames - Higher is better. Reveals stuttering and frame drops."
              />

              <MetricItem
                label="0.1% Low FPS"
                value={formatNumber(metrics.fps01PercentLow, 1)}
                color={metrics.fps01PercentLow >= 30 ? '#BEFF74' : metrics.fps01PercentLow >= 15 ? '#FFD59B' : '#FF575F'}
                tooltip="Average FPS of worst 0.1% of frames - Ultra-worst-case performance metric."
              />
            </div>
          </div>
        )}

        {/* Percentiles */}
        {metrics.frameTimeP50 > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: '#FFACBF' }}>Percentiles</h3>
            <div className="space-y-2">
              <MetricItem
                label="P50 (Median)"
                value={`${formatNumber(metrics.frameTimeP50, 2)} ms`}
                tooltip="50th percentile frame time - The middle value, unaffected by outliers."
              />

              <MetricItem
                label="P95"
                value={`${formatNumber(metrics.frameTimeP95, 2)} ms`}
                tooltip="95th percentile - 95% of frames are faster than this."
              />

              <MetricItem
                label="P99"
                value={`${formatNumber(metrics.frameTimeP99, 2)} ms`}
                tooltip="99th percentile - 99% of frames are faster than this. Catches severe slowdowns."
              />
            </div>
          </div>
        )}

        {/* File Info */}
        {(metrics.loadTime > 0 || metrics.splatCount > 0) && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: '#FFACBF' }}>File Info</h3>
            <div className="space-y-2">
              {metrics.loadTime > 0 && (
                <MetricItem
                  label="Load Time"
                  value={formatTime(metrics.loadTime)}
                  tooltip="Time from file selection to first render - Lower is better."
                />
              )}

              {metrics.splatCount > 0 && (
                <MetricItem
                  label="Splats"
                  value={formatCount(metrics.splatCount)}
                  tooltip="Total number of 3D Gaussian splats in the file - More splats = richer detail but higher rendering cost."
                />
              )}

              {metrics.fileSize > 0 && (
                <MetricItem
                  label="File Size"
                  value={formatMemory(metrics.fileSize)}
                  tooltip="Size of the Gaussian Splat file on disk - Affects download and load times."
                />
              )}

              {metrics.resolution[0] > 0 && (
                <MetricItem
                  label="Resolution"
                  value={`${metrics.resolution[0]} × ${metrics.resolution[1]}`}
                  tooltip="Canvas rendering resolution - Higher resolution = sharper visuals but lower performance."
                />
              )}
            </div>
          </div>
        )}

          {metrics.memoryUsage === 0 && (
            <div className="mt-8 p-4 rounded text-xs" style={{ backgroundColor: 'rgba(62, 62, 62, 0.5)', color: '#FFACBF' }}>
              Memory metrics only available in Chrome
            </div>
          )}
        </div>
      </div>
    );
  }

  // Comparison view when both files are loaded
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-visible" style={{ backgroundColor: '#3E3E3E', color: '#FDFDFB', fontFamily: 'Arvo, serif' }}>
      <div className="px-10 py-8">
        <h2 className="text-xl mb-8" style={{ color: '#B39DFF' }}>
          Comparison
        </h2>

        {/* Quality Comparison (PSNR/SSIM) - MOVED TO TOP */}
        {qualityMetrics && (qualityMetrics.psnr !== null || qualityMetrics.ssim !== null || qualityMetrics.error) && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: '#FFACBF' }}>Quality Comparison</h3>

            {qualityMetrics.error ? (
              <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: 'rgba(255, 87, 95, 0.2)', border: '1px solid #FF575F', color: '#FF575F' }}>
                <div className="font-semibold mb-1">Error</div>
                <div className="text-xs">{qualityMetrics.error}</div>
              </div>
            ) : (
              <div className="space-y-2">
                {qualityMetrics.psnr !== null && (
                  <MetricItem
                    label="PSNR"
                    value={qualityMetrics.psnr === Infinity ? '∞ dB (identical)' : `${formatNumber(qualityMetrics.psnr, 2)} dB`}
                    color={qualityMetrics.psnr > 35 ? '#BEFF74' : qualityMetrics.psnr > 25 ? '#FFD59B' : '#FF575F'}
                    tooltip="Peak Signal-to-Noise Ratio - Higher is better. Typical values: 25-45 dB. Measures pixel-level fidelity between Splat A and Splat B renders. >35 dB = excellent, 25-35 dB = good, <25 dB = poor."
                  />
                )}

                {qualityMetrics.ssim !== null && (
                  <MetricItem
                    label="SSIM"
                    value={formatNumber(qualityMetrics.ssim, 4)}
                    color={qualityMetrics.ssim > 0.95 ? '#BEFF74' : qualityMetrics.ssim > 0.85 ? '#FFD59B' : '#FF575F'}
                    tooltip="Structural Similarity Index - Higher is better (0-1 scale, 1.0 = identical). Measures perceptual similarity considering luminance, contrast, and structure. >0.95 = excellent, 0.85-0.95 = good, <0.85 = noticeable differences."
                  />
                )}

                {qualityMetrics.capturedAt && (
                  <div className="pt-2 text-xs" style={{ color: '#FFACBF' }}>
                    Captured: {new Date(qualityMetrics.capturedAt).toLocaleTimeString()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Basic Performance Comparison */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: '#FFACBF' }}>Basic</h3>
          <div className="space-y-4">
            <ComparisonMetricItem
              label="FPS"
              valueA={formatNumber(metricsA.fps, 1)}
              valueB={formatNumber(metricsB.fps, 1)}
              delta={formatDelta(metricsA.fps, metricsB.fps)}
              deltaColor={getDeltaColor(metricsA.fps, metricsB.fps, true)}
              tooltip="Frames Per Second - Higher is better. Shows how smoothly the scene renders. Green means Splat A is faster."
            />

            <ComparisonMetricItem
              label="Frame Time"
              valueA={`${formatNumber(metricsA.frameTime, 2)} ms`}
              valueB={`${formatNumber(metricsB.frameTime, 2)} ms`}
              delta={formatDelta(metricsA.frameTime, metricsB.frameTime)}
              deltaColor={getDeltaColor(metricsA.frameTime, metricsB.frameTime, false)}
              tooltip="Average time to render one frame - Lower is better. At 60 FPS, each frame takes ~16.67ms. Green means Splat A is faster."
            />

            {(metricsA.memoryUsage > 0 || metricsB.memoryUsage > 0) && (
              <ComparisonMetricItem
                label="Memory"
                valueA={formatMemory(metricsA.memoryUsage)}
                valueB={formatMemory(metricsB.memoryUsage)}
                delta={formatDelta(metricsA.memoryUsage, metricsB.memoryUsage)}
                deltaColor={getDeltaColor(metricsA.memoryUsage, metricsB.memoryUsage, false)}
                tooltip="JavaScript heap memory usage - Lower is better. Shows how much RAM the scene uses. Chrome only. Green means Splat A uses less memory."
              />
            )}
          </div>
        </div>

        {/* Stability Comparison */}
        {(metricsA.frameTimeVariance > 0 || metricsB.frameTimeVariance > 0) && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: '#FFACBF' }}>Stability</h3>
            <div className="space-y-4">
              <ComparisonMetricItem
                label="1% Low FPS"
                valueA={formatNumber(metricsA.fps1PercentLow, 1)}
                valueB={formatNumber(metricsB.fps1PercentLow, 1)}
                delta={formatDelta(metricsA.fps1PercentLow, metricsB.fps1PercentLow)}
                deltaColor={getDeltaColor(metricsA.fps1PercentLow, metricsB.fps1PercentLow, true)}
                tooltip="Average FPS of worst 1% of frames - Higher is better. Industry standard metric for worst-case performance. Reveals stuttering and frame drops. Green means Splat A has better worst-case performance."
              />

              <ComparisonMetricItem
                label="Frame Time σ"
                valueA={`${formatNumber(metricsA.frameTimeVariance, 2)} ms`}
                valueB={`${formatNumber(metricsB.frameTimeVariance, 2)} ms`}
                delta={formatDelta(metricsA.frameTimeVariance, metricsB.frameTimeVariance)}
                deltaColor={getDeltaColor(metricsA.frameTimeVariance, metricsB.frameTimeVariance, false)}
                tooltip="Standard deviation of frame times - Lower is better. Measures performance consistency. Low values mean smooth, predictable frame rates. Green means Splat A is more stable."
              />
            </div>
          </div>
        )}

        {/* File Info Comparison */}
        {(metricsA.splatCount > 0 || metricsB.splatCount > 0) && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: '#FFACBF' }}>File Info</h3>
            <div className="space-y-4">
              {(metricsA.loadTime > 0 || metricsB.loadTime > 0) && (
                <ComparisonMetricItem
                  label="Load Time"
                  valueA={formatTime(metricsA.loadTime)}
                  valueB={formatTime(metricsB.loadTime)}
                  delta={formatDelta(metricsA.loadTime, metricsB.loadTime)}
                  deltaColor={getDeltaColor(metricsA.loadTime, metricsB.loadTime, false)}
                  tooltip="Time to load and parse the file - Lower is better. Includes decompression and GPU upload. Green means Splat A loads faster."
                />
              )}

              {(metricsA.splatCount > 0 || metricsB.splatCount > 0) && (
                <ComparisonMetricItem
                  label="Splats"
                  valueA={formatCount(metricsA.splatCount)}
                  valueB={formatCount(metricsB.splatCount)}
                  delta={formatDelta(metricsA.splatCount, metricsB.splatCount)}
                  deltaColor="#FDFDFB"
                  tooltip="Number of 3D Gaussian primitives in the scene. Higher count means more detail but potentially slower performance. Neutral comparison (no color coding)."
                />
              )}

              {(metricsA.fileSize > 0 || metricsB.fileSize > 0) && (
                <ComparisonMetricItem
                  label="File Size"
                  valueA={formatMemory(metricsA.fileSize)}
                  valueB={formatMemory(metricsB.fileSize)}
                  delta={formatDelta(metricsA.fileSize, metricsB.fileSize)}
                  deltaColor={getDeltaColor(metricsA.fileSize, metricsB.fileSize, false)}
                  tooltip="File size on disk - Lower is better. Compressed formats like .ksplat and .spz are smaller than .ply. Smaller files load faster. Green means Splat A has smaller file size."
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MetricItemProps {
  label: string;
  value: string;
  color?: string;
  tooltip?: string;
}

function MetricItem({ label, value, color = '#FDFDFB', tooltip }: MetricItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="flex justify-between items-center py-2 relative"
      style={{ borderBottom: '1px solid #555', fontFamily: 'Arvo, serif' }}
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium" style={{ color: '#FFACBF' }}>{label}</span>
        {tooltip && (
          <svg className="w-4 h-4 cursor-help" fill="none" stroke="#FFACBF" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <span className="font-mono font-semibold text-lg" style={{ color }}>{value}</span>

      {/* Tooltip */}
      {showTooltip && tooltip && (
        <div
          className="absolute left-0 right-0 p-3 rounded-lg shadow-lg text-xs leading-relaxed"
          style={{
            top: '100%',
            marginTop: '8px',
            zIndex: 9999,
            backgroundColor: '#2D2D2D',
            border: '1px solid #555',
            color: '#FDFDFB'
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}

interface ComparisonMetricItemProps {
  label: string;
  valueA: string;
  valueB: string;
  delta: string;
  deltaColor: string;
  tooltip?: string;
}

function ComparisonMetricItem({ label, valueA, valueB, delta, deltaColor, tooltip }: ComparisonMetricItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="py-3 relative"
      style={{ borderBottom: '1px solid #555', fontFamily: 'Arvo, serif' }}
      onMouseEnter={() => tooltip && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="text-sm font-medium mb-2 flex items-center gap-1" style={{ color: '#FFACBF' }}>
        {label}
        {tooltip && (
          <svg className="w-4 h-4 cursor-help" fill="none" stroke="#FFACBF" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <div className="flex justify-between items-center text-xs">
        <div className="flex-1">
          <span style={{ color: '#B39DFF' }}>A:</span>
          <span className="ml-2 font-mono" style={{ color: '#FDFDFB' }}>{valueA}</span>
        </div>
        <div className="flex-1">
          <span style={{ color: '#B39DFF' }}>B:</span>
          <span className="ml-2 font-mono" style={{ color: '#FDFDFB' }}>{valueB}</span>
        </div>
        <div className="font-mono font-semibold" style={{ color: deltaColor }}>{delta}</div>
      </div>

      {/* Tooltip */}
      {showTooltip && tooltip && (
        <div
          className="absolute left-0 right-0 p-3 rounded-lg shadow-lg text-xs leading-relaxed"
          style={{
            top: '100%',
            marginTop: '8px',
            zIndex: 9999,
            backgroundColor: '#2D2D2D',
            border: '1px solid #555',
            color: '#FDFDFB'
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
