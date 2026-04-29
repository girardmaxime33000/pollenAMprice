import Link from 'next/link';
import type { Material } from '@/data/materials';
import { getLatestPrice, getPriceChange } from '@/data/materials';
import { formatPriceShort, formatPercent } from '@/lib/formatters';
import { changeTextColor } from '@/lib/colors';

const FAMILY_COLORS: Record<string, string> = {
  commodity: '#8B949E',
  engineering: '#7B61FF',
  recycled: '#26A69A',
  composite: '#F59E0B',
};

type Props = {
  material: Material;
  compact?: boolean;
};

export default function MaterialCard({ material, compact = false }: Props) {
  const price = getLatestPrice(material);
  const change1d = getPriceChange(material, 1);
  const change7d = getPriceChange(material, 7);
  const textColor = changeTextColor(change1d);
  const arrow = change1d >= 0 ? '▲' : '▼';
  const familyColor = FAMILY_COLORS[material.family] ?? '#8B949E';

  if (compact) {
    return (
      <Link
        href={`/materials/${material.slug}`}
        className="flex items-center justify-between p-3 rounded-lg bg-[#161B22] border border-[#21262D] hover:border-[#E07A1F]/40 transition-all duration-150 group"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-sm font-bold text-[#E6EDF3] group-hover:text-white">
            {material.name}
          </span>
          <span className="text-[10px] text-[#8B949E]">{material.fullName}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-mono text-sm font-medium text-[#E6EDF3]">
            {formatPriceShort(price)}
          </span>
          <span className="font-mono text-xs font-medium" style={{ color: textColor }}>
            {arrow} {formatPercent(change1d)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/materials/${material.slug}`}
      className="flex flex-col gap-3 p-4 rounded-xl bg-[#161B22] border border-[#21262D] hover:border-[#E07A1F]/40 transition-all duration-150 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-[#E6EDF3] group-hover:text-white">
              {material.name}
            </span>
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
              style={{ color: familyColor, backgroundColor: `${familyColor}18` }}
            >
              {material.family}
            </span>
          </div>
          <span className="text-xs text-[#8B949E]">{material.fullName}</span>
        </div>
        <div
          className="text-[10px] font-medium px-2 py-1 rounded"
          style={{
            color: material.printing3D.compatible === 'yes' ? '#26A69A' : material.printing3D.compatible === 'conditional' ? '#F59E0B' : '#EF5350',
            backgroundColor: material.printing3D.compatible === 'yes' ? '#26A69A18' : material.printing3D.compatible === 'conditional' ? '#F59E0B18' : '#EF535018',
          }}
        >
          3D: {material.printing3D.compatible}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-2xl font-bold text-[#E6EDF3]">
            {formatPriceShort(price)}
          </div>
          <div className="text-[10px] text-[#8B949E] font-mono">EUR/kg</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="font-mono text-sm font-semibold" style={{ color: textColor }}>
            {arrow} {formatPercent(change1d)} <span className="text-[10px] text-[#8B949E]">24h</span>
          </div>
          <div className="font-mono text-xs" style={{ color: changeTextColor(change7d) }}>
            {formatPercent(change7d)} <span className="text-[10px] text-[#8B949E]">7d</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
