import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc'
import { ArticleStoryblok } from '@/types/component-types-sb'
import { ArticleLayout } from '@/components/layout/ArticleLayout.tsx'


export default function Article({ blok }: Readonly<{ blok: ArticleStoryblok }>) {
	console.log("Article",blok)
	return (
		<ArticleLayout article={blok} {...storyblokEditable(blok)}>
			{blok.body?.map((nestedBlok: any) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}


		</ArticleLayout>
	)
}
