import { storyblokEditable } from '@storyblok/react/rsc'
import NewsFeedList from '@/components/elements/NewsFeedList.tsx'
import { deriveSourceIconUrl, type RssFeedSource } from '@/lib/rss'
import type { Rssfeed } from '@/types/component-types-sb'
import type { SbBlokKeyDataTypes } from '@storyblok/js'
import { Rss } from 'lucide-react'

interface NewsfeedlistBlok {
  feeds?: Rssfeed[]
  component: 'newsfeedlist'
  _uid: string
  [k: string]: SbBlokKeyDataTypes
}

export default function Newsfeedlist({ blok }: Readonly<{ blok: NewsfeedlistBlok }>) {
  const sources: RssFeedSource[] = (blok.feeds ?? []).map((feed) => ({
    name: feed.name,
    url: feed.url,
    iconUrl: feed.icon?.filename || deriveSourceIconUrl(feed.url)
  }))

  return (
    <div {...storyblokEditable(blok)}>
      <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
        <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <Rss className="h-6 w-6 flex-none text-teal-500" />
          <span className="ml-3">Neueste Beiträge</span>
        </h2>
        <hr className="mt-4 border-t border-zinc-100 dark:border-zinc-700/40" />
        <div className="mt-6">
          <NewsFeedList sources={sources} limit={8} bare />
        </div>
      </div>
    </div>
  )
}
