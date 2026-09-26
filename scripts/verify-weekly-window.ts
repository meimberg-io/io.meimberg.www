/**
 * Prüft getWeeklyWindow und selectWeeklyItems gegen feste Vektoren.
 *
 * Aufruf: npx --yes tsx scripts/verify-weekly-window.ts
 *
 * Ersetzt hier bewusst ein Test-Framework: das Repo hat keins, und die
 * Wochengrenzen sind der einzige Teil des Wochen-Feeds mit nicht-offensichtlicher
 * Arithmetik (Zeitzone, Umstellung, Monats- und Jahreswechsel).
 */
import { getWeeklyWindow, isInWindow } from '../src/lib/weeklyWindow'
import { selectWeeklyItems, WEEKLY_MAX_ITEMS, type WeeklyItem } from '../src/lib/weeklyNews'
import type { NewsItem } from '../src/lib/rss'

let failures = 0

function check(label: string, actual: string, expected: string): void {
  if (actual === expected) {
    console.log(`ok    ${label}`)
    return
  }
  console.error(`FAIL  ${label}`)
  console.error(`      erwartet: ${expected}`)
  console.error(`      erhalten: ${actual}`)
  failures++
}

function windowOf(nowIso: string): string {
  const weekly = getWeeklyWindow(new Date(nowIso))
  return `${weekly.start.toISOString()} .. ${weekly.end.toISOString()}`
}

// --- Normalfall: mitten in der Woche steht die davor abgeschlossene Woche ---

// Mi 12.08.2026 → Fr 31.07. 00:00 bis Fr 07.08. 00:00 Berlin (Sommerzeit, +02:00)
check(
  'Mittwoch mitten in der Woche',
  windowOf('2026-08-12T10:00:00Z'),
  '2026-07-30T22:00:00.000Z .. 2026-08-06T22:00:00.000Z'
)

// --- Umschaltung auf die Sekunde ---

// Do 13.08.2026 23:59:59 Berlin: noch das alte Fenster
check(
  'eine Sekunde vor der Umschaltung',
  windowOf('2026-08-13T21:59:59Z'),
  '2026-07-30T22:00:00.000Z .. 2026-08-06T22:00:00.000Z'
)

// Fr 14.08.2026 00:00:00 Berlin: neues Fenster, die eben beendete Woche
check(
  'exakt Freitag 00:00',
  windowOf('2026-08-13T22:00:00Z'),
  '2026-08-06T22:00:00.000Z .. 2026-08-13T22:00:00.000Z'
)

// Fr 14.08.2026 08:00 Berlin, typische Prüfzeit von Brevo: unverändert
check(
  'Freitagmorgen zur Prüfzeit',
  windowOf('2026-08-14T06:00:00Z'),
  '2026-08-06T22:00:00.000Z .. 2026-08-13T22:00:00.000Z'
)

// --- Zeitumstellung ---

// Sommerzeit ab So 29.03.2026. Fenster Fr 27.03. bis Fr 03.04. beginnt in CET
// (+01:00) und endet in CEST (+02:00), ist also 6d23h lang.
check(
  'Fenster über die Sommerzeit-Umstellung',
  windowOf('2026-04-08T10:00:00Z'),
  '2026-03-26T23:00:00.000Z .. 2026-04-02T22:00:00.000Z'
)

// Winterzeit ab So 25.10.2026. Fenster Fr 23.10. bis Fr 30.10. beginnt in CEST
// und endet in CET, ist also 7d1h lang.
check(
  'Fenster über die Winterzeit-Umstellung',
  windowOf('2026-11-04T10:00:00Z'),
  '2026-10-22T22:00:00.000Z .. 2026-10-29T23:00:00.000Z'
)

const spring = getWeeklyWindow(new Date('2026-04-08T10:00:00Z'))
check(
  'Länge des Frühjahrs-Fensters',
  String(spring.end.getTime() - spring.start.getTime()),
  String((7 * 24 - 1) * 60 * 60 * 1000)
)

const autumn = getWeeklyWindow(new Date('2026-11-04T10:00:00Z'))
check(
  'Länge des Herbst-Fensters',
  String(autumn.end.getTime() - autumn.start.getTime()),
  String((7 * 24 + 1) * 60 * 60 * 1000)
)

