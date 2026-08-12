# Wochen-Feed für den Newsletter — Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein zweiter RSS-Feed `/api/news/rss-weekly.xml`, der ausschließlich die letzte abgeschlossene Woche (Samstag bis Freitag) zeigt und samstags um 00:00 Berliner Zeit umschaltet, damit Buttondown Items erst einsammelt, wenn sie nicht mehr gelöscht werden können.

**Architecture:** Eine reine Funktion `getWeeklyWindow(now)` berechnet das Fenster in `Europe/Berlin`. Die neue Route nutzt die bestehende Aggregation aus `src/lib/rss.ts` unverändert, filtert auf das Fenster und schreibt das `pubDate` jedes Items auf den Freischalt-Zeitpunkt um, damit Buttondowns Datums-Heuristiken die verzögerten Items nicht aussortieren. Die XML-Erzeugung, die heute in drei Routen kopiert ist, wandert in `src/lib/rssXml.ts`.

**Tech Stack:** Next.js 15 (App Router, Route Handler), TypeScript 5, `Intl.DateTimeFormat` für die Zeitzone. Keine neue Dependency.

**Spec:** `docs/superpowers/specs/2026-08-12-newsletter-weekly-feed-design.md`

## Global Constraints

- **Keine Testinfrastruktur im Repo.** Kein vitest/jest, keine Testdateien, kein `test`-Script. Kein Test-Framework einführen. Verifikation läuft über `make check` (Lint + `tsc --noEmit`), das Prüfskript aus Task 1 und curl gegen den Dev-Server.
- **Niemals `npm run build` oder `make build` als Gate benutzen, solange ein Dev-Server läuft.** `next build` und `next dev` schreiben beide nach `.next`; ein Build zieht dem laufenden Dev-Server die Chunks weg und produziert Fehler, die wie eigene Bugs aussehen. `make check` prüft dieselben Typen und fasst `.next` nicht an.
- **Zeitzone ist immer `Europe/Berlin`.** Nie `getDay()`/`getHours()` auf lokale Serverzeit, nie UTC als Ersatz. Der Container läuft in UTC.
- **Das Fenster ist halboffen: `[start, end)`.** `start` inklusiv, `end` exklusiv.
- **Kein `Date`-Rechnen über 7×24 Stunden.** Wochengrenzen ausschließlich über Kalenderarithmetik (`Date.UTC` mit verschobenem Tageswert), sonst kippt das Fenster in den beiden Umstellungswochen um eine Stunde.
- **Der Output von `/api/news/rss.xml` muss byte-identisch bleiben.** Die Extraktion in Task 2 ist ein reines Refactoring.
- **Keine neue Runtime-Dependency** in `package.json`. Das Prüfskript darf `npx --yes tsx` per Ad-hoc-Download nutzen, ohne Eintrag in `devDependencies`.
- **Commit-Messages deutsch, beschreibend, ohne Präfix** (Repo-Konvention, siehe `git log`). **Keine KI-Attribution** (kein `Co-Authored-By` auf ein Modell, keine „Generated with"-Fußzeile) — ein Pre-Commit-Hook blockt das sonst hart.
- **Niemals pushen.** Commits ja, Push entscheidet der Nutzer.

---

### Task 1: Wochenfenster berechnen

**Files:**
- Create: `src/lib/weeklyWindow.ts`
- Create: `scripts/verify-weekly-window.ts`

**Interfaces:**
- Consumes: nichts.
- Produces:
  - `interface WeeklyWindow { start: Date; end: Date; releasedAt: Date }`
  - `getWeeklyWindow(now: Date): WeeklyWindow`
  - `isInWindow(date: Date, weekly: WeeklyWindow): boolean`

- [ ] **Step 1: Das Prüfskript schreiben (es schlägt fehl, weil das Modul noch nicht existiert)**

Das Repo hat kein Test-Framework, und dafür eines einzuführen ist ausgeschlossen. Das Skript ist der Ersatz: ein Satz fester Zeitvektoren gegen erwartete UTC-Instants. Es wird mitcommittet, damit die Grenzfälle nach einer Änderung erneut prüfbar sind.

Datei `scripts/verify-weekly-window.ts`:

```ts
/**
 * Prüft getWeeklyWindow gegen feste Zeitvektoren.
 *
 * Aufruf: npx --yes tsx scripts/verify-weekly-window.ts
 *
 * Ersetzt hier bewusst ein Test-Framework: das Repo hat keins, und die
 * Wochengrenzen sind der einzige Teil des Wochen-Feeds mit nicht-offensichtlicher
 * Arithmetik (Zeitzone, Umstellung, Monats- und Jahreswechsel).
 */
import { getWeeklyWindow, isInWindow } from '../src/lib/weeklyWindow'

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

// Mi 12.08.2026 → Sa 01.08. 00:00 bis Sa 08.08. 00:00 Berlin (Sommerzeit, +02:00)
check(
  'Mittwoch mitten in der Woche',
  windowOf('2026-08-12T10:00:00Z'),
  '2026-07-31T22:00:00.000Z .. 2026-08-07T22:00:00.000Z'
)

// --- Umschaltung auf die Sekunde ---

// Fr 14.08.2026 23:59:59 Berlin: noch das alte Fenster
check(
  'eine Sekunde vor der Umschaltung',
  windowOf('2026-08-14T21:59:59Z'),
  '2026-07-31T22:00:00.000Z .. 2026-08-07T22:00:00.000Z'
)

// Sa 15.08.2026 00:00:00 Berlin: neues Fenster, die eben beendete Woche
check(
  'exakt Samstag 00:00',
  windowOf('2026-08-14T22:00:00Z'),
  '2026-08-07T22:00:00.000Z .. 2026-08-14T22:00:00.000Z'
)

// Sa 15.08.2026 07:00 Berlin, typische Versandzeit: unverändert
check(
  'Samstagmorgen zur Versandzeit',
  windowOf('2026-08-15T05:00:00Z'),
  '2026-08-07T22:00:00.000Z .. 2026-08-14T22:00:00.000Z'
)

// --- Zeitumstellung ---

// Umstellung auf Sommerzeit: So 29.03.2026. Fenster Sa 28.03. bis Sa 04.04.
// beginnt in CET (+01:00) und endet in CEST (+02:00), ist also 6d23h lang.
check(
  'Fenster über die Sommerzeit-Umstellung',
  windowOf('2026-04-08T10:00:00Z'),
  '2026-03-27T23:00:00.000Z .. 2026-04-03T22:00:00.000Z'
)

// Umstellung auf Winterzeit: So 25.10.2026. Fenster Sa 24.10. bis Sa 31.10.
// beginnt in CEST und endet in CET, ist also 7d1h lang.
check(
  'Fenster über die Winterzeit-Umstellung',
  windowOf('2026-11-04T10:00:00Z'),
  '2026-10-23T22:00:00.000Z .. 2026-10-30T23:00:00.000Z'
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

// So 01.03.2026 → Fenster Sa 21.02. bis Sa 28.02.
check(
  'Monatsgrenze',
  windowOf('2026-03-01T12:00:00Z'),
  '2026-02-20T23:00:00.000Z .. 2026-02-27T23:00:00.000Z'
)

// Fr 01.01.2027 → Fenster Sa 19.12.2026 bis Sa 26.12.2026
check(
  'Jahresgrenze',
  windowOf('2027-01-01T12:00:00Z'),
  '2026-12-18T23:00:00.000Z .. 2026-12-25T23:00:00.000Z'
)

// --- releasedAt ist identisch mit der Obergrenze ---

const weekly = getWeeklyWindow(new Date('2026-08-15T05:00:00Z'))
check('releasedAt == end', weekly.releasedAt.toISOString(), weekly.end.toISOString())

// --- Halboffenes Intervall ---

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

if (failures > 0) {
  console.error(`\n${failures} Prüfung(en) fehlgeschlagen`)
  process.exit(1)
}
console.log('\nalle Prüfungen ok')
```

- [ ] **Step 2: Skript laufen lassen und den erwarteten Fehlschlag sehen**

Run: `npx --yes tsx scripts/verify-weekly-window.ts`

Expected: Abbruch mit einem Auflösungsfehler auf `../src/lib/weeklyWindow` (Text ähnlich `Cannot find module` / `ERR_MODULE_NOT_FOUND`). Kein `ok`/`FAIL` in der Ausgabe, weil das Modul nicht geladen werden kann.

- [ ] **Step 3: `src/lib/weeklyWindow.ts` implementieren**

```ts
/**
 * Wochenfenster für den Newsletter-Feed.
 *
 * Der Newsletter geht samstags raus und soll genau die abgeschlossene Woche
 * Samstag bis Freitag enthalten. Maßgeblich ist der letzte vergangene Samstag
 * 00:00 Berliner Zeit: er ist die (exklusive) Obergrenze des Fensters und
 * gleichzeitig der Zeitpunkt, ab dem die Woche im Feed sichtbar wird.
 */

const TIME_ZONE = 'Europe/Berlin'

export interface WeeklyWindow {
  /** Samstag 00:00 Berlin, sieben Kalendertage vor releasedAt. Inklusiv. */
  start: Date
  /** Identisch mit releasedAt. Exklusiv. */
  end: Date
  /** Letzter vergangener Samstag 00:00 Berlin. */
  releasedAt: Date
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
}

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  weekday: 'short',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})

const offsetFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  timeZoneName: 'longOffset'
})

interface BerlinDate {
  year: number
  month: number
  day: number
  /** 0 = Sonntag … 6 = Samstag */
  weekday: number
}

function berlinDate(at: Date): BerlinDate {
  const parts = partsFormatter.formatToParts(at)
  const value = (type: string): string =>
    parts.find((part) => part.type === type)?.value ?? ''

  return {
    year: Number(value('year')),
    month: Number(value('month')),
    day: Number(value('day')),
    weekday: WEEKDAY_INDEX[value('weekday')]
  }
}

/** UTC-Offset der Zone zum gegebenen Zeitpunkt, in Minuten. */
function berlinOffsetMinutes(at: Date): number {
  const name =
    offsetFormatter
      .formatToParts(at)
      .find((part) => part.type === 'timeZoneName')?.value ?? ''

  const match = name.match(/GMT([+-])(\d{2}):(\d{2})/)
  if (!match) return 0

  const sign = match[1] === '-' ? -1 : 1
  return sign * (Number(match[2]) * 60 + Number(match[3]))
}

/**
 * Berliner Mitternacht des angegebenen Kalendertags als UTC-Instant.
 *
 * `day` darf ausserhalb des Monats liegen (0 oder negativ, oder grösser als die
 * Monatslänge); Date.UTC rollt dann korrekt über Monats- und Jahresgrenzen.
 * Genau deshalb wird hier gerechnet und nicht in Millisekunden: eine Woche ist
 * in den Umstellungswochen nicht 7×24 Stunden lang.
 *
 * Der Offset wird am naiven Instant bestimmt. Das genügt, weil die Umstellung in
 * Europe/Berlin sonntags um 02:00/03:00 liegt: zwischen Freitag 22:00 UTC (dem
 * frühesten Ergebnis) und Samstag 00:00 UTC (dem naiven Instant) liegt nie ein
 * Wechsel, und Mitternacht fällt nie in eine Lücke oder Doppelstunde.
 */
function berlinMidnightUtc(year: number, month: number, day: number): Date {
  const naive = Date.UTC(year, month - 1, day, 0, 0, 0, 0)
  const offset = berlinOffsetMinutes(new Date(naive))
  return new Date(naive - offset * 60 * 1000)
}

export function getWeeklyWindow(now: Date): WeeklyWindow {
  const { year, month, day, weekday } = berlinDate(now)

  // Abstand zum letzten Samstag: am Samstag selbst 0, sonst 1 bis 6. Damit gilt
  // ab Samstag 00:00 bereits die eben abgeschlossene Woche.
  const daysSinceSaturday = (weekday + 1) % 7

  const releasedAt = berlinMidnightUtc(year, month, day - daysSinceSaturday)
  const start = berlinMidnightUtc(year, month, day - daysSinceSaturday - 7)

  return { start, end: releasedAt, releasedAt }
}

export function isInWindow(date: Date, weekly: WeeklyWindow): boolean {
  const time = date.getTime()
  return time >= weekly.start.getTime() && time < weekly.end.getTime()
}
```

- [ ] **Step 4: Prüfskript laufen lassen, alle Prüfungen müssen grün sein**

Run: `npx --yes tsx scripts/verify-weekly-window.ts`

Expected: 15 Zeilen `ok    …`, abschließend `alle Prüfungen ok`, Exit-Code 0. Bei einem `FAIL` zeigt die Ausgabe erwarteten und erhaltenen Instant; dann die Ursache in `berlinMidnightUtc`/`getWeeklyWindow` beheben, nicht die Erwartung im Skript anpassen.

- [ ] **Step 5: Lint und Typecheck**

Run: `make check`

Expected: ESLint ohne Fehler, `tsc --noEmit` ohne Ausgabe.

- [ ] **Step 6: Commit**

```bash
git add src/lib/weeklyWindow.ts scripts/verify-weekly-window.ts
git commit -m "Wochenfenster Sa-Fr in Berliner Zeit als eigene Funktion" -- src/lib/weeklyWindow.ts scripts/verify-weekly-window.ts
```

---

### Task 2: XML-Erzeugung nach `src/lib/rssXml.ts` ziehen

**Files:**
- Create: `src/lib/rssXml.ts`
- Modify: `src/app/api/news/rss.xml/route.ts` (komplett ersetzt, siehe Step 4)

**Interfaces:**
- Consumes: `NewsItem` aus `src/lib/rss.ts`.
- Produces:
  - `escapeXml(value: string): string`
  - `channelDisplayName(sourceName: string): string`
  - `interface NewsItemRenderOptions { pubDate?: Date; originalDate?: Date }`
  - `newsItemXml(item: NewsItem, options?: NewsItemRenderOptions): string`
  - `interface NewsFeedOptions { title: string; link: string; description: string; itemsXml: string[]; lastBuildDate?: Date }`
  - `newsFeedXml(options: NewsFeedOptions): string`

Der Sinn dieser Task ist ein reines Refactoring: der Output von `/api/news/rss.xml` muss hinterher Byte für Byte derselbe sein. Deshalb wird zuerst ein Referenz-Snapshot gezogen.

- [ ] **Step 1: Dev-Server starten**

In dieser Umgebung über das `preview_start`-Werkzeug (nicht über Bash), sonst `make dev`. Der Server braucht `NEXT_PUBLIC_STORYBLOK_TOKEN` in `.env.local` oder `.env`; ohne Token antwortet die Route mit 500.

Warten, bis `http://localhost:3000` erreichbar ist.

- [ ] **Step 2: Referenz-Snapshot des bestehenden Feeds ziehen**

```bash
curl -sS http://localhost:3000/api/news/rss.xml -o /tmp/news-baseline.xml
wc -c /tmp/news-baseline.xml && grep -c '<item>' /tmp/news-baseline.xml
```

Expected: Dateigröße im Bereich von etwa 120 KB, rund 148 `<item>`-Vorkommen. Wenn die Datei kleiner als 1 KB ist, hat die Route einen Fehler geliefert; dann `cat /tmp/news-baseline.xml` ansehen und den Token prüfen, bevor es weitergeht.

Hinweis: Der Snapshot hängt am Storyblok-Inhalt. Wird zwischen den beiden curl-Aufrufen etwas veröffentlicht, weicht der Diff aus einem harmlosen Grund ab. In diesem Fall Snapshot neu ziehen und den Diff wiederholen.

- [ ] **Step 3: `src/lib/rssXml.ts` anlegen**

```ts
/**
 * Erzeugen von RSS-XML.
 *
 * Gegenstück zu src/lib/rss.ts: dort werden fremde Feeds eingelesen, hier wird
 * ausgeliefert. Bewusst getrennt, weil beide Richtungen nichts miteinander zu
 * tun haben.
 */
import type { NewsItem } from '@/lib/rss'

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Der eigene Blog erscheint im Feed unter dem Autorennamen. */
export function channelDisplayName(sourceName: string): string {
  return sourceName === 'Blog' ? 'Oli' : sourceName
}

export interface NewsItemRenderOptions {
  /** Überschreibt das pubDate. Der Wochen-Feed setzt hier den Freischalt-Zeitpunkt. */
  pubDate?: Date
  /** Wird zusätzlich als <dc:date> ausgegeben, wenn gesetzt. */
  originalDate?: Date
}

export function newsItemXml(item: NewsItem, options?: NewsItemRenderOptions): string {
  const pubDate = (options?.pubDate ?? item.pubDate).toUTCString()
  const imageXml = item.imageUrl
    ? `\n      <enclosure url="${escapeXml(item.imageUrl)}" type="image/png" />\n      <media:thumbnail url="${escapeXml(item.imageUrl)}" />`
    : ''
  const originalDateXml = options?.originalDate
    ? `\n      <dc:date>${options.originalDate.toISOString()}</dc:date>`
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
      <dc:creator>${source}</dc:creator>${originalDateXml}${imageXml}
    </item>`
}

