import type { Metadata } from 'next';
import CalculatorWrapper from '@/components/CalculatorWrapper';

export const metadata: Metadata = {
  title: 'Cost Calculator — Pollen Polymer Index',
  description:
    'Compare pellet vs filament material costs for 3D printing. See how much you save with Pollen AM open pellet extrusion.',
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-8 py-16">
      {/* Header */}
      <div className="mb-16">
        <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-1">
          COST CALCULATOR
        </p>
        <h1
          className="font-serif font-semibold text-ink mb-4"
          style={{ fontSize: '48px', letterSpacing: '-0.02em' }}
        >
          Pellet vs filament
        </h1>
        <p className="text-base text-ink-muted max-w-xl">
          Configure your part and batch size to see the material cost advantage of open pellet extrusion.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-12 mb-16 pb-16 border-b border-line">
        {[
          { value: '93%', label: 'Average pellet discount vs retail filament' },
          { value: '8–18×', label: 'Typical cost multiplier per kg' },
          { value: '5', label: 'Industrial grades tracked' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span
              className="font-mono font-medium text-accent tabular"
              style={{ fontSize: '36px', lineHeight: 1, letterSpacing: '-0.02em' }}
            >
              {stat.value}
            </span>
            <span className="text-sm text-ink-muted max-w-[160px]">{stat.label}</span>
          </div>
        ))}
      </div>

      <CalculatorWrapper />

      {/* Methodology */}
      <div className="mt-16 pt-8 border-t border-line">
        <p className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-3">METHODOLOGY</p>
        <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
          Material weight is calculated as{' '}
          <span className="font-mono text-ink">volume × density × (infill / 100) × (1 + waste / 100)</span>.
          Pellet prices are live market spot prices from the Pollen Polymer Index. Filament equivalent prices
          represent typical retail pricing for the corresponding material grade. Savings represent the raw
          material cost difference only and do not include machine amortisation, labour, or post-processing.
        </p>
      </div>
    </div>
  );
}
