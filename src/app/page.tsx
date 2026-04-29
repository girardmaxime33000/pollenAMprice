import type { Metadata } from 'next';
import Link from 'next/link';
import { materials, getLatestPrice, getPriceChange } from '@/data/materials';
import { articles } from '@/data/articles';
import { getLatestPPI, getPPIChange, getPPIHistory } from '@/lib/ppi';
import { formatPriceShort, formatPercent, formatDate } from '@/lib/formatters';
import { changeTextColor } from '@/lib/colors';
import Heatmap from '@/components/Heatmap';
import TickerWrapper from '@/components/TickerWrapper';
import ChartWrapper from '@/components/ChartWrapper';

export const metadata: Metadata = {
  title: 'Pollen Polymer Index — Industrial Polymer Price Tracker',
  description:
    'Live polymer pellet prices for PP, HDPE, PA6, PETG, and rPET. The reference index for industrial 3D printing material costs — powered by Pollen AM.',
};

const FAMILY_COLORS: Record<string, string> = {
  commodity: '#8B949E',
  engineering: '#7B61FF',
  recycled: '#26A69A',
  composite: '#F59E0B',
};

export default function HomePage() {
  const ppiLatest = getLatestPPI();
  const ppiChange1d = getPPIChange(1);
  const ppiChange7d = getPPIChange(7);
  const ppiChange30d = getPPIChange(30);
  const ppiHistory = getPPIHistory();

  // Convert PPI history to PricePoint format for the chart
  const ppiChartData = ppiHistory.map((p) => ({ date: p.date, price: p.value }));

  const topMovers = materials
    .map((m) => ({
      material: m,
      price: getLatestPrice(m),
      change1d: getPriceChange(m, 1),
      change7d: getPriceChange(m, 7),
      change30d: getPriceChange(m, 30),
    }))
    .sort((a, b) => Math.abs(b.change1d) - Math.abs(a.change1d));

  return (
    <div>
      {/* Ticker bar */}
      <TickerWrapper />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
        {/* Hero: PPI chart */}
        <section>
          <div className="mb-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#E6EDF3]">Pollen Polymer Index</h1>
                <p className="text-sm text-[#8B949E] mt-0.5">
                  Weighted composite of 5 polymer pellet grades · Updated daily
                </p>
              </div>
              <Link
                href="/compare"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#21262D] bg-[#161B22] px-3 py-1.5 text-xs font-medium text-[#8B949E] hover:text-[#E6EDF3] hover:border-[#E07A1F]/40 transition-colors"
              >
                Compare materials →
              </Link>
            </div>

            {/* PPI headline numbers */}
            <div className="mt-4 flex items-center gap-6 flex-wrap">
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-4xl font-bold text-[#E6EDF3]">
                  {ppiLatest.value.toFixed(3)}
                </span>
                <span className="text-xs text-[#8B949E] font-mono">EUR/kg (weighted avg)</span>
              </div>
              {[
                { label: '24h', change: ppiChange1d },
                { label: '7d', change: ppiChange7d },
                { label: '30d', change: ppiChange30d },
              ].map(({ label, change }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span
                    className="font-mono text-xl font-bold"
                    style={{ color: changeTextColor(change) }}
                  >
                    {formatPercent(change)}
                  </span>
                  <span className="text-[10px] text-[#8B949E]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#21262D] bg-[#161B22] p-4">
            <ChartWrapper
              data={ppiChartData}
              color="#E07A1F"
              type="area"
              defaultTimeframe="1Y"
              height={280}
            />
          </div>
        </section>

        {/* Heatmap */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#E6EDF3]">24h Performance</h2>
            <Link href="/materials" className="text-xs text-[#8B949E] hover:text-[#E07A1F] transition-colors">
              All materials →
            </Link>
          </div>
          <Heatmap />
        </section>

        {/* Top movers table */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#E6EDF3]">Market Overview</h2>
            <Link href="/materials" className="text-xs text-[#8B949E] hover:text-[#E07A1F] transition-colors">
              Full table →
            </Link>
          </div>
          <div className="rounded-xl border border-[#21262D] bg-[#161B22] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#21262D]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#8B949E] uppercase tracking-wider hidden sm:table-cell">Family</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#8B949E] uppercase tracking-wider">24h %</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#8B949E] uppercase tracking-wider hidden md:table-cell">7d %</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#8B949E] uppercase tracking-wider hidden md:table-cell">30d %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262D]">
                {topMovers.map(({ material, price, change1d, change7d, change30d }) => {
                  const familyColor = FAMILY_COLORS[material.family] ?? '#8B949E';
                  return (
                    <tr key={material.slug} className="hover:bg-[#0B0E14]/60 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/materials/${material.slug}`}
                          className="font-mono text-sm font-bold text-[#E6EDF3] hover:text-[#E07A1F] transition-colors"
                        >
                          {material.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
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
                      <td className="px-4 py-3 text-right">
                        <span
                          className="font-mono text-sm font-semibold"
                          style={{ color: changeTextColor(change1d) }}
                        >
                          {formatPercent(change1d)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span
                          className="font-mono text-xs"
                          style={{ color: changeTextColor(change7d) }}
                        >
                          {formatPercent(change7d)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden md:table-cell">
                        <span
                          className="font-mono text-xs"
                          style={{ color: changeTextColor(change30d) }}
                        >
                          {formatPercent(change30d)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Latest articles */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-[#E6EDF3]">Latest Analysis</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="flex flex-col gap-3 p-4 rounded-xl bg-[#161B22] border border-[#21262D] hover:border-[#E07A1F]/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded px-2 py-0.5 text-[10px] font-medium bg-[#E07A1F]/15 text-[#E07A1F]">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-[#8B949E]">{formatDate(article.date)}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#E6EDF3] leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-[#8B949E] leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
                {article.materialSlug && (
                  <Link
                    href={`/materials/${article.materialSlug}`}
                    className="mt-auto text-xs font-medium text-[#E07A1F] hover:underline"
                  >
                    View {article.materialSlug.toUpperCase().replace('-', ' ')} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="rounded-xl border border-[#E07A1F]/20 bg-[#E07A1F]/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#E6EDF3]">
              Calculate your pellet cost savings
            </h2>
            <p className="text-sm text-[#8B949E] mt-0.5">
              See how much you save switching from filament to Pollen AM open pellet printing.
            </p>
          </div>
          <Link
            href="/calculator"
            className="shrink-0 rounded-lg bg-[#E07A1F] hover:bg-[#C96E1A] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150"
          >
            Open Calculator →
          </Link>
        </section>
      </div>
    </div>
  );
}