export interface NewsFeedOptions {
  title: string
  link: string
  description: string
  /** Fertig gerenderte <item>-Blöcke, in Ausgabereihenfolge. */
  itemsXml: string[]
  lastBuildDate?: Date
}

export function newsFeedXml(options: NewsFeedOptions): string {
  const channelItems = options.itemsXml.join('\n')
  const lastBuildDate = options.lastBuildDate
    ? `\n    <lastBuildDate>${options.lastBuildDate.toUTCString()}</lastBuildDate>`
    : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(options.title)}</title>
    <link>${escapeXml(options.link)}</link>
    <description>${escapeXml(options.description)}</description>
    <language>de</language>
    <copyright>© ${new Date().getFullYear()} meimberg.io</copyright>${lastBuildDate}
    ${channelItems}
  </channel>
</rss>`
}
```

- [ ] **Step 4: `/api/news/rss.xml` auf die gemeinsamen Helfer umstellen**

`src/app/api/news/rss.xml/route.ts` vollständig ersetzen durch:

```ts
import { NextResponse } from 'next/server'
import { fetchNewsFeedSources } from '@/lib/storyblokApi'
import { fetchAggregatedNews } from '@/lib/rss'
import { newsFeedXml, newsItemXml } from '@/lib/rssXml'

const BASE_URL = 'https://www.meimberg.io/'

export async function GET() {
  const sources = await fetchNewsFeedSources()
  const items = sources.length > 0 ? await fetchAggregatedNews(sources) : []

  const xml = newsFeedXml({
    title: 'News | meimberg.io',
    link: BASE_URL,
    description: 'Aggregierter News-Feed: Blog und weitere Quellen von meimberg.io',
    itemsXml: items.map((item) => newsItemXml(item))
  })

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=300'
    }
  })
}
```

