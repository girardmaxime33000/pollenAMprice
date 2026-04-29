export const COLORS = {
  background: '#0B0E14',
  surface: '#161B22',
  border: '#21262D',
  accent: '#E07A1F',
  up: '#26A69A',
  down: '#EF5350',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
} as const;

// Material line colours for comparator chart
export const MATERIAL_COLORS: Record<string, string> = {
  'pp-homo': '#E07A1F',
  hdpe: '#26A69A',
  pa6: '#7B61FF',
  petg: '#F59E0B',
  rpet: '#34D399',
};

// Heatmap interpolation: given a percent change, return a bg colour
export function heatmapColor(change: number): string {
  if (change >= 0.03) return 'rgba(38,166,154,0.35)';
  if (change >= 0.015) return 'rgba(38,166,154,0.20)';
  if (change >= 0.005) return 'rgba(38,166,154,0.10)';
  if (change >= -0.005) return 'rgba(139,148,158,0.12)';
  if (change >= -0.015) return 'rgba(239,83,80,0.10)';
  if (change >= -0.03) return 'rgba(239,83,80,0.20)';
  return 'rgba(239,83,80,0.35)';
}

export function changeTextColor(change: number): string {
  if (change > 0) return '#26A69A';
  if (change < 0) return '#EF5350';
  return '#8B949E';
}
