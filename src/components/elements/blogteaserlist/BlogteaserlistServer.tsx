import { TeaserlistProps, componentTypeForFolder } from './renderTeaserlist'
import { fetchStories } from '@/lib/storyblokApi'
import { BlogCardList } from './BlogCardList'

export default async function BlogteaserlistServer({ props }: { props: TeaserlistProps }) {
  const componentType = componentTypeForFolder(props.folder)
  const blogsToRender =
    props.type === 'automatic'
      ? await fetchStories(props.limit, componentType, { folder: props.folder })
      : props.blogs || []
  return (
    <BlogCardList
      blogs={blogsToRender.data.stories}
      layout={props.layout}
    />
  )

}

