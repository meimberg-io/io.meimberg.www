import {
  COMPONENTTYPE_ARTICLE,
  COMPONENTTYPE_BLOG,
  COMPONENTTYPE_SPECIAL,
  STORYBLOK_FOLDER_ARTICLES,
  STORYBLOK_FOLDER_SPECIALS
} from '@/lib/storyblokShared'
import BlogteaserlistClient from './BlogteaserlistClient'
import BlogteaserlistServer from './BlogteaserlistServer'
import { BlogCardList } from './BlogCardList'

export interface TeaserlistProps {
  type: string
  limit: number
  blogs?: any
  layout: string
  folder?: string
}

export function componentTypeForFolder(folder?: string): string {
  if (folder === STORYBLOK_FOLDER_ARTICLES || folder === 'a') {
    return COMPONENTTYPE_ARTICLE
  }
  if (folder === STORYBLOK_FOLDER_SPECIALS || folder === 's') {
    return COMPONENTTYPE_SPECIAL
  }
  return COMPONENTTYPE_BLOG
}

export function renderTeaserlist(props: TeaserlistProps) {
  if (props.type === 'automatic') {
    const isEditor =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).has('_storyblok')
    return isEditor
      ? <BlogteaserlistClient props={props} />
      : <BlogteaserlistServer props={props} />
  }

  return (
    <BlogCardList
      blogs={props.blogs}
      layout={props.layout}
    />
  )
}
