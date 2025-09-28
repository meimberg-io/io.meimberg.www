import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { LinkIcon } from '@/components/util/Svg.tsx'
import Link from 'next/link'
import { HyperlinkStoryblok } from '@/types/component-types-sb'
import { storyblokEditable } from '@storyblok/react/rsc'


export default function Hyperlink({ blok }: HyperlinkStoryblok) {
	// Handle different link types (internal story links vs external URLs)
	const getHref = () => {
		if (blok.url.linktype === 'story') {
			// Internal story link - use cached_url
			const url = blok.url.cached_url || blok.url.url || '#'
			// Ensure internal links start with / to avoid relative path issues
			return url.startsWith('/') ? url : `/${url}`
		} else {
			// External URL
			return blok.url.url || '#'
		}
	}

	const getTarget = () => {
		// For internal links, don't open in new tab
		if (blok.url.linktype === 'story') {
			return '_self'
		}
		// For external links, use the target from Storyblok or default to _blank
		return blok.url.target || '_blank'
	}

	return (
		<ElementWrapper>
			<div className="rounded-2xl  px-4 py-4 border bg-zinc-100 dark:bg-zinc-950 border-gray-200 dark:border-gray-800 " {...storyblokEditable(blok)} >
				<Link 
					href={getHref()} 
					target={getTarget()}
					className="relative transition flex text-sm font-medium hover:text-zinc-400  text-zink-200 dark:text-teal-500"
				>
					<LinkIcon className="h-6 w-6 flex-none" />
					<span className="ml-2">{blok.label}</span>
				</Link>
			</div>
		</ElementWrapper>
	)
}
