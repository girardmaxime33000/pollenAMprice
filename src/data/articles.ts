export type Article = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string;
  materialSlug?: string;
};

export const articles: Article[] = [
  {
    slug: 'pa6-price-break-3-20',
    title: 'Why PA6 broke 3.20 EUR/kg this quarter',
    date: '2026-04-14',
    category: 'Market Analysis',
    materialSlug: 'pa6',
    excerpt:
      'Polyamide 6 crossed the 3.20 EUR/kg threshold for the first time since Q3 2024, driven by caprolactam feedstock tightness and resurgent automotive demand.',
    body: `Polyamide 6 crossed the 3.20 EUR/kg threshold for the first time since Q3 2024, driven by a combination of caprolactam feedstock tightness and resurgent automotive demand from European OEMs resuming full production schedules.

The primary catalyst was a force majeure declaration at a major caprolactam producer in Central Europe in late February, which removed approximately 180,000 tonnes of annual capacity from the spot market. While the outage was resolved within six weeks, inventory drawdowns were severe enough to sustain upward price pressure through the end of Q1.

On the demand side, tier-one automotive suppliers reported a 14% quarter-on-quarter increase in PA6 purchasing volumes, reflecting both new model launches and the gradual recovery of EV powertrain component orders. Unlike commodity polymers, PA6 demand in industrial 3D printing has remained resilient throughout the cycle: pellet-grade PA6 is typically purchased on quarterly contracts rather than spot, providing price insulation for advanced manufacturing operations.

Looking forward, market participants expect some relief in Q3 as idled capacity returns and seasonal demand softens. However, the structural shift toward higher PA6 consumption in lightweighting applications — particularly in commercial vehicle interiors and under-hood components — suggests the EUR 3.00 floor established in 2025 is likely to hold through year-end.

For industrial 3D printing operators running open pellet-based systems such as those from Pollen AM, the pellet premium over equivalent filament grades remains substantial — typically 12–14× — providing a durable cost advantage even at current elevated PA6 prices.`,
  },
  {
    slug: 'rpet-premium-narrows',
    title: 'rPET premium narrows as recycling capacity expands',
    date: '2026-04-07',
    category: 'Sustainability',
    materialSlug: 'rpet',
    excerpt:
      'The spread between virgin PET and bottle-grade rPET has compressed to under 0.05 EUR/kg in spot markets, as EU-mandated recycling investments come online ahead of schedule.',
    body: `The spread between virgin PET and bottle-grade rPET has compressed to under 0.05 EUR/kg in spot markets — a historic low — as EU-mandated recycling investments come online ahead of schedule across France, Germany, and the Benelux.

Three new mechanical recycling lines commissioned in Q1 2026, with a combined throughput of 320,000 tonnes per year, have materially shifted the supply-demand balance for food-contact grade rPET. The European Commission's 30% recycled content mandate for PET packaging, which takes effect in 2027, had triggered a wave of capacity investment beginning in 2023. That capacity is now landing in a market where brand owners have simultaneously improved collection efficiency, boosting feedstock availability.

The implications for industrial buyers are significant. rPET pellets — long purchased at a premium to virgin material due to scarcity — can now be sourced near price parity in some contract formats. This aligns well with the sustainability commitments of manufacturers operating industrial FFF (Fused Filament Fabrication) and pellet-extrusion platforms.

For pellet-based 3D printing in particular, rPET presents a compelling value proposition: mechanical properties comparable to virgin PET, a dramatically reduced carbon footprint (estimated 60–70% lower embodied CO₂), and an increasingly competitive price point. Early-adopter manufacturers have begun qualifying rPET for structural tooling components and short-run production fixtures, applications previously reserved for engineering-grade virgin polymers.

Analysts at ICIS forecast that rPET will trade at a modest discount to virgin PET by Q4 2026 in spot markets, potentially the first time this has occurred in the modern recycling era. Brands and processors that established rPET supply chains early will be positioned to capture both cost and compliance benefits simultaneously.`,
  },
  {
    slug: 'pp-volatility-european-converters',
    title: 'PP volatility: what European converters should expect through year-end',
    date: '2026-03-28',
    category: 'Market Outlook',
    materialSlug: 'pp-homo',
    excerpt:
      'Polypropylene has seen intramonth swings of up to 6% in Q1 2026. We analyse the structural drivers and offer a framework for hedging exposure in pellet purchasing strategies.',
    body: `Polypropylene has recorded intramonth price swings of up to 6% in Q1 2026, unsettling converter purchasing teams and complicating budget forecasting. The volatility has structural rather than purely cyclical roots — understanding them is prerequisite to building a resilient sourcing strategy.

Three forces are in play simultaneously. First, propylene monomer feedstock is increasingly linked to naphtha, and European naphtha differentials have been unusually volatile since the Red Sea shipping disruptions reshaped Mediterranean refinery economics in late 2024. Second, Chinese PP capacity — which accounts for over 40% of global production — has been running at elevated rates for export, creating periodic price waves when surplus volumes target European markets. Third, demand from the European packaging sector remains structurally weak as brands accelerate the shift to mono-material recyclable formats, some of which use less PP per unit.

Against this backdrop, European converters have responded in two ways. Those with financial sophistication have explored propylene derivative swaps and naphtha-linked contracts to lock in feedstock cost predictability. Smaller operations have gravitated toward shorter purchasing windows — monthly rather than quarterly contracts — accepting higher administrative overhead in exchange for flexibility.

For industrial 3D printing operations, the picture is somewhat different. PP is attractive for pellet-based additive manufacturing precisely because of its low density (0.905 g/cm³), which translates into more parts per kilogram of feedstock. At 1.20–1.35 EUR/kg, even peak-volatility PP remains dramatically cheaper than equivalent PP filament grades at 20–24 EUR/kg. The 15–18× cost advantage is resilient to foreseeable price movements.

Our base case for H2 2026: PP in the 1.25–1.45 EUR/kg range, with continued intramonth volatility. Buyers should consider quarterly volume commitments with monthly pricing resets to balance cost certainty with downside protection.`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
