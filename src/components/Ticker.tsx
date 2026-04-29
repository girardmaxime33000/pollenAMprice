'use client';

import { useEffect, useRef } from 'react';
import { materials, getLatestPrice, getPriceChange } from '@/data/materials';
import { formatPriceShort, formatPercent } from '@/lib/formatters';
import { changeTextColor } from '@/lib/colors';

type TickerItem = {
  slug: string;
  name: string;
  price: number;
  change1d: number;
};

function buildTickerItems(): TickerItem[] {
  return materials.map((m) => ({
    slug: m.slug,
    name: m.name,
    price: getLatestPrice(m),
    change1d: getPriceChange(m, 1),
  }));
}

function TickerCell({ item }: { item: TickerItem }) {
  const color = changeTextColor(item.change1d);
  const changeText = formatPercent(item.change1d);
  const arrow = item.change1d >= 0 ? '▲' : '▼';

  return (
    <div className="flex items-center gap-3 px-6 shrink-0 border-r border-[#21262D]">
      <span className="font-mono text-xs font-bold text-[#E6EDF3] tracking-wider">
        {item.name.toUpperCase()}
      </span>
      <span className="font-mono text-xs text-[#E6EDF3]">
        {formatPriceShort(item.price)}
      </span>
      <span className="font-mono text-xs font-medium" style={{ color }}>
        {arrow} {changeText}
      </span>
    </div>
  );
}

export default function Ticker() {
  const items = buildTickerItems();
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate items for seamless loop
  const allItems = [...items, ...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let x = 0;
    const speed = 0.5; // px per frame
    const singleWidth = track.scrollWidth / 3;

    function animate() {
      x -= speed;
      if (Math.abs(x) >= singleWidth) {
        x += singleWidth;
      }
      if (track) {
        track.style.transform = `translateX(${x}px)`;
      }
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      className="w-full overflow-hidden bg-[#161B22] border-b border-[#21262D]"
      aria-label="Live price ticker"
    >
      <div className="flex items-center" style={{ height: 36 }}>
        <div ref={trackRef} className="flex items-center h-full will-change-transform">
          {allItems.map((item, i) => (
            <TickerCell key={`${item.slug}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
