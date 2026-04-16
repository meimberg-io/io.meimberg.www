import { newsSourceBadgeClassName } from '@/lib/newsSourceBadge'
import { fetchAggregatedNews, getNewsImageRenderConfig, type RssFeedSource, type NewsItem } from '@/lib/rss'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import Image from 'next/image'
import Link from 'next/link'
import { PaginatedList } from './PaginatedNewsList.tsx'

function formatNewsDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function SourceBadge({ item }: { item: NewsItem }) {
  return (
    <span className={newsSourceBadgeClassName(item.sourceName)}>
      {item.sourceName}
    </span>
  )
}

function NewsCard({ item }: { item: NewsItem }) {
  const imageConfig = getNewsImageRenderConfig(item.imageUrl)

  return (
    <article
      className="group relative rounded-2xl transition-colors"
    >
      <div className="absolute -inset-x-2 -inset-y-2 z-0 scale-[0.98] rounded-2xl bg-zinc-50 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50" />

      <Link href={item.link} target="_blank" rel="noopener noreferrer" className="absolute -inset-x-2 -inset-y-2 z-20 rounded-2xl" />

      <div className="relative z-10 py-3 pr-2">
        <div className="mb-3 flex items-center justify-between">
          <time
            dateTime={item.pubDate.toISOString()}
            className="text-xs text-subtle-foreground"
          >
            {formatNewsDate(item.pubDate)}
          </time>
          <SourceBadge item={item} />
        </div>

        <div className="flex gap-4">
          {imageConfig && (
            <div className="relative shrink-0 overflow-hidden rounded-xl h-28 w-28">
              <Image
                src={imageConfig.src}
                alt=""
                fill
                className="object-cover"
                sizes={imageConfig.sizes}
                quality={imageConfig.quality}
                unoptimized={imageConfig.unoptimized}
              />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-body">
                {item.description}
              </p>
            )}
            <div className="mt-2.5 flex items-center text-sm font-medium text-internal">
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

interface NewsFeedListProps {
  sources: RssFeedSource[]
  limit?: number
  pageSize?: number
  bare?: boolean
}

export default async function NewsFeedList({ sources, limit, pageSize, bare }: NewsFeedListProps) {
  const allItems = await fetchAggregatedNews(sources)

  if (allItems.length === 0) {
    const empty = <p className="text-zinc-500 dark:text-zinc-400">Keine News verfügbar.</p>
    return bare ? empty : <ElementWrapper>{empty}</ElementWrapper>
  }

  const items = limit ? allItems.slice(0, limit) : allItems

  if (pageSize) {
    const content = <PaginatedList items={items} pageSize={pageSize} />
    return bare ? content : <ElementWrapper spacing="large">{content}</ElementWrapper>
  }

  const content = (
    <div className="flex max-w-3xl flex-col gap-4">
      {items.map((item) => (
        <NewsCard key={item.link} item={item} />
      ))}
    </div>
  )
  return bare ? content : <ElementWrapper spacing="large">{content}</ElementWrapper>
}
