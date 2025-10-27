import { ArticleteaserlistProps } from '@/components/elements/articleteaserlist/Articleteaserlist.tsx'
import { COMPONENTTYPE_ARTICLE, COMPONENTTYPE_BLOG, fetchStories } from '@/lib/storyblok.ts'
import { ArticleCardList } from '@/components/elements/articleteaserlist/ArticleCardList.tsx'


export default async function ArticleteaserlistServer({ props }: { props: ArticleteaserlistProps }) {
	const componentTypes = COMPONENTTYPE_ARTICLE + ',' + COMPONENTTYPE_BLOG
	const articlesToRender = props.type === 'automatic' ? await fetchStories(props.limit, componentTypes, props.folder) : props.articles || []
	return <ArticleCardList articles={articlesToRender.data.stories} layout={props.layout} />

}