- [ ] **Step 5: Byte-Identität prüfen**

```bash
curl -sS http://localhost:3000/api/news/rss.xml -o /tmp/news-after.xml
diff /tmp/news-baseline.xml /tmp/news-after.xml && echo "identisch"
```

Expected: keine Diff-Ausgabe, danach `identisch`. Jede Abweichung ist ein Fehler in der Extraktion und muss behoben werden, bevor es weitergeht. Erfahrungsgemäß betrifft das die Einrückung und die führenden Zeilenumbrüche in den Template-Literalen.

- [ ] **Step 6: Lint und Typecheck**

Run: `make check`

Expected: keine Fehler. Insbesondere darf `escapeXml` in `src/app/api/news/rss.xml/route.ts` nicht mehr vorkommen.

- [ ] **Step 7: Commit**

```bash
git add src/lib/rssXml.ts src/app/api/news/rss.xml/route.ts
git commit -m "RSS-XML-Erzeugung aus der News-Route in src/lib/rssXml.ts ziehen" -- src/lib/rssXml.ts src/app/api/news/rss.xml/route.ts
```

---

### Task 3: `escapeXml` in Blog- und Artikel-Route auf den gemeinsamen Helfer umstellen

**Files:**
- Modify: `src/app/api/rss.xml/route.ts` (lokale `escapeXml`-Funktion entfernen, Import ergänzen)
- Modify: `src/app/api/artikel/rss.xml/route.ts` (dito)

