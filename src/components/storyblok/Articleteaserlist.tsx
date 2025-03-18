import { fetchArticles } from '@/lib/storyblok.ts'
import { Card } from '@/components/spotlight/Card.tsx'
import { ArticleStoryblok, ArticleteaserlistStoryblok, DividerStoryblok } from '@/types/component-types-sb'
import { formatDate } from '@/lib/formatDate.ts'
import { ISbStoryData } from '@storyblok/react'


function renderArticle(article: ArticleStoryblok) {

	return (

		<Card as="article" key={article._uid}>
			<Card.Title href={`/articles/${article.slug}`}>
				{article.title}
			</Card.Title>
			<Card.Eyebrow as="time" dateTime={article.date} decorate>
				{article.date && formatDate(article.date)}
			</Card.Eyebrow>
			<Card.Description>{article.abstract}</Card.Description>
			<Card.Cta>Read article</Card.Cta>
		</Card>

	)

}
//
//
// return articles.data.stories.map((article) => {
// 		return (
// 			<div className="mt-16 sm:mt-20">
//
// 				{renderArticle(article.content)}
// 			</div>
//
// 		)
//
//
// export default  function Articleteaserlist({ blok }: ArticleteaserlistStoryblok) {
//
//
// 	// const articles: ISbStoryData<ArticleStoryblok[]> = blok.type === 'automatic' ?  fetchArticles(blok.limit) : blok.articles
// 	const articles  =  fetchArticles(blok.limit) {
// 		return		(
//
// 	//
// 	//
// 	// return articles.data.stories.map((article) => {
// 	// 		return (
// 	// 			<div className="mt-16 sm:mt-20">
// 	//
// 	// 				{renderArticle(article.content)}
// 	// 			</div>
// 	//
// 	// 		)
// 	//
//
// 	 <div>xx</div>
//
//
// 		)}
// 	)
//
// }

export default function Divider({ blok }: DividerStoryblok) {
	return <hr key={blok._uid}/>
}
