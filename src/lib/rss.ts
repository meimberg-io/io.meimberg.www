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

export interface NewsImageRenderConfig {
  src: string
  unoptimized: boolean
  quality?: number
  sizes: string
}

const NEWS_IMAGE_OPTIMIZED_HOSTS = new Set([
  'meimberg.io'
])

const NEWS_IMAGE_OPTIMIZED_SUFFIXES = [
  '.meimberg.io'
]

const STORYBLOK_HOSTS = new Set([
  'a.storyblok.com',
  'pagetypes.imgix.net'
])

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
    const imageUrl = resolveNewsImageUrl(extractImageUrl(block), link ?? undefined)

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

function normalizeUrl(url: string, baseUrl?: string): string | undefined {
  const raw = url.trim()
  if (!raw) return undefined

  try {
    if (raw.startsWith('//')) {
      return `https:${raw}`
    }
    if (raw.startsWith('/')) {
      if (!baseUrl) return undefined
      return new URL(raw, baseUrl).toString()
    }
    return new URL(raw).toString()
  } catch {
    return undefined
  }
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

export function resolveNewsImageUrl(imageUrl?: string, linkUrl?: string): string | undefined {
  if (!imageUrl) return undefined
  return normalizeUrl(imageUrl, linkUrl)
}

function isOptimizableNewsHost(hostname: string): boolean {
  if (NEWS_IMAGE_OPTIMIZED_HOSTS.has(hostname)) return true
  return NEWS_IMAGE_OPTIMIZED_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
}

function isStoryblokHost(hostname: string): boolean {
  return STORYBLOK_HOSTS.has(hostname)
}

function buildStoryblokSquare(url: URL, size: number, quality: number): string {
  const base = `${url.origin}${url.pathname}`
  const focal = url.searchParams.get('focus')
  if (focal && focal.trim().length > 0) {
    return `${base}/m/${size}x${size}/filters:focal(${focal}):quality(${quality}):format(webp)`
  }
  return `${base}/m/${size}x${size}/smart/filters:quality(${quality}):format(webp)`
}

export function getNewsImageRenderConfig(imageUrl?: string): NewsImageRenderConfig | null {
  if (!imageUrl) return null
  try {
    const parsed = new URL(imageUrl)
    if (isStoryblokHost(parsed.hostname)) {
      const src = buildStoryblokSquare(parsed, 224, 95)
      return {
        src,
        unoptimized: false,
        quality: 95,
        sizes: '112px'
      }
    }

    if (isOptimizableNewsHost(parsed.hostname)) {
      return {
        src: imageUrl,
        unoptimized: false,
        quality: 95,
        sizes: '224px'
      }
    }

    return {
      src: imageUrl,
      unoptimized: true,
      sizes: '112px'
    }
  } catch {
    return {
      src: imageUrl,
      unoptimized: true,
      sizes: '112px'
    }
  }
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