**Interfaces:**
- Consumes: `escapeXml` aus `src/lib/rssXml.ts` (Task 2).
- Produces: nichts Neues.

Beide Routen rendern Storyblok-Stories statt `NewsItem`. Ihre Item- und Channel-Renderer bleiben deshalb, wo sie sind; nur die beiden nach Task 2 noch verbliebenen Kopien von `escapeXml` verschwinden.

- [ ] **Step 1: Referenz-Snapshots beider Feeds ziehen**

```bash
curl -sS http://localhost:3000/api/rss.xml -o /tmp/blog-baseline.xml
curl -sS http://localhost:3000/api/artikel/rss.xml -o /tmp/artikel-baseline.xml
grep -c '<item>' /tmp/blog-baseline.xml /tmp/artikel-baseline.xml
```

Expected: beide Dateien enthalten Items (Blog rund 47, Artikel rund 26).

- [ ] **Step 2: In `src/app/api/rss.xml/route.ts` die lokale Funktion entfernen**

Diesen Block löschen:

```ts
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
```

Und den Import ergänzen, direkt unter die bestehenden Imports:

```ts
import { escapeXml } from '@/lib/rssXml'
```

- [ ] **Step 3: Dasselbe in `src/app/api/artikel/rss.xml/route.ts`**

Denselben `escapeXml`-Block löschen (er ist zeichengleich) und denselben Import ergänzen:

