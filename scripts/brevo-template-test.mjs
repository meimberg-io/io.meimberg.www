/**
 * Schickt das Newsletter-Template sofort als Testmail über Brevo, gefüllt mit dem echten Wochen-Feed.
 *
 * Aufruf: node --env-file=.env scripts/brevo-template-test.mjs [feed-url]
 *
 * Braucht in .env: BREVO_API_KEY, BREVO_TEST_TO (Empfänger), BREVO_TEST_FROM (in Brevo verifizierter Absender).
 *
 * Die RSS-Integration liest den Feed nur zur Prüfzeit und verlangt eine Stunde Vorlauf. Dieses Skript
 * umgeht das über die Transaktions-API: Brevo wertet dieselbe Template-Sprache aus, die Items kommen
 * nur als params.items statt als items an. Für die Abnahme bleibt ein echter RSS-Lauf nötig.
 */
import { readFile } from 'node:fs/promises'

const feedUrl = process.argv[2] ?? 'https://www.meimberg.io/api/news/rss-weekly.xml'
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

const feed = await (await fetch(feedUrl)).text()
const items = [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => toBrevoItem(match[1]))

const template = await readFile(new URL('../docs/newsletter/brevo-template.html', import.meta.url), 'utf8')
const htmlContent = template.replace(/\{%\s*for item in items\s*%\}/g, '{% for item in params.items %}')

const res = await fetch('https://api.brevo.com/v3/smtp/email', {
  method: 'POST',
  headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({
    sender: { email: BREVO_TEST_FROM, name: 'Newsletter-Test' },
    to: [{ email: BREVO_TEST_TO }],
    subject: `Template-Test ${new Date().toLocaleString('de-DE')} (${items.length} Items)`,
    htmlContent,
    params: { items }
  })
})

console.log(`${items.length} Items aus ${feedUrl}: ${items.map((i) => i.AUTHOR).join(', ')}`)
console.log(`Brevo: HTTP ${res.status} ${await res.text()}`)
process.exit(res.ok ? 0 : 1)
