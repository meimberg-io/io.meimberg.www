import { storyblokEditable } from '@storyblok/react/rsc'
import { PictureStoryblok } from '@/types/component-types-sb'
import Image from 'next/image'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'


export default function Picture({ blok }: { blok: PictureStoryblok }) {

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
						className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
					/>

				</div>
			</div>
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
						className="rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
					/>

				</div>

			</div>
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
						className="rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
					/>
				</div>
			</ElementWrapper>

		)

	}


}
