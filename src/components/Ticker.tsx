'use client';

import Link from 'next/link';
import { materials, getLatestPrice, getPriceChange } from '@/data/materials';
import { formatPriceShort, formatPercent } from '@/lib/formatters';
import { changeTextColor } from '@/lib/colors';

function TickerCell({ item }: { item: { slug: string; name: string; price: number; change1d: number } }) {
  const color = changeTextColor(item.change1d);
  const sign = item.change1d >= 0 ? '+' : '';

  return (
    <Link
      href={`/materials/${item.slug}`}
      className="flex items-baseline gap-2 shrink-0 hover:text-ink transition-colors duration-150"
    >
      <span className="font-mono text-xs font-semibold tracking-[0.04em] text-ink uppercase tabular">
        {item.name}
      </span>
      <span className="font-mono text-xs text-ink-muted tabular">
        {formatPriceShort(item.price)}
      </span>
      <span className="font-mono text-xs tabular" style={{ color }}>
        {sign}{formatPercent(item.change1d)}
      </span>
    </Link>
  );
}

export default function Ticker() {
  const items = materials.map((m) => ({
    slug: m.slug,
    name: m.name,
    price: getLatestPrice(m),
    change1d: getPriceChange(m, 1),
  }));

  return (
    <div className="w-full bg-bg border-b border-line overflow-x-auto" aria-label="Price summary">
      <div className="mx-auto max-w-[1120px] px-8">
        <div className="flex items-center gap-12 h-10">
          {items.map((item) => (
            <TickerCell key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
