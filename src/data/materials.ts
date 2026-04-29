export type MaterialFamily = 'commodity' | 'engineering' | 'recycled' | 'composite';

export type PricePoint = {
  date: string;
  price: number;
};

export type Material = {
  slug: string;
  name: string;
  fullName: string;
  family: MaterialFamily;
  density: number;
  mfi: string;
  glassTransition: number | null;
  meltTemp: number | null;
  applications: string[];
  majorSuppliers: string[];
  printing3D: {
    compatible: 'yes' | 'no' | 'conditional';
    notes: string;
    nozzleTemp: string;
    bedTemp: string;
  };
  filamentEquivalentPricePerKg: number;
  history: PricePoint[];
};

// Seeded PRNG — mulberry32
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller normal sample
function boxMuller(rng: () => number): number {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2);
}

function generateHistory(params: {
  startPrice: number;
  drift: number;       // annual
  volatility: number;  // annual
  seed: number;
  shockDays: number[]; // indices where shocks occur
  shockMagnitudes: number[]; // e.g. +0.08 or -0.08
}): PricePoint[] {
  const { startPrice, drift, volatility, seed, shockDays, shockMagnitudes } = params;
  const rng = mulberry32(seed);
  const days = 730;
  const dt = 1 / 365;
  const muDt = (drift - 0.5 * volatility * volatility) * dt;
  const sigmaSqrtDt = volatility * Math.sqrt(dt);

  const points: PricePoint[] = [];
  let price = startPrice;

  // Start date: 2 years ago from 2026-04-29
  const startMs = new Date('2024-04-29').getTime();

  for (let i = 0; i < days; i++) {
    const date = new Date(startMs + i * 86400000);
    const dateStr = date.toISOString().slice(0, 10);

    // Apply shock if this is a shock day
    const shockIdx = shockDays.indexOf(i);
    if (shockIdx !== -1) {
      price = price * (1 + shockMagnitudes[shockIdx]);
    }

    // GBM step
    const z = boxMuller(rng);
    price = price * Math.exp(muDt + sigmaSqrtDt * z);
    price = Math.max(price, 0.10); // floor

    points.push({ date: dateStr, price: Math.round(price * 1000) / 1000 });
  }

  return points;
}

const ppHistory = generateHistory({
  startPrice: 1.25,
  drift: 0.03,
  volatility: 0.18,
  seed: 42001,
  shockDays: [45, 280, 560],
  shockMagnitudes: [0.085, -0.09, 0.082],
});

const hdpeHistory = generateHistory({
  startPrice: 1.30,
  drift: 0.02,
  volatility: 0.16,
  seed: 42002,
  shockDays: [60, 310, 580],
  shockMagnitudes: [-0.08, 0.092, -0.085],
});

const pa6History = generateHistory({
  startPrice: 3.10,
  drift: 0.05,
  volatility: 0.22,
  seed: 42003,
  shockDays: [90, 340, 610],
  shockMagnitudes: [0.09, -0.088, 0.085],
});

const petgHistory = generateHistory({
  startPrice: 1.55,
  drift: 0.04,
  volatility: 0.20,
  seed: 42004,
  shockDays: [30, 260, 500],
  shockMagnitudes: [-0.082, 0.088, -0.09],
});

const rpetHistory = generateHistory({
  startPrice: 1.10,
  drift: 0.06,
  volatility: 0.25,
  seed: 42005,
  shockDays: [70, 330, 590],
  shockMagnitudes: [0.092, -0.085, 0.09],
});

