'use client'
import { YoutubeStoryblok } from '@/types/component-types-sb'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'
import { useState } from 'react'
import Image from 'next/image'


export default function Youtube({ blok }: { blok: YoutubeStoryblok }) {
	const [isActivated, setIsActivated] = useState(false)
	const youtubeUrl = `https://www.youtube-nocookie.com/embed/${blok.youtubeid}?autoplay=1&rel=0`
	const previewImage = `https://i.ytimg.com/vi/${blok.youtubeid}/hqdefault.jpg`

	const frame = (
		<iframe
			src={youtubeUrl}
			title="YouTube video player"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			referrerPolicy="strict-origin-when-cross-origin"
			allowFullScreen
			loading="lazy"
			className="absolute top-0 left-0 h-full w-full"
		/>
	)

	const placeholder = (
		<button
			type="button"
			aria-label="YouTube Video laden und abspielen"
			onClick={() => setIsActivated(true)}
			className="group relative h-full w-full cursor-pointer overflow-hidden"
		>
			<Image
				src={previewImage}
				alt="Video-Vorschau"
				fill
				sizes="(max-width: 768px) 100vw, 80vw"
				className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
			/>
			<span className="absolute inset-0 bg-black/35" />
			<span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-xs">
				<svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
					<path d="M8 5v14l11-7z" />
				</svg>
				Abspielen
			</span>
		</button>
	)

	return (
		<ElementWrapper>
			{blok.format === 'square' ? (
				<div {...storyblokEditable(blok)} className="relative w-full pb-[100%]">
					<div className="absolute top-0 left-0 w-full h-full">
						{isActivated ? frame : placeholder}
					</div>
				</div>
			) : (
				<div {...storyblokEditable(blok)} className="relative w-full overflow-hidden rounded-lg pb-[56.25%]">
					<div className="absolute inset-0">
						{isActivated ? frame : placeholder}
					</div>
				</div>
			)}
		</ElementWrapper>
	)

}
