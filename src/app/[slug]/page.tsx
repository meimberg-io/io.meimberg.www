import { fetchData } from '@/lib/storyblok'
import { StoryblokStory } from '@storyblok/react/rsc'

export const revalidate = 0
export const fetchCache = 'force-no-store'


export default async function StoryPage({ params }: {
	params: Promise<{ slug: string }>
}) {
	const slug = (await params).slug
	const { data } = await fetchData('pages/' + slug)
	return (

		<StoryblokStory story={data.story} />

	)
}
