import { STORYBLOK_FOLDER_ARTICLES } from '@/lib/storyblokShared'
import { ArticleteaserlistStoryblok } from '@/types/component-types-sb'
import { storyblokEditable } from '@storyblok/react/rsc'
import { renderTeaserlist, type TeaserlistProps } from './renderTeaserlist'

export default function Articleteaserlist({ blok }: { blok: ArticleteaserlistStoryblok }) {
  const props: TeaserlistProps = {
    type: blok.type,
    limit: parseInt(blok.limit),
    layout: blok.layout || 'cards',
    folder: blok.folder || STORYBLOK_FOLDER_ARTICLES,
    blogs: blok.articles || [],
  }

  return (
    <div {...storyblokEditable(blok)}>
      {renderTeaserlist(props)}
    </div>
  )
}
