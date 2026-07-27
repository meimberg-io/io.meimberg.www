'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { useSpecial } from '@/components/special/SpecialContext.tsx'

export default function ChapterNav() {
  const { specialPath, specialTitle, chapters } = useSpecial()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (chapters.length === 0) return null

  const currentIndex = chapters.findIndex((chapter) => `/${chapter.fullSlug}` === pathname)
  const current = currentIndex >= 0 ? chapters[currentIndex] : null

  const chapterList = (
    <ol className="space-y-1">
      {chapters.map((chapter, index) => {
        const isCurrent = index === currentIndex
        return (
          <li key={chapter.uuid}>
            <Link
              href={`/${chapter.fullSlug}`}
              aria-current={isCurrent ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={clsx(
                'block border-l-2 py-1.5 pl-3 text-sm transition',
                isCurrent
                  ? 'border-accent font-semibold text-foreground-strong'
                  : 'border-border-subtle text-internal hover:border-internal hover:text-internal-hover'
              )}
            >
              <span className="mr-2 tabular-nums text-muted-foreground">{index + 1}</span>
              {chapter.title}
            </Link>
          </li>
        )
      })}
    </ol>
  )

  const backLink = (
    <Link
      href={`/${specialPath}`}
      className="mb-6 block text-sm font-semibold text-internal hover:text-internal-hover"
    >
      ← {specialTitle || 'Zur Übersicht'}
    </Link>
  )

  return (
    <>
      {/* ab xl: klebende Sidebar */}
      <nav
        aria-label="Kapitel dieses Specials"
        className="not-prose hidden xl:block"
      >
        <div className="sticky top-28">
          {backLink}
          {chapterList}
        </div>
      </nav>

      {/* unter xl: klebende Zeile, aufklappbar */}
      <nav
        aria-label="Kapitel dieses Specials"
        className="not-prose sticky top-0 z-20 -mx-4 mb-8 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 xl:hidden"
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center justify-between text-left text-sm text-internal hover:text-internal-hover"
        >
          <span>
            {current
              ? `Kapitel ${currentIndex + 1} von ${chapters.length} — ${current.title}`
              : specialTitle || 'Kapitel'}
          </span>
          <span aria-hidden="true" className="ml-4 shrink-0">
            {open ? '▲' : '▼'}
          </span>
        </button>
        {open && (
          <div className="mt-4">
            {backLink}
            {chapterList}
          </div>
        )}
      </nav>
    </>
  )
}
