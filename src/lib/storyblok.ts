import Page from '@/components/storyblok/Page'
import FallbackComponent from '@/components/storyblok/FallbackComponent'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import Article from '@/components/storyblok/Article.tsx'
import Linklist from '@/components/storyblok/Linklist.tsx'
import Grid2Column from '@/components/storyblok/Grid2Column.tsx'
import Picture from '@/components/storyblok/Picture.tsx'
import Richtext from '@/components/storyblok/Richtext.tsx'
import Divider from '@/components/storyblok/Divider.tsx'
import Photos from '@/components/storyblok/Photos.tsx'
import Articleteaserlist from '@/components/storyblok/articleteaserlist/Articleteaserlist.tsx'
import { ISbStoriesParams, StoryblokClient } from '@storyblok/react'


export const EDITOR_SECRET = "WUTZ"

export const RESOLVE_RELATIONS = "linklist.links,sociallink.icon,articleteaserlist.articles"

export const getStoryblokApi = storyblokInit({
	accessToken: 'cDI6mUwrC5dKWFsPWD6s8Att',
	use: [apiPlugin],
	bridge: true,
	enableFallbackComponent: true,
	customFallbackComponent: FallbackComponent,
	apiOptions: {
		region: 'eu',
		cache: {
			type: 'none'
		},
	},
	components: {
		page: Page,
		article: Article,
		linklist: Linklist,
		picture: Picture,
		richtext: Richtext,
		divider: Divider,
		photos: Photos,
		articleteaserlist: Articleteaserlist,
		grid_2column: Grid2Column
	},
})

export async function fetchData(slug: string, isPreview: boolean) {
	const version = isPreview ? 'draft' : 'published'
	const sbParams: ISbStoriesParams = { version: version, resolve_relations: RESOLVE_RELATIONS }
	const storyblokApi: StoryblokClient = getStoryblokApi()
	return storyblokApi.get(`cdn/stories/${slug}`, sbParams)
}
