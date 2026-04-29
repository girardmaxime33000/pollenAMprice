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

const FAMILY_COLORS: Record<string, string> = {
  commodity: '#8B949E',
  engineering: '#7B61FF',
  recycled: '#26A69A',
  composite: '#F59E0B',
};

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
  const textColor = changeTextColor(change1d);
  const arrow = change1d >= 0 ? '▲' : '▼';
  const familyColor = FAMILY_COLORS[material.family] ?? '#8B949E';
  const chartColor = MATERIAL_COLORS[material.slug] ?? '#E07A1F';
  const compatColor =
    material.printing3D.compatible === 'yes'
      ? '#26A69A'
      : material.printing3D.compatible === 'conditional'
      ? '#F59E0B'
      : '#EF5350';

  const similarSlugs = SIMILAR[material.slug] ?? [];
  const similarMaterials = similarSlugs.map((s) => getMaterial(s)).filter(Boolean) as typeof materials;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-[#8B949E]">
        <Link href="/" className="hover:text-[#E6EDF3] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/materials" className="hover:text-[#E6EDF3] transition-colors">Materials</Link>
        <span>/</span>
        <span className="text-[#E6EDF3]">{material.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-mono text-3xl font-bold text-[#E6EDF3]">{material.name}</h1>
            <span
              className="rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider"
              style={{ color: familyColor, backgroundColor: `${familyColor}18` }}
            >
              {material.family}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#8B949E]">{material.fullName}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1">
          <span className="font-mono text-4xl font-bold text-[#E6EDF3]">
            {formatPriceShort(price)}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-[#8B949E]">EUR/kg</span>
            <span className="font-mono text-lg font-bold" style={{ color: textColor }}>
              {arrow} {formatPercent(change1d)}
            </span>
          </div>
        </div>
      </div>

      {/* Change pills */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {[
          { label: '24h', change: change1d },
          { label: '7d', change: change7d },
          { label: '30d', change: change30d },
        ].map(({ label, change }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 border border-[#21262D] bg-[#161B22]"
          >
            <span className="text-xs text-[#8B949E]">{label}</span>
            <span className="font-mono text-sm font-semibold" style={{ color: changeTextColor(change) }}>
              {formatPercent(change)}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-8 rounded-xl border border-[#21262D] bg-[#161B22] p-4">
        <ChartWrapper
          data={material.history}
          color={chartColor}
          type="area"
          defaultTimeframe="1M"
          height={320}
        />
      </div>

      {/* Two-column details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Technical specs */}
        <div className="rounded-xl border border-[#21262D] bg-[#161B22] p-5">
          <h2 className="text-sm font-semibold text-[#E6EDF3] mb-4">Technical Specifications</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Density', value: `${material.density} g/cm³` },
              { label: 'MFI', value: material.mfi },
              { label: 'Glass Transition (Tg)', value: material.glassTransition != null ? `${material.glassTransition} °C` : 'N/A' },
              { label: 'Melt Temperature (Tm)', value: material.meltTemp != null ? `${material.meltTemp} °C` : 'N/A' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-[#21262D] pb-2 last:border-0 last:pb-0">
                <span className="text-xs text-[#8B949E]">{label}</span>
                <span className="font-mono text-xs font-medium text-[#E6EDF3]">{value}</span>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-[#E6EDF3] mt-5 mb-3">Applications</h3>
          <div className="flex flex-wrap gap-1.5">
            {material.applications.map((app) => (
              <span key={app} className="rounded px-2 py-0.5 text-[10px] bg-[#0B0E14] border border-[#21262D] text-[#8B949E]">
                {app}
              </span>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-[#E6EDF3] mt-5 mb-3">Major Suppliers</h3>
          <div className="flex flex-wrap gap-1.5">
            {material.majorSuppliers.map((s) => (
              <span key={s} className="rounded px-2 py-0.5 text-[10px] bg-[#0B0E14] border border-[#21262D] text-[#8B949E]">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* 3D Printing relevance */}
        <div className="rounded-xl border border-[#21262D] bg-[#161B22] p-5">
          <h2 className="text-sm font-semibold text-[#E6EDF3] mb-4">3D Printing Relevance</h2>

          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4 border"
            style={{ borderColor: `${compatColor}40`, backgroundColor: `${compatColor}10` }}
          >
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: compatColor }} />
            <span className="text-sm font-semibold capitalize" style={{ color: compatColor }}>
              {material.printing3D.compatible === 'yes'
                ? 'Fully Compatible'
                : material.printing3D.compatible === 'conditional'
                ? 'Conditional Compatibility'
                : 'Not Compatible'}
            </span>
          </div>

          <p className="text-sm text-[#8B949E] leading-relaxed mb-5">
            {material.printing3D.notes}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-lg bg-[#0B0E14] border border-[#21262D] p-3">
              <div className="text-[10px] text-[#8B949E] mb-1">Nozzle Temp</div>
              <div className="font-mono text-sm font-bold text-[#E6EDF3]">{material.printing3D.nozzleTemp}</div>
            </div>
            <div className="rounded-lg bg-[#0B0E14] border border-[#21262D] p-3">
              <div className="text-[10px] text-[#8B949E] mb-1">Bed Temp</div>
              <div className="font-mono text-sm font-bold text-[#E6EDF3]">{material.printing3D.bedTemp}</div>
            </div>
          </div>

          <div className="rounded-lg bg-[#0B0E14] border border-[#21262D] p-3 mb-5">
            <div className="text-[10px] text-[#8B949E] mb-1">Filament equivalent price</div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-[#EF5350]">{material.filamentEquivalentPricePerKg} EUR/kg</span>
              <span className="text-[10px] text-[#8B949E]">vs pellet {formatPriceShort(price)} EUR/kg</span>
            </div>
            <div className="mt-1 font-mono text-xs text-[#E07A1F] font-semibold">
              {(material.filamentEquivalentPricePerKg / price).toFixed(1)}× cost advantage with pellets
            </div>
          </div>

          <Link
            href={`/calculator?material=${material.slug}`}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#E07A1F] hover:bg-[#C96E1A] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150"
          >
            Calculate cost for this material →
          </Link>
        </div>
      </div>

      {/* Similar materials */}
      {similarMaterials.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#E6EDF3] mb-3">Related Materials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {similarMaterials.map((m) => {
              const p = getLatestPrice(m);
              const c = getPriceChange(m, 1);
              return (
                <Link
                  key={m.slug}
                  href={`/materials/${m.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#161B22] border border-[#21262D] hover:border-[#E07A1F]/40 transition-colors"
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-[#E6EDF3]">{m.name}</div>
                    <div className="text-[10px] text-[#8B949E]">{m.fullName}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm text-[#E6EDF3]">{formatPriceShort(p)}</div>
                    <div className="font-mono text-xs" style={{ color: changeTextColor(c) }}>
                      {formatPercent(c)}
                    </div>
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
