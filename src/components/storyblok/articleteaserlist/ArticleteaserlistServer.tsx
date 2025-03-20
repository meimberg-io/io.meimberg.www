import { fetchArticles } from '@/lib/fetchArticles.ts'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { ArticleCard } from '@/components/storyblok/articleteaserlist/ArticleCard.tsx'


export default async function ArticleteaserlistServer({ blok }: { blok: { type: string; limit: number; articles?: any } }) {

	const articlesToRender = blok.type === 'automatic' ? await fetchArticles(blok.limit) : blok.articles || [];
	return (
		<div>
			{articlesToRender.data.stories.map((article: ISbStoryData<ArticleStoryblok>) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</div>
	);
}
