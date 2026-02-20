export interface RssFeedSource {
  name: string
  url: string
  iconUrl?: string
}

export interface NewsItem {
  title: string
  link: string
  pubDate: Date
  description: string
  sourceName: string
  sourceIconUrl?: string
  imageUrl?: string
}

const CACHE_TTL_MS = 10 * 60 * 1000

interface CacheEntry {
  items: NewsItem[]
  fetchedAt: number
}

const cache = new Map<string, CacheEntry>()

function parseRssItems(xml: string, source: RssFeedSource): NewsItem[] {
  const items: NewsItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]

    const title = extractTag(block, 'title')
    const link = extractTag(block, 'link')
    const pubDateStr = extractTag(block, 'pubDate')
    const description = extractTag(block, 'description')
    const imageUrl = extractImageUrl(block)

    if (!title || !link) continue

    items.push({
      title,
      link,
      pubDate: pubDateStr ? new Date(pubDateStr) : new Date(0),
      description: stripCdata(description ?? ''),
      sourceName: source.name,
      sourceIconUrl: source.iconUrl,
      imageUrl
    })
  }

  return items
}

function extractTag(xml: string, tag: string): string | null {
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`))
  if (cdataMatch) return cdataMatch[1].trim()

  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return match ? decodeXmlEntities(match[1].trim()) : null
}

function extractImageUrl(block: string): string | undefined {
  const enclosure = block.match(/<enclosure[^>]+url=["']([^"']+)["']/)
  if (enclosure) return enclosure[1]

  const mediaThumbnail = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/)
  if (mediaThumbnail) return mediaThumbnail[1]

  return undefined
}

function stripCdata(text: string): string {
  return text.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim()
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function applySourceFields(items: NewsItem[], source: RssFeedSource): NewsItem[] {
  return items.map((item) => ({
    ...item,
    sourceName: source.name,
    sourceIconUrl: source.iconUrl,
  }))
}

async function fetchFeed(source: RssFeedSource): Promise<NewsItem[]> {
  const cached = cache.get(source.url)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return applySourceFields(cached.items, source)
  }

  try {
    const res = await fetch(source.url, {
      cache: 'no-store'
    })

    if (!res.ok) {
      console.error(`RSS fetch failed for ${source.name}: ${res.status}`)
      return cached ? applySourceFields(cached.items, source) : []
    }

    const xml = await res.text()
    const items = parseRssItems(xml, source)

    cache.set(source.url, { items, fetchedAt: Date.now() })
    return items
  } catch (err) {
    console.error(`RSS fetch error for ${source.name}:`, err)
    return cached ? applySourceFields(cached.items, source) : []
  }
}

const KNOWN_SOURCE_ICONS: Record<string, string> = {
  'morpheuxx.meimberg.io': 'https://morpheuxx.meimberg.io/favicon.svg',
}

export function deriveSourceIconUrl(feedUrl: string): string | undefined {
  try {
    const { hostname, origin } = new URL(feedUrl)
    return KNOWN_SOURCE_ICONS[hostname] ?? `${origin}/apple-touch-icon.png`
  } catch {
    return undefined
  }
}

export async function fetchAggregatedNews(sources: RssFeedSource[]): Promise<NewsItem[]> {
  const results = await Promise.all(sources.map(fetchFeed))
  const allItems = results.flat()
  allItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
  return allItems
}
