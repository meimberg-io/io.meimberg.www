import { Container } from '@/components/layout/Container.tsx'
import React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import { ArticleStoryblok, PageStoryblok, StuffStoryblok } from '@/types/component-types-sb'
import Pagetitle from '@/components/elements/Pagetitle.tsx'


export function SimplePageLayout({ blok, layout, title, intro, children }: {
	blok: PageStoryblok | ArticleStoryblok | StuffStoryblok
	layout: '' | 'home' | 'wide' | 'narrow'
	title: string | false | undefined,
	intro: string | false | undefined,
	children?: React.ReactNode
}) {
	const containerClass = layout === 'home' ? 'mt-9 sm:mt-9' : 'mt-16 sm:mt-32'
	
	// For narrow layout, use a custom container with max-w-2xl like the project pages
	if (layout === 'narrow') {
		return (
			<div className={`sm:px-8 ${containerClass}`}>
				<div className="mx-auto w-full max-w-7xl lg:px-8">
					<div className="relative px-4 sm:px-8 lg:px-12">
						<div className="mx-auto max-w-2xl">
							{title && (<div {...storyblokEditable(blok)}>
									<Pagetitle blok={{ pagetitle: title, pageintro: intro, layout: layout }} />
								</div>
							)}
							{children && <div className="mb-16 sm:mb-20">{children}</div>}
						</div>
					</div>
				</div>
			</div>
		)
	}
	
	// For home and wide layouts, use the standard Container
	return (
		<Container className={containerClass}>
			{title && (<div {...storyblokEditable(blok)}>
					<Pagetitle blok={{ pagetitle: title, pageintro: intro, layout: layout }} />
				</div>
			)}
			{children && <div className="mb-16 sm:mb-20">{children}</div>}
		</Container>
	)
}
