import {
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc'
import { ArticleStoryblok } from '@/types/component-types-sb'

export default function Article({ blok }: { blok: ArticleStoryblok }) {
	return (
		<main {...storyblokEditable(blok)}>
			<p {...storyblokEditable(blok)}>TITLE: {blok.title}</p>
			{blok.body?.map((nestedBlok: any) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</main>
	)
}
