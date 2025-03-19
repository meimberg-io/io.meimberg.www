import { ISbStoriesParams, StoryblokClient } from '@storyblok/react'
import { StoryblokStory } from '@storyblok/react/rsc'
import { getStoryblokApi } from '@/lib/storyblok.ts'

export default async function StoryPage({ params, searchParams }) {
	const isPreview = (await searchParams).secret === "WUTZ";

	const {data} = await fetchData("about",isPreview)



	return <StoryblokStory  story={data.story} />


}

export async function fetchData(slug:string, isPreview:boolean) {
	const version = isPreview ? "draft" : "published";

	const sbParams: ISbStoriesParams = { version: version, resolve_relations: ['linklist.links,sociallink.icon'] };

	const storyblokApi: StoryblokClient = getStoryblokApi();
	return storyblokApi.get(`cdn/stories/${slug}`, sbParams);
}
