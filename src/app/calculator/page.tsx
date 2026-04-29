import type { Metadata } from 'next';
import CalculatorWrapper from '@/components/CalculatorWrapper';

export const metadata: Metadata = {
  title: 'Cost Calculator — Pollen Polymer Index',
  description:
    'Compare pellet vs filament material costs for 3D printing. See how much you save with Pollen AM open pellet extrusion.',
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-[#E6EDF3]">3D Printing Cost Calculator</h1>
          <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#E07A1F]/15 text-[#E07A1F]">
            Pellet vs Filament
          </span>
        </div>
        <p className="text-sm text-[#8B949E]">
          Calculate the material cost advantage of open pellet extrusion vs standard filament FDM.
          Configure your part and batch size to see the savings.
        </p>
      </div>

      {/* Info strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Avg pellet discount', value: '93%', sub: 'vs retail filament' },
          { label: 'Typical multiplier', value: '8–18×', sub: 'cheaper than filament/kg' },
          { label: 'Materials available', value: '5', sub: 'industrial grades' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 rounded-xl border border-[#21262D] bg-[#161B22] px-4 py-3"
          >
            <span className="font-mono text-2xl font-bold text-[#E07A1F]">{stat.value}</span>
            <span className="text-xs font-semibold text-[#E6EDF3]">{stat.label}</span>
            <span className="text-[10px] text-[#8B949E]">{stat.sub}</span>
          </div>
        ))}
      </div>

      <CalculatorWrapper />

      {/* Methodology note */}
      <div className="mt-8 rounded-xl border border-[#21262D] bg-[#161B22] p-4">
        <h3 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider mb-2">Methodology</h3>
        <p className="text-xs text-[#8B949E] leading-relaxed">
          Material weight is calculated as:{' '}
          <span className="font-mono text-[#E6EDF3]">
            volume × density × (infill / 100) × (1 + waste / 100)
          </span>
          . Pellet prices are live market spot prices from the Pollen Polymer Index. Filament
          equivalent prices represent typical retail pricing for the corresponding material grade.
          Savings represent the raw material cost difference only and do not include machine
          amortisation, labour, or post-processing.
        </p>
      </div>
    </div>
  );
}
