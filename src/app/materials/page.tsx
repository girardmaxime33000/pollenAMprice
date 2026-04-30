import type { Metadata } from 'next';
import Link from 'next/link';
import { materials, getLatestPrice, getPriceChange } from '@/data/materials';
import { formatPriceShort, formatPercent } from '@/lib/formatters';
import { changeTextColor } from '@/lib/colors';

export const metadata: Metadata = {
  title: 'Materials — Pollen Polymer Index',
  description: 'Live pellet prices for PP Homo, HDPE, PA6, PETG, and rPET — tracked daily for industrial 3D printing.',
};

const COMPAT_COLOR: Record<string, string> = {
  yes: '#2F6F4E',
  conditional: '#8B6914',
  no: '#B5503C',
};

export default function MaterialsPage() {
  const rows = materials.map((m) => ({
    material: m,
    price: getLatestPrice(m),
    change1d: getPriceChange(m, 1),
    change7d: getPriceChange(m, 7),
    change30d: getPriceChange(m, 30),
    change365d: getPriceChange(m, 365),
  }));

  return (
    <div className="mx-auto max-w-[1120px] px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-1">
          POLYMER MATERIALS
        </p>
        <h1
          className="font-serif font-semibold text-ink"
          style={{ fontSize: '48px', letterSpacing: '-0.02em' }}
        >
          Market prices
        </h1>
        <p className="mt-3 text-base text-ink-muted max-w-xl">
          Daily spot prices for industrial pellet grades — tracked for FFF and pellet extrusion 3D printing.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #1A1A1A' }}>
              <th className="pb-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">Symbol</th>
              <th className="pb-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">Name</th>
              <th className="pb-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint hidden sm:table-cell">Family</th>
              <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">Price</th>
              <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">24h</th>
              <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint hidden md:table-cell">7d</th>
              <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint hidden md:table-cell">30d</th>
              <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint hidden lg:table-cell">1Y</th>
              <th className="pb-3 text-center text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint hidden sm:table-cell">3D Print</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ material, price, change1d, change7d, change30d, change365d }) => {
              const compatColor = COMPAT_COLOR[material.printing3D.compatible] ?? '#A8A8A0';
              return (
                <tr
                  key={material.slug}
                  className="border-b border-line hover:bg-[#F2F2EE] transition-colors duration-150"
                >
                  <td className="py-4 pr-4">
                    <Link
                      href={`/materials/${material.slug}`}
                      className="font-mono text-sm font-semibold tracking-[0.04em] text-ink hover:text-accent transition-colors duration-150 uppercase tabular"
                    >
                      {material.name}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-sm text-ink-muted">{material.fullName}</td>
                  <td className="py-4 pr-4 hidden sm:table-cell">
                    <span className="text-xs text-ink-faint capitalize">{material.family}</span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="font-mono text-sm text-ink tabular">{formatPriceShort(price)}</span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="font-mono text-sm tabular" style={{ color: changeTextColor(change1d) }}>
                      {formatPercent(change1d)}
                    </span>
                  </td>
                  <td className="py-4 text-right hidden md:table-cell">
                    <span className="font-mono text-sm tabular" style={{ color: changeTextColor(change7d) }}>
                      {formatPercent(change7d)}
                    </span>
                  </td>
                  <td className="py-4 text-right hidden md:table-cell">
                    <span className="font-mono text-sm tabular" style={{ color: changeTextColor(change30d) }}>
                      {formatPercent(change30d)}
                    </span>
                  </td>
                  <td className="py-4 text-right hidden lg:table-cell">
                    <span className="font-mono text-sm tabular" style={{ color: changeTextColor(change365d) }}>
                      {formatPercent(change365d)}
                    </span>
                  </td>
                  <td className="py-4 text-center hidden sm:table-cell">
                    <span className="text-xs font-medium capitalize" style={{ color: compatColor }}>
                      {material.printing3D.compatible}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <Link
                      href={`/materials/${material.slug}`}
                      className="text-xs text-ink-faint hover:text-ink transition-colors duration-150"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CTA */}
      <div className="mt-16 pt-8 border-t border-line flex items-center gap-6">
        <Link
          href="/compare"
          className="bg-ink text-bg px-5 py-3 text-sm font-medium hover:bg-black transition-colors duration-150"
        >
          Compare materials
        </Link>
        <Link
          href="/calculator"
          className="text-sm text-ink-muted hover:text-ink transition-colors duration-150 underline-offset-2 hover:underline"
        >
          Cost calculator
        </Link>
      </div>
    </div>
  );
}
