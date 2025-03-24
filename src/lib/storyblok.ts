import Page from '@/components/pagetypes/Page'
import FallbackComponent from '@/components/FallbackComponent.tsx'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import Article from '@/components/pagetypes/Article.tsx'
import Linklist from '@/components/elements/Linklist.tsx'
import Grid2Column from '@/components/layout/Grid2Column.tsx'
import Picture from '@/components/elements/Picture.tsx'
import Richtext from '@/components/elements/Richtext.tsx'
import Divider from '@/components/elements/Divider.tsx'
import Photos from '@/components/elements/Photos.tsx'
import Articleteaserlist from '@/components/elements/articleteaserlist/Articleteaserlist.tsx'
import { ISbStoriesParams, ISbStoryData, StoryblokClient } from '@storyblok/react'
import { ArticleStoryblok, GlobalsettingsStoryblok } from '@/types/component-types-sb'
import Stuff from '@/components/pagetypes/Stuff.tsx'
import Stuffteaserlist from '@/components/elements/stuffteaser/Stuffteaserlist.tsx'
import Hyperlink from '@/components/elements/Hyperlink.tsx'
import Pagetitle from '@/components/elements/Pagetitle.tsx'
import Grouping from '@/components/elements/Grouping.tsx'
import Tool from '@/components/elements/Tool.tsx'
import Gallery from '@/components/elements/Gallery.tsx'
import Youtube from '@/components/elements/Youtube.tsx'
import Video from '@/components/elements/Video.tsx'
import Soundcloud from '@/components/elements/Soundcloud.tsx'


export const COMPONENTTYPE_ARTICLE = 'article'

export const RESOLVE_RELATIONS_NAV = [
	'globalsettings.topnav',
	'globalsettings.footernav'
]
export const RESOLVE_RELATIONS = [
	'linklist.links',
	'sociallink.icon',
	'articleteaserlist.articles',
	'stuffteaserlist.stuffs',
	'globalsettings.topnav',
	'globalsettings.footernav'
]

export const getStoryblokApi = storyblokInit({
	accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
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
		stuff: Stuff,
		linklist: Linklist,
		picture: Picture,
		richtext: Richtext,
		divider: Divider,
		hyperlink: Hyperlink,
		grouping: Grouping,
		pagetitle: Pagetitle,
		gallery: Gallery,
		tool: Tool,
		photos: Photos,
		video: Video,
		soundcloud: Soundcloud,
		youtube: Youtube,
		articleteaserlist: Articleteaserlist,
		stuffteaserlist: Stuffteaserlist,
		grid_2column: Grid2Column
	}
})

export async function fetchGlobalsettings(isPreview: boolean): Promise<GlobalsettingsStoryblok> {
	const version = isPreview ? 'draft' : 'published'
	const sbParams: ISbStoriesParams = { version: version, resolve_relations: RESOLVE_RELATIONS_NAV }
	const storyblokApi: StoryblokClient = getStoryblokApi()
	const { data } = await storyblokApi.getStory('globalsettings', sbParams, { cache: process.env.NEXT_PUBLIC_STORYBOOK_DISABLECACHING ? 'no-cache' : 'default'  })
	return data.story.content as GlobalsettingsStoryblok
}

export async function fetchStory(slug: string, isPreview: boolean) {
	const version = isPreview ? 'draft' : 'published'
	const sbParams: ISbStoriesParams = { version: version, resolve_relations: RESOLVE_RELATIONS }
	const storyblokApi: StoryblokClient = getStoryblokApi()
	const result = storyblokApi.getStory(slug, sbParams, { cache: process.env.NEXT_PUBLIC_STORYBOOK_DISABLECACHING ? 'no-cache' : 'default' })
	return result
}

export async function fetchStories(limit: number, componenttype: string, folder?: string): Promise<{ data: { stories: ISbStoryData<ArticleStoryblok>[] } }> {
	const storyblokApi = getStoryblokApi()
	await storyblokApi.flushCache()
	const result = storyblokApi.get('cdn/stories', {
		version: process.env.SB_VERSION as 'published' | 'draft' | undefined,
		filter_query: {
			component: {
				in: componenttype
			}
		},
		starts_with: folder,
		sort_by: 'content.date:desc',
		per_page: (limit ?? 100) as number
	})
	return result
}
