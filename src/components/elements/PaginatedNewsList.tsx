'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { NewsItem } from '@/lib/rss'

interface SerializedNewsItem {
  title: string
  link: string
  pubDate: string
  description: string
  sourceName: string
  sourceIconUrl?: string
  imageUrl?: string
}

type SourceTheme = {
  color: string
  bgLight: string
  borderLight: string
}

const SOURCE_THEMES: Record<string, SourceTheme> = {
  'awesome apps': {
    color: '#2563eb',
    bgLight: 'rgba(37,99,235,0.08)',
    borderLight: '#60a5fa',
  },
  morpheuxx: {
    color: '#dc2626',
    bgLight: 'rgba(220,38,38,0.08)',
    borderLight: '#f87171',
  },
  blog: {
    color: '#0d9488',
    bgLight: 'rgba(13,148,136,0.08)',
    borderLight: '#2dd4bf',
  },
}

const DEFAULT_THEME: SourceTheme = {
  color: '#71717a',
  bgLight: 'rgba(113,113,122,0.08)',
  borderLight: '#d4d4d8',
}

function getSourceTheme(sourceName: string): SourceTheme {
  const key = sourceName.toLowerCase()
  for (const [k, v] of Object.entries(SOURCE_THEMES)) {
    if (key.includes(k)) return v
  }
  return DEFAULT_THEME
}

function formatNewsDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function PaginatedNewsCard({ item }: { item: SerializedNewsItem }) {
  const theme = getSourceTheme(item.sourceName)

  return (
    <article
      className="group relative rounded-2xl border-l-2 transition-colors"
      style={{ borderLeftColor: theme.borderLight }}
    >
      <div className="absolute -inset-x-2 -inset-y-2 z-0 scale-[0.98] rounded-2xl bg-zinc-50 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50" />
      <Link href={item.link} target="_blank" rel="noopener noreferrer" className="absolute -inset-x-2 -inset-y-2 z-20 rounded-2xl" />
      <div className="relative z-10 py-3 pl-4 pr-2">
        <div className="mb-3 flex items-center justify-between">
          <time dateTime={item.pubDate} className="text-xs text-zinc-400 dark:text-zinc-500">
            {formatNewsDate(item.pubDate)}
          </time>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ color: theme.color, backgroundColor: theme.bgLight }}
          >
            {item.sourceName}
          </span>
        </div>
        <div className="flex gap-4">
          {item.imageUrl && (
            <div className="relative shrink-0 overflow-hidden rounded-xl h-28 w-28">
              <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="112px" unoptimized />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
            )}
            <div className="mt-2.5 flex items-center text-sm font-medium text-teal-500">
              Weiterlesen
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function PaginatedList({ items, pageSize }: { items: NewsItem[]; pageSize: number }) {
  const serialized: SerializedNewsItem[] = items.map((item) => ({
    ...item,
    pubDate: item.pubDate.toISOString(),
  }))

  const [visibleCount, setVisibleCount] = useState(pageSize)
  const visible = serialized.slice(0, visibleCount)
  const hasMore = visibleCount < serialized.length

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      {visible.map((item) => (
        <PaginatedNewsCard key={item.link} item={item} />
      ))}
      {hasMore && (
        <button
          onClick={() => setVisibleCount((c) => c + pageSize)}
          className="mt-4 cursor-pointer self-center rounded-full border border-zinc-200 text-sm font-medium text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          style={{ padding: '10px 32px' }}
        >
          Mehr anzeigen
        </button>
      )}
    </div>
  )
}
