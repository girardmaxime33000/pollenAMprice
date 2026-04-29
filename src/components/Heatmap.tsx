import Link from 'next/link';
import { materials, getLatestPrice, getPriceChange } from '@/data/materials';
import { formatPriceShort, formatPercent } from '@/lib/formatters';
import { heatmapColor, changeTextColor } from '@/lib/colors';

export default function Heatmap() {
  const items = materials.map((m) => ({
    slug: m.slug,
    name: m.name,
    fullName: m.fullName,
    price: getLatestPrice(m),
    change1d: getPriceChange(m, 1),
    change7d: getPriceChange(m, 7),
  }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
      {items.map((item) => {
        const bgColor = heatmapColor(item.change1d);
        const textColor = changeTextColor(item.change1d);
        const arrow = item.change1d >= 0 ? '▲' : '▼';

        return (
          <Link
            key={item.slug}
            href={`/materials/${item.slug}`}
            className="relative flex flex-col gap-1 rounded-lg border border-[#21262D] p-3 transition-all duration-150 hover:border-[#E07A1F]/40 hover:scale-[1.02] cursor-pointer"
            style={{ backgroundColor: bgColor }}
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs font-bold text-[#E6EDF3] tracking-wider">
                {item.name}
              </span>
              <span className="font-mono text-xs font-semibold" style={{ color: textColor }}>
                {arrow}
              </span>
            </div>
            <span className="font-mono text-base font-bold text-[#E6EDF3]">
              {formatPriceShort(item.price)}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#8B949E] truncate">{item.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold" style={{ color: textColor }}>
                {formatPercent(item.change1d)}
              </span>
              <span className="text-[10px] text-[#8B949E]">24h</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
