export const COLORS = {
  background: '#FAFAF7',
  surface: '#FAFAF7',
  surfaceRaised: '#FFFFFF',
  border: '#E5E5E0',
  borderStrong: '#1A1A1A',
  accent: '#D2691E',
  up: '#2F6F4E',
  down: '#B5503C',
  ink: '#1A1A1A',
  inkMuted: '#6E6E68',
  inkFaint: '#A8A8A0',
} as const;

// Greyscale palette for multi-line comparator chart
export const MATERIAL_COLORS: Record<string, string> = {
  'pp-homo': '#D2691E', // accent — highlighted series
  hdpe: '#1A1A1A',
  pa6: '#6E6E68',
  petg: '#A8A8A0',
  rpet: '#2F6F4E',
};

export function heatmapColor(change: number): string {
  if (change >= 0.03) return 'rgba(47,111,78,0.08)';
  if (change >= 0.015) return 'rgba(47,111,78,0.05)';
  if (change >= 0.005) return 'rgba(47,111,78,0.03)';
  if (change >= -0.005) return 'transparent';
  if (change >= -0.015) return 'rgba(181,80,60,0.03)';
  if (change >= -0.03) return 'rgba(181,80,60,0.05)';
  return 'rgba(181,80,60,0.08)';
}

export function changeTextColor(change: number): string {
  if (change > 0) return '#2F6F4E';
  if (change < 0) return '#B5503C';
  return '#A8A8A0';
}
