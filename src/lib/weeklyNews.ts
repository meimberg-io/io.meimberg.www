import type { NewsItem } from '@/lib/rss'
import { isInWindow, type WeeklyWindow } from '@/lib/weeklyWindow'

/** Brevo holt höchstens 10 Items pro RSS-Kampagne, alles darüber wählt Brevo selbst aus. */
export const WEEKLY_MAX_ITEMS = 10

/** Füllt nur die Plätze auf, die Blog, Artikel und Morpheuxx übrig lassen. */
const FILLER_SOURCE = 'Awesome Apps'

const newestFirst = (a: NewsItem, b: NewsItem) => b.pubDate.getTime() - a.pubDate.getTime()

/**
 * Items der Woche, neueste zuerst, höchstens WEEKLY_MAX_ITEMS.
 *
 * Wird es zu viel, fallen die ältesten Awesome-Apps-Items weg. Items ohne
 * parsbares Datum setzt rss.ts auf die Epoche; sie würden nie in ein Fenster
 * fallen, ohne dass es auffällt, deshalb werden sie hier sichtbar verworfen.
 */
export function selectWeeklyItems(items: NewsItem[], weekly: WeeklyWindow): NewsItem[] {
  const dated = items.filter((item) => {
    if (item.pubDate.getTime() > 0) return true
    console.warn(`[rss-weekly] Item ohne Datum verworfen: ${item.link}`)
    return false
  })

  const inWeek = dated.filter((item) => isInWindow(item.pubDate, weekly)).sort(newestFirst)
  const core = inWeek.filter((item) => item.sourceName !== FILLER_SOURCE)
  const filler = inWeek.filter((item) => item.sourceName === FILLER_SOURCE)
  const fillerSlots = Math.max(0, WEEKLY_MAX_ITEMS - core.length)

  return [...core.slice(0, WEEKLY_MAX_ITEMS), ...filler.slice(0, fillerSlots)].sort(newestFirst)
}
