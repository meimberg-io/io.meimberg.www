/**
 * Wochenfenster für den Newsletter-Feed.
 *
 * Der Newsletter geht freitags tagsüber raus und soll genau die abgeschlossene
 * Woche Freitag bis Donnerstag enthalten. Maßgeblich ist der letzte vergangene
 * Freitag 00:00 Berliner Zeit: er ist die (exklusive) Obergrenze des Fensters.
 */

const TIME_ZONE = 'Europe/Berlin'

export interface WeeklyWindow {
  /** Freitag 00:00 Berlin, sieben Kalendertage vor end. Inklusiv. */
  start: Date
  /** Letzter vergangener Freitag 00:00 Berlin. Exklusiv. */
  end: Date
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
 * `day` darf ausserhalb des Monats liegen (0 oder negativ); Date.UTC rollt dann
 * korrekt über Monats- und Jahresgrenzen. Deshalb wird in Kalendertagen gerechnet
 * und nicht in Millisekunden: eine Woche ist in den Umstellungswochen nicht
 * 7×24 Stunden lang.
 *
 * Der Offset wird am naiven Instant bestimmt. Das genügt, weil die Umstellung in
 * Europe/Berlin sonntags um 02:00/03:00 liegt: eine Freitags-Mitternacht fällt nie
 * in eine Lücke oder Doppelstunde, und zwischen naivem und echtem Instant liegt
 * nie ein Wechsel.
 */
function berlinMidnightUtc(year: number, month: number, day: number): Date {
  const naive = Date.UTC(year, month - 1, day, 0, 0, 0, 0)
  const offset = berlinOffsetMinutes(new Date(naive))
  return new Date(naive - offset * 60 * 1000)
}

export function getWeeklyWindow(now: Date): WeeklyWindow {
  const { year, month, day, weekday } = berlinDate(now)

  // Abstand zum letzten Freitag: am Freitag selbst 0, sonst 1 bis 6. Damit gilt
  // ab Freitag 00:00 bereits die eben abgeschlossene Woche.
  const daysSinceFriday = (weekday + 2) % 7

  return {
    start: berlinMidnightUtc(year, month, day - daysSinceFriday - 7),
    end: berlinMidnightUtc(year, month, day - daysSinceFriday)
  }
}

export function isInWindow(date: Date, weekly: WeeklyWindow): boolean {
  const time = date.getTime()
  return time >= weekly.start.getTime() && time < weekly.end.getTime()
}
