'use client'

import { MultiassetStoryblok, PhotosStoryblok } from '@/types/component-types-sb'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import { Thumbnails } from 'yet-another-react-lightbox/plugins'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'


export default function Gallery({ blok }: PhotosStoryblok) {

	const images: MultiassetStoryblok = blok.images
	const cols = 'md:grid-cols-' + blok.columns + ' lg:grid-cols-' + blok.columns

	const [open, setOpen] = useState(false)
	const [index, setIndex] = useState(0)

	const slides = images
		.filter((img) => !!img.filename)
		.map((img) => ({ src: img.filename! }))

	return (
		<ElementWrapper>
			<div  {...storyblokEditable(blok)}>
				<div className={'grid grid-cols-1 gap-6 sm:grid-cols-2 ' + cols}>
					{images.map((asset, i) => (
						asset.filename && (
							<div key={asset.id}
									 className="relative w-full aspect-auto overflow-hidden rounded-lg cursor-pointer"
									 onClick={() => {
										 setIndex(i)
										 setOpen(true)
									 }}>
								<img
									className="object-cover object-center w-full h-full max-w-full rounded-lg"
									src={asset.filename}
									alt="gallery-photo"
								/>
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
			</div>
		</ElementWrapper>
	)
}
