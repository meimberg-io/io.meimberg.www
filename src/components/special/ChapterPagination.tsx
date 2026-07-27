'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useSpecial } from '@/components/special/SpecialContext.tsx'

export default function ChapterPagination() {
  const { specialPath, specialTitle, chapters } = useSpecial()
  const pathname = usePathname()

  const currentIndex = chapters.findIndex((chapter) => `/${chapter.fullSlug}` === pathname)

  if (currentIndex < 0) {
    // Kein Chapter passt zum Pfad (z. B. degradierter Pfad ohne Provider-Daten).
    // Ohne specialPath gibt es aber gar kein Ziel für einen Rücklink.
    if (!specialPath) return null

    return (
      <nav aria-label="Weitere Kapitel" className="not-prose mt-16 border-t border-border pt-8">
        <Link
          href={`/${specialPath}`}
          className="block text-sm font-semibold text-internal hover:text-internal-hover"
        >
          ← Alle Kapitel{specialTitle ? `: ${specialTitle}` : ''}
        </Link>
      </nav>
    )
  }

  const previous = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  return (
    <nav
      aria-label="Weitere Kapitel"
      className="not-prose mt-16 border-t border-border pt-8"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/${previous.fullSlug}`}
            className="rounded-2xl bg-muted p-5 ring-1 ring-border transition hover:ring-internal"
          >
            <span className="block text-sm text-muted-foreground">
              ← Kapitel {currentIndex}
            </span>
            <span className="mt-1 block font-semibold text-foreground-strong">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${next.fullSlug}`}
            className="rounded-2xl bg-muted p-5 text-right ring-1 ring-border transition hover:ring-internal sm:col-start-2"
          >
            <span className="block text-sm text-muted-foreground">
              Kapitel {currentIndex + 2} →
            </span>
            <span className="mt-1 block font-semibold text-foreground-strong">
              {next.title}
            </span>
          </Link>
        )}
      </div>
      <Link
        href={`/${specialPath}`}
        className="mt-8 block text-sm font-semibold text-internal hover:text-internal-hover"
      >
        ← Alle Kapitel{specialTitle ? `: ${specialTitle}` : ''}
      </Link>
    </nav>
  )
}
