import { NextResponse } from 'next/server'
import { fetchNewsFeedSources } from '@/lib/storyblokApi'
import { fetchAggregatedNews } from '@/lib/rss'
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
  return sourceName === 'Blog' ? 'Oli' : sourceName
}

/**
 * Storyblok-Bilder in Feed-Größe: 1200 px (doppelte Mailbreite) als JPEG, weil Outlook für
 * Windows kein WebP anzeigt. Die Originale sind PNGs mit mehreren MB.
 */
function feedImage(url: string): { url: string; type: string } {
  if (/^https:\/\/a\.storyblok\.com\/f\//.test(url) && !url.includes('/m/')) {
    return { url: `${url}/m/1200x0/filters:format(jpeg):quality(80)`, type: 'image/jpeg' }
  }
  return { url, type: 'image/png' }
}

function itemXml(item: NewsItem): string {
  const pubDate = item.pubDate.toUTCString()
  const image = item.imageUrl ? feedImage(item.imageUrl) : null
  const imageXml = image
    ? `\n      <enclosure url="${escapeXml(image.url)}" type="${image.type}" />\n      <media:thumbnail url="${escapeXml(image.url)}" />`
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
  const sources = await fetchNewsFeedSources()
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
