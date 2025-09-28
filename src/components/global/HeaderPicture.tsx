import { AssetStoryblok } from '@/types/component-types-sb'
import clsx from 'clsx'
import Image from 'next/image'


export default function HeaderPicture({ headerpicture }: {headerpicture?:AssetStoryblok}) {

	return (
		<>
			{
				headerpicture?.filename && (

				<div  className='sm:px-8'>

					<div className="mx-auto w-full max-w-7xl lg:px-8 mt-16  " >
						<div  className={clsx('relative px-4 sm:px-8 lg:px-12')} style={{height:"240px"}}>
							{headerpicture.filename ? (
								<Image src={headerpicture.filename + `/m/1216x240` + `/filters:focal(${headerpicture.focus})`}  alt="Headerpicture"
											 className="w-full object-center object-fill"   fill={true}
											 layout='fill'
											 objectFit='cover'/>
							) : (
								<div className="w-full h-full bg-gray-200" />
							)}
						</div>
					</div>
				</div>
		)}
</>
	)

}
