'use client'

import dynamic from 'next/dynamic'
import { VideoStoryblok } from '@/types/component-types-sb'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'

import 'plyr-react/plyr.css'

const Plyr = dynamic(
  () => import('plyr-react').then((m) => ({ default: m.Plyr })),
  { ssr: false }
)

function mimeFromUrl(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase()
  if (ext === 'webm') return 'video/webm'
  if (ext === 'ogv' || ext === 'ogg') return 'video/ogg'
  return 'video/mp4'
}

export default function Video({ blok }: { blok: VideoStoryblok }) {
  const src = blok.file?.filename
  if (!src) return null

  const source = {
    type: 'video' as const,
    sources: [{ src, type: mimeFromUrl(src) }]
  }

  return (
    <ElementWrapper>
      <div {...storyblokEditable(blok)} className="w-full overflow-hidden rounded-lg">
        <Plyr
          source={source}
          options={{
            controls: [
              'play-large',
              'play',
              'progress',
              'current-time',
              'mute',
              'volume',
              'captions',
              'settings',
              'pip',
              'airplay',
              'fullscreen'
            ]
          }}
        />
      </div>
    </ElementWrapper>
  )
}
