import { EDITOR_SECRET, fetchStory } from '@/lib/storyblok.ts'
import StoryClient from '@/components/global/StoryClient.tsx'
import { StoryblokStory } from '@storyblok/react/rsc'


export interface PageProps {
	params: {
		slug: string[] | undefined,
	};
	searchParams: {
		secret: string | undefined;
	}
}

export async function renderPage( slug?:string[],  secret?: string | undefined ) {
	const full_slug = slug?.join('/') ?? 'home'
	const isPreview = secret === EDITOR_SECRET
	const { data } = await fetchStory(full_slug, isPreview)
	return isPreview ? <StoryClient initialStory={data.story} /> : <StoryblokStory story={data.story} />
}
