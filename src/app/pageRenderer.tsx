import { EDITOR_SECRET, fetchData } from '@/lib/storyblok.ts'
import StoryClient from '@/components/StoryClient.tsx'
import { StoryblokStory } from '@storyblok/react/rsc'


export interface PageProps {
	params: { [key: string]: string | string[] | undefined };
	searchParams: { [key: string]: string | string[] | undefined };
}


export async function renderPage({ params, searchParams }: PageProps) {
	const slug = params.slug?.toString() ?? 'home'
	const isPreview = searchParams.secret === EDITOR_SECRET
	const { data } = await fetchData(slug, isPreview)
	return isPreview ? <StoryClient initialStory={data.story} /> : <StoryblokStory story={data.story} />
}
