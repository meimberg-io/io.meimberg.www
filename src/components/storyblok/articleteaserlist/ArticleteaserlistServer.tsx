import { ArticleStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { ArticleCard } from '@/components/storyblok/articleteaserlist/ArticleCard.tsx'
import { ArticleteaserlistProps } from '@/components/storyblok/articleteaserlist/Articleteaserlist.tsx'
import { fetchArticles } from '@/lib/storyblok.ts'


export default async function ArticleteaserlistServer({ props }: {  props: ArticleteaserlistProps }) {
	const articlesToRender = props.type === 'automatic' ? await fetchArticles(props.limit) : props.articles || [];
	return (
		<div>
			{articlesToRender.data.stories.map((article: ISbStoryData<ArticleStoryblok>) => (
				<ArticleCard key={article.id} article={article} layout={props.layout} />
			))}
		</div>
	);
}
