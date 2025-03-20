import { getStoryblokApi } from '@/lib/storyblok.ts';
import { ISbStoryData } from '@storyblok/react';
import { ArticleStoryblok } from '@/types/component-types-sb';

export async function fetchArticles(limit: number): Promise<{ data: { stories: ISbStoryData<ArticleStoryblok>[] } }> {
	const storyblokApi = getStoryblokApi();
	await storyblokApi.flushCache();
	return storyblokApi.get('cdn/stories', {
		version: process.env.SB_VERSION as 'published' | 'draft' | undefined,
		starts_with: 'articles/',
		sort_by: 'content.date:desc',
		per_page: limit,
	});
}
