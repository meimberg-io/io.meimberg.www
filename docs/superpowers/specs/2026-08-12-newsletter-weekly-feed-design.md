# Wochen-Feed für den Newsletter: verzögerter RSS-Feed mit Sa–Fr-Fenster

*Datum: 2026-08-12 · Status: abgestimmt, bereit für Umsetzungsplanung*

## Ausgangslage und Ziel

Der Newsletter läuft über Buttondown und hängt an
[`/api/news/rss.xml`](../../../src/app/api/news/rss.xml/route.ts), dem aggregierten News-Feed aus
Blog, Artikel und externen Quellen. Buttondown pollt diesen Feed alle 30 Minuten und legt jedes neu
gesehene Item sofort als Newsletter-Item ab.

Daraus folgt das Problem: wird ein Item später deaktiviert oder gelöscht, ist es bei Buttondown
längst erfasst und geht am Samstag trotzdem raus. Buttondown bietet keine Möglichkeit, ein einmal
eingesammeltes Item wieder zu verwerfen.

Ziel ist ein zweiter Feed, den Buttondown statt des bestehenden liest und der Items erst zeigt,
wenn die Woche abgeschlossen ist. Was während der Woche wieder verschwindet, erreicht den
Newsletter dann nie. Der bestehende Feed bleibt unverändert für menschliche Leser.

Der Wirkmechanismus ist die **Verzögerung**, nicht die Fensterbreite. Buttondown entscheidet über
den Mail-Inhalt anhand seiner eigenen Dedupe-Liste, nicht anhand der Feed-Länge.

## Buttondown-Mechanik, auf der der Entwurf aufsetzt

Recherchiert in der Buttondown-Doku zu RSS-to-Email, weil daran hängt, ob der Ansatz überhaupt
trägt:

- Buttondown pollt alle 30 Minuten.
- Items werden über `guid` identifiziert, ersatzweise über den Link. Bereits verschickte Items
  gehen nicht erneut raus.
- Die Option „skip old items" überspringt Items, deren Publish-Datum mehr als einen Tag vor der
  Entdeckung liegt. Standard ist aus. Wäre sie an, würde dieser Entwurf komplett kippen: ein
  Montags-Item, das erst Samstag auftaucht, ist fünf Tage alt.
- Items werden zusätzlich als „irrelevant" markiert, wenn ihr Datum vor dem Zeitpunkt der
  Feed-Verknüpfung liegt.
- Die Weekly-Cadence feuert nur, wenn mindestens ein neues Item vorliegt.

Die beiden Datums-Regeln sind der Grund für die `pubDate`-Umschreibung weiter unten.

## Entscheidungen

| Frage | Entscheidung |
|---|---|
| Route | `/api/news/rss-weekly.xml`, neu. Bestehender Feed bleibt inhaltlich unverändert. |
| Fenster | Genau eine abgeschlossene Woche, Sa 00:00 bis Fr 24:00, Umschaltung Samstag 00:00. |
| Zeitzone | `Europe/Berlin`. |
| Historie | Keine. Bewusst gegen die Empfehlung entschieden, Risiko unten dokumentiert. |
| `pubDate` | Freischalt-Zeitpunkt statt Original-Datum, pro Item um Sekunden versetzt. |
| Original-Datum | Bleibt als `<dc:date>` erhalten. |
| Rendering | Next: `force-dynamic`, damit das Fenster zur Laufzeit wandert. |
| Code-Teilung | XML-Helfer nach `src/lib/rssXml.ts`, bestehende News-Route mit umgestellt. |
| Prüfbarkeit | Optionaler Query-Parameter `?now=<ISO>` überschreibt die Fenster-Berechnung. |

## Fenster-Definition

Maßgeblich ist der letzte **vergangene** Samstag 00:00 Berliner Zeit. Dieser Zeitpunkt ist
gleichzeitig die Obergrenze des Fensters und der Freischalt-Zeitpunkt. Die Untergrenze liegt sieben
Tage davor. Das Intervall ist halboffen, `[start, end)`.

| Abruf am | Fenster | Enthält |
|---|---|---|
| Mi 12.08.2026 | Sa 01.08. 00:00 bis Sa 08.08. 00:00 | Sa 01.08. bis Fr 07.08. |
| Sa 15.08.2026, 00:01 | Sa 08.08. 00:00 bis Sa 15.08. 00:00 | Sa 08.08. bis Fr 14.08. |

