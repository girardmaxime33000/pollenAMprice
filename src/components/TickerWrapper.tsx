'use client';

import dynamic from 'next/dynamic';

const Ticker = dynamic(() => import('./Ticker'), { ssr: false });

export default function TickerWrapper() {
  return <Ticker />;
}
