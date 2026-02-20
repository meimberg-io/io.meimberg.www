#!/usr/bin/env node

const SPACE_ID = '330326'
const MAPI_TOKEN = process.env.SPACE_TOKEN
const BLOG_PARENT_ID = 106113126469536
const BASE = `https://mapi.storyblok.com/v1/spaces/${SPACE_ID}`

if (!MAPI_TOKEN) {
  console.error('SPACE_TOKEN env var is required')
  process.exit(1)
}

const authHeaders = { Authorization: MAPI_TOKEN }
const jsonHeaders = { ...authHeaders, 'Content-Type': 'application/json' }

async function api(path, { method = 'GET', body } = {}) {
  const options = { method, headers: body ? jsonHeaders : authHeaders }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${method} ${path} -> ${res.status}: ${text}`)
  }
  if (res.status === 204) return {}
  return res.json()
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchAllArticles() {
  const data = await api('/stories?filter_query[component][in]=article&per_page=100')
  return data.stories
}

async function migrateArticle(article) {
  console.log(`\nMigrating: "${article.name}" (${article.full_slug})`)

  const full = await api(`/stories/${article.id}`)
  const story = full.story
  const content = { ...story.content, component: 'blog' }

  const created = await api('/stories', {
    method: 'POST',
    body: {
      story: {
        name: story.name,
        slug: story.slug,
        parent_id: BLOG_PARENT_ID,
        content
      }
    }
  })

  const newId = created.story.id
  console.log(`  -> Created blog: ${created.story.full_slug} (ID: ${newId})`)
  await sleep(300)

  await api(`/stories/${newId}/publish`)
  console.log(`  -> Published`)
  await sleep(300)

  await api(`/stories/${article.id}`, { method: 'DELETE' })
  console.log(`  -> Deleted original article`)
  await sleep(300)

  return created.story
}

async function main() {
  console.log('Fetching articles...')
  const articles = await fetchAllArticles()
  console.log(`Found ${articles.length} articles to migrate`)

  const results = []
  for (const article of articles) {
    const result = await migrateArticle(article)
    results.push(result)
  }

  console.log('\n--- Migration complete ---')
  for (const r of results) {
    console.log(`  ${r.full_slug}`)
  }
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
