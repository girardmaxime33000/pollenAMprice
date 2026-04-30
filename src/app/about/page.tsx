import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — Pollen Polymer Index',
  description: 'About the Pollen Polymer Index — the reference price tracker for industrial polymer pellets used in 3D printing, powered by Pollen AM.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-8 py-16">
      {/* Header */}
      <div className="mb-16">
        <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-1">
          ABOUT
        </p>
        <h1
          className="font-serif font-semibold text-ink border-b border-line pb-8"
          style={{ fontSize: '48px', letterSpacing: '-0.02em' }}
        >
          Pollen Polymer Index
        </h1>
      </div>

      <div className="flex flex-col gap-16 max-w-2xl">
        {/* What is PPI */}
        <section>
          <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">OVERVIEW</p>
          <h2
            className="font-serif font-semibold text-ink border-b border-line pb-4 mb-6"
            style={{ fontSize: '28px', letterSpacing: '-0.01em' }}
          >
            What is the Pollen Polymer Index?
          </h2>
          <div className="flex flex-col gap-4 text-base text-ink-muted leading-relaxed">
            <p>
              The Pollen Polymer Index (PPI) is a weighted composite price indicator covering five
              polymer pellet grades most relevant to industrial 3D printing: PP Homo, HDPE, PA6, PETG,
              and rPET. It is designed to give manufacturing operations running pellet-based extrusion
              systems a single reference number for raw material cost benchmarking.
            </p>
            <p>
              The index uses a simple weighted average, with weights reflecting typical consumption
              patterns in industrial FFF and pellet extrusion applications: PP Homo 35%, HDPE 30%,
              PETG 15%, PA6 10%, rPET 10%.
            </p>
          </div>
        </section>

        {/* Pollen AM */}
        <section>
          <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">THE COMPANY</p>
          <h2
            className="font-serif font-semibold text-ink border-b border-line pb-4 mb-6"
            style={{ fontSize: '28px', letterSpacing: '-0.01em' }}
          >
            Powered by Pollen AM
          </h2>
          <div className="flex flex-col gap-4 text-base text-ink-muted leading-relaxed">
            <p>
              This tool is built and maintained by{' '}
              <a
                href="https://pollen.am"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-2 hover:text-accent transition-colors"
              >
                Pollen AM
              </a>
              , a French industrial 3D printer manufacturer specialising in open pellet-based extrusion
              systems. Pollen AM machines accept standard polymer pellets directly — the same granules
              used in injection moulding — rather than pre-processed filament.
            </p>
            <p>
              This eliminates the filament conversion cost (typically 8–18× the raw pellet price),
              making large-format and high-volume 3D printing dramatically more economical.
            </p>
          </div>
        </section>

        {/* Methodology */}
        <section>
          <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">METHODOLOGY</p>
          <h2
            className="font-serif font-semibold text-ink border-b border-line pb-4 mb-6"
            style={{ fontSize: '28px', letterSpacing: '-0.01em' }}
          >
            How the index works
          </h2>
          <div className="flex flex-col gap-4 text-base text-ink-muted leading-relaxed mb-6">
            <p>
              Price data is sourced from European spot market assessments and published contract
              ranges. Prices are expressed in EUR per kilogram (EUR/kg) on a delivered European
              basis. The index is updated daily on business days.
            </p>
            <p>
              The Pollen Polymer Index value is computed as:
            </p>
            <div className="border border-line px-4 py-3 font-mono text-sm text-ink bg-surface-raised">
              PPI = 0.35 × PP + 0.30 × HDPE + 0.15 × PETG + 0.10 × PA6 + 0.10 × rPET
            </div>
            <p>
              Historical data covers a rolling 2-year window. Volatility metrics are computed as
              annualised standard deviation of daily log returns.
            </p>
          </div>

          {/* Weights table */}
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #1A1A1A' }}>
                <th className="pb-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">Material</th>
                <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">PPI Weight</th>
                <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">Family</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'PP Homo', weight: '35%', family: 'Commodity' },
                { name: 'HDPE', weight: '30%', family: 'Commodity' },
                { name: 'PETG', weight: '15%', family: 'Engineering' },
                { name: 'PA6', weight: '10%', family: 'Engineering' },
                { name: 'rPET', weight: '10%', family: 'Recycled' },
              ].map((row) => (
                <tr key={row.name} className="border-b border-line hover:bg-[#F2F2EE] transition-colors duration-150">
                  <td className="py-4 font-mono text-sm font-semibold text-ink tabular">{row.name}</td>
                  <td className="py-4 text-right font-mono text-sm text-accent tabular">{row.weight}</td>
                  <td className="py-4 text-right text-sm text-ink-muted">{row.family}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Disclaimer */}
        <section id="disclaimer">
          <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">DISCLAIMER</p>
          <h2
            className="font-serif font-semibold text-ink border-b border-line pb-4 mb-6"
            style={{ fontSize: '28px', letterSpacing: '-0.01em' }}
          >
            Disclaimer
          </h2>
          <p className="text-sm text-ink-faint leading-relaxed">
            This platform is a demonstration MVP. All price data shown is simulated for
            illustrative purposes and does not represent actual market prices. It is not intended
            as financial, commercial, or procurement advice. Pollen AM makes no representations
            as to the accuracy or completeness of the information presented. Do not make
            purchasing or investment decisions based solely on this tool.
          </p>
        </section>

        {/* CTA */}
        <div className="flex items-center gap-6 pt-4 border-t border-line">
          <Link
            href="/calculator"
            className="bg-ink text-bg px-5 py-3 text-sm font-medium hover:bg-black transition-colors duration-150"
          >
            Try the calculator
          </Link>
          <Link
            href="/materials"
            className="text-sm text-ink-muted hover:text-ink transition-colors duration-150 underline-offset-2 hover:underline"
          >
            Browse materials
          </Link>
        </div>
      </div>
    </div>
  );
}
