'use client';

import { useEffect, useRef, useState } from 'react';
import { COLORS, MATERIAL_COLORS } from '@/lib/colors';

type TimeframeKey = '1W' | '1M' | '3M' | '1Y' | 'All';

const TIMEFRAME_DAYS: Record<TimeframeKey, number | null> = {
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
  All: null,
};

type Series = {
  slug: string;
  name: string;
  data: { date: string; value: number }[];
};

type Props = {
  series: Series[];
  height?: number;
};

export default function MultiLineChart({ series, height = 340 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeKey>('1Y');
  const chartRef = useRef<unknown>(null);
  const seriesMapRef = useRef<Map<string, unknown>>(new Map());
  const timeframes = Object.keys(TIMEFRAME_DAYS) as TimeframeKey[];

  const getFilteredData = (data: { date: string; value: number }[], tf: TimeframeKey) => {
    const days = TIMEFRAME_DAYS[tf];
    if (!days) return data;
    return data.slice(Math.max(0, data.length - days));
  };

  useEffect(() => {
    if (!containerRef.current || series.length === 0) return;
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
        timeScale: { borderColor: COLORS.border },
        handleScroll: true,
        handleScale: true,
      });

      seriesMapRef.current.clear();

      for (const s of series) {
        const color = MATERIAL_COLORS[s.slug] ?? '#8B949E';
        const lineSeries = chart.addLineSeries({
          color,
          lineWidth: 2,
          priceLineVisible: false,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
          crosshairMarkerBackgroundColor: color,
          title: s.name,
        });
        const filtered = getFilteredData(s.data, activeTimeframe);
        lineSeries.setData(
          filtered.map((p) => ({ time: p.date as import('lightweight-charts').Time, value: p.value }))
        );
        seriesMapRef.current.set(s.slug, lineSeries);
      }

      chart.timeScale().fitContent();
      chartRef.current = chart;

      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current && !destroyed) {
          chart.applyOptions({ width: containerRef.current.clientWidth });
        }
      });
      resizeObserver.observe(containerRef.current);
    });

    return () => {
      destroyed = true;
      if (chartRef.current) {
        (chartRef.current as { remove: () => void }).remove();
        chartRef.current = null;
        seriesMapRef.current.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    for (const s of series) {
      const lineSeries = seriesMapRef.current.get(s.slug);
      if (!lineSeries) continue;
      const filtered = getFilteredData(s.data, activeTimeframe);
      (lineSeries as { setData: (d: unknown[]) => void }).setData(
        filtered.map((p) => ({ time: p.date as import('lightweight-charts').Time, value: p.value }))
      );
    }
    (chartRef.current as { timeScale: () => { fitContent: () => void } }).timeScale().fitContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTimeframe, series]);

  return (
    <div className="flex flex-col gap-2">
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
      <div ref={containerRef} style={{ height }} className="w-full" />
    </div>
  );
}