Der Samstags-Versand trifft damit immer die Woche, die wenige Stunden vorher zu Ende gegangen ist.

Fällt der Abruf exakt auf Samstag 00:00, gilt dieser Samstag schon als der „letzte vergangene": der
Feed zeigt dann bereits die eben abgeschlossene Woche. Die Umschaltung passiert also ohne Lücke
genau auf der Sekunde.

## Module

### `src/lib/weeklyWindow.ts` (neu)

Reine Berechnung, kein I/O, keine Abhängigkeit auf Storyblok oder RSS.

```ts
export interface WeeklyWindow {
  start: Date       // Samstag 00:00 Berlin, sieben Tage vor releasedAt
  end: Date         // = releasedAt, exklusiv
  releasedAt: Date  // letzter vergangener Samstag 00:00 Berlin
}

export function getWeeklyWindow(now: Date): WeeklyWindow
export function isInWindow(date: Date, window: WeeklyWindow): boolean
```

Die Zeitzone wird ohne neue Dependency über `Intl.DateTimeFormat` aufgelöst: Berliner Kalendertag
und Wochentag über `formatToParts`, der UTC-Offset über `timeZoneName: 'longOffset'`. Daraus wird
die Berliner Mitternacht als UTC-Instant konstruiert.

Die Zeitumstellung fällt immer auf Sonntag 02:00 beziehungsweise 03:00. Die Samstags-Grenze ist
deshalb nie doppelt belegt und nie unbesetzt, der naive Offset-Ansatz ist hier korrekt. Das gehört
als Kommentar in die Datei, sonst sieht der nächste Leser nur einen ungesicherten Sonderfall.

### `src/lib/rssXml.ts` (neu, Extraktion)

`escapeXml` liegt heute in drei Feed-Routen identisch vor, der News-Item-Renderer in einer. Die neue
Route wäre die vierte Kopie, also Redundanz, die niemand mehr synchron hält.

Bewusst eine eigene Datei und nicht `src/lib/rss.ts`: dort geht es um das **Einlesen** fremder
Feeds (Parsen, Cache, Bild-Normalisierung). Das **Erzeugen** von XML ist eine andere Aufgabe.

Inhalt:

- `escapeXml(value: string): string`
- `channelDisplayName(sourceName: string): string`
- `newsItemXml(item: NewsItem, overrides?: { pubDate?: Date; originalDate?: Date }): string`
- `newsFeedXml(options: { title, link, description, items, lastBuildDate? }): string`

Umgestellt werden:

- [`/api/news/rss.xml`](../../../src/app/api/news/rss.xml/route.ts) vollständig, Output muss
  byte-identisch bleiben.
- [`/api/rss.xml`](../../../src/app/api/rss.xml/route.ts) und
  [`/api/artikel/rss.xml`](../../../src/app/api/artikel/rss.xml/route.ts) nur für `escapeXml`.
  Ihre Item-Renderer arbeiten auf Storyblok-Stories statt auf `NewsItem` und bleiben, wo sie sind.

### `src/app/api/news/rss-weekly.xml/route.ts` (neu)

```
GET
 ├─ now = ?now-Parameter, sonst new Date()
 ├─ window = getWeeklyWindow(now)
 ├─ sources = fetchNewsFeedSources()            unverändert
 ├─ items = fetchAggregatedNews(sources)        unverändert
 ├─ items ohne verwertbares Datum verwerfen, console.warn
 ├─ auf window filtern
 ├─ aufsteigend nach Original-Datum sortieren
 ├─ pubDate = releasedAt + Index in Sekunden, dc:date = Original-Datum
 └─ newsFeedXml(...)
```

`export const dynamic = 'force-dynamic'`. Ohne das kann Next die Route beim Build statisch
vorrendern, `new Date()` friert auf den Build-Zeitpunkt ein und das Fenster wandert nie. Der Fehler
wäre still: der Feed antwortet weiter mit HTTP 200 und altem Inhalt.

`Cache-Control: s-maxage=300, stale-while-revalidate=60`. Kürzer als der 30-Minuten-Poll, damit die
Umschaltung am Samstag nicht von einem länger stehenden Cache verdeckt wird.

## Warum `pubDate` umgeschrieben wird

