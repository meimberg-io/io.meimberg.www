"use client";

import { MultiassetStoryblok, PhotosStoryblok } from '@/types/component-types-sb'
import 'yet-another-react-lightbox/styles.css'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import { Thumbnails } from 'yet-another-react-lightbox/plugins'


// im class: absolute inset-0 w-full h-full object-cover object-center
// im class: object-cover object-center w-full h-full max-w-full rounded-lg

export default function Gallery({ blok }: PhotosStoryblok) {

	const images: MultiassetStoryblok = blok.images
	const cols = 'md:grid-cols-' + blok.columns

	const [open, setOpen] = useState(false)
	const [index, setIndex] = useState(0)

	const slides = images
		.filter((img) => !!img.filename)
		.map((img) => ({ src: img.filename! }))

	return (
		<div className="mt-16 sm:mt-20">
			<div className={'grid grid-cols-1 gap-6 sm:grid-cols-2 ' + cols}>
				{images.map((asset, i) => (
					asset.filename && (
						<div key={asset.id}
								 className="relative w-full aspect-auto overflow-hidden rounded-lg"
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
			/>
		</div>
	)
}
