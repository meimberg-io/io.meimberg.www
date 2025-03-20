'use client'

import { Card } from '@/components/spotlight/Card.tsx'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { formatDate } from '@/lib/formatDate.ts'
import { ISbStoryData } from '@storyblok/react'
import ArticleteaserlistClient from '@/components/storyblok/ArticleteaserlistClient.tsx'
import ArticleteaserlistServer from '@/components/storyblok/ArticleteaserlistServer.tsx'

export function ArticleCard(props: { article: ISbStoryData<ArticleStoryblok> }) {
	return <div className="mt-16 sm:mt-20">
		<Card as="article">
			<Card.Title href={`/articles/${props.article.slug}`}>{props.article.content.title}</Card.Title>
			<Card.Eyebrow as="time" dateTime={props.article.content.date} decorate>
				{props.article.content.date && formatDate(props.article.content.date)}
			</Card.Eyebrow>
			<Card.Description>{props.article.content.abstract}</Card.Description> {/* ✅ Hier gefixt */}
			<Card.Cta>Read article</Card.Cta>
		</Card>
	</div>
}

export default function Articleteaserlist({ blok }: { blok: { type: string; limit: number; articles?: any } }) {
	const isEditor = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('_storyblok')
	return isEditor ? ArticleteaserlistClient({ blok }) : ArticleteaserlistServer({ blok })
}
