/**
 * Entscheidet, ob eine Anfrage den Entwurfs- oder den veröffentlichten Stand
 * bekommt. Einzige Quelle dieser Entscheidung — vorher stand der Vergleich an
 * vier Stellen kopiert.
 *
 * Zwei Wege führen in die Preview:
 *
 * 1. `?secret=…` an der URL. Den benutzt der Storyblok Visual Editor (siehe
 *    src/pages/api/preview.tsx) und er muss deshalb bleiben. Nachteil beim
 *    Selbst-Testen: kein Link auf der Seite trägt ihn weiter.
 * 2. `STORYBLOK_PREVIEW=1` in der lokalen `.env`. Gilt für die ganze Session
 *    und alle Klicks, ohne dass irgendein Link umgebaut werden muss.
 *
 * Weg 2 ist ausdrücklich für die lokale Entwicklung gedacht. Die Variable
 * trägt kein `NEXT_PUBLIC_`-Präfix, wird also nicht ins Browser-Bundle
 * kompiliert und ist rein serverseitig.
 */

const PREVIEW_FLAG = process.env.STORYBLOK_PREVIEW
const previewAlwaysOn = PREVIEW_FLAG === '1' || PREVIEW_FLAG === 'true'

if (previewAlwaysOn) {
  // Absichtlich laut: mit gesetzter Variable liefert die Instanz
  // ausschließlich Entwürfe. Auf einem öffentlichen Server wäre das ein
  // Datenleck, das sonst niemandem auffällt.
  console.warn(
    '[preview] STORYBLOK_PREVIEW ist aktiv — es werden ausschließlich Entwürfe ausgeliefert. Nur für die lokale Entwicklung gedacht.'
  )
}

function secretMatches(secret?: string): boolean {
  return Boolean(secret) && secret === process.env.NEXT_PUBLIC_STORYBLOK_EDITOR_SECRET
}

/**
 * Welcher Inhaltsstand wird geholt — Entwurf oder veröffentlicht?
 *
 * @param secret Wert des `secret`-Query-Parameters, falls vorhanden.
 */
export function isPreviewRequest(secret?: string): boolean {
  return previewAlwaysOn || secretMatches(secret)
}

/**
 * Läuft die Seite im Storyblok Visual Editor, braucht also die Live-Editing-
 * Bridge und damit client-seitiges Rendern über StoryClient?
 *
 * Bewusst NICHT am Env-Schalter hängend, obwohl beides „Preview" heißt. Der
 * Client-Renderpfad ist ein anderer als der produktive: async Server-
 * Komponenten (etwa NewsFeedList, das seine Feeds selbst holt) funktionieren
 * dort nicht. Wer lokal gegen Entwürfe testet, will den *echten* Renderpfad
 * sehen, nur mit anderem Inhaltsstand — nicht den Editor-Pfad.
 */
export function isEditorRequest(secret?: string): boolean {
  return secretMatches(secret)
}
