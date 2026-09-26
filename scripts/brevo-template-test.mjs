/**
 * Schickt das Newsletter-Template sofort als Testmail über Brevo, gefüllt mit dem echten Wochen-Feed.
 *
 * Aufruf: node --env-file=.env scripts/brevo-template-test.mjs [--template <id> [--local]] [feed-url]
 *
 * Ohne --template wird nur docs/newsletter/brevo-template.html geschickt. Mit --template das in Brevo
 * gespeicherte Template samt Kopf und Footer, so wie es im Editor steht; die ID zeigt Brevo in der
 * Template-Liste. --local ersetzt darin die Schleifen des HTML-Blocks durch den Stand der lokalen Datei,
 * um eine Änderung im Gesamtbild zu sehen, bevor sie in Brevo eingefügt ist.
 *
 * Braucht in .env: BREVO_API_KEY, BREVO_TEST_TO (Empfänger), BREVO_TEST_FROM (in Brevo verifizierter Absender).
 *
 * Die RSS-Integration liest den Feed nur zur Prüfzeit und verlangt eine Stunde Vorlauf. Dieses Skript
 * umgeht das über die Transaktions-API: Brevo wertet dieselbe Template-Sprache aus, die Items kommen
 * nur als params.items statt als items an. Für die Abnahme bleibt ein echter RSS-Lauf nötig.
 */
import { readFile } from 'node:fs/promises'

const args = process.argv.slice(2)
const templateFlag = args.indexOf('--template')
const templateId = templateFlag >= 0 ? args.splice(templateFlag, 2)[1] : null
const localFlag = args.indexOf('--local')
const useLocalBlock = localFlag >= 0 && args.splice(localFlag, 1).length > 0
const feedUrl = args[0] ?? 'https://www.meimberg.io/api/news/rss-weekly.xml'
const { BREVO_API_KEY, BREVO_TEST_TO, BREVO_TEST_FROM } = process.env

if (!BREVO_API_KEY || !BREVO_TEST_TO || !BREVO_TEST_FROM) {
  console.error('BREVO_API_KEY, BREVO_TEST_TO und BREVO_TEST_FROM in .env setzen.')
  process.exit(1)
}

const decode = (value) =>
  value
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')

const tag = (xml, name) => {
  const match = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))
  return match ? decode(match[1].trim()) : ''
}

// Brevo bildet RSS-Tags als Großbuchstaben-Keys ab, <enclosure> als dessen URL.
function toBrevoItem(itemXml) {
  return {
    TITLE: tag(itemXml, 'title'),
    LINK: tag(itemXml, 'link'),
    GUID: tag(itemXml, 'guid'),
    PUBDATE: tag(itemXml, 'pubDate'),
    DESCRIPTION: tag(itemXml, 'description'),
    AUTHOR: tag(itemXml, 'author'),
    CATEGORY: tag(itemXml, 'category'),
    ENCLOSURE: decode(itemXml.match(/<enclosure url="([^"]*)"/)?.[1] ?? '')
  }
}

// Bereich von der ersten Item-Schleife bis zum letzten endfor, in beiden Templates gleich abgegrenzt.
function loopRange(html) {
  const start = html.search(/\{%\s*for item in items\s*%\}/)
  const end = html.lastIndexOf('{% endfor %}') + '{% endfor %}'.length
  if (start < 0 || end < start) throw new Error('Keine Item-Schleife im Template gefunden')
  return [start, end]
}

function spliceLoops(saved, local) {
  const [savedStart, savedEnd] = loopRange(saved)
  const [localStart, localEnd] = loopRange(local)
  return saved.slice(0, savedStart) + local.slice(localStart, localEnd) + saved.slice(savedEnd)
}

const feed = await (await fetch(feedUrl)).text()
const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => toBrevoItem(match[1]))

const headers = { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' }

let template = await readFile(new URL('../docs/newsletter/brevo-template.html', import.meta.url), 'utf8')
let subject = 'Template-Test'
if (templateId) {
  const res = await fetch(`https://api.brevo.com/v3/smtp/templates/${templateId}`, { headers })
  if (!res.ok) {
    console.error(`Template ${templateId} nicht ladbar: HTTP ${res.status} ${await res.text()}`)
    process.exit(1)
  }
  const saved = await res.json()
  subject = saved.subject || saved.name
  template = useLocalBlock ? spliceLoops(saved.htmlContent, template) : saved.htmlContent
}
const htmlContent = template.replace(/\{%\s*for item in items\s*%\}/g, '{% for item in params.items %}')

const res = await fetch('https://api.brevo.com/v3/smtp/email', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    sender: { email: BREVO_TEST_FROM, name: 'Newsletter-Test' },
    to: [{ email: BREVO_TEST_TO }],
    subject: `${subject} · Test ${new Date().toLocaleString('de-DE')} (${items.length} Items)`,
    htmlContent,
    params: { items }
  })
})

console.log(`${items.length} Items aus ${feedUrl}: ${items.map((i) => i.AUTHOR).join(', ')}`)
console.log(`Brevo: HTTP ${res.status} ${await res.text()}`)
process.exit(res.ok ? 0 : 1)
