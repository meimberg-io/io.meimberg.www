import {
	StoryblokServerComponent
} from '@storyblok/react/rsc'
import { Grid2ColumnStoryblok } from '@/types/component-types-sb'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'

export default function Grid2Column({ blok }: { blok: Grid2ColumnStoryblok }) {
	return (
		<ElementWrapper>
		<div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
			<div>
				{blok.col1?.map((nestedBlok: any) => (
					<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			</div>
			<div>
				{blok.col2?.map((nestedBlok: any) => (
					<div key={nestedBlok._uid} className="lg:pl-20 mb-12">
						<StoryblokServerComponent blok={nestedBlok} />
					</div>
				))}
			</div>
		</div>
		</ElementWrapper>
	)
}
