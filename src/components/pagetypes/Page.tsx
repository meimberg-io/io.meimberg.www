import {
	storyblokEditable,
	StoryblokServerComponent
} from '@storyblok/react/rsc'
import { PageStoryblok } from '@/types/component-types-sb'
import { SimplePageLayout } from '@/components/layout/SimplePageLayout.tsx'


export default function Page({ blok }: Readonly<{ blok: PageStoryblok }>) {
	return (
		<SimplePageLayout
			blok={blok}
			layout={blok.layout}
			title={!blok.hidepagetitle && blok.pagetitle}
			intro={!blok.hidepagetitle && blok.pageintro}
			{...storyblokEditable(blok)}
		>

			{blok.body?.map((nestedBlok: any) => (
				<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</SimplePageLayout>
	)
}
