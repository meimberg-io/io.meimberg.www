'use client'

import { MultiassetStoryblok, PhotosStoryblok, StoryblokAsset } from '@/types/component-types-sb'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import { Thumbnails } from 'yet-another-react-lightbox/plugins'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'
import Image from 'next/image'
import { storyblokImageForCard } from '@/lib/storyblokImageUrl.ts'


export default function Gallery({ blok }: { blok: PhotosStoryblok }) {

	const images: MultiassetStoryblok = blok.images
	const cols = 'md:grid-cols-' + blok.columns + ' lg:grid-cols-' + blok.columns

	const [open, setOpen] = useState(false)
	const [index, setIndex] = useState(0)

	const slides = images
		.filter((img: StoryblokAsset) => !!img.filename)
		.map((img: StoryblokAsset) => {
			const optimized = storyblokImageForCard(img, 2200, 1600, 85)
			return {
				src: optimized?.src ?? img.filename!,
				unoptimized: optimized?.unoptimized ?? false
			}
		})

	return (
		<ElementWrapper>
			<div  {...storyblokEditable(blok)}>
			<div className={'grid grid-cols-1 gap-6 sm:grid-cols-2 ' + cols}>
				{images.map((asset: StoryblokAsset, i: number) => (
						asset.filename && (
							<div key={asset.id}
									 className="relative w-full aspect-[4/3] overflow-hidden rounded-lg cursor-pointer"
									 onClick={() => {
										 setIndex(i)
										 setOpen(true)
									 }}>
								{(() => {
									const optimized = storyblokImageForCard(asset, 1200, 900, 78)
									if (!optimized) return null
									return (
										<Image
											className="object-cover object-center w-full h-full max-w-full rounded-lg"
											src={optimized.src}
											alt="gallery-photo"
											fill
											sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
											unoptimized={optimized.unoptimized}
										/>
									)
								})()}
							</div>
						)
					))}
				</div>


				<Lightbox
					open={open}
					close={() => setOpen(false)}
					slides={slides}
					index={index}
					plugins={[Thumbnails]}
					render={{
						slide: ({ slide }) => {
							const typedSlide = slide as { src: string; unoptimized?: boolean }
							return (
								<div
									style={{
										position: 'relative',
										width: 'min(92vw, 1800px)',
										aspectRatio: '16 / 10',
										maxHeight: '90vh'
									}}
								>
									<Image
										src={typedSlide.src}
										alt=""
										fill
										unoptimized={typedSlide.unoptimized}
										sizes="90vw"
										style={{
											borderRadius: '0.75rem',
											objectFit: 'contain'
										}}
									/>
								</div>
							)
						}
					}}
				/>
			</div>
		</ElementWrapper>
	)
}