export const materials: Material[] = [
  {
    slug: 'pp-homo',
    name: 'PP Homo',
    fullName: 'Polypropylene homopolymer',
    family: 'commodity',
    density: 0.905,
    mfi: '12 g/10min @ 230°C/2.16kg',
    glassTransition: -10,
    meltTemp: 165,
    applications: [
      'Automotive components',
      'Packaging',
      'Consumer goods',
      'Medical devices',
      'Industrial parts',
    ],
    majorSuppliers: ['LyondellBasell', 'Borealis', 'INEOS', 'Sabic', 'TotalEnergies'],
    printing3D: {
      compatible: 'conditional',
      notes:
        'Requires surface treatment for bed adhesion. Low warping risk with enclosure. Excellent for functional prototypes and end-use parts requiring chemical resistance.',
      nozzleTemp: '210–230°C',
      bedTemp: '80–100°C',
    },
    filamentEquivalentPricePerKg: 22,
    history: ppHistory,
  },
  {
    slug: 'hdpe',
    name: 'HDPE',
    fullName: 'High-density polyethylene',
    family: 'commodity',
    density: 0.955,
    mfi: '8 g/10min @ 190°C/2.16kg',
    glassTransition: -120,
    meltTemp: 130,
    applications: [
      'Pipes & fittings',
      'Bottles & containers',
      'Geomembranes',
      'Industrial tanks',
      'Automotive fuel systems',
    ],
    majorSuppliers: ['ExxonMobil', 'Dow', 'Braskem', 'LyondellBasell', 'INEOS'],
    printing3D: {
      compatible: 'conditional',
      notes:
        'High shrinkage requires careful temperature management. Best results with enclosed chamber and heated bed. Ideal for chemical-resistant functional parts.',
      nozzleTemp: '200–240°C',
      bedTemp: '90–110°C',
    },
    filamentEquivalentPricePerKg: 28,
    history: hdpeHistory,
  },
  {
    slug: 'pa6',
    name: 'PA6',
    fullName: 'Polyamide 6 (Nylon 6)',
    family: 'engineering',
    density: 1.14,
    mfi: '18 g/10min @ 235°C/2.16kg',
    glassTransition: 50,
    meltTemp: 220,
    applications: [
      'Structural components',
      'Gears & bearings',
      'Automotive under-hood',
      'Electrical connectors',
      'Sporting goods',
    ],
    majorSuppliers: ['BASF', 'DSM', 'Lanxess', 'RadiciGroup', 'Solvay'],
    printing3D: {
      compatible: 'yes',
      notes:
        'Excellent mechanical properties. Requires pre-drying (80°C/8h). Strong interlayer adhesion. Preferred engineering material for Pollen AM pellet systems.',
      nozzleTemp: '250–270°C',
      bedTemp: '70–90°C',
    },
    filamentEquivalentPricePerKg: 45,
    history: pa6History,
  },
  {
    slug: 'petg',
    name: 'PETG',
    fullName: 'Polyethylene terephthalate glycol-modified',
    family: 'engineering',
    density: 1.27,
    mfi: '22 g/10min @ 250°C/2.16kg',
    glassTransition: 80,
    meltTemp: 230,
    applications: [
      'Transparent enclosures',
      'Medical packaging',
      'Food-contact items',
      'Signage',
      'Electronics housings',
    ],
    majorSuppliers: ['Eastman', 'SK Chemicals', 'Indorama', 'Evonik', 'Selenis'],
    printing3D: {
      compatible: 'yes',
      notes:
        'Best balance of ease-of-printing and mechanical performance. Excellent layer adhesion, minimal warping. Food-safe grades available for industrial pellet processing.',
      nozzleTemp: '230–260°C',
      bedTemp: '70–85°C',
    },
    filamentEquivalentPricePerKg: 26,
    history: petgHistory,
  },
  {
    slug: 'rpet',
    name: 'rPET',
    fullName: 'Recycled polyethylene terephthalate',
    family: 'recycled',
    density: 1.38,
    mfi: '25 g/10min @ 250°C/2.16kg',
    glassTransition: 75,
    meltTemp: 250,
    applications: [
      'Sustainable packaging',
      'Textile fibres',
      'Automotive trim',
      'Construction sheets',
      'Eco-design products',
    ],
    majorSuppliers: ['Veolia', 'Plastipak', 'CarbonLITE', 'Indorama Ventures', 'Viridor'],
    printing3D: {
      compatible: 'yes',
      notes:
        'Ideal for sustainability-focused manufacturing. Pre-drying mandatory (150°C/4h). Mechanical properties comparable to virgin PET. Rapidly growing in industrial 3D printing.',
      nozzleTemp: '240–270°C',
      bedTemp: '70–90°C',
    },
    filamentEquivalentPricePerKg: 32,
    history: rpetHistory,
  },
];

export function getMaterial(slug: string): Material | undefined {
  return materials.find((m) => m.slug === slug);
}

export function getLatestPrice(material: Material): number {
  return material.history[material.history.length - 1].price;
}

export function getPriceChange(material: Material, days: number): number {
  const history = material.history;
  const current = history[history.length - 1].price;
  const past = history[Math.max(0, history.length - 1 - days)].price;
  return (current - past) / past;
}
