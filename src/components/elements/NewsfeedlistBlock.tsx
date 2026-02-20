import { storyblokEditable } from '@storyblok/react/rsc'
import NewsFeedList from '@/components/elements/NewsFeedList.tsx'
import { deriveSourceIconUrl, type RssFeedSource } from '@/lib/rss'
import type { Rssfeed } from '@/types/component-types-sb'
import type { SbBlokKeyDataTypes } from '@storyblok/js'

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
      <NewsFeedList sources={sources} />
    </div>
  )
}
