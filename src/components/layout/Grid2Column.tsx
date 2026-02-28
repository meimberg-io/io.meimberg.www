import {
	StoryblokServerComponent
} from '@storyblok/react/rsc'
import { Grid2ColumnStoryblok } from '@/types/component-types-sb'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'

export default function Grid2Column({ blok }: { blok: Grid2ColumnStoryblok }) {
	return (
		<ElementWrapper spacing="large">
		<div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:items-start">
		<div className="flex flex-col gap-12">
			{blok.col1?.map((nestedBlok: any) => (
				<div key={nestedBlok._uid}>
					<StoryblokServerComponent blok={nestedBlok} />
				</div>
			))}
		</div>
		<div className="flex flex-col gap-12 lg:pl-20">
			{blok.col2?.map((nestedBlok: any) => (
				<div key={nestedBlok._uid}>
					<StoryblokServerComponent blok={nestedBlok} />
				</div>
			))}
		</div>
		</div>
		</ElementWrapper>
	)
}
