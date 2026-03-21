import { BlogteaserlistProps } from '@/components/elements/blogteaserlist/Blogteaserlist.tsx'
import {
  COMPONENTTYPE_ARTICLE,
  COMPONENTTYPE_BLOG,
  fetchStories,
  STORYBLOK_FOLDER_ARTICLES
} from '@/lib/storyblok.ts'
import { BlogCardList } from '@/components/elements/blogteaserlist/BlogCardList.tsx'

function componentTypeForFolder(folder?: string): string {
  if (folder === STORYBLOK_FOLDER_ARTICLES || folder === 'a') {
    return COMPONENTTYPE_ARTICLE
  }
  return COMPONENTTYPE_BLOG
}

export default async function BlogteaserlistServer({ props }: { props: BlogteaserlistProps }) {
  const componentType = componentTypeForFolder(props.folder)
  const blogsToRender =
    props.type === 'automatic'
      ? await fetchStories(props.limit, componentType, { folder: props.folder })
      : props.blogs || []
  return (
    <BlogCardList
      blogs={blogsToRender.data.stories}
      layout={props.layout}
      showImage={props.showImage}
    />
  )

}

