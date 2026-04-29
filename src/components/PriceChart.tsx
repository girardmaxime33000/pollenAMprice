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

type ChartType = 'area' | 'line';

type Props = {
  data: PricePoint[];
  color?: string;
  type?: ChartType;
  defaultTimeframe?: TimeframeKey;
  showTimeframes?: boolean;
  height?: number;
};

export default function PriceChart({
  data,
  color = COLORS.accent,
  type = 'area',
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
          textColor: COLORS.textSecondary,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
        },
        grid: {
          vertLines: { color: COLORS.border, style: LineStyle.Dotted },
          horzLines: { color: COLORS.border, style: LineStyle.Dotted },
        },
        crosshair: {
          vertLine: { color: COLORS.textSecondary, width: 1, style: LineStyle.Dashed, labelBackgroundColor: COLORS.surface },
          horzLine: { color: COLORS.textSecondary, width: 1, style: LineStyle.Dashed, labelBackgroundColor: COLORS.surface },
        },
        rightPriceScale: {
          borderColor: COLORS.border,
          textColor: COLORS.textSecondary,
        },
        timeScale: {
          borderColor: COLORS.border,
          timeVisible: true,
          secondsVisible: false,
        },
        handleScroll: true,
        handleScale: true,
      });

      let series: unknown;

      if (type === 'area') {
        const areaSeries = chart.addAreaSeries({
          lineColor: color,
          topColor: `${color}40`,
          bottomColor: `${color}05`,
          lineWidth: 2,
          priceLineVisible: true,
          priceLineColor: `${color}80`,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
          crosshairMarkerBackgroundColor: color,
        });
        series = areaSeries;
      } else {
        const lineSeries = chart.addLineSeries({
          color,
          lineWidth: 2,
          priceLineVisible: true,
          priceLineColor: `${color}80`,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
          crosshairMarkerBackgroundColor: color,
        });
        series = lineSeries;
      }

      const filtered = getFilteredData(activeTimeframe);
      const chartData = filtered.map((p) => ({
        time: p.date as import('lightweight-charts').Time,
        value: p.price,
      }));

      (series as { setData: (d: unknown[]) => void }).setData(chartData);
      chart.timeScale().fitContent();

      chartRef.current = chart;
      seriesRef.current = series;

      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current && !destroyed) {
          chart.applyOptions({ width: containerRef.current.clientWidth });
        }
      });
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
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
    const chartData = filtered.map((p) => ({
      time: p.date as import('lightweight-charts').Time,
      value: p.price,
    }));
    (seriesRef.current as { setData: (d: unknown[]) => void }).setData(chartData);
    (chartRef.current as { timeScale: () => { fitContent: () => void } }).timeScale().fitContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTimeframe, data]);

  return (
    <div className="flex flex-col gap-2">
      {showTimeframes && (
        <div className="flex items-center gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeframe(tf)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
                activeTimeframe === tf
                  ? 'bg-[#E07A1F] text-white'
                  : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161B22]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      )}
      <div ref={containerRef} style={{ height }} className="w-full" />
    </div>
  );
}
