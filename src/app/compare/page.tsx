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
        if (prev.length === 1) return prev; // keep at least 1
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
  const compatColor = (c: string) => (c === 'yes' ? '#26A69A' : c === 'conditional' ? '#F59E0B' : '#EF5350');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#E6EDF3]">Material Comparator</h1>
        <p className="mt-1 text-sm text-[#8B949E]">
          Overlay price performance for up to 5 materials. Prices normalised to 100 at series start.
        </p>
      </div>

      {/* Pill selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {materials.map((m) => {
          const isSelected = selected.includes(m.slug);
          const color = MATERIAL_COLORS[m.slug] ?? '#8B949E';
          return (
            <button
              key={m.slug}
              onClick={() => toggleMaterial(m.slug)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium font-mono transition-all duration-150"
              style={
                isSelected
                  ? { borderColor: color, backgroundColor: `${color}20`, color }
                  : { borderColor: '#21262D', backgroundColor: 'transparent', color: '#8B949E' }
              }
              aria-pressed={isSelected}
            >
              {isSelected && (
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
              )}
              {m.name}
            </button>
          );
        })}
        <span className="self-center text-xs text-[#8B949E]">
          {selected.length}/5 selected
        </span>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-[#21262D] bg-[#161B22] p-4 mb-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-3">
          {selectedMaterials.map((m) => (
            <div key={m.slug} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: MATERIAL_COLORS[m.slug] ?? '#8B949E' }}
              />
              <span className="font-mono text-xs text-[#8B949E]">{m.name}</span>
            </div>
          ))}
        </div>
        <MultiLineChart series={chartSeries} height={340} />
      </div>

      {/* Comparison table */}
      <div className="rounded-xl border border-[#21262D] bg-[#161B22] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#21262D]">
          <h2 className="text-sm font-semibold text-[#E6EDF3]">Side-by-Side Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#21262D]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wider w-32">Metric</th>
                {selectedMaterials.map((m) => (
                  <th key={m.slug} className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: MATERIAL_COLORS[m.slug] ?? '#8B949E' }}>
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262D]">
              {[
                {
                  label: 'Current Price',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-xs font-semibold text-[#E6EDF3]">
                      {formatPriceShort(getLatestPrice(m))} EUR/kg
                    </span>
                  ),
                },
                {
                  label: '30d Change',
                  render: (m: typeof materials[0]) => {
                    const c = getPriceChange(m, 30);
                    return (
                      <span className="font-mono text-xs font-semibold" style={{ color: changeTextColor(c) }}>
                        {formatPercent(c)}
                      </span>
                    );
                  },
                },
                {
                  label: '12m Avg',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-xs text-[#E6EDF3]">
                      {avg(m.history.slice(-365)).toFixed(3)} EUR/kg
                    </span>
                  ),
                },
                {
                  label: 'Volatility (ann.)',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-xs text-[#E6EDF3]">
                      {(volatility(m.history.slice(-365)) * 100).toFixed(1)}%
                    </span>
                  ),
                },
                {
                  label: 'Density',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-xs text-[#E6EDF3]">{m.density} g/cm³</span>
                  ),
                },
                {
                  label: '3D Print',
                  render: (m: typeof materials[0]) => (
                    <span className="text-xs font-medium" style={{ color: compatColor(m.printing3D.compatible) }}>
                      {compatLabel(m.printing3D.compatible)}
                    </span>
                  ),
                },
                {
                  label: 'Filament equiv.',
                  render: (m: typeof materials[0]) => (
                    <span className="font-mono text-xs text-[#EF5350]">
                      {m.filamentEquivalentPricePerKg} EUR/kg
                    </span>
                  ),
                },
                {
                  label: 'Pellet savings',
                  render: (m: typeof materials[0]) => {
                    const mult = m.filamentEquivalentPricePerKg / getLatestPrice(m);
                    return (
                      <span className="font-mono text-xs font-bold text-[#E07A1F]">
                        {mult.toFixed(1)}×
                      </span>
                    );
                  },
                },
              ].map(({ label, render }) => (
                <tr key={label} className="hover:bg-[#0B0E14]/40 transition-colors">
                  <td className="px-4 py-3 text-xs text-[#8B949E]">{label}</td>
                  {selectedMaterials.map((m) => (
                    <td key={m.slug} className="px-4 py-3 text-right">
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
      <div className="mt-6 flex items-center gap-4">
        <Link
          href="/calculator"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#E07A1F] hover:bg-[#C96E1A] px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          Calculate costs →
        </Link>
        <Link
          href="/materials"
          className="text-xs text-[#8B949E] hover:text-[#E07A1F] transition-colors"
        >
          View all materials
        </Link>
      </div>
    </div>
  );
}
