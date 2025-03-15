import {
	storyblokEditable,
	StoryblokServerComponent,
} from '@storyblok/react/rsc'
import { PageStoryblok } from '@/types/component-types-sb'
import Image from 'next/image'
import { SimpleLayout } from '@/components/spotlight/SimpleLayout.tsx'

export default function Page({ blok }: { blok: PageStoryblok }) {
	return (
		<SimpleLayout
			title={blok.pageheadline}
			intro={blok.pageintro}
			{...storyblokEditable(blok)}
		>
			{blok.body?.map((nestedBlok: any) => (
				<p>sdd</p>
			))}
			<ul
				role="list"
				className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
			>

			</ul>
		</SimpleLayout>


	)
}
