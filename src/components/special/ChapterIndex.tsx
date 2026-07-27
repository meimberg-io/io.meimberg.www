'use client'

import Link from 'next/link'
import { useSpecial } from '@/components/special/SpecialContext.tsx'

export default function ChapterIndex() {
  const { chapters } = useSpecial()

  if (chapters.length === 0) return null

  return (
    <nav aria-label="Kapitel dieses Specials" className="not-prose mt-16 sm:mt-24">
      <h2 className="mb-8 font-headline text-2xl font-semibold text-accent">Kapitel</h2>
      <ol className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {chapters.map((chapter, index) => (
          <li key={chapter.uuid}>
            <Link
              href={`/${chapter.fullSlug}`}
              className="block h-full rounded-2xl bg-muted p-6 ring-1 ring-border transition hover:ring-internal"
            >
              <span className="text-sm font-semibold text-accent">
                Kapitel {index + 1}
              </span>
              <span className="mt-2 block text-lg font-semibold text-foreground-strong">
                {chapter.title}
              </span>
              {chapter.abstract && (
                <span className="mt-2 block text-base text-body">{chapter.abstract}</span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
