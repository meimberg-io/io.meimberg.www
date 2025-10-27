'use client';

import { useEffect, useState } from 'react'
import { ArticleStoryblok, BlogStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { ArticleteaserlistProps } from '@/components/elements/articleteaserlist/Articleteaserlist.tsx'
import { COMPONENTTYPE_ARTICLE, COMPONENTTYPE_BLOG, fetchStories } from '@/lib/storyblok.ts'
import { ArticleCardList } from '@/components/elements/articleteaserlist/ArticleCardList.tsx'

type ContentItem = ISbStoryData<ArticleStoryblok> | ISbStoryData<BlogStoryblok>

export default function ArticleteaserlistClient({ props }: { props: ArticleteaserlistProps }) {
	const [articles, setArticles] = useState<ContentItem[] | null>(null);

	useEffect(() => {
		if (props.type === 'automatic') {
			const componentTypes = COMPONENTTYPE_ARTICLE + ',' + COMPONENTTYPE_BLOG
			fetchStories(props.limit, componentTypes, props.folder).then((response) => {
				setArticles(response.data.stories as ContentItem[]);
			});
		} else {
			setArticles(props.articles);
		}
	}, [props]);

	if (!articles) return <p>Loading...</p>;

	return <ArticleCardList articles={articles} layout={props.layout} />;
}
