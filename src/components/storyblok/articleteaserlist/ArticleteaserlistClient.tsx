'use client';

import { useEffect, useState } from 'react'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { ArticleCard } from '@/components/storyblok/articleteaserlist/ArticleCard.tsx'
import { ArticleteaserlistProps } from '@/components/storyblok/articleteaserlist/Articleteaserlist.tsx'
import { fetchArticles } from '@/lib/storyblok.ts'


export default function ArticleteaserlistClient({ props }: { props: ArticleteaserlistProps }) {
	const [articles, setArticles] = useState<ISbStoryData<ArticleStoryblok>[] | null>(null);

	useEffect(() => {
		if (props.type === 'automatic') {
			fetchArticles(props.limit).then((response) => {
				setArticles(response.data.stories); // ✅ Jetzt ist `stories` definiert
			});
		} else {
			setArticles(props.articles);
		}
	}, [props]);

	if (!articles) return <p>Loading...</p>; // Fallback, bis die API-Daten geladen sind

	return articles.map((article) => (
		<ArticleCard key={article.id} article={article} layout={props.layout}/>

	));
}
