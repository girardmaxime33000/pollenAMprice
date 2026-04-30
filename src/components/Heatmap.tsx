import Link from 'next/link';
import { materials, getLatestPrice, getPriceChange } from '@/data/materials';
import { formatPriceShort, formatPercent } from '@/lib/formatters';
import { heatmapColor, changeTextColor } from '@/lib/colors';

export default function Heatmap() {
  const items = materials.map((m) => ({
    slug: m.slug,
    name: m.name,
    price: getLatestPrice(m),
    change1d: getPriceChange(m, 1),
  }));

  return (
    <div className="flex border border-line overflow-hidden">
      {items.map((item, i) => {
        const textColor = changeTextColor(item.change1d);
        const bgColor = heatmapColor(item.change1d);

        return (
          <Link
            key={item.slug}
            href={`/materials/${item.slug}`}
            className="flex-1 flex items-center justify-between px-4 py-3 hover:bg-[#F2F2EE] transition-colors duration-150"
            style={{
              backgroundColor: bgColor,
              borderLeft: i > 0 ? '1px solid #E5E5E0' : 'none',
            }}
          >
            <span className="font-mono text-xs font-semibold tracking-[0.04em] text-ink uppercase tabular">
              {item.name}
            </span>
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-mono text-xs tabular" style={{ color: textColor }}>
                {formatPercent(item.change1d)}
              </span>
              <span className="font-mono text-[11px] text-ink-faint tabular">
                {formatPriceShort(item.price)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