```ts
import { escapeXml } from '@/lib/rssXml'
```

- [ ] **Step 4: Beide Feeds gegen die Snapshots diffen**

```bash
curl -sS http://localhost:3000/api/rss.xml -o /tmp/blog-after.xml
curl -sS http://localhost:3000/api/artikel/rss.xml -o /tmp/artikel-after.xml
diff /tmp/blog-baseline.xml /tmp/blog-after.xml && diff /tmp/artikel-baseline.xml /tmp/artikel-after.xml && echo "beide identisch"
```

Expected: keine Diff-Ausgabe, danach `beide identisch`.

- [ ] **Step 5: Prüfen, dass keine Kopie übrig ist**

```bash
grep -rn 'function escapeXml' src/
```

Expected: genau eine Zeile, in `src/lib/rssXml.ts`.

- [ ] **Step 6: Lint und Typecheck**

Run: `make check`

Expected: keine Fehler.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/rss.xml/route.ts src/app/api/artikel/rss.xml/route.ts
git commit -m "Blog- und Artikel-Feed nutzen escapeXml aus dem gemeinsamen Helfer" -- src/app/api/rss.xml/route.ts src/app/api/artikel/rss.xml/route.ts
```

---

### Task 4: Route `/api/news/rss-weekly.xml`

**Files:**
- Create: `src/app/api/news/rss-weekly.xml/route.ts`

**Interfaces:**
- Consumes: `getWeeklyWindow`, `isInWindow` (Task 1); `newsFeedXml`, `newsItemXml` (Task 2); `fetchNewsFeedSources` aus `src/lib/storyblokApi.ts`; `fetchAggregatedNews` aus `src/lib/rss.ts`.
- Produces: den Feed selbst, keine wiederverwendbare API.

- [ ] **Step 1: Route anlegen**

```ts
import { NextResponse } from 'next/server'
import { fetchNewsFeedSources } from '@/lib/storyblokApi'
import { fetchAggregatedNews } from '@/lib/rss'
import { newsFeedXml, newsItemXml } from '@/lib/rssXml'
import { getWeeklyWindow, isInWindow } from '@/lib/weeklyWindow'

