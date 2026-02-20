import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc'
import { StuffStoryblok } from '@/types/component-types-sb'
import { StuffLayout } from '@/components/layout/StuffLayout.tsx'


export default function Stuff({ blok }: Readonly<{ blok: StuffStoryblok }>) {
	return (
		<StuffLayout article={blok} {...storyblokEditable(blok)}>
			{blok.body?.map((nestedBlok: any) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</StuffLayout>
	)
}
