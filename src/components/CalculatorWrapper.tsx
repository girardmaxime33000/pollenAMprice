'use client';

import dynamic from 'next/dynamic';

const CalculatorForm = dynamic(() => import('./CalculatorForm'), { ssr: false });

export default function CalculatorWrapper({ defaultSlug }: { defaultSlug?: string }) {
  return <CalculatorForm defaultSlug={defaultSlug} />;
}