/**
 * Wochen-Feed für den Newsletter.
 *
 * Zeigt ausschließlich die letzte abgeschlossene Woche (Samstag bis Freitag,
 * Berliner Zeit) und schaltet samstags um 00:00 um. Buttondown pollt diesen
 * Feed statt /api/news/rss.xml: was während der laufenden Woche wieder
 * deaktiviert oder gelöscht wird, taucht hier nie auf und kann deshalb nicht
 * im Newsletter landen.
 *
 * force-dynamic ist Pflicht. Ohne das darf Next die Route beim Build statisch
 * vorrendern; new Date() friert dann auf den Build-Zeitpunkt ein, das Fenster
 * wandert nie mehr, und der Feed antwortet weiter mit HTTP 200 auf altem
 * Inhalt. Der Fehler wäre also still.
 */
export const dynamic = 'force-dynamic'

const BASE_URL = 'https://www.meimberg.io/'

export async function GET(request: Request) {
  const nowParam = new URL(request.url).searchParams.get('now')
  const now = nowParam ? new Date(nowParam) : new Date()

  // Bewusst harter Fehler statt stiller Rückfall auf die aktuelle Woche: ein
  // Tippfehler im Parameter würde beim Nachprüfen sonst ein falsches Ergebnis
  // bestätigen.
  if (Number.isNaN(now.getTime())) {
    return NextResponse.json(
      { error: 'Parameter "now" ist kein gültiges Datum (ISO 8601 erwartet).' },
      { status: 400 }
    )
  }

  const weekly = getWeeklyWindow(now)
  const sources = await fetchNewsFeedSources()
  const allItems = sources.length > 0 ? await fetchAggregatedNews(sources) : []

  const itemsXml = allItems
    .filter((item) => {
      const time = item.pubDate.getTime()
      // fetchFeed setzt Items ohne parsbares pubDate auf new Date(0). Die
      // fallen in kein Fenster und wären damit dauerhaft unsichtbar, ohne dass
      // es auffällt — deshalb explizit verwerfen und protokollieren.
      if (Number.isNaN(time) || time === 0) {
        console.warn(`[rss-weekly] Item ohne verwertbares Datum übersprungen: ${item.link}`)
        return false
      }
      return isInWindow(item.pubDate, weekly)
    })
    .sort((a, b) => a.pubDate.getTime() - b.pubDate.getTime())
    .map((item, index) =>
      newsItemXml(item, {
        // Jedes Item ist bei der Entdeckung ein bis sieben Tage alt. Mit dem
        // Freischalt-Zeitpunkt als pubDate greifen Buttondowns Datums-Regeln
        // ("skip old items", "irrelevant" vor Feed-Verknüpfung) nicht. Der
        // Sekundenversatz hält die Reihenfolge deterministisch.
        pubDate: new Date(weekly.releasedAt.getTime() + index * 1000),
        originalDate: item.pubDate
      })
    )

  const xml = newsFeedXml({
    title: 'News der Woche | meimberg.io',
    link: BASE_URL,
    description:
      'Abgeschlossene Woche (Samstag bis Freitag) des News-Feeds von meimberg.io',
    itemsXml,
    lastBuildDate: weekly.releasedAt
  })

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      // Kürzer als Buttondowns 30-Minuten-Poll, damit die Umschaltung am
      // Samstag nicht von einem länger stehenden Cache verdeckt wird.
      'Cache-Control': 's-maxage=300, stale-while-revalidate=60'
    }
  })
}
```

- [ ] **Step 2: Feed ohne Parameter abrufen**

```bash
curl -sS http://localhost:3000/api/news/rss-weekly.xml | head -20
```

Expected: gültiges RSS mit `<title>News der Woche | meimberg.io</title>` und einem `<lastBuildDate>`, das auf einen Samstag fällt. Die Item-Zahl ist klein (Größenordnung 0 bis 10) und kann für eine ruhige Woche null sein — das ist kein Fehler.

- [ ] **Step 3: Umschaltung auf die Sekunde prüfen**

```bash
for t in 2026-08-14T21:59:59Z 2026-08-14T22:00:00Z; do
  echo "--- now=$t"
  curl -sS "http://localhost:3000/api/news/rss-weekly.xml?now=$t" \
    | grep -E '<lastBuildDate>|<dc:date>' 
