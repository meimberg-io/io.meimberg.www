import { ISbStoryData } from '@storyblok/react'
import { ArticleStoryblok, BlogStoryblok } from '@/types/component-types-sb'
import { Card } from '@/components/elements/articleteaserlist/Card.tsx'
import { formatDate } from '@/lib/formatDate.ts'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { FileText, Lightbulb } from 'lucide-react'


type ContentItem = ISbStoryData<ArticleStoryblok> | ISbStoryData<BlogStoryblok>

export function ArticleCardList(props: { articles: ContentItem[], layout: string }) {

	if (props.layout === 'small') {

		return (
			<ElementWrapper>
				{
					props.articles.map((article) => {
						const isArticle = article.content.component === 'article'
						return (
							<article key={article.id} className="mt-16 sm:mt-20">
								<Card as="article" className="pr-12">
									<div className="flex items-center w-full order-first mb-3">
										<Card.Icon>
											{isArticle ? <FileText size={20} /> : <Lightbulb size={20} />}
										</Card.Icon>
										<Card.Eyebrow as="time" dateTime={article.content.date}>
											{article.content.date && formatDate(article.content.date)}
										</Card.Eyebrow></div>
									<Card.Title href={`/${article.full_slug}`}>{article.content.teasertitle}</Card.Title>
									<Card.Description>{article.content.abstract}</Card.Description>
								</Card>
							</article>
						)
					})
				}

			</ElementWrapper>
		)
	} else {
		return (
			<ElementWrapper spacing="large">

				<div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
					<div className="flex max-w-3xl flex-col space-y-16">
						{props.articles.map((article) => {
							const isArticle = article.content.component === 'article'
							return (
								<article key={article.id} className="md:grid md:grid-cols-4 md:items-baseline ">
									<Card className="md:col-span-3 pr-12">
										<div className="flex items-start  order-first mb-3">

											<Card.Icon>
												{isArticle ? <FileText size={20} /> : <Lightbulb size={20} />}
											</Card.Icon>
											<Card.Eyebrow as="time" dateTime={article.content.date} className="">
												{formatDate(article.content.date)}
											</Card.Eyebrow>
										</div>
										<Card.Title href={`/${article.full_slug}`}>
											{article.content.teasertitle}
										</Card.Title>
										<Card.Description>{article.content.abstract}</Card.Description>
									</Card>

								</article>
							)
						})}
					</div>
				</div>
			</ElementWrapper>
		)

	}
}


