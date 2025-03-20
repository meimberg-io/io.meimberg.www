import { EDITOR_SECRET, fetchData } from '@/lib/storyblok.ts'
import StoryClient from '@/components/page/StoryClient.tsx'
import { StoryblokStory } from '@storyblok/react/rsc'


export interface PageProps {
	params: {
		slug: string | undefined,
		folder: string | undefined,
	};
	searchParams: {
		secret: string | undefined;
	};
}


export async function renderPage({ params, searchParams }: PageProps) {
	const slug = (await params).slug?.toString() ?? 'home'
	const folder = `${(await params).folder?.toString() ?? ''}/`.replace(/\/+$/, '/');
	const isPreview = (await searchParams).secret === EDITOR_SECRET
	const { data } = await fetchData(folder + slug, isPreview)
	return isPreview ? <StoryClient initialStory={data.story} /> : <StoryblokStory story={data.story} />
}
