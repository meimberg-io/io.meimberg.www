import { NextResponse } from 'next/server'
import {
  COMPONENTTYPE_ARTICLE,
  STORYBLOK_FOLDER_ARTICLES
} from '@/lib/storyblokShared'
import { fetchStories } from '@/lib/storyblokApi'
import type { ISbStoryData } from '@storyblok/react'
import type { ArticleStoryblok, BlogStoryblok } from '@/types/component-types-sb'

const BASE_URL = 'https://www.meimberg.io/'

type TeaserStory = ArticleStoryblok | BlogStoryblok

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getImageUrl(story: ISbStoryData<TeaserStory>): string | null {
  const teaserimage = story.content?.teaserimage
  if (teaserimage?.filename) return teaserimage.filename

  const headerpicture = story.content?.headerpicture
  if (headerpicture?.filename) return headerpicture.filename

  return null
}

function itemXml(story: ISbStoryData<TeaserStory>): string {
  const url = `${BASE_URL}${story.full_slug}`
  const title =
    story.content?.pagetitle ||
    (story.content as { teasertitle?: string })?.teasertitle ||
    story.name ||
    'Untitled'
  const description =
    (story.content as { abstract?: string; pageintro?: string })?.abstract ||
    (story.content as { pageintro?: string })?.pageintro ||
    ''
  const pubDate =
    (story.content as { date?: string })?.date
      ? new Date((story.content as { date: string }).date).toUTCString()
      : story.published_at
        ? new Date(story.published_at).toUTCString()
        : new Date().toUTCString()

  const imageUrl = getImageUrl(story)
  const imageXml = imageUrl
    ? `\n      <enclosure url="${escapeXml(imageUrl)}" type="image/png" />\n      <media:thumbnail url="${escapeXml(imageUrl)}" />`
    : ''

  return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description ?? ''}]]></description>
      <category>Artikel</category>${imageXml}
    </item>`
}

function feedXml(items: ISbStoryData<TeaserStory>[]) {
  const channelItems = items.map(itemXml).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Artikel | meimberg.io</title>
    <link>${BASE_URL}artikel</link>
    <description>Artikel von meimberg.io</description>
    <language>de</language>
    ${channelItems}
  </channel>
</rss>`
}

export async function GET() {
  const storiesResponse = await fetchStories(100, COMPONENTTYPE_ARTICLE, {
    folder: STORYBLOK_FOLDER_ARTICLES
  })
  const xml = feedXml(storiesResponse.data.stories as ISbStoryData<TeaserStory>[])

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate=300'
    }
  })
}
