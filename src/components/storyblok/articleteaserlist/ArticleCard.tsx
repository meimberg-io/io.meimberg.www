import { ISbStoryData } from '@storyblok/react'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { Card } from '@/components/storyblok/articleteaserlist/Card.tsx'
import { formatDate } from '@/lib/formatDate.ts'

export function ArticleCard(props: { article: ISbStoryData<ArticleStoryblok>, layout: string }) {
	const article = props.article.content
	if (props.layout === 'small') {


		return (
			<div className="mt-16 sm:mt-20">
				<Card as="article">
					<Card.Title href={`/${props.article.full_slug}`}>{article.title}</Card.Title>
					<Card.Eyebrow as="time" dateTime={article.date} decorate>
						{article.date && formatDate(article.date)}
					</Card.Eyebrow>
					<Card.Description>{article.abstract}</Card.Description> {/* ✅ Hier gefixt */}
					<Card.Cta>{article.readmoretext ?? 'Weiterlesen'}</Card.Cta>
				</Card>
			</div>
		)
	} else {
		return (
			<article className="md:grid md:grid-cols-4 md:items-baseline">
				<Card className="md:col-span-3">
					<Card.Title href={`/${article.full_slug}`}>
						{article.title}
					</Card.Title>
					<Card.Eyebrow
						as="time"
						dateTime={article.date}
						className="md:hidden"
						decorate
					>
						{formatDate(article.date)}
					</Card.Eyebrow>
					<Card.Description>{article.description}</Card.Description>
					<Card.Cta>Read article</Card.Cta>
				</Card>
				<Card.Eyebrow
					as="time"
					dateTime={article.date}
					className="mt-1 max-md:hidden"
				>
					{formatDate(article.date)}
				</Card.Eyebrow>
			</article>
		)
	}
}


