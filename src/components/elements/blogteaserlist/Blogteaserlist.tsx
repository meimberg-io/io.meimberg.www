import { STORYBLOK_FOLDER_ARTICLES } from '@/lib/storyblok'
import { BlogteaserlistStoryblok } from '@/types/component-types-sb'
import BlogteaserlistClient from '@/components/elements/blogteaserlist/BlogteaserlistClient.tsx'
import BlogteaserlistServer from '@/components/elements/blogteaserlist/BlogteaserlistServer.tsx'
import { BlogCardList } from '@/components/elements/blogteaserlist/BlogCardList.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'


export interface BlogteaserlistProps {
  type: string
  limit: number
  blogs?: any
  layout: string
  folder?: string
  showImage?: boolean
}

export default function Blogteaserlist({ blok }: { blok: BlogteaserlistStoryblok }) {
  const isArticleList =
    blok.folder === 'a' || blok.folder === STORYBLOK_FOLDER_ARTICLES
  const showImage = isArticleList
  const props: BlogteaserlistProps = {
    type: blok.type,
    limit: parseInt(blok.limit),
    layout: blok.layout,
    folder: blok.folder,
    blogs: blok.articles || [],
    showImage
  }

  if (blok.type === 'automatic') {
    const isEditor = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('_storyblok')
    return (
      <div {...storyblokEditable(blok)}>
        {isEditor ? <BlogteaserlistClient props={props} /> : <BlogteaserlistServer props={props} />}
      </div>
    )
  } else {
    return (
      <div {...storyblokEditable(blok)}>
        <BlogCardList
          blogs={props.blogs}
          layout={props.layout}
          showImage={props.showImage}
        />
      </div>
    )
  }
}

