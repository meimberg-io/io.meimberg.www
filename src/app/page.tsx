
import { ISbStoriesParams, StoryblokClient, StoryblokComponent, useStoryblok } from '@storyblok/react'
import { apiPlugin, storyblokInit, StoryblokStory } from '@storyblok/react/rsc'
import FallbackComponent from '@/components/storyblok/FallbackComponent.tsx'
import Page from '@/components/storyblok/Page.tsx'
import Article from '@/components/storyblok/Article.tsx'
import Linklist from '@/components/storyblok/Linklist.tsx'
import Picture from '@/components/storyblok/Picture.tsx'
import Richtext from '@/components/storyblok/Richtext.tsx'
import Divider from '@/components/storyblok/Divider.tsx'
import Photos from '@/components/storyblok/Photos.tsx'
import Articleteaserlist from '@/components/storyblok/Articleteaserlist.tsx'
import Grid2Column from '@/components/storyblok/Grid2Column.tsx'
import { fetchStory, getStoryblokApi } from '@/lib/storyblok.ts'

export default async function StoryPage({ params, searchParams }) {
	const isPreview = searchParams._storyblok === "true";

	console.log('DEBUG 1 params', params)
	console.log('DEBUG 2 searchParams', searchParams)
	const {data} = await fetchData("about",isPreview)
	// const story = useStoryblok(
	// 	'about',
	// 	{ version: 'published', resolve_relations: ['linklist.links,sociallink.icon'] },
	// 	{
	// 		resolveRelations: ['linklist.links,sociallink.icon'],
	// 		resolveLinks: 'url',
	// 		preventClicks: true
	// 	}
	// )


	return <StoryblokStory  story={data.story} />


}

export async function fetchData(slug:string, isPreview:boolean) {
	const version = isPreview ? "draft" : "published";

	const sbParams: ISbStoriesParams = { version: version, resolve_relations: ['linklist.links,sociallink.icon'] };

	const storyblokApi: StoryblokClient = getStoryblokApi();
	return storyblokApi.get(`cdn/stories/${slug}`, sbParams);
}
