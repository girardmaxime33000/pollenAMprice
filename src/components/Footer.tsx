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
    <footer className="w-full border-t border-line bg-bg">
      <div className="mx-auto max-w-[1120px] px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.15em] uppercase text-ink">POLYMER INDEX</p>
            <p className="mt-2 text-xs text-ink-muted">
              Powered by{' '}
              <a href="https://pollen.am" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline underline-offset-2">
                Pollen AM
              </a>
              {' '}— built for industrial pellet 3D printing.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-ink-muted hover:text-ink transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-ink-faint">
            &copy; {year} Pollen AM. All rights reserved.
          </p>
          <p className="text-xs text-ink-faint max-w-md">
            Prices are indicative only and do not constitute financial or procurement advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
