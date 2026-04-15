import { notFound } from 'next/navigation'
import { fetchStory } from '@/lib/storyblokApi'
import StoryClient from '@/components/global/StoryClient.tsx'
import { StoryblokStory } from '@storyblok/react/rsc'
import { getStoryblokApi } from '@/lib/storyblok'


export async function renderPage( slug?:string[],  secret?: string | undefined ) {
	const full_slug = slug?.join('/') ?? 'home'
	const isPreview = secret === process.env.NEXT_PUBLIC_STORYBLOK_EDITOR_SECRET
	getStoryblokApi()
	let data: Awaited<ReturnType<typeof fetchStory>>['data']
	try {
		const result = await fetchStory(full_slug, isPreview)
		data = result.data
	} catch (err: unknown) {
		const status = (err as { status?: number; response?: { status?: number } })?.status
				?? (err as { status?: number; response?: { status?: number } })?.response?.status
		if (status === 404 || status === 422) {
			notFound()
		}
		throw err
	}
	return isPreview ? <StoryClient initialStory={data.story} /> : <StoryblokStory story={data.story} />
}