Jedes Item im Wochen-Feed ist im Moment der Entdeckung ein bis sieben Tage alt. Damit greifen zwei
Buttondown-Regeln, die es aussortieren könnten: „skip old items" bei Ein-Tages-Schwelle, und die
Markierung als „irrelevant" für Daten vor der Feed-Verknüpfung. Letztere trifft insbesondere den
ersten Schub nach dem Einrichten.

Mit `pubDate = releasedAt + Index Sekunden` ist jedes Item im Moment des Auftauchens frisch, und
keine der beiden Regeln greift. Der Sekunden-Versatz hält die Reihenfolge deterministisch, statt sie
Buttondown bei identischen Zeitstempeln zu überlassen.

Das Original-Datum geht nicht verloren, es wandert nach `<dc:date>` und steht dem Digest-Template
zur Verfügung.

## Fehlerfälle

| Fall | Verhalten |
|---|---|
| Leere Woche | Valider Feed mit null Items. Buttondowns Weekly-Cadence feuert nicht, es geht keine Mail raus. Kein Sonderfall im Code. |
| Item ohne parsbares Datum | Wird verworfen, mit `console.warn`. [`rss.ts`](../../../src/lib/rss.ts) setzt solche Items heute auf `new Date(0)`; ohne aktives Verwerfen wären sie dauerhaft unsichtbar, ohne dass es auffällt. |
| Eine Quelle antwortet nicht | Unverändertes Verhalten von `fetchFeed`: letzter Cache-Stand, sonst leere Liste, Fehler ins Log. |
| Storyblok nicht erreichbar | `fetchNewsFeedSources` wirft, die Route antwortet mit 500. Buttondown überspringt den Poll und versucht es 30 Minuten später erneut. Kein eigenes Handling nötig. |

## Prüfbarkeit

Das Repo hat kein Test-Framework, und dafür eines einzuführen steht hier nicht zur Debatte.

Stattdessen: `getWeeklyWindow` ist rein und nimmt `now` als Argument. Die Route liest optional
`?now=<ISO-8601>` und gibt den Wert nur an diese Funktion weiter, nie an Storyblok. Damit lässt sich
der Feed für jeden beliebigen Samstag abrufen und gegen das erwartete Item-Set halten, ohne eine
Woche zu warten.

Bewusst akzeptiert: der Parameter ist öffentlich sichtbar. Der Feed ist read-only, und Buttondown
schickt ihn nie mit. Es bleibt eine Test-Naht im Produktivcode.

Abnahme vor dem Umschalten:

1. `?now=` auf einen Samstag kurz nach 00:00 setzen und prüfen, dass genau die Sa–Fr-Woche davor
   erscheint.
2. Dasselbe eine Sekunde vor Samstag 00:00 und prüfen, dass noch das alte Fenster steht.
3. Alle `pubDate` liegen auf `releasedAt` und aufwärts, aufsteigend, ohne Dopplung.
4. Output von `/api/news/rss.xml` vor und nach der Extraktion diffen, muss identisch sein.

## Buttondown-Konfiguration

Codeseitig nicht erzwingbar, gehört aber zur Lösung:

- Der bestehende Feed `/api/news/rss.xml` muss von der Automation abgekoppelt werden. Bleiben beide
  verknüpft, sammeln beide dieselben Items ein.
- „skip old items" muss aus bleiben.
- Cadence auf weekly, Versand Samstag.

## Bekanntes Restrisiko

- **Verpasste Poll-Fenster.** Ein Item ist nur sieben Tage sichtbar. Fällt der Poll in dieser Zeit
  komplett aus, etwa durch ein längeres Deployment-Problem oder eine deaktivierte Automation, ist
  die Woche still verloren. Es gibt keinen Nachholmechanismus. Bewusste Entscheidung gegen zwei
  bis drei Wochen Historie, die diesen Fall abgedeckt hätte.
- **Löschung am Samstag.** Was zwischen Samstag 00:00 und dem tatsächlichen Versand gelöscht wird,
  ist bereits erfasst und geht raus. Stunden statt einer Woche, aber nicht null.
- **Rotation in Fremdfeeds.** Ein Item muss am Samstag 00:00 noch in seiner Quelle stehen. Bei
  derzeit rund sechs Items pro Woche und 148 Items im Aggregat ist das unkritisch, kann sich mit
  einer sehr schreibfreudigen neuen Quelle aber ändern.
