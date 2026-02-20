import { storyblokEditable } from '@storyblok/react/rsc'
import { NewsStoryblok } from '@/types/component-types-sb'
import { SimplePageLayout } from '@/components/layout/SimplePageLayout.tsx'
import NewsFeedList from '@/components/elements/NewsFeedList.tsx'
import { deriveSourceIconUrl, type RssFeedSource } from '@/lib/rss'

export default function News({ blok }: Readonly<{ blok: NewsStoryblok }>) {
  const sources: RssFeedSource[] = (blok.feeds ?? []).map((feed) => ({
    name: feed.name,
    url: feed.url,
    iconUrl: feed.icon?.filename || deriveSourceIconUrl(feed.url)
  }))

  return (
    <SimplePageLayout
      blok={blok}
      layout="wide"
      title={blok.pagetitle}
      intro={blok.pageintro}
      {...storyblokEditable(blok)}
    >
      <NewsFeedList sources={sources} pageSize={20} />
    </SimplePageLayout>
  )
}
