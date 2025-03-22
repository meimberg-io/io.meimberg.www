import { ArticleteaserlistProps } from '@/components/elements/articleteaserlist/Articleteaserlist.tsx'
import { COMPONENTTYPE_ARTICLE, fetchStories } from '@/lib/storyblok.ts'
import { ArticleCardList } from '@/components/elements/articleteaserlist/ArticleCardList.tsx'


export default async function ArticleteaserlistServer({ props }: { props: ArticleteaserlistProps }) {
	const articlesToRender = props.type === 'automatic' ? await fetchStories(props.limit, COMPONENTTYPE_ARTICLE, props.folder) : props.articles || []
	return <ArticleCardList articles={articlesToRender.data.stories} layout={props.layout} />

}
