'use client'

import { ArticleStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import ArticleteaserlistClient from '@/components/storyblok/articleteaserlist/ArticleteaserlistClient.tsx'
import ArticleteaserlistServer from '@/components/storyblok/articleteaserlist/ArticleteaserlistServer.tsx'
import { ArticleCard } from '@/components/storyblok/articleteaserlist/ArticleCard.tsx'


export default function Articleteaserlist({ blok }: { blok: { type: string; limit: number; articles?: any } }) {
	if (blok.type === 'automatic') {
		const isEditor = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('_storyblok')
		return isEditor ? ArticleteaserlistClient({ blok }) : ArticleteaserlistServer({ blok })
	} else {
		return blok.articles.map((article: ISbStoryData<ArticleStoryblok>) => (
			<ArticleCard key={article.id} article={article} />
		))
	}
}
