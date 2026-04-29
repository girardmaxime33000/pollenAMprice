'use client';

import dynamic from 'next/dynamic';
import type { PricePoint } from '@/data/materials';

const PriceChart = dynamic(() => import('./PriceChart'), { ssr: false });

type TimeframeKey = '1D' | '1W' | '1M' | '3M' | '1Y' | 'All';

type Props = {
  data: PricePoint[];
  color?: string;
  type?: 'area' | 'line';
  defaultTimeframe?: TimeframeKey;
  showTimeframes?: boolean;
  height?: number;
};

export default function ChartWrapper(props: Props) {
  return <PriceChart {...props} />;
}
