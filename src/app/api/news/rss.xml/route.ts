import { NextResponse } from 'next/server'
import { fetchNewsStoryContent } from '@/lib/storyblok'
import { fetchAggregatedNews, deriveSourceIconUrl, type RssFeedSource } from '@/lib/rss'
import type { NewsItem } from '@/lib/rss'

const BASE_URL = 'https://www.meimberg.io/'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function channelDisplayName(sourceName: string): string {
  return sourceName === 'Blog' ? 'Olis' : sourceName
}

function itemXml(item: NewsItem): string {
  const pubDate = item.pubDate.toUTCString()
  const imageXml = item.imageUrl
    ? `\n      <enclosure url="${escapeXml(item.imageUrl)}" type="image/png" />\n      <media:thumbnail url="${escapeXml(item.imageUrl)}" />`
    : ''
  const source = escapeXml(channelDisplayName(item.sourceName))
  return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid>${escapeXml(item.link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${item.description ?? ''}]]></description>
      <author>${source}</author>
      <category>${source}</category>
      <dc:creator>${source}</dc:creator>${imageXml}
    </item>`
}

function feedXml(items: NewsItem[]): string {
  const channelItems = items.map(itemXml).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>News | meimberg.io</title>
    <link>${BASE_URL}</link>
    <description>Aggregierter News-Feed: Blog und weitere Quellen von meimberg.io</description>
    <language>de</language>
    <copyright>© ${new Date().getFullYear()} meimberg.io</copyright>
    ${channelItems}
  </channel>
</rss>`
}

export async function GET() {
  const newsContent = await fetchNewsStoryContent()
  const feeds = newsContent?.feeds ?? []
  const sources: RssFeedSource[] = feeds.map((feed) => ({
    name: feed.name,
    url: feed.url,
    iconUrl: feed.icon?.filename || deriveSourceIconUrl(feed.url)
  }))

  const items = sources.length > 0 ? await fetchAggregatedNews(sources) : []
  const xml = feedXml(items)

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=300'
    }
  })
}
