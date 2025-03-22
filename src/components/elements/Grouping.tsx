import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { StoryblokServerComponent } from '@storyblok/react/rsc'
import { GroupingStoryblok } from '@/types/component-types-sb'
import { Section } from '@/components/layout/Section.tsx'
import React from 'react'


function ToolsSection({ children, ...props }: React.ComponentPropsWithoutRef<typeof Section>) {
	return (
		<Section {...props}>
			<ul role="list" className="space-y-16">
				{children}
			</ul>
		</Section>
	)
}

export default function Grouping({ blok }: { blok: GroupingStoryblok }) {
	return (

		<ElementWrapper spacing="large">
			<div className="space-y-20">
				<ToolsSection title={blok.grouptitle}>
					{blok.groupcontent?.map((nestedBlok: any) => (
						<div key={nestedBlok._uid} className="lg:pl-20 mb-12">
							<StoryblokServerComponent blok={nestedBlok} />
						</div>
					))}
				</ToolsSection>
			</div>


		</ElementWrapper>

	)
}
