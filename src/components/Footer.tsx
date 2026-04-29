import Link from 'next/link'

const footerLinks = [
  { href: '/materials', label: 'Materials' },
  { href: '/compare', label: 'Compare' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/about', label: 'About' },
  { href: '/about#disclaimer', label: 'Disclaimer' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-[#21262D] bg-[#0B0E14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: tagline */}
          <p className="text-xs text-[#8B949E] text-center sm:text-left">
            <span className="text-[#E07A1F] font-medium">Powered by Pollen AM</span>
            {' '}—{' '}
            built for industrial pellet 3D printing
          </p>

          {/* Center/Right: links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-[#8B949E] hover:text-[#E6EDF3] transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-[#21262D]/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Copyright */}
          <p className="text-xs text-[#8B949E]/50">
            &copy; {year} Pollen AM. All rights reserved.
          </p>

          {/* Disclaimer */}
          <p className="text-xs text-[#8B949E]/40 text-center sm:text-right max-w-md">
            Prices are indicative only and do not constitute financial or procurement advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
