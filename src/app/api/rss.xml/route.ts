import { NextResponse } from 'next/server'
import { COMPONENTTYPE_ARTICLE, COMPONENTTYPE_BLOG, fetchStories } from '@/lib/storyblok'
import type { ISbStoryData } from '@storyblok/react'
import type { ArticleStoryblok, BlogStoryblok } from '@/types/component-types-sb'

const BASE_URL = 'https://www.meimberg.io/'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function itemXml(story: ISbStoryData<ArticleStoryblok | BlogStoryblok>): string {
  const url = `${BASE_URL}${story.full_slug}`
  const title =
    story.content?.pagetitle ||
    (story.content as any)?.teasertitle ||
    story.name ||
    'Untitled'
  const description =
    (story.content as any)?.abstract ||
    (story.content as any)?.pageintro ||
    ''
  const pubDate =
    (story.content as any)?.date
      ? new Date((story.content as any).date).toUTCString()
      : story.published_at
        ? new Date(story.published_at).toUTCString()
        : new Date().toUTCString()

  return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description ?? ''}]]></description>
    </item>`
}

function feedXml(items: ISbStoryData<ArticleStoryblok | BlogStoryblok>[]) {
  const channelItems = items.map(itemXml).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>meimberg.io</title>
    <link>${BASE_URL}</link>
    <description>Olis Blick auf eine digitalisierte Welt</description>
    <language>de</language>
    ${channelItems}
  </channel>
</rss>`
}

export async function GET() {
  const componentTypes = `${COMPONENTTYPE_ARTICLE},${COMPONENTTYPE_BLOG}`
  const storiesResponse = await fetchStories(100, componentTypes)
  const xml = feedXml(storiesResponse.data.stories)

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=300'
    }
  })
}


