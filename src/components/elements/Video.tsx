'use client'

import dynamic from 'next/dynamic'
import { VideoStoryblok } from '@/types/component-types-sb'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'
import { useState } from 'react'

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
  const [isActivated, setIsActivated] = useState(false)
  if (!src) return null

  const source = {
    type: 'video' as const,
    sources: [{ src, type: mimeFromUrl(src) }]
  }

  return (
    <ElementWrapper>
      <div {...storyblokEditable(blok)} className="w-full overflow-hidden rounded-lg">
        {isActivated ? (
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
        ) : (
          <button
            type="button"
            aria-label="Video laden und abspielen"
            onClick={() => setIsActivated(true)}
            className="group relative flex w-full items-center justify-center overflow-hidden bg-zinc-900/90 py-24 text-white transition hover:bg-zinc-900"
          >
            <span className="absolute inset-0 bg-linear-to-br from-zinc-700/40 via-zinc-900/0 to-zinc-950/80" />
            <span className="relative flex items-center gap-3 rounded-full border border-white/25 bg-black/35 px-5 py-3 text-sm font-medium backdrop-blur-xs">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Video laden
            </span>
          </button>
        )}
      </div>
    </ElementWrapper>
  )
}
