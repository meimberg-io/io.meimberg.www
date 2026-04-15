import { AssetStoryblok } from '@/types/component-types-sb'
import clsx from 'clsx'
import Image from 'next/image'

export default function HeaderPicture({
  headerpicture
}: {
  headerpicture?: AssetStoryblok
}) {
  const focus = headerpicture?.focus
  const hasFocus = Boolean(focus && String(focus).length > 0)
  const headerImageSrc = headerpicture?.filename
    ? hasFocus
      ? `${headerpicture.filename}/m/1216x240/filters:focal(${focus}):quality(80)`
      : `${headerpicture.filename}/m/1216x240/smart/filters:quality(80)`
    : null

  return (
    <>
      {headerpicture?.filename && (
        <div className="sm:px-8">
          <div className="mx-auto mt-16 w-full max-w-7xl lg:px-8">
            <div
              className={clsx('relative px-4 sm:px-8 lg:px-12')}
              style={{ height: '240px' }}
            >
              {headerImageSrc ? (
                <Image
                  src={headerImageSrc}
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
