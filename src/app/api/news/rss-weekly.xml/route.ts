import { NextResponse } from 'next/server'
import { fetchNewsFeedSources } from '@/lib/storyblokApi'
import { fetchAggregatedNews } from '@/lib/rss'
import { getWeeklyWindow } from '@/lib/weeklyWindow'
import { selectWeeklyItems, type WeeklyItem } from '@/lib/weeklyNews'

/**
 * Wochen-Feed für den Brevo-Newsletter: genau die abgeschlossene Woche Fr–Do.
 *
 * Item-Format wie /api/news/rss.xml, plus mb:section und mb:first für die Sektionen im
 * Brevo-Template (dort als item.MB_SECTION und item.MB_FIRST). Die Helfer sind bewusst kopiert statt
 * geteilt, damit der bestehende Feed, an dem noch Buttondown hängt, byte-gleich
 * bleibt.
 */

// Ohne das rendert Next die Route beim Build vor, und das Fenster wandert nie.
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://www.meimberg.io/'
const NEWSLETTER_NS = 'https://www.meimberg.io/ns/newsletter'

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
 * Storyblok-Bilder in Mail-Größe: doppelte Mailbreite für Retina, als JPEG, weil Outlook für
 * Windows kein WebP anzeigt. Die Originale sind PNGs mit mehreren MB.
 */
function mailImageUrl(url: string): { url: string; type: string } {
  if (/^https:\/\/a\.storyblok\.com\/f\//.test(url) && !url.includes('/m/')) {
    return { url: `${url}/m/1200x0/filters:format(jpeg):quality(80)`, type: 'image/jpeg' }
  }
  return { url, type: 'image/png' }
}

/**
 * Brevo übernimmt nur Items, deren pubDate zwischen den letzten beiden Prüfzeiten liegt (jeweils
 * eine halbe Stunde davor). Mit dem Originaldatum fiele alles heraus, was freitags vor der Prüfzeit
 * erschienen ist, Blogartikel mit Datum 00:00 also immer. Deshalb trägt jedes Item den
 * Freischaltzeitpunkt (Ende des Fensters) plus einige Sekunden, absteigend in Feed-Reihenfolge.
 * Das Originaldatum steht in dc:date.
 */
function releasedPubDate(released: Date, index: number, count: number): Date {
  return new Date(released.getTime() + (count - index) * 1000)
}

/**
 * Testmodus (`?test=1`) für eine täglich prüfende Test-Integration: pubDate eine Stunde vor dem
 * Abruf, damit jede Prüfung die Woche als neu sieht, und die guid pro Tag neu, falls Brevo
 * bereits verschickte Items wiedererkennt. Inhalt bleibt die abgeschlossene Woche.
 */
const TEST_LEAD_MS = 60 * 60 * 1000

interface ItemStamp {
  pubDate: Date
  guid: string
}

function itemXml({ item, section, first }: WeeklyItem, stamp: ItemStamp): string {
  const image = item.imageUrl ? mailImageUrl(item.imageUrl) : null
  const imageXml = image
    ? `\n      <enclosure url="${escapeXml(image.url)}" type="${image.type}" />\n      <media:thumbnail url="${escapeXml(image.url)}" />`
    : ''
  const source = escapeXml(channelDisplayName(item.sourceName))
  return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="false">${escapeXml(stamp.guid)}</guid>
      <pubDate>${stamp.pubDate.toUTCString()}</pubDate>
      <dc:date>${item.pubDate.toISOString()}</dc:date>
      <description><![CDATA[${item.description ?? ''}]]></description>
      <author>${source}</author>
      <category>${source}</category>
      <dc:creator>${source}</dc:creator>
      <mb:section>${section}</mb:section>
      <mb:first>${first ? 1 : 0}</mb:first>${imageXml}
    </item>`
}

function feedXml(items: WeeklyItem[], lastBuildDate: Date, stampOf: (index: number, link: string) => ItemStamp): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:mb="${NEWSLETTER_NS}">
  <channel>
    <title>Wochen-News | meimberg.io</title>
    <link>${BASE_URL}</link>
    <description>Newsletter-Feed: Blog und weitere Quellen der abgeschlossenen Woche Freitag bis Donnerstag</description>
    <language>de</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <copyright>© ${new Date().getFullYear()} meimberg.io</copyright>
    ${items.map((entry, index) => itemXml(entry, stampOf(index, entry.item.link))).join('\n')}
  </channel>
</rss>`
}

/** `?now=<ISO-8601>` verschiebt nur die Fensterberechnung, zum Prüfen beliebiger Wochen. */
function resolveNow(req: Request): Date {
  const param = new URL(req.url).searchParams.get('now')
  const parsed = param ? new Date(param) : null
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : new Date()
}

export async function GET(req: Request) {
  const weekly = getWeeklyWindow(resolveNow(req))
  const testMode = new URL(req.url).searchParams.get('test') === '1'
  const sources = await fetchNewsFeedSources()
  const items = sources.length > 0 ? await fetchAggregatedNews(sources) : []
  const selected = selectWeeklyItems(items, weekly)

  const fetchedAt = Date.now()
  const testDay = new Date(fetchedAt).toISOString().slice(0, 10)
  const stampOf = (index: number, link: string): ItemStamp =>
    testMode
      ? {
          pubDate: new Date(fetchedAt - TEST_LEAD_MS + (selected.length - index) * 1000),
          guid: `${link}#test-${testDay}`
        }
      : { pubDate: releasedPubDate(weekly.end, index, selected.length), guid: link }

  const xml = feedXml(selected, weekly.end, stampOf)

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': testMode ? 'no-store' : 's-maxage=300, stale-while-revalidate=60'
    }
  })
}
