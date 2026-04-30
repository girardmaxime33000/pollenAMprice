import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { materials, getMaterial, getLatestPrice, getPriceChange } from '@/data/materials';
import { formatPrice, formatPriceShort, formatPercent } from '@/lib/formatters';
import { changeTextColor, MATERIAL_COLORS } from '@/lib/colors';
import ChartWrapper from '@/components/ChartWrapper';

export function generateStaticParams() {
  return materials.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = getMaterial(slug);
  if (!material) return { title: 'Not Found' };
  return {
    title: `${material.name} Price — Pollen Polymer Index`,
    description: `Live ${material.fullName} pellet price tracking. Current: ${formatPrice(getLatestPrice(material))}`,
  };
}

const SIMILAR: Record<string, string[]> = {
  'pp-homo': ['hdpe', 'petg', 'rpet'],
  hdpe: ['pp-homo', 'petg', 'rpet'],
  pa6: ['petg', 'rpet', 'pp-homo'],
  petg: ['pa6', 'rpet', 'hdpe'],
  rpet: ['petg', 'pa6', 'hdpe'],
};

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const material = getMaterial(slug);
  if (!material) notFound();

  const price = getLatestPrice(material);
  const change1d = getPriceChange(material, 1);
  const change7d = getPriceChange(material, 7);
  const change30d = getPriceChange(material, 30);
  const chartColor = MATERIAL_COLORS[material.slug] ?? '#D2691E';

  const similarSlugs = SIMILAR[material.slug] ?? [];
  const similarMaterials = similarSlugs.map((s) => getMaterial(s)).filter(Boolean) as typeof materials;

  const specs = [
    { label: 'Density', value: `${material.density} g/cm³` },
    { label: 'MFI', value: material.mfi },
    { label: 'Glass Transition (Tg)', value: material.glassTransition != null ? `${material.glassTransition} °C` : 'N/A' },
    { label: 'Melt Temperature (Tm)', value: material.meltTemp != null ? `${material.meltTemp} °C` : 'N/A' },
  ];

  return (
    <div className="mx-auto max-w-[1120px] px-8 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-ink-faint">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <Link href="/materials" className="hover:text-ink transition-colors">Materials</Link>
        <span>/</span>
        <span className="text-ink-muted">{material.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">
          {material.family.toUpperCase()} · PELLET GRADE
        </p>
        <h1
          className="font-serif font-semibold text-ink mb-4"
          style={{ fontSize: '48px', letterSpacing: '-0.02em' }}
        >
          {material.fullName}
        </h1>
        <div className="flex items-baseline gap-4 flex-wrap">
          <span
            className="font-mono font-medium text-ink tabular"
            style={{ fontSize: '48px', lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum"' }}
          >
            {formatPriceShort(price)}
          </span>
          <span className="font-mono text-sm text-ink-muted tabular">EUR/kg</span>
          <span
            className="font-mono text-xl font-medium tabular"
            style={{ color: changeTextColor(change1d) }}
          >
            {change1d >= 0 ? '+' : ''}{formatPercent(change1d)} 24h
          </span>
        </div>
      </div>

      {/* Change row */}
      <div className="flex items-center gap-6 mb-10 flex-wrap">
        {[
          { label: '7 days', change: change7d },
          { label: '30 days', change: change30d },
        ].map(({ label, change }) => (
          <div key={label} className="flex items-baseline gap-2">
            <span className="text-xs text-ink-faint">{label}</span>
            <span className="font-mono text-sm font-medium tabular" style={{ color: changeTextColor(change) }}>
              {change >= 0 ? '+' : ''}{formatPercent(change)}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-16 border border-line p-4">
        <ChartWrapper
          data={material.history}
          color={chartColor}
          type="line"
          defaultTimeframe="1M"
          height={360}
        />
      </div>

      {/* Two-column: 65/35 */}
      <div className="flex flex-col lg:flex-row gap-16 mb-16">
        {/* Left: specs (65%) */}
        <div className="flex-[65]">
          <div className="mb-1">
            <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">SPECIFICATIONS</p>
            <h2
              className="font-serif font-semibold text-ink border-b border-line pb-4"
              style={{ fontSize: '28px', letterSpacing: '-0.01em' }}
            >
              Technical data
            </h2>
          </div>
          <dl className="mt-0">
            {specs.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-4 border-b border-line">
                <dt className="text-sm text-ink-muted">{label}</dt>
                <dd className="font-mono text-sm font-medium text-ink tabular">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-4">APPLICATIONS</p>
            <div className="flex flex-wrap gap-2">
              {material.applications.map((app) => (
                <span
                  key={app}
                  className="px-3 py-1 text-xs text-ink-muted border border-line"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-4">MAJOR SUPPLIERS</p>
            <div className="flex flex-wrap gap-2">
              {material.majorSuppliers.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 text-xs text-ink-muted border border-line"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 3D printing callout (35%) */}
        <div className="flex-[35]">
          <div
            className="p-6"
            style={{ borderLeft: '4px solid #D2691E' }}
          >
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-4">
              3D PRINTING RELEVANCE
            </p>

            <p className="text-sm font-medium text-ink mb-1 capitalize">
              {material.printing3D.compatible === 'yes'
                ? 'Fully compatible'
                : material.printing3D.compatible === 'conditional'
                ? 'Conditional compatibility'
                : 'Not compatible'}
            </p>

            <p className="text-sm text-ink-muted leading-relaxed mb-6">
              {material.printing3D.notes}
            </p>

            <dl className="flex flex-col gap-0 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-line">
                <dt className="text-xs text-ink-faint uppercase tracking-[0.06em]">Nozzle</dt>
                <dd className="font-mono text-sm text-ink tabular">{material.printing3D.nozzleTemp}</dd>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-line">
                <dt className="text-xs text-ink-faint uppercase tracking-[0.06em]">Bed</dt>
                <dd className="font-mono text-sm text-ink tabular">{material.printing3D.bedTemp}</dd>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-line">
                <dt className="text-xs text-ink-faint uppercase tracking-[0.06em]">Filament equiv.</dt>
                <dd className="font-mono text-sm text-down tabular">{material.filamentEquivalentPricePerKg} EUR/kg</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-xs text-ink-faint uppercase tracking-[0.06em]">Cost advantage</dt>
                <dd className="font-mono text-sm font-semibold text-accent tabular">
                  {(material.filamentEquivalentPricePerKg / price).toFixed(1)}× cheaper
                </dd>
              </div>
            </dl>

            <Link
              href={`/calculator?material=${material.slug}`}
              className="flex items-center justify-center w-full bg-ink text-bg px-4 py-3 text-sm font-medium hover:bg-black transition-colors duration-150"
            >
              Calculate cost for this material
            </Link>
          </div>
        </div>
      </div>

      {/* Related materials */}
      {similarMaterials.length > 0 && (
        <div>
          <p className="text-xs font-sans font-medium uppercase tracking-[0.08em] text-ink-faint mb-2">RELATED</p>
          <h2
            className="font-serif font-semibold text-ink border-b border-line pb-4 mb-0"
            style={{ fontSize: '22px', letterSpacing: '-0.01em' }}
          >
            Similar materials
          </h2>
          <div className="flex flex-col">
            {similarMaterials.map((m) => {
              const p = getLatestPrice(m);
              const c = getPriceChange(m, 1);
              return (
                <Link
                  key={m.slug}
                  href={`/materials/${m.slug}`}
                  className="flex items-center justify-between py-4 border-b border-line hover:bg-[#F2F2EE] transition-colors duration-150"
                >
                  <div>
                    <span className="font-mono text-sm font-semibold tracking-[0.04em] text-ink uppercase tabular">{m.name}</span>
                    <span className="ml-3 text-sm text-ink-muted">{m.fullName}</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-ink tabular">{formatPriceShort(p)}</span>
                    <span className="font-mono text-sm tabular" style={{ color: changeTextColor(c) }}>
                      {c >= 0 ? '+' : ''}{formatPercent(c)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
