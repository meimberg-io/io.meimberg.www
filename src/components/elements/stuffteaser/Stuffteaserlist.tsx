import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { Card } from '@/components/elements/articleteaserlist/Card.tsx'
import { LinkIcon } from '@/components/util/Svg.tsx'
import { StuffStoryblok, StuffteaserlistStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import Image from 'next/image'
import { storyblokEditable } from '@storyblok/react/rsc'
import { HeartIcon } from 'lucide-react'


export interface StuffteaserlistProps {

	stuffs?: ISbStoryData<StuffStoryblok>[] | [];

}

export default function Stuffteaserlist({ blok }: { blok: StuffteaserlistStoryblok }) {
	const props: StuffteaserlistProps = {
		stuffs: blok.stuffs ?? []
	}
	if (blok.layout === 'small') {
		return (
			<ElementWrapper spacing="large">

				<div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
					<h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100 ">
						<HeartIcon className="h-6 w-6 flex-none " color="oklch(0.704 0.14 182.503)"/>
						<span className="ml-3 mb-2 ">Cool Stuff</span>
					</h2>

					<ol className="mt-6 space-y-4">
						{blok.stuffs?.map((stuff: ISbStoryData<StuffStoryblok>) => (
							<div key={stuff.id} className="my-8">
							<Card as="li"  >
								<div className="flex gap-4 w-full">
									<div
										className=" overflow-hidden mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full ring-1 shadow-md shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
										{stuff.content.teaserimage?.filename && <Image src={stuff.content.teaserimage?.filename} alt="" className="overflow-hidden h-10 w-10" width={32} height={32} />}
									</div>
									<dl className="flex flex-auto flex-wrap gap-x-2">
										<dt className="sr-only">Company</dt>
										<dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
											{stuff.content.pagetitle}
										</dd>
										<dt className="sr-only">Role</dt>
										<dd className="text-xs text-zinc-500 dark:text-zinc-400">
											{stuff.content.shortabstact}
										</dd>
									</dl>
									<div className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
										<Card.Link href={`/${stuff.full_slug}`}></Card.Link>
									</div>
								</div>
							</Card>
							</div>

						))}
					</ol>

				</div>

			</ElementWrapper>
		)

	} else {
		return (
			<ElementWrapper spacing="large" {...storyblokEditable(blok)}>

				<ul
					role="list"
					className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
				>
					{props.stuffs?.map((stuff: ISbStoryData<StuffStoryblok>) => (
						<Card as="li" key={stuff.id}>

							<div
								className="relative z-10 flex h-16 w-16 overflow-hidden items-center justify-center rounded-full bg-white ring-1 shadow-md shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
								{stuff.content.teaserimage?.filename &&
									<Image src={stuff.content.teaserimage?.filename} alt="" width="128" height="128" className="h-16 w-16" />}

							</div>
							<div className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
								<Card.Link href={`/${stuff.full_slug}`}>{stuff.content.teasertitle}</Card.Link>
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

}
