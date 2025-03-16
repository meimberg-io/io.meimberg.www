import {
	storyblokEditable,
	StoryblokServerComponent
} from '@storyblok/react/rsc'
import { PageStoryblok } from '@/types/component-types-sb'
import { SimpleLayout } from '@/components/spotlight/SimpleLayout.tsx'


export default function Page({ blok }: Readonly<{ blok: PageStoryblok }>) {
	return (
		<SimpleLayout title={blok.pageheadline} intro={blok.pageintro} layout={blok.layout} {...storyblokEditable(blok)}      >
			{blok.body?.map((nestedBlok: any) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</SimpleLayout>
	)
}
