'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { materials, getLatestPrice, getPriceChange } from '@/data/materials';
import { normaliseToBase100 } from '@/lib/ppi';
import { formatPriceShort, formatPercent } from '@/lib/formatters';
import { changeTextColor, MATERIAL_COLORS } from '@/lib/colors';

const MultiLineChart = dynamic(() => import('@/components/MultiLineChart'), { ssr: false });

const DEFAULT_SLUGS = ['pp-homo', 'hdpe', 'pa6'];

function avg(history: { price: number }[]): number {
  return history.reduce((s, p) => s + p.price, 0) / history.length;
}

function volatility(history: { price: number }[]): number {
  const a = avg(history);
  const variance = history.reduce((s, p) => s + Math.pow(p.price - a, 2), 0) / history.length;
  return Math.sqrt(variance) / a;
}

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>(DEFAULT_SLUGS);

  const toggleMaterial = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) {
        if (prev.length === 1) return prev;
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 5) return prev;
      return [...prev, slug];
    });
  };

  const selectedMaterials = materials.filter((m) => selected.includes(m.slug));
  const chartSeries = selectedMaterials.map((m) => ({
    slug: m.slug,
    name: m.name,
    data: normaliseToBase100(m.history),
  }));

  const compatLabel = (c: string) => (c === 'yes' ? 'Yes' : c === 'conditional' ? 'Conditional' : 'No');
  const compatColor = (c: string) =>
    c === 'yes' ? '#2F6F4E' : c === 'conditional' ? '#8B6914' : '#B5503C';

  return (
    <div className="mx-auto max-w-[1120px] px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-1">
          MATERIAL COMPARATOR
        </p>
        <h1
          className="font-serif font-semibold text-ink mb-3"
          style={{ fontSize: '48px', letterSpacing: '-0.02em' }}
        >
          Compare materials
        </h1>
        <p className="text-base text-ink-muted max-w-xl">
          Overlay price performance for up to 5 materials. Prices normalised to 100 at series start.
        </p>
      </div>

      {/* Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {materials.map((m) => {
          const isSelected = selected.includes(m.slug);
          const color = MATERIAL_COLORS[m.slug] ?? '#A8A8A0';
          return (
            <button
              key={m.slug}
              onClick={() => toggleMaterial(m.slug)}
              className="px-3 py-1.5 text-xs font-mono font-medium border transition-colors duration-150"
              style={
                isSelected
                  ? { borderColor: color, color, background: 'transparent' }
                  : { borderColor: '#E5E5E0', color: '#A8A8A0', background: 'transparent' }
              }
              aria-pressed={isSelected}
            >
              {m.name}
            </button>
          );
        })}
        <span className="text-xs text-ink-faint ml-2">
          {selected.length}/5
        </span>
      </div>

      {/* Chart legend */}
      <div className="flex flex-wrap gap-5 mb-4">
        {selectedMaterials.map((m) => (
          <div key={m.slug} className="flex items-center gap-2">
            <span
              className="inline-block h-px w-6"
              style={{ backgroundColor: MATERIAL_COLORS[m.slug] ?? '#A8A8A0' }}
            />
            <span className="font-mono text-xs text-ink-muted uppercase tracking-[0.04em]">{m.name}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="border border-line p-4 mb-16">
        <MultiLineChart series={chartSeries} height={340} />
      </div>

      {/* Comparison table */}
      <div className="mb-12">
        <h2
          className="font-serif font-semibold text-ink border-b border-line pb-4 mb-0"
          style={{ fontSize: '28px', letterSpacing: '-0.01em' }}
        >
          Side-by-side comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #1A1A1A' }}>
                <th className="py-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint w-36">Metric</th>
                {selectedMaterials.map((m) => (
                  <th key={m.slug} className="py-3 text-right text-[11px] font-mono font-semibold tracking-[0.04em] uppercase" style={{ color: MATERIAL_COLORS[m.slug] ?? '#A8A8A0' }}>
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'Current price',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-sm text-ink tabular">
                      {formatPriceShort(getLatestPrice(m))} EUR/kg
                    </span>
                  ),
                },
                {
                  label: '30d change',
                  render: (m: typeof materials[0]) => {
                    const c = getPriceChange(m, 30);
                    return (
                      <span className="font-mono text-sm tabular" style={{ color: changeTextColor(c) }}>
                        {c >= 0 ? '+' : ''}{formatPercent(c)}
                      </span>
                    );
                  },
                },
                {
                  label: '12m avg',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-sm text-ink tabular">
                      {avg(m.history.slice(-365)).toFixed(3)} EUR/kg
                    </span>
                  ),
                },
                {
                  label: 'Volatility (ann.)',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-sm text-ink tabular">
                      {(volatility(m.history.slice(-365)) * 100).toFixed(1)}%
                    </span>
                  ),
                },
                {
                  label: 'Density',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-sm text-ink tabular">{m.density} g/cm³</span>
                  ),
                },
                {
                  label: '3D print',
                  render: (m: typeof materials[0]) => (
                    <span className="text-sm font-medium capitalize" style={{ color: compatColor(m.printing3D.compatible) }}>
                      {compatLabel(m.printing3D.compatible)}
                    </span>
                  ),
                },
                {
                  label: 'Filament equiv.',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-sm text-down tabular">
                      {m.filamentEquivalentPricePerKg} EUR/kg
                    </span>
                  ),
                },
                {
                  label: 'Pellet savings',
                  render: (m: typeof materials[0]) => {
                    const mult = m.filamentEquivalentPricePerKg / getLatestPrice(m);
                    return (
                      <span className="font-mono text-sm font-semibold text-accent tabular">
                        {mult.toFixed(1)}×
                      </span>
                    );
                  },
                },
              ].map(({ label, render }) => (
                <tr key={label} className="border-b border-line hover:bg-[#F2F2EE] transition-colors duration-150">
                  <td className="py-4 text-sm text-ink-muted">{label}</td>
                  {selectedMaterials.map((m) => (
                    <td key={m.slug} className="py-4 text-right">
                      {render(m)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-6 pt-4 border-t border-line">
        <Link
          href="/calculator"
          className="bg-ink text-bg px-5 py-3 text-sm font-medium hover:bg-black transition-colors duration-150"
        >
          Calculate costs
        </Link>
        <Link
          href="/materials"
          className="text-sm text-ink-muted hover:text-ink transition-colors duration-150 underline-offset-2 hover:underline"
        >
          View all materials
        </Link>
      </div>
    </div>
  );
}
