import { AssetStoryblok } from '@/types/component-types-sb'
import clsx from 'clsx'
import Image from 'next/image'

export default function HeaderPicture({
  headerpicture
}: {
  headerpicture?: AssetStoryblok
}) {
  return (
    <>
      {headerpicture?.filename && (
        <div className="sm:px-8">
          <div className="mx-auto mt-16 w-full max-w-7xl lg:px-8">
            <div
              className={clsx('relative h-[240px] px-4 sm:px-8 lg:px-12')}
            >
              {headerpicture.filename ? (
                <Image
                  src={`${headerpicture.filename}/m/1216x240/filters:focal(${headerpicture.focus})/filters:quality(80)`}
                  alt="Headerpicture"
                  className="w-full object-cover object-center"
                  fill
                />
              ) : (
                <div className="h-full w-full bg-gray-200" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
