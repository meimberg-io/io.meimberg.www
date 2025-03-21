
import { ArticleStoryblok, ArticleteaserlistStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import ArticleteaserlistClient from '@/components/storyblok/articleteaserlist/ArticleteaserlistClient.tsx'
import ArticleteaserlistServer from '@/components/storyblok/articleteaserlist/ArticleteaserlistServer.tsx'
import { ArticleCard } from '@/components/storyblok/articleteaserlist/ArticleCard.tsx'

export interface ArticleteaserlistProps {
	type: string;
	limit: number;
	articles?: any;
	layout: string
}


export default function Articleteaserlist({ blok }: { blok: ArticleteaserlistStoryblok }) {
	const props: ArticleteaserlistProps = {
		type: blok.type,
		limit: parseInt(blok.limit),
		layout: blok.layout,
		articles: blok.articles || []
	}


	if (blok.type === 'automatic') {
		const isEditor = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('_storyblok')
		return isEditor ? <ArticleteaserlistClient props={props} /> : <ArticleteaserlistServer props={props} />;

	} else {
		return props.articles.map((article: ISbStoryData<ArticleStoryblok>) => (
			<ArticleCard key={article.id} article={article} layout={props.layout}/>
		))
	}
}
