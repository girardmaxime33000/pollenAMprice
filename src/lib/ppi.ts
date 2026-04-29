import { materials, type PricePoint } from '@/data/materials';

const WEIGHTS = {
  'pp-homo': 0.35,
  hdpe: 0.30,
  pa6: 0.10,
  petg: 0.15,
  rpet: 0.10,
} as const;

export type PPIPoint = {
  date: string;
  value: number;
};

export function computePPI(): PPIPoint[] {
  // All materials have the same length history
  const len = materials[0].history.length;
  const result: PPIPoint[] = [];

  for (let i = 0; i < len; i++) {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const material of materials) {
      const weight = WEIGHTS[material.slug as keyof typeof WEIGHTS] ?? 0;
      if (weight > 0) {
        weightedSum += material.history[i].price * weight;
        totalWeight += weight;
      }
    }

    result.push({
      date: materials[0].history[i].date,
      value: Math.round((weightedSum / totalWeight) * 1000) / 1000,
    });
  }

  return result;
}

export function getLatestPPI(): PPIPoint {
  const ppi = computePPI();
  return ppi[ppi.length - 1];
}

export function getPPIChange(days: number): number {
  const ppi = computePPI();
  const current = ppi[ppi.length - 1].value;
  const past = ppi[Math.max(0, ppi.length - 1 - days)].value;
  return (current - past) / past;
}

// Returns PPI history filtered by number of days from today
export function getPPIHistory(days?: number): PPIPoint[] {
  const ppi = computePPI();
  if (!days) return ppi;
  return ppi.slice(Math.max(0, ppi.length - days));
}

// Normalise a price series to 100 at first point (for comparator)
export function normaliseToBase100(points: PricePoint[]): { date: string; value: number }[] {
  if (points.length === 0) return [];
  const base = points[0].price;
  return points.map((p) => ({
    date: p.date,
    value: Math.round((p.price / base) * 10000) / 100,
  }));
}
