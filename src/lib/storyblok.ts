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
import Articleteaserlist from '@/components/storyblok/Articleteaserlist.tsx'
import { ISbResult, ISbStoriesParams, StoryblokClient } from '@storyblok/react'


export const EDITOR_SECRET = 'WUTZ'

export const RESOLVE_RELATIONS = 'linklist.links,sociallink.icon'

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
//
// // Zentrale Fetch-Funktion
// export async function fetchStory(slug: string, isPage: boolean = false): Promise<ISbStoryData<any> | null> {
// 	const storyblokApi = getStoryblokApi();
// 	await storyblokApi.flushCache(); // 🧹 Sicherstellen, dass immer frischer Content geladen wird
//
// 	const prefix = isPage ? "cdn/stories/pages/" : "cdn/stories/";
//
// 	// 🔍 Prüfen, ob wir im Storyblok Editor sind
// 	let isEditor = false;
// 	if (typeof window !== "undefined") {
// 		isEditor = window.self !== window.top || !!window.StoryblokBridge;
// 	}
//

//
// 	// /**/console.log('isEditor', isEditor)
// 	//console.log('window', window)
// 	try {
//
// 		const { data } = await storyblokApi.get(prefix + slug, {
// 			version: isEditor ? "draft" : "published", // ✅ Nur im Editor den Draft-Content holen
// 			resolve_relations: "linklist.links,sociallink.icon",
// 		});
//
// 		if (!data || !data.story) {
// 			console.warn(`⚠️ Storyblok API returned no data for slug: ${slug}`);
// 			return null;
// 		}
//
// 		return data.story;
// 	} catch (error) {
// 		console.error("❌ Error fetching story from Storyblok:", error);
// 		return null;
// 	}
// }

// export async function fetchData(slug: string) {
// 	const storyblokApi = getStoryblokApi()
// 	await storyblokApi.flushCache()
// 	return storyblokApi.get(
// 		'cdn/stories/' + slug,
// 		{
// 			version: process.env.SB_VERSION as 'published' | 'draft' | undefined,
// 			resolve_relations: resolve_relations
// 		},
// 		{ cache: 'no-store' }
// 	)
// }

export async function fetchArticles(limit: number): Promise<ISbResult> {
	const storyblokApi = getStoryblokApi()
	await	 storyblokApi.flushCache()
	return storyblokApi.get(
		'cdn/stories',
		{
			version: process.env.SB_VERSION as 'published' | 'draft' | undefined,
			starts_with: 'articles/',
			sort_by: 'content.date:desc',
			per_page: limit,

		},
		{ cache: 'no-store' }
	)

}
