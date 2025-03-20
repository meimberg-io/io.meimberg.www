import { ISbStoryData } from '@storyblok/react'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { Card } from '@/components/storyblok/articleteaserlist/Card.tsx'
import { formatDate } from '@/lib/formatDate.ts'

export function ArticleCard(props: { article: ISbStoryData<ArticleStoryblok> }) {
	const article = props.article.content
	return <div className="mt-16 sm:mt-20">
		<Card as="article">
			<Card.Title href={`/articles/${props.article.slug}`}>{article.title}</Card.Title>
			<Card.Eyebrow as="time" dateTime={article.date} decorate>
				{article.date && formatDate(article.date)}
			</Card.Eyebrow>
			<Card.Description>{article.abstract}</Card.Description> {/* ✅ Hier gefixt */}
			<Card.Cta>{article.readmoretext ?? "Weiterlesen"}</Card.Cta>
		</Card>
	</div>
}
