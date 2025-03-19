import { ISbStoriesParams, StoryblokClient } from '@storyblok/react'
import { StoryblokStory } from '@storyblok/react/rsc'
import { EDITOR_SECRET, fetchData, getStoryblokApi, PageProps, RESOLVE_RELATIONS } from '@/lib/storyblok.ts'
import StoryClient from '@/components/StoryClient.tsx'


export default async function StoryPage({ searchParams }: PageProps) {
	const isPreview = (await searchParams).secret === EDITOR_SECRET
	console.log('isPreview', isPreview);
	const { data } = await fetchData('about', isPreview)
	return isPreview ? <StoryClient initialStory={data.story} /> : <StoryblokStory story={data.story} />
}
