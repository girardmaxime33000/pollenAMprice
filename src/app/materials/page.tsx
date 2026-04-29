import type { Metadata } from 'next';
import Link from 'next/link';
import { materials, getLatestPrice, getPriceChange } from '@/data/materials';
import { formatPriceShort, formatPercent } from '@/lib/formatters';
import { changeTextColor } from '@/lib/colors';

export const metadata: Metadata = {
  title: 'Materials — Pollen Polymer Index',
  description: 'Live pellet prices for PP Homo, HDPE, PA6, PETG, and rPET — tracked daily for industrial 3D printing.',
};

const FAMILY_COLORS: Record<string, string> = {
  commodity: '#8B949E',
  engineering: '#7B61FF',
  recycled: '#26A69A',
  composite: '#F59E0B',
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#E6EDF3]">Polymer Materials</h1>
        <p className="mt-1 text-sm text-[#8B949E]">
          Daily spot prices for industrial pellet grades — tracked for FFF and pellet extrusion 3D printing.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#21262D] bg-[#161B22] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#21262D]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Symbol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Family</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#8B949E] uppercase tracking-wider">24h %</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#8B949E] uppercase tracking-wider">7d %</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#8B949E] uppercase tracking-wider">30d %</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#8B949E] uppercase tracking-wider">1Y %</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8B949E] uppercase tracking-wider">3D Print</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8B949E] uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262D]">
              {rows.map(({ material, price, change1d, change7d, change30d, change365d }) => {
                const familyColor = FAMILY_COLORS[material.family] ?? '#8B949E';
                const compatColor =
                  material.printing3D.compatible === 'yes'
                    ? '#26A69A'
                    : material.printing3D.compatible === 'conditional'
                    ? '#F59E0B'
                    : '#EF5350';

                return (
                  <tr
                    key={material.slug}
                    className="hover:bg-[#0B0E14]/60 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/materials/${material.slug}`} className="font-mono text-sm font-bold text-[#E6EDF3] hover:text-[#E07A1F] transition-colors">
                        {material.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E]">{material.fullName}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                        style={{ color: familyColor, backgroundColor: `${familyColor}18` }}
                      >
                        {material.family}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm font-semibold text-[#E6EDF3]">
                        {formatPriceShort(price)}
                      </span>
                    </td>
                    {[change1d, change7d, change30d, change365d].map((change, i) => (
                      <td key={i} className="px-4 py-3 text-right">
                        <span className="font-mono text-xs font-semibold" style={{ color: changeTextColor(change) }}>
                          {formatPercent(change)}
                        </span>
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center">
                      <span
                        className="inline-block rounded px-2 py-0.5 text-[10px] font-medium"
                        style={{ color: compatColor, backgroundColor: `${compatColor}18` }}
                      >
                        {material.printing3D.compatible}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/materials/${material.slug}`}
                        className="text-[10px] font-medium text-[#8B949E] hover:text-[#E07A1F] transition-colors"
                        aria-label={`View ${material.name} details`}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid below */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map((m) => (
          <Link
            key={m.slug}
            href={`/materials/${m.slug}`}
            className="flex flex-col gap-3 p-4 rounded-xl bg-[#161B22] border border-[#21262D] hover:border-[#E07A1F]/40 transition-all duration-150 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-base font-bold text-[#E6EDF3] group-hover:text-white">
                  {m.name}
                </span>
                <p className="text-[11px] text-[#8B949E]">{m.fullName}</p>
              </div>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                style={{ color: FAMILY_COLORS[m.family], backgroundColor: `${FAMILY_COLORS[m.family]}18` }}
              >
                {m.family}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-mono text-xl font-bold text-[#E6EDF3]">{formatPriceShort(getLatestPrice(m))}</div>
                <div className="text-[10px] text-[#8B949E] font-mono">EUR/kg</div>
              </div>
              <span
                className="font-mono text-sm font-semibold"
                style={{ color: changeTextColor(getPriceChange(m, 1)) }}
              >
                {formatPercent(getPriceChange(m, 1))}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
