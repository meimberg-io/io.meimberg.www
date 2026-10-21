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

// Darstellung je Stil. `frame` umschließt Bild und Bildunterschrift, damit die
// Unterschrift unter dem Bild steht und nicht unter der vollen Spaltenbreite.
const VARIANTS = {
	keyvisual: {
		frame: 'max-w-xs px-2.5 lg:max-w-none flex flex-col items-center',
		width: 420,
		height: 420,
		sizes: '(min-width: 1024px) 32rem, 20rem',
		image: 'aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800',
		caption: 'mt-6 text-center'
	},
	small: {
		frame: 'max-w-xs px-2.5 lg:max-w-none flex flex-col items-center',
		width: 240,
		height: 240,
		sizes: '(min-width: 512px) 20rem, 12rem',
		image: 'rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800',
		caption: 'mt-3 text-center'
	},
	normal: {
		frame: '',
		width: 800,
		height: 800,
		sizes: '(min-width: 1024px) 32rem, 20rem',
		image: 'rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800',
		caption: 'mt-3'
	}
} as const

export default function Picture({ blok }: { blok: PictureBlok }) {
	const [open, setOpen] = useState(false)

	// Ein Picture-Block ohne Bild (in Storyblok angelegt, nie befüllt) rendert nichts.
	const src = blok.image?.filename
	if (!src) return null

	// Leerer Alt-Text kennzeichnet das Bild als dekorativ — richtig für Bestand ohne Alt-Text.
	const alt = blok.image?.alt?.trim() || ''
	const caption = blok.caption?.trim()

	// Default: Lightbox enabled. Set clickEnlarge: false in Storyblok to disable.
	const enableLightbox = blok.clickEnlarge !== false

	const handleClick = () => {
		if (enableLightbox) setOpen(true)
	}

	const renderLightboxSlide = ({ slide }: { slide: unknown }) => {
		const typedSlide = slide as { src: string; alt?: string }
		return (
			<Image
				src={typedSlide.src}
				alt={typedSlide.alt || ''}
				width={1600}
				height={1600}
				unoptimized
				sizes="100vw"
				style={{
					maxWidth: '100%',
					maxHeight: '100%',
					borderRadius: '0.75rem',
					objectFit: 'contain'
				}}
			/>
		)
	}

	const variant = blok.style === 'keyvisual' || blok.style === 'small' ? VARIANTS[blok.style] : VARIANTS.normal
	const imageClasses = enableLightbox ? 'cursor-pointer' : ''

	return (
		<ElementWrapper spacing={blok.spacing || undefined}>
			<figure {...storyblokEditable(blok)} className={variant.frame}>
				<Image
					src={src}
					width={variant.width}
					height={variant.height}
					alt={alt}
					sizes={variant.sizes}
					className={`${variant.image} ${imageClasses}`}
					onClick={handleClick}
				/>
				{caption && (
					<figcaption className={`${variant.caption} text-sm whitespace-pre-line text-muted-foreground`}>
						{caption}
					</figcaption>
				)}
			</figure>
			{enableLightbox && (
				<Lightbox
					open={open}
					close={() => setOpen(false)}
					slides={[{ src, alt }]}
					render={{ slide: renderLightboxSlide }}
				/>
			)}
		</ElementWrapper>
	)
}
