'use client';

import { useState, useCallback } from 'react';
import { materials, getLatestPrice } from '@/data/materials';
import { formatCurrency, formatWeight } from '@/lib/formatters';

export default function CalculatorForm({ defaultSlug }: { defaultSlug?: string }) {
  const [slug, setSlug] = useState(defaultSlug ?? 'pp-homo');
  const [volume, setVolume] = useState(50);
  const [infill, setInfill] = useState(30);
  const [waste, setWaste] = useState(10);
  const [batch, setBatch] = useState(100);

  const material = materials.find((m) => m.slug === slug) ?? materials[0];
  const pelletPrice = getLatestPrice(material);
  const filamentPrice = material.filamentEquivalentPricePerKg;

  const partWeightG = volume * material.density * (infill / 100) * (1 + waste / 100);
  const partWeightKg = partWeightG / 1000;

  const pelletCostPerPart = partWeightKg * pelletPrice;
  const filamentCostPerPart = partWeightKg * filamentPrice;
  const pelletBatchCost = pelletCostPerPart * batch;
  const filamentBatchCost = filamentCostPerPart * batch;
  const savings = filamentBatchCost - pelletBatchCost;
  const savingsPct = filamentBatchCost > 0 ? (savings / filamentBatchCost) * 100 : 0;

  const mailtoBody = encodeURIComponent(
    `Configuration:\n- Material: ${material.fullName}\n- Part volume: ${volume} cm³\n- Infill: ${infill}%\n- Waste: ${waste}%\n- Batch size: ${batch}\n\nEstimated savings vs filament: ${formatCurrency(savings)} (${savingsPct.toFixed(1)}%)\n\nPlease send a quote for this configuration.`
  );
  const mailtoLink = `mailto:contact@pollen.am?subject=${encodeURIComponent(`Quote request — ${material.name} pellet configuration`)}&body=${mailtoBody}`;

  const SliderRow = useCallback(
    ({
      label,
      value,
      min,
      max,
      step = 1,
      unit,
      onChange,
    }: {
      label: string;
      value: number;
      min: number;
      max: number;
      step?: number;
      unit: string;
      onChange: (v: number) => void;
    }) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">
            {label}
          </label>
          <span className="font-mono text-sm text-ink tabular">
            {value} {unit}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full cursor-pointer calc-slider"
          aria-label={label}
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            height: '2px',
            background: `linear-gradient(to right, #1A1A1A ${((value - min) / (max - min)) * 100}%, #E5E5E0 ${((value - min) / (max - min)) * 100}%)`,
            outline: 'none',
          }}
        />
        <div className="flex justify-between text-[10px] text-ink-faint font-mono tabular">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    ),
    []
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      {/* Inputs */}
      <div className="flex flex-col gap-6">
        <p className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint border-b border-line pb-3">
          Configuration
        </p>

        {/* Material select */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">
            Material
          </label>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border-0 border-b border-line bg-transparent px-0 py-2 text-sm font-mono text-ink focus:border-ink-strong focus:outline-none transition-colors"
            aria-label="Select material"
          >
            {materials.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.name} — {m.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Part volume */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">
              Part volume
            </label>
            <span className="font-mono text-sm text-ink tabular">{volume} cm³</span>
          </div>
          <input
            type="number"
            min={1}
            max={10000}
            value={volume}
            onChange={(e) => setVolume(Math.max(1, Number(e.target.value)))}
            className="w-full border-0 border-b border-line bg-transparent px-0 py-2 text-sm font-mono text-ink focus:border-ink focus:outline-none transition-colors tabular"
            aria-label="Part volume in cubic centimetres"
          />
        </div>

        <SliderRow label="Infill" value={infill} min={5} max={100} unit="%" onChange={setInfill} />
        <SliderRow label="Waste (purge + supports)" value={waste} min={0} max={30} unit="%" onChange={setWaste} />

        {/* Batch size */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">
              Batch size
            </label>
            <span className="font-mono text-sm text-ink tabular">{batch} parts</span>
          </div>
          <input
            type="number"
            min={1}
            max={10000}
            value={batch}
            onChange={(e) => setBatch(Math.max(1, Number(e.target.value)))}
            className="w-full border-0 border-b border-line bg-transparent px-0 py-2 text-sm font-mono text-ink focus:border-ink focus:outline-none transition-colors tabular"
            aria-label="Batch size in parts"
          />
        </div>
      </div>

      {/* Output card */}
      <div
        className="flex flex-col gap-6 p-8 border border-line"
        style={{ background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)' }}
      >
        {/* Per-part comparison */}
        <div>
          <p className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint border-b border-line pb-3 mb-4">
            Cost comparison · {batch} parts
          </p>
          <div className="flex flex-col gap-0">
            <div className="flex items-center justify-between py-3 border-b border-line">
              <span className="text-sm text-ink-muted">Weight / part</span>
              <span className="font-mono text-sm text-ink tabular">{formatWeight(partWeightG)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-line">
              <span className="text-sm text-ink-muted">Pellet cost / part</span>
              <span className="font-mono text-sm text-ink tabular">{formatCurrency(pelletCostPerPart)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-line">
              <span className="text-sm text-ink-muted">Filament cost / part</span>
              <span className="font-mono text-sm text-down tabular">{formatCurrency(filamentCostPerPart)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-line">
              <span className="text-sm text-ink-muted">Pellet batch total</span>
              <span className="font-mono text-sm text-up tabular">{formatCurrency(pelletBatchCost)}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-ink-muted">Filament batch total</span>
              <span className="font-mono text-sm text-down tabular">{formatCurrency(filamentBatchCost)}</span>
            </div>
          </div>
        </div>

        {/* Savings hero */}
        <div className="border-t border-line-strong pt-6">
          <p className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-3">
            Savings with Pollen AM pellets
          </p>
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className="font-mono font-medium tabular"
              style={{ fontSize: '64px', lineHeight: 1, letterSpacing: '-0.02em', color: '#D2691E' }}
            >
              {formatCurrency(savings)}
            </span>
          </div>
          <p className="font-mono text-base text-ink-muted tabular">
            {savingsPct.toFixed(1)}% cheaper than filament
          </p>
          <p className="mt-3 text-xs text-ink-faint leading-relaxed">
            {material.name} pellets at{' '}
            <span className="font-mono tabular">{pelletPrice.toFixed(3)} EUR/kg</span> vs filament at{' '}
            <span className="font-mono tabular">{filamentPrice} EUR/kg</span>
          </p>
        </div>

        {/* CTA */}
        <a
          href={mailtoLink}
          className="flex items-center justify-center w-full bg-ink text-bg px-5 py-3 text-sm font-medium hover:bg-black transition-colors duration-150"
        >
          Request a Pollen AM quote for this configuration
        </a>
      </div>
    </div>
  );
}
