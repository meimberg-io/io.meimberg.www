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

	// Defense-in-depth (MICM-7): Content-Manager-only LinkedIn posts must never
	// render on the public site, even if one were accidentally published. They
	// live in the `linkedin/` folder and use the `linkedin_post` component.
	// Draft-only persistence already keeps them out via 404, this is a second guard.
	const component = data.story?.content?.component
	const storyFullSlug = data.story?.full_slug ?? full_slug
	if (component === 'linkedin_post' || storyFullSlug === 'linkedin' || storyFullSlug?.startsWith('linkedin/')) {
		notFound()
	}

	return isPreview ? <StoryClient initialStory={data.story} /> : <StoryblokStory story={data.story} />
}
