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

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#21262D] bg-[#0B0E14]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Wordmark */}
        <Link href="/" className="flex flex-col items-start group">
          <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-[#E6EDF3] group-hover:text-white transition-colors">
            POLYMER INDEX
          </span>
          <span className="mt-0.5 h-px w-full bg-[#E07A1F]" aria-hidden="true" />
        </Link>

        {/* Center: Nav links (desktop) */}
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

        {/* Right: badge + burger */}
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

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161B22] transition-colors"
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

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-[#21262D] bg-[#0B0E14]"
        >
          <nav className="flex flex-col px-4 py-3 gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-3 py-2.5 text-sm font-medium text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#161B22] rounded-md transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-[#21262D]">
              <a
                href="https://pollen.am"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E07A1F]/30 bg-[#E07A1F]/10 px-3 py-1 text-xs font-medium text-[#E07A1F]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#E07A1F]" aria-hidden="true" />
                Powered by Pollen AM
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
