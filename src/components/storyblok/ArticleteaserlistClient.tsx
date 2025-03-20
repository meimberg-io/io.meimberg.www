'use client';

import { useEffect, useState } from 'react'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { fetchArticles } from '@/lib/fetchArticles.ts'
import { ArticleCard } from '@/components/storyblok/Articleteaserlist.tsx'


export default function ArticleteaserlistClient({ blok }: { blok: { type: string; limit: number; articles?: any } }) {
	const [articles, setArticles] = useState<ISbStoryData<ArticleStoryblok>[] | null>(null);

	console.log('I am ArticleteaserlistClient');

	useEffect(() => {
		if (blok.type === 'automatic') {
			fetchArticles(blok.limit).then((response) => {
				setArticles(response.data.stories); // ✅ Jetzt ist `stories` definiert
			});
		} else {
			setArticles(blok.articles);
		}
	}, [blok]);

	if (!articles) return <p>Loading...</p>; // Fallback, bis die API-Daten geladen sind

	return articles.map((article) => (
		<ArticleCard key={article.id} article={article} />

	));
}
