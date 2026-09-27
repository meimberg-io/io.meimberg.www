/**
 * Storyblok-Datumsfelder als Instant lesen. Storyblok speichert `YYYY-MM-DD` oder
 * `YYYY-MM-DD HH:mm` ohne Zonenangabe, gemeint ist UTC. `new Date()` läse die Form mit
 * Uhrzeit in der lokalen Zone und verschöbe sie je nach Server oder Browser.
 */
export function parseStoryblokDate(value: string): Date {
  const trimmed = value.trim()
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?$/)
  if (!match) return new Date(trimmed)
  return new Date(`${match[1]}T${match[2] ?? '00:00'}${match[2]?.length === 5 ? ':00' : ''}Z`)
}

export function formatDate(dateString: string) {
  return parseStoryblokDate(dateString).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  })
}
