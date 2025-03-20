import { fetchArticles } from '@/lib/fetchArticles.ts'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { ArticleCard } from '@/components/storyblok/Articleteaserlist.tsx'


export default async function ArticleteaserlistServer({ blok }: { blok: { type: string; limit: number; articles?: any } }) {

	const articles = blok.type === 'automatic' ? await fetchArticles(blok.limit) : blok.articles || [];
	return (
		<div>
			{articles.data.stories.map((article: ISbStoryData<ArticleStoryblok>) => (
				<ArticleCard key={article.id} article={article} />
			))}
		</div>
	);
}
