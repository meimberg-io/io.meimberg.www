'use client'

import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { Container } from '@/components/layout/Container.tsx'
import { AppContext } from '@/lib/providers.tsx'
import { StuffStoryblok } from '@/types/component-types-sb'
import { ArrowLeftIcon } from '@/components/util/Svg.tsx'
import HeaderPicture from '@/components/global/HeaderPicture.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'
import Pagetitle from '@/components/elements/Pagetitle.tsx'


export function StuffLayout({ article, children }: {
	article: StuffStoryblok
	children: React.ReactNode
}) {
	const router = useRouter()
	const { previousPathname } = useContext(AppContext)
	return (
		<>
			<HeaderPicture headerpicture={article.headerpicture} />

			<Container className="mt-16 lg:mt-32">
				<div className="xl:relative">
					<div className="mx-auto max-w-2xl">
						{previousPathname && (
							<button
								type="button"
								onClick={() => router.back()}
								aria-label="Go back to articles"
								className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 shadow-md shadow-zinc-800/5 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20"
							>
								<ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
							</button>
						)}

						<article>
							<header className="">
								{article.pagetitle && (<div {...storyblokEditable(article)}>
										<Pagetitle blok={{ pagetitle: article.pagetitle, pageintro: article.pageintro, whitetitle: true }} />
									</div>
								)}
							</header>

							{children}

						</article>
					</div>

				</div>
			</Container>
		</>
	)
}
