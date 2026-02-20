import { fetchAggregatedNews, type RssFeedSource, type NewsItem } from '@/lib/rss'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import Image from 'next/image'
import Link from 'next/link'

function formatNewsDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

type SourceTheme = {
  color: string
  bgLight: string
  bgDark: string
  borderLight: string
  borderDark: string
}

const SOURCE_THEMES: Record<string, SourceTheme> = {
  'awesome apps': {
    color: '#2563eb',
    bgLight: 'rgba(37,99,235,0.08)',
    bgDark: 'rgba(96,165,250,0.12)',
    borderLight: '#60a5fa',
    borderDark: 'rgba(96,165,250,0.4)',
  },
  morpheuxx: {
    color: '#dc2626',
    bgLight: 'rgba(220,38,38,0.08)',
    bgDark: 'rgba(248,113,113,0.12)',
    borderLight: '#f87171',
    borderDark: 'rgba(248,113,113,0.4)',
  },
  blog: {
    color: '#0d9488',
    bgLight: 'rgba(13,148,136,0.08)',
    bgDark: 'rgba(45,212,191,0.12)',
    borderLight: '#2dd4bf',
    borderDark: 'rgba(45,212,191,0.4)',
  },
}

const DEFAULT_THEME: SourceTheme = {
  color: '#71717a',
  bgLight: 'rgba(113,113,122,0.08)',
  bgDark: 'rgba(161,161,170,0.12)',
  borderLight: '#d4d4d8',
  borderDark: 'rgba(113,113,122,0.4)',
}

function getSourceTheme(sourceName: string): SourceTheme {
  const key = sourceName.toLowerCase()
  for (const [k, v] of Object.entries(SOURCE_THEMES)) {
    if (key.includes(k)) return v
  }
  return DEFAULT_THEME
}

function SourceBadge({ item, isDark }: { item: NewsItem; isDark?: boolean }) {
  const theme = getSourceTheme(item.sourceName)
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color: theme.color, backgroundColor: theme.bgLight }}
    >
      {item.sourceName}
    </span>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
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
          <time
            dateTime={item.pubDate.toISOString()}
            className="text-xs text-zinc-400 dark:text-zinc-500"
          >
            {formatNewsDate(item.pubDate)}
          </time>
          <SourceBadge item={item} />
        </div>

        <div className="flex gap-4">
          {item.imageUrl && (
            <div className="relative shrink-0 overflow-hidden rounded-xl h-28 w-28">
              <Image
                src={item.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="112px"
                unoptimized
              />
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

export default async function NewsFeedList({ sources }: { sources: RssFeedSource[] }) {
  const items = await fetchAggregatedNews(sources)

  if (items.length === 0) {
    return (
      <ElementWrapper>
        <p className="text-zinc-500 dark:text-zinc-400">Keine News verfügbar.</p>
      </ElementWrapper>
    )
  }

  return (
    <ElementWrapper spacing="large">
      <div className="flex max-w-3xl flex-col gap-4">
        {items.map((item) => (
          <NewsCard key={item.link} item={item} />
        ))}
      </div>
    </ElementWrapper>
  )
}
