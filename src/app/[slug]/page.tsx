import { ISbStoriesParams, StoryblokClient } from '@storyblok/react'
import { StoryblokStory } from '@storyblok/react/rsc'
import { EDITOR_SECRET, getStoryblokApi, PageProps, RESOLVE_RELATIONS } from '@/lib/storyblok.ts'
import StoryClient from '@/components/StoryClient.tsx'


export default async function StoryPage({ searchParams }: PageProps) {
	const isPreview = (await searchParams).secret === EDITOR_SECRET
	const { data } = await fetchData('about', isPreview)
	return isPreview ? <StoryClient initialStory={data.story} /> : <StoryblokStory story={data.story} />
}

export async function fetchData(slug: string, isPreview: boolean) {
	const version = isPreview ? 'draft' : 'published'
	const sbParams: ISbStoriesParams = { version: version, resolve_relations: RESOLVE_RELATIONS }
	const storyblokApi: StoryblokClient = getStoryblokApi()
	return storyblokApi.get(`cdn/stories/${slug}`, sbParams)
}
