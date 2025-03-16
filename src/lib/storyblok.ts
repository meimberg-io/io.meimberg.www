import Page from '@/components/storyblok/Page'
import Teaser from '@/components/storyblok/Teaser'
import Grid from '@/components/storyblok/Grid'
import FallbackComponent from '@/components/storyblok/FallbackComponent'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import Article from '@/components/storyblok/Article.tsx'
import Linklist from '@/components/storyblok/Linklist.tsx'
import Grid2Column from '@/components/storyblok/Grid2Column.tsx'
import Picture from '@/components/storyblok/Picture.tsx'
import Richtext from '@/components/storyblok/Richtext.tsx'
import Divider from '@/components/storyblok/Divider.tsx'

export const getStoryblokApi = storyblokInit({
	accessToken: 'cDI6mUwrC5dKWFsPWD6s8Att',
	use: [apiPlugin],
	components: {
		teaser: Teaser,
		page: Page,
		grid: Grid,
		article: Article,
		linklist: Linklist,
		picture: Picture,
		richtext: Richtext,
		divider: Divider,
		grid_2column: Grid2Column,
	},
	apiOptions: {
		region: 'eu',
		cache: {
			type: 'none',
		},
	},

	enableFallbackComponent: true,
	customFallbackComponent: FallbackComponent,
})


export async function fetchData(slug: string) {
	const storyblokApi = getStoryblokApi()
	await storyblokApi.flushCache()
	return storyblokApi.get(
		'cdn/stories/' + slug,
		{
			version: process.env.SB_VERSION as 'published' | 'draft' | undefined,
			resolve_relations: "linklist.links,sociallink.icon",
		},
		{ cache: 'no-store' }
	)
}

