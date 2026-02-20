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

type SourceColorScheme = {
  dot: string
  badge: string
  text: string
  border: string
}

const SOURCE_COLORS: Record<string, SourceColorScheme> = {
  'awesome apps': {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-l-amber-400 dark:border-l-amber-500/40',
  },
  morpheus: {
    dot: 'bg-violet-500',
    badge: 'bg-violet-50 dark:bg-violet-500/10',
    text: 'text-violet-700 dark:text-violet-400',
    border: 'border-l-violet-400 dark:border-l-violet-500/40',
  },
  blog: {
    dot: 'bg-teal-500',
    badge: 'bg-teal-50 dark:bg-teal-500/10',
    text: 'text-teal-700 dark:text-teal-400',
    border: 'border-l-teal-400 dark:border-l-teal-500/40',
  },
}

const DEFAULT_COLORS: SourceColorScheme = {
  dot: 'bg-zinc-400',
  badge: 'bg-zinc-100 dark:bg-zinc-800',
  text: 'text-zinc-600 dark:text-zinc-400',
  border: 'border-l-zinc-300 dark:border-l-zinc-600',
}

function getSourceColors(sourceName: string): SourceColorScheme {
  const key = sourceName.toLowerCase()
  for (const [k, v] of Object.entries(SOURCE_COLORS)) {
    if (key.includes(k)) return v
  }
  return DEFAULT_COLORS
}

function SourceBadge({ item }: { item: NewsItem }) {
  const colors = getSourceColors(item.sourceName)
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${colors.badge} ${colors.text}`}>
      {item.sourceIconUrl ? (
        <Image
          src={item.sourceIconUrl}
          alt=""
          width={14}
          height={14}
          className="rounded-sm"
          unoptimized
        />
      ) : (
        <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
      )}
      {item.sourceName}
    </span>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  const colors = getSourceColors(item.sourceName)

  return (
    <article className={`group relative rounded-2xl border-l-2 ${colors.border} transition-colors`}>
      {/* Hover background */}
      <div className="absolute -inset-x-2 -inset-y-2 z-0 scale-[0.98] rounded-2xl bg-zinc-50 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50" />

      {/* Click target */}
      <Link href={item.link} target="_blank" rel="noopener noreferrer" className="absolute -inset-x-2 -inset-y-2 z-20 rounded-2xl" />

      <div className="relative z-10 py-3 pl-4 pr-2">
        {/* Top: Source badge + date */}
        <div className="mb-3 flex items-center gap-3">
          <SourceBadge item={item} />
          <time
            dateTime={item.pubDate.toISOString()}
            className="text-xs text-zinc-400 dark:text-zinc-500"
          >
            {formatNewsDate(item.pubDate)}
          </time>
        </div>

        {/* Content: image + text */}
        <div className="flex gap-4">
          {item.imageUrl && (
            <div className="relative hidden shrink-0 overflow-hidden rounded-lg sm:block sm:h-16 sm:w-16 md:h-20 md:w-20">
              <Image
                src={item.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
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
