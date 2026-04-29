import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — Pollen Polymer Index',
  description: 'About the Pollen Polymer Index — the reference price tracker for industrial polymer pellets used in 3D printing, powered by Pollen AM.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#E6EDF3]">About Pollen Polymer Index</h1>
        <div className="mt-1 h-px w-16 bg-[#E07A1F]" />
      </div>

      <div className="flex flex-col gap-8">
        {/* What is PPI */}
        <section className="rounded-xl border border-[#21262D] bg-[#161B22] p-6">
          <h2 className="text-base font-semibold text-[#E6EDF3] mb-3">What is the Pollen Polymer Index?</h2>
          <p className="text-sm text-[#8B949E] leading-relaxed">
            The Pollen Polymer Index (PPI) is a weighted composite price indicator covering five
            polymer pellet grades most relevant to industrial 3D printing: PP Homo, HDPE, PA6, PETG,
            and rPET. It is designed to give manufacturing operations running pellet-based extrusion
            systems a single reference number for raw material cost benchmarking — the equivalent of
            a Bloomberg commodity index, but scoped to the plastics grades that matter for additive
            manufacturing.
          </p>
          <p className="text-sm text-[#8B949E] leading-relaxed mt-3">
            The index is a simple weighted average, with weights reflecting typical consumption
            patterns in industrial FFF (Fused Filament Fabrication) and pellet extrusion
            applications: PP Homo 35%, HDPE 30%, PETG 15%, PA6 10%, rPET 10%.
          </p>
        </section>

        {/* Powered by Pollen AM */}
        <section className="rounded-xl border border-[#E07A1F]/20 bg-[#E07A1F]/5 p-6">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 h-8 w-8 rounded-lg bg-[#E07A1F]/20 flex items-center justify-center shrink-0">
              <span className="text-[#E07A1F] font-mono text-sm font-bold">P</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#E6EDF3] mb-2">Powered by Pollen AM</h2>
              <p className="text-sm text-[#8B949E] leading-relaxed">
                This tool is built and maintained by{' '}
                <a
                  href="https://pollen.am"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E07A1F] hover:underline"
                >
                  Pollen AM
                </a>
                , a French industrial 3D printer manufacturer specialising in open pellet-based
                extrusion systems. Pollen AM machines accept standard polymer pellets directly —
                the same granules used in injection moulding — rather than pre-processed filament.
                This eliminates the filament conversion cost (typically 8–18× the raw pellet
                price), making large-format and high-volume 3D printing dramatically more
                economical.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="rounded-xl border border-[#21262D] bg-[#161B22] p-6">
          <h2 className="text-base font-semibold text-[#E6EDF3] mb-3">Methodology</h2>
          <div className="flex flex-col gap-4 text-sm text-[#8B949E] leading-relaxed">
            <p>
              Price data is sourced from European spot market assessments and published contract
              ranges. Prices are expressed in EUR per kilogram (EUR/kg) on a delivered European
              basis. The index is updated daily on business days.
            </p>
            <p>
              The Pollen Polymer Index value is computed as:
            </p>
            <div className="rounded-lg bg-[#0B0E14] border border-[#21262D] px-4 py-3 font-mono text-xs text-[#E6EDF3]">
              PPI = 0.35 × PP + 0.30 × HDPE + 0.15 × PETG + 0.10 × PA6 + 0.10 × rPET
            </div>
            <p>
              Historical data covers a rolling 2-year window. Volatility metrics are computed as
              annualised standard deviation of daily log returns. The filament equivalent prices
              used in the cost calculator represent indicative retail pricing for the corresponding
              material grades and are not tied to specific resellers.
            </p>
          </div>

          {/* Weights table */}
          <div className="mt-4 rounded-lg border border-[#21262D] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#21262D] bg-[#0B0E14]/60">
                  <th className="px-3 py-2 text-left text-[#8B949E] font-semibold uppercase tracking-wider">Material</th>
                  <th className="px-3 py-2 text-right text-[#8B949E] font-semibold uppercase tracking-wider">PPI Weight</th>
                  <th className="px-3 py-2 text-right text-[#8B949E] font-semibold uppercase tracking-wider">Family</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262D]">
                {[
                  { name: 'PP Homo', weight: '35%', family: 'Commodity' },
                  { name: 'HDPE', weight: '30%', family: 'Commodity' },
                  { name: 'PETG', weight: '15%', family: 'Engineering' },
                  { name: 'PA6', weight: '10%', family: 'Engineering' },
                  { name: 'rPET', weight: '10%', family: 'Recycled' },
                ].map((row) => (
                  <tr key={row.name} className="hover:bg-[#0B0E14]/40 transition-colors">
                    <td className="px-3 py-2 font-mono font-bold text-[#E6EDF3]">{row.name}</td>
                    <td className="px-3 py-2 text-right font-mono text-[#E07A1F] font-semibold">{row.weight}</td>
                    <td className="px-3 py-2 text-right text-[#8B949E]">{row.family}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-xl border border-[#21262D] bg-[#161B22] p-6">
          <h2 className="text-base font-semibold text-[#E6EDF3] mb-3">Disclaimer</h2>
          <p className="text-xs text-[#8B949E] leading-relaxed">
            This platform is a demonstration MVP. All price data shown is simulated for
            illustrative purposes and does not represent actual market prices. It is not intended
            as financial, commercial, or procurement advice. Pollen AM makes no representations
            as to the accuracy or completeness of the information presented. Do not make
            purchasing or investment decisions based solely on this tool.
          </p>
        </section>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/calculator"
            className="rounded-lg bg-[#E07A1F] hover:bg-[#C96E1A] px-4 py-2.5 text-sm font-semibold text-white transition-colors"
          >
            Try the calculator →
          </Link>
          <Link
            href="/materials"
            className="text-sm text-[#8B949E] hover:text-[#E07A1F] transition-colors"
          >
            Browse materials
          </Link>
        </div>
      </div>
    </div>
  );
}
