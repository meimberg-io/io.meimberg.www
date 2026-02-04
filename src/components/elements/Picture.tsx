'use client'

import { storyblokEditable } from '@storyblok/react/rsc'
import { PictureStoryblok } from '@/types/component-types-sb'
import Image from 'next/image'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

// Extended type for optional clickEnlarge field (add in Storyblok if needed)
type PictureBlok = PictureStoryblok & { clickEnlarge?: boolean }

export default function Picture({ blok }: { blok: PictureBlok }) {
	const [open, setOpen] = useState(false)

	// Default: Lightbox enabled. Set clickEnlarge: false in Storyblok to disable.
	const enableLightbox = blok.clickEnlarge !== false

	const handleClick = () => {
		if (enableLightbox) setOpen(true)
	}

	const imageClasses = enableLightbox ? 'cursor-pointer' : ''

	if (blok.style === 'keyvisual') {
		return (
			<ElementWrapper spacing={blok.spacing || undefined}>
				<div {...storyblokEditable(blok)} className="">
					<div className="max-w-xs px-2.5 lg:max-w-none flex justify-center">
						<Image
							src={blok.image.filename}
							width={420}
							height={420}
							alt=""
							sizes="(min-width: 1024px) 32rem, 20rem"
							className={`aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 ${imageClasses}`}
							onClick={handleClick}
						/>
					</div>
				</div>
				{enableLightbox && (
					<Lightbox
						open={open}
						close={() => setOpen(false)}
						slides={[{ src: blok.image.filename }]}
						render={{
							slide: ({ slide }) => {
								const typedSlide = slide as { src: string }
								return (
									<img
										src={typedSlide.src}
										alt=""
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											borderRadius: '0.75rem',
											objectFit: 'contain'
										}}
									/>
								)
							}
						}}
					/>
				)}
			</ElementWrapper>
		)
	} else if (blok.style === 'small') {
		return (
			<ElementWrapper spacing={blok.spacing || undefined}>
				<div {...storyblokEditable(blok)} className="">
					<div className="max-w-xs px-2.5 lg:max-w-none content-center flex justify-center">
						<Image
							src={blok.image.filename}
							width={240}
							height={240}
							alt=""
							sizes="(min-width: 512px) 20rem, 12rem"
							className={`rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 ${imageClasses}`}
							onClick={handleClick}
						/>
					</div>
				</div>
				{enableLightbox && (
					<Lightbox
						open={open}
						close={() => setOpen(false)}
						slides={[{ src: blok.image.filename }]}
						render={{
							slide: ({ slide }) => {
								const typedSlide = slide as { src: string }
								return (
									<img
										src={typedSlide.src}
										alt=""
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											borderRadius: '0.75rem',
											objectFit: 'contain'
										}}
									/>
								)
							}
						}}
					/>
				)}
			</ElementWrapper>
		)
	} else {
		return (
			<ElementWrapper spacing={blok.spacing || undefined}>
				<div {...storyblokEditable(blok)} className="">
					<Image
						src={blok.image.filename}
						width={800}
						height={800}
						alt=""
						sizes="(min-width: 1024px) 32rem, 20rem"
						className={`rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800 ${imageClasses}`}
						onClick={handleClick}
					/>
				</div>
				{enableLightbox && (
					<Lightbox
						open={open}
						close={() => setOpen(false)}
						slides={[{ src: blok.image.filename }]}
						render={{
							slide: ({ slide }) => {
								const typedSlide = slide as { src: string }
								return (
									<img
										src={typedSlide.src}
										alt=""
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											borderRadius: '0.75rem',
											objectFit: 'contain'
										}}
									/>
								)
							}
						}}
					/>
				)}
			</ElementWrapper>
		)
	}
}
