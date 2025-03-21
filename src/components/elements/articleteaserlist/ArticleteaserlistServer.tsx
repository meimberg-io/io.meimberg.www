import { ArticleteaserlistProps } from '@/components/elements/articleteaserlist/Articleteaserlist.tsx'
import { fetchArticles } from '@/lib/storyblok.ts'
import { ArticleCardList } from '@/components/elements/articleteaserlist/ArticleCardList.tsx'


export default async function ArticleteaserlistServer({ props }: {  props: ArticleteaserlistProps }) {
	const articlesToRender = props.type === 'automatic' ? await fetchArticles(props.limit) : props.articles || [];
	return	<ArticleCardList articles={articlesToRender.data.stories} layout={props.layout} />;

}
