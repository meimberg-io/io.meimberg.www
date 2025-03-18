import { storyblokEditable } from '@storyblok/react/rsc'
import { LinklistStoryblok, SociallinkStoryblok } from '@/types/component-types-sb'
import { Icon } from '@/components/Icon.tsx'
import Link from 'next/link'
import { ISbStoryData } from '@storyblok/react'

export default function Linklist({ blok }: LinklistStoryblok) {

	// Falls style "icontext" ist, eine Liste rendern
	if (blok.style === "icontext") {
		return (
			<ul role="list" className="space-y-4" {...storyblokEditable(blok)}>
				{blok.links?.map((link: ISbStoryData<SociallinkStoryblok>) => (
					<li key={link.slug} className="flex">
						<Link
							className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
							href={link.content.url.url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon svgText={link.content?.icon?.content?.svg} className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
							<span className="ml-4">{link.content.text}</span>
						</Link>
					</li>
				))}
			</ul>
		)
	}

	// Standardfall: Nur Icons
	return (
		<div className="mt-6 flex gap-6" {...storyblokEditable(blok)}>
			{blok.links?.map((link: ISbStoryData<SociallinkStoryblok>) => (
				<Link
					key={link.slug}
					className="group -m-1 p-1"
					href={link.content.url.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={link.content.title}
				>
					<Icon svgText={link.content?.icon?.content?.svg} className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500"/>
				</Link>
			))}
		</div>
	)
}