done
```

Expected: `lastBuildDate` wird als UTC ausgegeben, Samstag 00:00 Berlin ist im August also Freitag 22:00 GMT.

- Bei `now=2026-08-14T21:59:59Z`: `<lastBuildDate>Fri, 07 Aug 2026 22:00:00 GMT</lastBuildDate>`, alle `dc:date` liegen im Intervall `[2026-07-31T22:00Z, 2026-08-07T22:00Z)`.
- Bei `now=2026-08-14T22:00:00Z`: `<lastBuildDate>Fri, 14 Aug 2026 22:00:00 GMT</lastBuildDate>`, alle `dc:date` liegen im Intervall `[2026-08-07T22:00Z, 2026-08-14T22:00Z)`.

Kein `dc:date` darf in beiden Aufrufen auftauchen. Die beiden Item-Mengen müssen disjunkt sein.

- [ ] **Step 4: `pubDate`-Umschreibung prüfen**

```bash
curl -sS "http://localhost:3000/api/news/rss-weekly.xml?now=2026-08-15T05:00:00Z" \
  | grep -E '<pubDate>'
```

Expected: Alle `pubDate` starten bei `Fri, 14 Aug 2026 22:00:00 GMT` und steigen sekundenweise (`22:00:01`, `22:00:02`, …), lückenlos und ohne Dopplung. Liefert die Woche keine Items, gibt es keine Ausgabe; dann einen `now`-Wert wählen, dessen Vorwoche laut `/api/news/rss.xml` Items enthält.

- [ ] **Step 5: Ungültigen Parameter prüfen**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' "http://localhost:3000/api/news/rss-weekly.xml?now=morgen"
```

Expected: `400`.

- [ ] **Step 6: Gegen den vollen Feed abgleichen**

```bash
curl -sS http://localhost:3000/api/news/rss-weekly.xml | grep -oE '<link>[^<]+</link>' | tail -n +2 | sort > /tmp/weekly-links.txt
curl -sS http://localhost:3000/api/news/rss.xml     | grep -oE '<link>[^<]+</link>' | tail -n +2 | sort > /tmp/full-links.txt
comm -23 /tmp/weekly-links.txt /tmp/full-links.txt
```

Expected: keine Ausgabe. Jeder Link im Wochen-Feed muss auch im vollen Feed stehen; alles andere wäre ein Filter- oder Rendering-Fehler. (`tail -n +2` schneidet den Channel-`<link>` ab.)

- [ ] **Step 7: Lint und Typecheck**

Run: `make check`

Expected: keine Fehler.

- [ ] **Step 8: Commit**

```bash
git add src/app/api/news/rss-weekly.xml/route.ts
git commit -m "Wochen-Feed /api/news/rss-weekly.xml für den Newsletter" -- src/app/api/news/rss-weekly.xml/route.ts
```

---

### Task 5: Dokumentation und Umschalt-Anleitung

**Files:**
- Modify: `README.md` (Abschnitt zu den Feeds und der Buttondown-Konfiguration ergänzen)

**Interfaces:**
- Consumes: nichts.
- Produces: nichts.

Die Buttondown-Einstellungen sind codeseitig nicht erzwingbar, entscheiden aber, ob die Lösung wirkt. Ohne Notiz im Repo weiß in einem halben Jahr niemand mehr, warum es zwei Feeds gibt und warum „skip old items" aus bleiben muss.

