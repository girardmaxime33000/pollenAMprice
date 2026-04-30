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

export default function HomePage() {
  const ppiLatest = getLatestPPI();
  const ppiChange30d = getPPIChange(30);
  const ppiHistory = getPPIHistory();
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
      {/* Hero PPI block */}
      <section className="mx-auto max-w-[1120px] px-8 pt-24 pb-12">
        <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-4">
          POLLEN POLYMER INDEX · APRIL 2026
        </p>
        <h1
          className="font-serif font-semibold text-ink leading-tight mb-6"
          style={{ fontSize: '48px', letterSpacing: '-0.02em' }}
        >
          Tracking the European polymer market
        </h1>
        <div className="flex items-baseline gap-4 flex-wrap">
          <span
            className="font-mono font-medium text-ink tabular"
            style={{ fontSize: '64px', lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"' }}
          >
            {ppiLatest.value.toFixed(3)}
          </span>
          <span className="text-base font-serif text-ink-muted">
            {ppiChange30d >= 0 ? 'up' : 'down'}{' '}
            <span style={{ color: changeTextColor(ppiChange30d) }}>
              {Math.abs(ppiChange30d * 100).toFixed(1)}%
            </span>{' '}
            over the past 30 days
          </span>
        </div>
        <p className="mt-2 text-sm text-ink-faint font-mono">EUR/kg weighted average · Updated daily</p>
      </section>

      {/* PPI Chart */}
      <section className="mx-auto max-w-[1120px] px-8 pb-16">
        <ChartWrapper
          data={ppiChartData}
          color="#D2691E"
          type="line"
          defaultTimeframe="1Y"
          height={320}
        />
      </section>

      {/* Ticker bar (after hero) */}
      <TickerWrapper />

      {/* Heatmap */}
      <section className="mx-auto max-w-[1120px] px-8 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-1">
              24-HOUR PERFORMANCE
            </p>
            <h2
              className="font-serif font-semibold text-ink"
              style={{ fontSize: '28px', letterSpacing: '-0.01em' }}
            >
              Market snapshot
            </h2>
          </div>
          <Link href="/materials" className="text-sm text-ink-muted hover:text-ink transition-colors duration-150 underline-offset-2 hover:underline">
            All materials
          </Link>
        </div>
        <Heatmap />
      </section>

      {/* Top movers table */}
      <section className="mx-auto max-w-[1120px] px-8 pb-24">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-1">
              MARKET OVERVIEW
            </p>
            <h2
              className="font-serif font-semibold text-ink"
              style={{ fontSize: '28px', letterSpacing: '-0.01em' }}
            >
              Top movers
            </h2>
          </div>
          <Link href="/materials" className="text-sm text-ink-muted hover:text-ink transition-colors duration-150 underline-offset-2 hover:underline">
            Full table
          </Link>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #1A1A1A' }}>
              <th className="pb-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">Symbol</th>
              <th className="pb-3 text-left text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint hidden sm:table-cell">Name</th>
              <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">Price</th>
              <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint">24h</th>
              <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint hidden md:table-cell">7d</th>
              <th className="pb-3 text-right text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint hidden md:table-cell">30d</th>
            </tr>
          </thead>
          <tbody>
            {topMovers.map(({ material, price, change1d, change7d, change30d }) => (
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
                <td className="py-4 pr-4 hidden sm:table-cell">
                  <span className="text-sm text-ink-muted">{material.fullName}</span>
                </td>
                <td className="py-4 text-right">
                  <span className="font-mono text-sm text-ink tabular">{formatPriceShort(price)}</span>
                </td>
                <td className="py-4 text-right">
                  <span className="font-mono text-sm font-medium tabular" style={{ color: changeTextColor(change1d) }}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Latest analysis — editorial list */}
      <section className="mx-auto max-w-[1120px] px-8 pb-24">
        <div className="mb-6">
          <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-1">
            LATEST ANALYSIS
          </p>
          <h2
            className="font-serif font-semibold text-ink"
            style={{ fontSize: '28px', letterSpacing: '-0.01em' }}
          >
            Research &amp; commentary
          </h2>
        </div>
        <div className="border-t border-line">
          {articles.map((article) => (
            <article key={article.slug} className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-6 border-b border-line">
              <div className="sm:w-32 shrink-0">
                <p className="text-xs text-ink-faint">{formatDate(article.date)}</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-faint mt-1">{article.category}</p>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold text-ink leading-snug mb-2" style={{ letterSpacing: '-0.01em' }}>
                  {article.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                {article.materialSlug && (
                  <Link
                    href={`/materials/${article.materialSlug}`}
                    className="text-xs text-ink-muted hover:text-ink transition-colors duration-150 underline-offset-2 hover:underline"
                  >
                    View {article.materialSlug.toUpperCase().replace('-', ' ')}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1120px] px-8 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif font-semibold text-ink text-xl mb-1" style={{ letterSpacing: '-0.01em' }}>
              Calculate your pellet cost savings
            </h2>
            <p className="text-sm text-ink-muted">
              See how much you save switching from filament to Pollen AM open pellet printing.
            </p>
          </div>
          <Link
            href="/calculator"
            className="shrink-0 bg-ink text-bg px-5 py-3 text-sm font-medium hover:bg-black transition-colors duration-150"
          >
            Open Calculator
          </Link>
        </div>
      </section>
    </div>
  );
}
