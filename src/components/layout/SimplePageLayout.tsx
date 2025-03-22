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