- [ ] **Step 1: Stelle im README finden**

```bash
grep -n 'BUTTONDOWN_API_KEY' README.md
```

Expected: eine Zeile (aktuell Zeile 25). Der neue Abschnitt kommt an das Ende des Dokuments, nicht in die Env-Aufzählung.

- [ ] **Step 2: Abschnitt am Dateiende anfügen**

````markdown
## RSS-Feeds

| Route | Inhalt | Zweck |
|---|---|---|
| `/api/rss.xml` | Blog aus Storyblok | Leser, Feedreader |
| `/api/artikel/rss.xml` | Artikel aus Storyblok | Leser, Feedreader |
| `/api/news/rss.xml` | Aggregat aus Blog, Artikel und externen Quellen | Leser, News-Seite |
| `/api/news/rss-weekly.xml` | dasselbe Aggregat, aber nur die letzte abgeschlossene Woche | **nur Buttondown** |

Der Wochen-Feed zeigt Samstag bis Freitag (Berliner Zeit) und schaltet samstags
um 00:00 um. Buttondown erfasst jedes Item beim ersten Poll und kann es danach
nicht mehr verwerfen; über den verzögerten Feed erreicht ein Item, das während
der Woche wieder deaktiviert oder gelöscht wird, den Newsletter nie.

Zum Nachprüfen ohne eine Woche Wartezeit nimmt die Route einen Parameter
`?now=<ISO-8601>`, der nur in die Fenster-Berechnung fließt:

```
/api/news/rss-weekly.xml?now=2026-08-15T05:00:00Z
```

Die Fenster-Arithmetik (Zeitzone, Zeitumstellung, Monats- und Jahreswechsel)
prüft `npx --yes tsx scripts/verify-weekly-window.ts`.

### Buttondown-Einstellungen

Drei Dinge müssen dort gelten, sonst wirkt der Wochen-Feed nicht:

- Die Automation liest **`/api/news/rss-weekly.xml`**. `/api/news/rss.xml` muss
  abgekoppelt sein, sonst sammeln beide dieselben Items ein.
- **„skip old items" bleibt aus.** Die Option verwirft Items, die mehr als einen
  Tag vor ihrer Entdeckung veröffentlicht wurden. Im Wochen-Feed sind das je
  nach Wochentag alle.
- Cadence **weekly**, Versand samstags.

Der Feed setzt das `pubDate` jedes Items auf den Freischalt-Zeitpunkt, damit
Buttondown die verzögerten Items nicht als veraltet einsortiert. Das echte
Veröffentlichungsdatum steht als `<dc:date>` daneben und ist im Digest-Template
verfügbar.
````

- [ ] **Step 3: Markdown gegenlesen**

```bash
tail -50 README.md
```

Expected: Die Tabelle ist vollständig, der eingebettete Codeblock mit der Beispiel-URL ist korrekt geschlossen, keine doppelten Überschriften mit bestehenden Abschnitten.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "README: die vier RSS-Feeds und die nötigen Buttondown-Einstellungen dokumentieren" -- README.md
```

---

## Abschluss

- [ ] **Dev-Server stoppen** (`preview_stop`, sonst `make stop`).
- [ ] **`make check`** ein letztes Mal, muss grün sein.
- [ ] **`git log --oneline -6`** ansehen: fünf Commits aus diesem Plan, kein Push.
- [ ] Dem Nutzer melden, was noch von Hand passieren muss: in Buttondown den neuen Feed verknüpfen, den alten abkoppeln, „skip old items" aus lassen, Cadence weekly. Und dass der erste echte Durchlauf erst am nächsten Samstag beobachtbar ist.

## Bewusst nicht Teil dieses Plans

- **Historie im Wochen-Feed.** Ein Item ist nur sieben Tage sichtbar; fällt der Poll in dieser Zeit komplett aus, ist die Woche still verloren. Zwei bis drei Wochen Historie hätten das abgedeckt, wurden aber im Design bewusst verworfen (siehe Spec, „Bekanntes Restrisiko").
- **Test-Framework.** Nicht einführen. `scripts/verify-weekly-window.ts` ist der bewusste Ersatz für den einen Teil mit nicht-offensichtlicher Arithmetik.
- **Item-Renderer der Blog- und Artikel-Routen.** Sie arbeiten auf Storyblok-Stories, nicht auf `NewsItem`, und bleiben unangetastet. Nur `escapeXml` wird geteilt.
