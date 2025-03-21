import { ArticleteaserlistStoryblok } from '@/types/component-types-sb'
import ArticleteaserlistClient from '@/components/elements/articleteaserlist/ArticleteaserlistClient.tsx'
import ArticleteaserlistServer from '@/components/elements/articleteaserlist/ArticleteaserlistServer.tsx'
import { ArticleCardList } from '@/components/elements/articleteaserlist/ArticleCardList.tsx'


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
		return	<ArticleCardList articles={props.articles} layout={props.layout} />;

	}
}
