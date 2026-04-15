import { ISbStoriesParams, ISbStoryData, StoryblokClient } from '@storyblok/react'
import { ArticleStoryblok, BlogStoryblok, GlobalsettingsStoryblok } from '@/types/component-types-sb'
import { deriveSourceIconUrl, type RssFeedSource } from '@/lib/rss'
import StoryblokClientJs from 'storyblok-js-client'
import { RESOLVE_RELATIONS, RESOLVE_RELATIONS_NAV, STORY_TYPES } from '@/lib/storyblokShared'

let cachedApi: StoryblokClient | null = null

function getStoryblokApi(): StoryblokClient {
  if (!cachedApi) {
    cachedApi = new StoryblokClientJs({
      accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
      region: 'eu'
    }) as unknown as StoryblokClient
  }
  return cachedApi
}

export async function fetchGlobalsettings(isPreview: boolean): Promise<GlobalsettingsStoryblok> {
  const version = isPreview ? 'draft' : 'published'
  const sbParams: ISbStoriesParams = { version, resolve_relations: RESOLVE_RELATIONS_NAV }
  const storyblokApi: StoryblokClient = getStoryblokApi()
  const { data } = await storyblokApi.getStory('globalsettings', sbParams, {
    cache: process.env.NEXT_PUBLIC_STORYBOOK_DISABLECACHING ? 'no-cache' : 'default'
  })
  return data.story.content as GlobalsettingsStoryblok
}

export async function fetchStory(slug: string, isPreview: boolean) {
  const version = isPreview ? 'draft' : 'published'
  const sbParams: ISbStoriesParams = { version, resolve_relations: RESOLVE_RELATIONS }
  const storyblokApi: StoryblokClient = getStoryblokApi()
  return storyblokApi.getStory(slug, sbParams, {
    cache: process.env.NEXT_PUBLIC_STORYBOOK_DISABLECACHING ? 'no-cache' : 'default'
  })
}

export async function fetchStories(
  limit: number,
  componenttype: string,
  opts?: { folder?: string; tag?: string }
): Promise<{ data: { stories: ISbStoryData<BlogStoryblok | ArticleStoryblok>[] } }> {
  const storyblokApi = getStoryblokApi()
  await storyblokApi.flushCache()
  const filterQuery: Record<string, unknown> = {
    component: { in: componenttype }
  }
  if (opts?.tag) {
    filterQuery.tag_list = { any_in_array: opts.tag }
  }
  return storyblokApi.get('cdn/stories', {
    version: process.env.SB_VERSION as 'published' | 'draft' | undefined,
    filter_query: filterQuery,
    starts_with: opts?.folder,
    sort_by: 'content.date:desc',
    per_page: limit ?? 100
  })
}

export async function fetchAllStories(): Promise<{ data: { stories: ISbStoryData[] } }> {
  const storyblokApi = getStoryblokApi()
  await storyblokApi.flushCache()
  return storyblokApi.get('cdn/stories', {
    version: process.env.SB_VERSION as 'published' | 'draft' | undefined,
    filter_query: {
      component: {
        in: STORY_TYPES
      }
    },
    per_page: 100
  })
}

export async function fetchNewsFeedSources(): Promise<RssFeedSource[]> {
  const { data } = await fetchStory('p/news', false)
  const body = data?.story?.content?.body ?? []
  const feedBlock = Array.isArray(body)
    ? body.find((block: { component?: string }) => block.component === 'newsfeedlist')
    : null
  const feeds = feedBlock?.feeds ?? []

  return feeds.map((feed: { name: string; url: string; icon?: { filename?: string } }) => ({
    name: feed.name,
    url: feed.url,
    iconUrl: feed.icon?.filename || deriveSourceIconUrl(feed.url)
  }))
}
