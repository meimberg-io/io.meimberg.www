import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { Card } from '@/components/elements/articleteaserlist/Card.tsx'
import { LinkIcon } from '@/components/Svg.tsx'
import { StuffStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import Image from 'next/image'


export interface StuffteaserlistProps {

	stuffs?: ISbStoryData<StuffStoryblok>[] | [];

}

export default function Stuffteaserlist({ blok }: { blok: StuffteaserlistProps }) {
	const props: StuffteaserlistProps = {

		stuffs: blok.stuffs ?? []
	}

	return (
		<ElementWrapper spacing="large">
			<ul
				role="list"
				className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
			>
				{props.stuffs?.map((stuff: ISbStoryData<StuffStoryblok>) => (
					<Card as="li" key={stuff.id} >

						<div
							className="relative z-10 flex h-16 w-16 overflow-hidden items-center justify-center rounded-full bg-white ring-1 shadow-md shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
							{stuff.content.teaserimage?.filename &&
								<Image src={stuff.content.teaserimage?.filename} alt="" width="128" height="128" className="h-16 w-16" />}

						</div>
						<div className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
							<Card.Link href={`/${stuff.full_slug}`}>{stuff.content.title}</Card.Link>
						</div>
						<Card.Description>{stuff.content.abstract} </Card.Description>
						<p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
							<LinkIcon className="h-6 w-6 flex-none" />
							<span className="ml-2">{stuff.content.readmoretext}</span>
						</p>
					</Card>
				))}
			</ul>

		</ElementWrapper>

	)

}
