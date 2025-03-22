import { ISbStoryData } from '@storyblok/react'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { Card } from '@/components/elements/articleteaserlist/Card.tsx'
import { formatDate } from '@/lib/formatDate.ts'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'


export function ArticleCardList(props: { articles: ISbStoryData<ArticleStoryblok>[], layout: string }) {

	if (props.layout === 'small') {

		return (
			<ElementWrapper  >
				{
					props.articles.map((article) => (

						<article key={article.id} className="mt-16 sm:mt-20">
							<Card as="article">
								<Card.Title href={`/${article.full_slug}`}>{article.content.teasertitle}</Card.Title>
								<Card.Eyebrow as="time" dateTime={article.content.date} decorate>
									{article.content.date && formatDate(article.content.date)}
								</Card.Eyebrow>
								<Card.Description>{article.content.abstract}</Card.Description> {/* ✅ Hier gefixt */}
								<Card.Cta>{article.content.readmoretext ?? 'Weiterlesen'}</Card.Cta>
							</Card>
						</article>
					))
				}

			</ElementWrapper>
		)
	} else {
		return (
			<ElementWrapper spacing="large">

				<div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
					<div className="flex max-w-3xl flex-col space-y-16">
						{props.articles.map((article) => (
							<article key={article.id} className="md:grid md:grid-cols-4 md:items-baseline ">
								<Card className="md:col-span-3">
									<Card.Title href={`/${article.full_slug}`}>
										{article.content.teasertitle}
									</Card.Title>
									<Card.Eyebrow as="time" dateTime={article.content.date} className="md:hidden" decorate>
										{'xx' + formatDate(article.content.date)}
									</Card.Eyebrow>
									<Card.Description>{article.content.abstract}</Card.Description>
									<Card.Cta>{article.content.readmoretext ?? 'Weiterlesen'}</Card.Cta>
								</Card>
								<Card.Eyebrow as="time" dateTime={article.content.date} className="mt-1 max-md:hidden">
									{formatDate(article.content.date)}
								</Card.Eyebrow>
							</article>
						))}
					</div>
				</div>
			</ElementWrapper>
		)

	}
}


