import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/layout/Container.tsx'
import { GlobalsettingsStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import React from 'react'


function NavLink({ href, children }: {
	href: string
	children: React.ReactNode
}) {
	return (
		<Link href={href} className="transition hover:text-teal-500 dark:hover:text-teal-400">
			{children}
		</Link>
	)
}

export function Footer({
  footernav,
  copyright
}: {
  footernav: GlobalsettingsStoryblok['footernav'] | undefined
  copyright: GlobalsettingsStoryblok['copyright']
}) {
	return (
		<footer className="mt-32 flex-none">
			<ContainerOuter>
				<div className="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
					<ContainerInner>
						<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
							<div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">


							{footernav?.filter((i): i is ISbStoryData<any> => {
								return typeof i === 'object' && i !== null && 'id' in i
							}).map((item, index: number) => (
								<NavLink key={index} href={`/${item.full_slug}`}>{item.name}</NavLink>
							))}

							</div>
							<p className="text-sm text-zinc-500 dark:text-zinc-400">
								&copy; {new Date().getFullYear()} {copyright}
							</p>
						</div>
					</ContainerInner>
				</div>
			</ContainerOuter>
		</footer>
	)
}
