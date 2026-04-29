import Link from 'next/link'

const navLinks = [
  { href: '/materials', label: 'Materials' },
  { href: '/compare', label: 'Compare' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#21262D] bg-[#0B0E14]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Wordmark */}
        <Link href="/" className="flex flex-col items-start group">
          <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-[#E6EDF3] group-hover:text-white transition-colors">
            POLYMER INDEX
          </span>
          <span
            className="mt-0.5 h-px w-full bg-[#E07A1F] origin-left scale-x-100 transition-transform"
            aria-hidden="true"
          />
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-1.5 text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] transition-colors duration-150 rounded-md hover:bg-[#161B22] group"
            >
              {link.label}
              <span
                className="absolute bottom-0 left-3 right-3 h-px bg-[#E07A1F] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        {/* Right: Powered by badge */}
        <div className="flex items-center gap-3">
          <a
            href="https://pollen.am"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#E07A1F]/30 bg-[#E07A1F]/10 px-3 py-1 text-xs font-medium text-[#E07A1F] hover:bg-[#E07A1F]/20 hover:border-[#E07A1F]/50 transition-colors duration-150"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#E07A1F]" aria-hidden="true" />
            Powered by Pollen AM
          </a>

          {/* Mobile menu trigger placeholder */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161B22] transition-colors"
            aria-label="Open menu"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M2 4h12M2 8h12M2 12h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
