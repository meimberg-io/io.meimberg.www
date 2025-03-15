import {
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc'
import { PageStoryblok } from '@/types/component-types-sb'

export default function Page({ blok }: { blok: PageStoryblok }) {
	return (
		<main {...storyblokEditable(blok)}>
			<p {...storyblokEditable(blok)}>UID: {blok.wutz}</p>
			{blok.body?.map((nestedBlok: any) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</main>
	)
}
