'use client';

import { useEffect, useState } from 'react'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { ArticleteaserlistProps } from '@/components/storyblok/articleteaserlist/Articleteaserlist.tsx'
import { fetchArticles } from '@/lib/storyblok.ts'
import { ArticleCardList } from '@/components/storyblok/articleteaserlist/ArticleCardList.tsx'


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

	return <ArticleCardList articles={articles} layout={props.layout} />;
	// return articles.map((article) => (
	// 	<ArticleCard key={article.id} article={article} layout={props.layout}/>
	// ));
}
