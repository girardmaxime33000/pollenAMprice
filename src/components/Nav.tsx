'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/materials', label: 'Materials' },
  { href: '/compare', label: 'Compare' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-bg">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-8">
        {/* Wordmark */}
        <Link href="/" className="flex flex-col items-start">
          <span className="font-mono text-xs font-600 tracking-[0.15em] uppercase text-ink">
            POLYMER INDEX
          </span>
          <span className="mt-0.5 h-px w-full bg-accent" aria-hidden="true" />
        </Link>

        {/* Nav links desktop */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted hover:text-ink transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Pollen AM link + burger */}
        <div className="flex items-center gap-4">
          <a
            href="https://pollen.am"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-xs text-ink-muted hover:text-ink transition-colors duration-150 underline-offset-2 hover:underline"
          >
            Pollen AM
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-8 h-8 text-ink-muted hover:text-ink transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-line bg-bg">
          <nav className="flex flex-col px-8 py-4 gap-0" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm text-ink-muted hover:text-ink border-b border-line last:border-0 transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://pollen.am"
              target="_blank"
              rel="noopener noreferrer"
              className="pt-4 text-xs text-ink-muted hover:text-ink transition-colors duration-150"
            >
              Pollen AM ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
