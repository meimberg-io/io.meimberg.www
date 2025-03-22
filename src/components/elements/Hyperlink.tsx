import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { LinkIcon } from '@/components/util/Svg.tsx'
import Link from 'next/link'
import { HyperlinkStoryblok } from '@/types/component-types-sb'


export default function Hyperlink({ blok }: HyperlinkStoryblok) {

	return (
		<ElementWrapper>
			<div className="rounded-2xl  px-4 py-4 border bg-zinc-100 dark:bg-zinc-950 border-gray-200 dark:border-gray-800 ">
				<Link href={blok.url} target="_blank"
							className="relative transition flex text-sm font-medium hover:text-zinc-400  text-zink-200 dark:text-teal-500">
					<LinkIcon className="h-6 w-6 flex-none" />
					<span className="ml-2">{blok.label}</span>
				</Link>
			</div>
		</ElementWrapper>

	)

}
