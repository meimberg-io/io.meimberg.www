import Page from '@/components/storyblok/Page'
import FallbackComponent from '@/components/storyblok/FallbackComponent'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import Article from '@/components/storyblok/Article.tsx'
import Linklist from '@/components/storyblok/elements/Linklist.tsx'
import Grid2Column from '@/components/layout/Grid2Column.tsx'
import Picture from '@/components/storyblok/elements/Picture.tsx'
import Richtext from '@/components/storyblok/elements/Richtext.tsx'
import Divider from '@/components/storyblok/elements/Divider.tsx'
import Photos from '@/components/storyblok/elements/Photos.tsx'
import Articleteaserlist from '@/components/storyblok/articleteaserlist/Articleteaserlist.tsx'
import { ISbStoriesParams, ISbStoryData, StoryblokClient } from '@storyblok/react'
import { ArticleStoryblok, GlobalsettingsStoryblok } from '@/types/component-types-sb'


export const EDITOR_SECRET = 'WUTZ'
export const RESOLVE_RELATIONS_NAV = [
	'globalsettings.topnav',
	'globalsettings.footernav'
]
export const RESOLVE_RELATIONS = [
	'linklist.links',
	'sociallink.icon',
	'articleteaserlist.articles',
	'globalsettings.topnav',
	'globalsettings.footernav'
]


export const RESOLVE_RELATIONS_CONFIG = 'globalsettings.topnav,globalsettings.footernav'

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
		}
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
	}
})

export async function fetchGlobalsettings(isPreview: boolean): Promise<GlobalsettingsStoryblok> {
	const version = isPreview ? 'draft' : 'published'
	const sbParams: ISbStoriesParams = { version: version, resolve_relations: RESOLVE_RELATIONS_NAV }
	const storyblokApi: StoryblokClient = getStoryblokApi()
	// return storyblokApi.getStory('globalsettings', sbParams, { cache: 'no-cache' }) as GlobalsettingsStoryblok
	const { data } = await storyblokApi.getStory('globalsettings', sbParams, { cache: 'no-cache' })
	return data.story.content as GlobalsettingsStoryblok
}

export async function fetchStory(slug: string, isPreview: boolean) {
	const version = isPreview ? 'draft' : 'published'
	const sbParams: ISbStoriesParams = { version: version, resolve_relations: RESOLVE_RELATIONS }
	const storyblokApi: StoryblokClient = getStoryblokApi()
	const result =  storyblokApi.getStory(slug, sbParams, { cache: 'no-cache' })
	return result;
}


export async function fetchArticles(limit: number): Promise<{ data: { stories: ISbStoryData<ArticleStoryblok>[] } }> {
	const storyblokApi = getStoryblokApi()
	await storyblokApi.flushCache()
	const result =  storyblokApi.get('cdn/stories', {
		version: process.env.SB_VERSION as 'published' | 'draft' | undefined,
		starts_with: 'a/',
		sort_by: 'content.date:desc',
		per_page: (limit ?? 100) as number
	});
	return result;
}
