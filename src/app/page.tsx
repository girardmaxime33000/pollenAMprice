export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-112px)] px-4">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#21262D] bg-[#161B22] px-4 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#E07A1F] animate-pulse" />
        <span className="text-xs font-medium tracking-widest uppercase text-[#8B949E]">
          Phase 1 — In Development
        </span>
      </div>

      {/* Wordmark */}
      <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#E6EDF3] text-center leading-tight mb-4">
        POLLEN{' '}
        <span className="text-[#E07A1F]">POLYMER</span>{' '}
        INDEX
      </h1>

      {/* Tagline */}
      <p className="mt-2 text-lg sm:text-xl text-[#8B949E] text-center max-w-2xl leading-relaxed">
        Dashboard Coming Soon
      </p>

      <p className="mt-4 text-sm text-[#8B949E] text-center max-w-xl leading-relaxed">
        Real-time polymer pellet pricing intelligence for industrial 3D printing.
        Track PA12, PP, PLA, PETG, ABS, and more — built for production.
      </p>

      {/* Divider */}
      <div className="mt-12 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-[#21262D] to-transparent" />

      {/* Stats preview */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {[
          { label: 'Polymers Tracked', value: '12+', sub: 'industrial grades' },
          { label: 'Data Sources', value: '30+', sub: 'global suppliers' },
          { label: 'Update Frequency', value: 'Daily', sub: 'market close' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-xl border border-[#21262D] bg-[#161B22] px-6 py-5 text-center"
          >
            <span className="font-mono text-2xl font-bold text-[#E6EDF3]">
              {stat.value}
            </span>
            <span className="mt-1 text-xs font-medium text-[#8B949E] uppercase tracking-wider">
              {stat.label}
            </span>
            <span className="mt-0.5 text-xs text-[#8B949E]/60">{stat.sub}</span>
          </div>
        ))}
      </div>

      {/* Bottom notice */}
      <p className="mt-12 text-xs text-[#8B949E]/50 text-center">
        Prices shown are indicative only. Not financial advice.
      </p>
    </div>
  )
}
