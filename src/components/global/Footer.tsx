'use client'
import Link from 'next/link'

import { ContainerInner, ContainerOuter } from '@/components/layout/Container.tsx'
import React, { useEffect, useState } from 'react'
import { GlobalsettingsStoryblok } from '@/types/component-types-sb'
import { fetchGlobalsettings } from '@/lib/storyblok.ts'


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

export function Footer() {

	const [siteSettings, setSiteSettings] = useState<GlobalsettingsStoryblok>()

	useEffect(() => {
		fetchGlobalsettings(false).then((x) => {
			setSiteSettings(x)

		})
	}, [])
	return (
		<footer className="mt-32 flex-none">
			<ContainerOuter>
				<div className="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
					<ContainerInner>
						<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
							<div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">


								{siteSettings?.footernav?.filter((i) => {
									return (i.id !== undefined)
								}).map((item: { id: string, full_slug: string, name: string }, index: number) => (
									<NavLink key={index} href={`/${item.full_slug}`}>{item.name}</NavLink>
								))}

							</div>
							<p className="text-sm text-zinc-400 dark:text-zinc-500">
								&copy; {new Date().getFullYear()} {siteSettings?.copyright}
							</p>
						</div>
					</ContainerInner>
				</div>
			</ContainerOuter>
		</footer>
	)
}
