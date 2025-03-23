import { MultiassetStoryblok, PhotosStoryblok } from '@/types/component-types-sb'


import clsx from 'clsx'
import Image from 'next/image'


export default function Photos({ blok }: PhotosStoryblok) {
	const rotations = ['rotate-2', '-rotate-2', 'rotate-2', '-rotate-2', 'rotate-2']
	const images: MultiassetStoryblok = blok.images
	return (
		<div className="mt-16 sm:mt-20">
			<div className="-my-4 flex justify-center gap-5 overflow-visible py-4 sm:gap-8">
				{images.map((asset, index: number) => (
					<div
						key={asset.id}
						className={clsx(
							'relative aspect-9/10 w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 sm:w-72 sm:rounded-2xl dark:bg-zinc-800',
							rotations[index % rotations.length]
						)}
					>
						{asset.filename && (<Image
							src={asset.filename}
							width={200}
							height={200}
							alt=""
							sizes="(min-width: 640px) 18rem, 11rem"
							className="absolute inset-0 h-full w-full object-cover"
						/>)}

					</div>
				))}
			</div>
		</div>
	)
}
