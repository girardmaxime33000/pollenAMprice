'use client';

import { useState, useCallback } from 'react';
import { materials } from '@/data/materials';
import { getLatestPrice } from '@/data/materials';
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

  // Weight = volume (cm³) * density (g/cm³) * infill fraction
  // +waste fraction on top
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
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs text-[#8B949E]">{label}</label>
          <span className="font-mono text-xs text-[#E6EDF3]">
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
          className="w-full accent-[#E07A1F] cursor-pointer"
          aria-label={label}
        />
        <div className="flex justify-between text-[10px] text-[#8B949E] font-mono">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    ),
    []
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="flex flex-col gap-5 p-5 rounded-xl bg-[#161B22] border border-[#21262D]">
        <h3 className="text-sm font-semibold text-[#E6EDF3]">Configuration</h3>

        {/* Material */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#8B949E]">Material</label>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-lg border border-[#21262D] bg-[#0B0E14] px-3 py-2 text-sm font-mono text-[#E6EDF3] focus:border-[#E07A1F] focus:outline-none transition-colors"
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
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#8B949E]">Part volume</label>
            <span className="font-mono text-xs text-[#E6EDF3]">{volume} cm³</span>
          </div>
          <input
            type="number"
            min={1}
            max={10000}
            value={volume}
            onChange={(e) => setVolume(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-[#21262D] bg-[#0B0E14] px-3 py-2 text-sm font-mono text-[#E6EDF3] focus:border-[#E07A1F] focus:outline-none transition-colors"
            aria-label="Part volume in cubic centimetres"
          />
        </div>

        <SliderRow label="Infill" value={infill} min={5} max={100} unit="%" onChange={setInfill} />
        <SliderRow label="Waste (purge + supports)" value={waste} min={0} max={30} unit="%" onChange={setWaste} />

        {/* Batch size */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#8B949E]">Batch size</label>
            <span className="font-mono text-xs text-[#E6EDF3]">{batch} parts</span>
          </div>
          <input
            type="number"
            min={1}
            max={10000}
            value={batch}
            onChange={(e) => setBatch(Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-[#21262D] bg-[#0B0E14] px-3 py-2 text-sm font-mono text-[#E6EDF3] focus:border-[#E07A1F] focus:outline-none transition-colors"
            aria-label="Batch size in parts"
          />
        </div>
      </div>

      {/* Outputs */}
      <div className="flex flex-col gap-4">
        {/* Cost cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Pellet */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#161B22] border border-[#26A69A]/30">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#26A69A]" />
              <span className="text-xs font-semibold text-[#26A69A]">Pellet (Pollen AM)</span>
            </div>
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-mono text-[10px] text-[#8B949E]">Weight / part</span>
                <div className="font-mono text-sm font-bold text-[#E6EDF3]">{formatWeight(partWeightG)}</div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#8B949E]">Cost / part</span>
                <div className="font-mono text-base font-bold text-[#E6EDF3]">{formatCurrency(pelletCostPerPart)}</div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#8B949E]">Batch ({batch} parts)</span>
                <div className="font-mono text-lg font-bold text-[#26A69A]">{formatCurrency(pelletBatchCost)}</div>
              </div>
            </div>
          </div>

          {/* Filament */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#161B22] border border-[#8B949E]/20">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#8B949E]" />
              <span className="text-xs font-semibold text-[#8B949E]">Filament (FDM)</span>
            </div>
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-mono text-[10px] text-[#8B949E]">Weight / part</span>
                <div className="font-mono text-sm font-bold text-[#E6EDF3]">{formatWeight(partWeightG)}</div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#8B949E]">Cost / part</span>
                <div className="font-mono text-base font-bold text-[#E6EDF3]">{formatCurrency(filamentCostPerPart)}</div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#8B949E]">Batch ({batch} parts)</span>
                <div className="font-mono text-lg font-bold text-[#EF5350]">{formatCurrency(filamentBatchCost)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Savings hero */}
        <div className="flex flex-col gap-3 p-5 rounded-xl bg-[#E07A1F]/10 border border-[#E07A1F]/30">
          <div className="text-xs font-semibold text-[#E07A1F] uppercase tracking-wider">
            Savings with Pollen AM pellets
          </div>

          {/* Bar comparison */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#8B949E] w-16 text-right font-mono">Pellet</span>
              <div className="flex-1 h-4 rounded bg-[#21262D] overflow-hidden">
                <div
                  className="h-full rounded bg-[#26A69A] transition-all duration-300"
                  style={{ width: `${Math.min(100, (pelletBatchCost / filamentBatchCost) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-[#26A69A] w-20">{formatCurrency(pelletBatchCost)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#8B949E] w-16 text-right font-mono">Filament</span>
              <div className="flex-1 h-4 rounded bg-[#21262D] overflow-hidden">
                <div className="h-full w-full rounded bg-[#EF5350]/60" />
              </div>
              <span className="text-[10px] font-mono text-[#EF5350] w-20">{formatCurrency(filamentBatchCost)}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold text-[#E07A1F]">
              {formatCurrency(savings)}
            </span>
            <span className="font-mono text-xl font-bold text-[#E07A1F]">
              ({savingsPct.toFixed(1)}% cheaper)
            </span>
          </div>
          <p className="text-xs text-[#8B949E]">
            Saved on a batch of {batch} parts using {material.name} pellets at{' '}
            <span className="font-mono text-[#E6EDF3]">{pelletPrice.toFixed(3)} EUR/kg</span> vs filament at{' '}
            <span className="font-mono text-[#E6EDF3]">{filamentPrice} EUR/kg</span>.
          </p>
        </div>

        {/* CTA */}
        <a
          href={mailtoLink}
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#E07A1F] hover:bg-[#C96E1A] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150"
        >
          Request a Pollen AM quote for this configuration →
        </a>
      </div>
    </div>
  );
}
