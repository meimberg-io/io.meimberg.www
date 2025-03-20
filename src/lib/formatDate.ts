export function formatDate(dateString: string) {
  return new Date(`${dateString}`).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
