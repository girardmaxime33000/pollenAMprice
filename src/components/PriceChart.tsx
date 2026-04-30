'use client';

import { useEffect, useRef, useState } from 'react';
import type { PricePoint } from '@/data/materials';
import { COLORS } from '@/lib/colors';

type TimeframeKey = '1D' | '1W' | '1M' | '3M' | '1Y' | 'All';

const TIMEFRAME_DAYS: Record<TimeframeKey, number | null> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
  All: null,
};

type Props = {
  data: PricePoint[];
  color?: string;
  type?: 'area' | 'line';
  defaultTimeframe?: TimeframeKey;
  showTimeframes?: boolean;
  height?: number;
};

export default function PriceChart({
  data,
  color = COLORS.accent,
  defaultTimeframe = '1M',
  showTimeframes = true,
  height = 300,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeKey>(defaultTimeframe);
  const chartRef = useRef<unknown>(null);
  const seriesRef = useRef<unknown>(null);

  const timeframes = Object.keys(TIMEFRAME_DAYS) as TimeframeKey[];

  const getFilteredData = (tf: TimeframeKey) => {
    const days = TIMEFRAME_DAYS[tf];
    if (!days) return data;
    return data.slice(Math.max(0, data.length - days));
  };

  useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;

    import('lightweight-charts').then((module) => {
      if (destroyed || !containerRef.current) return;
      const { createChart, ColorType, LineStyle } = module;

      const chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: COLORS.inkFaint,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: COLORS.border, style: LineStyle.Solid },
        },
        crosshair: {
          vertLine: { color: COLORS.inkFaint, width: 1, style: LineStyle.Dashed, labelBackgroundColor: COLORS.ink },
          horzLine: { color: COLORS.inkFaint, width: 1, style: LineStyle.Dashed, labelBackgroundColor: COLORS.ink },
        },
        rightPriceScale: {
          borderColor: COLORS.border,
          textColor: COLORS.inkFaint,
        },
        timeScale: {
          borderColor: COLORS.border,
          timeVisible: true,
          secondsVisible: false,
        },
        handleScroll: true,
        handleScale: true,
      });

      const lineSeries = chart.addLineSeries({
        color,
        lineWidth: 2,
        priceLineVisible: false,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: color,
      });

      const filtered = getFilteredData(activeTimeframe);
      lineSeries.setData(
        filtered.map((p) => ({ time: p.date as import('lightweight-charts').Time, value: p.price }))
      );
      chart.timeScale().fitContent();

      chartRef.current = chart;
      seriesRef.current = lineSeries;

      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current && !destroyed) {
          chart.applyOptions({ width: containerRef.current.clientWidth });
        }
      });
      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    });

    return () => {
      destroyed = true;
      if (chartRef.current) {
        (chartRef.current as { remove: () => void }).remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;
    const filtered = getFilteredData(activeTimeframe);
    (seriesRef.current as { setData: (d: unknown[]) => void }).setData(
      filtered.map((p) => ({ time: p.date as import('lightweight-charts').Time, value: p.price }))
    );
    (chartRef.current as { timeScale: () => { fitContent: () => void } }).timeScale().fitContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTimeframe, data]);

  return (
    <div className="flex flex-col gap-3">
      {showTimeframes && (
        <div className="flex items-center gap-0 text-xs font-mono text-ink-faint">
          {timeframes.map((tf, i) => (
            <span key={tf} className="flex items-center">
              {i > 0 && <span className="px-1.5 select-none">·</span>}
              <button
                onClick={() => setActiveTimeframe(tf)}
                className={`transition-colors duration-150 ${
                  activeTimeframe === tf
                    ? 'font-semibold text-ink border-b border-accent'
                    : 'hover:text-ink-muted'
                }`}
              >
                {tf}
              </button>
            </span>
          ))}
        </div>
      )}
      <div ref={containerRef} style={{ height }} className="w-full" />
    </div>
  );
}