// --- Monats- und Jahresgrenze (Kalenderarithmetik mit Tageswert <= 0) ---

// So 01.03.2026 → Fenster Fr 20.02. bis Fr 27.02.
check(
  'Monatsgrenze',
  windowOf('2026-03-01T12:00:00Z'),
  '2026-02-19T23:00:00.000Z .. 2026-02-26T23:00:00.000Z'
)

// Sa 02.01.2027 → Fenster Fr 25.12.2026 bis Fr 01.01.2027
check(
  'Jahresgrenze',
  windowOf('2027-01-02T12:00:00Z'),
  '2026-12-24T23:00:00.000Z .. 2026-12-31T23:00:00.000Z'
)

// --- Halboffenes Intervall ---

const weekly = getWeeklyWindow(new Date('2026-08-14T06:00:00Z'))
check('Untergrenze ist inklusiv', String(isInWindow(weekly.start, weekly)), 'true')
check('Obergrenze ist exklusiv', String(isInWindow(weekly.end, weekly)), 'false')
check(
  'eine Millisekunde vor der Obergrenze',
  String(isInWindow(new Date(weekly.end.getTime() - 1), weekly)),
  'true'
)
check(
  'eine Millisekunde vor der Untergrenze',
  String(isInWindow(new Date(weekly.start.getTime() - 1), weekly)),
  'false'
)

// --- Auswahl: Fenster, Datum, Obergrenze mit Awesome Apps als Puffer ---

function item(sourceName: string, iso: string, title = `${sourceName} ${iso}`): NewsItem {
  return { title, link: `https://example.org/${title}`, pubDate: new Date(iso), description: '', sourceName }
}

const inWeek = (day: number, hour = 12) =>
  `2026-08-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00Z`

const titles = (items: WeeklyItem[]) => items.map(({ item }) => item.title).join(', ')

check(
  'nur Items im Fenster, ohne Datum verworfen, neueste zuerst',
  titles(
    selectWeeklyItems(
      [
        item('Blog', inWeek(8), 'a'),
        item('Blog', inWeek(12), 'b'),
        item('Blog', '2026-08-13T22:00:00Z', 'zu spät'),
        item('Blog', '2026-08-06T21:59:59Z', 'zu früh'),
        item('Blog', '1970-01-01T00:00:00Z', 'ohne Datum')
      ],
      weekly
    )
  ),
  'b, a'
)

const crowded = [
  ...Array.from({ length: 4 }, (_, i) => item('Blog', inWeek(7 + i), `blog${i}`)),
  ...Array.from({ length: 2 }, (_, i) => item('Morpheuxx', inWeek(9 + i), `morph${i}`)),
  ...Array.from({ length: 8 }, (_, i) => item('Awesome Apps', inWeek(7 + i % 7, 10 + i), `app${i}`))
]
const selected = selectWeeklyItems(crowded, weekly)

check('Obergrenze wird eingehalten', String(selected.length), String(WEEKLY_MAX_ITEMS))
check(
  'Blog und Morpheuxx vollständig',
  String(selected.filter(({ item }) => item.sourceName !== 'Awesome Apps').length),
  '6'
)
check(
  'Awesome Apps: die neuesten bleiben',
  selected
    .filter(({ item }) => item.sourceName === 'Awesome Apps')
    .map(({ item }) => item.title)
    .sort()
    .join(', '),
  'app3, app4, app5, app6'
)

check(
  'nach Sektion sortiert, darin neueste zuerst',
  selected.map(({ section }) => section).join(','),
  'blog,blog,blog,blog,morpheuxx,morpheuxx,apps,apps,apps,apps'
)
check(
  'erstes Item je Sektion markiert',
  selected.filter(({ first }) => first).map(({ item }) => item.title).join(', '),
  'blog3, morph1, app6'
)
check(
  'Artikel zählen zur Blog-Sektion',
  selectWeeklyItems([item('Morpheuxx', inWeek(9), 'm'), item('Artikel', inWeek(8), 'a')], weekly)
    .map(({ section, first }) => `${section}:${first}`)
    .join(','),
  'blog:true,morpheuxx:true'
)

if (failures > 0) {
  console.error(`\n${failures} Prüfung(en) fehlgeschlagen`)
  process.exit(1)
}
console.log('\nalle Prüfungen ok')
