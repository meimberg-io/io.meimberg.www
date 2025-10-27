import { BlogteaserlistProps } from '@/components/elements/blogteaserlist/Blogteaserlist.tsx'
import { COMPONENTTYPE_BLOG, fetchStories } from '@/lib/storyblok.ts'
import { BlogCardList } from '@/components/elements/blogteaserlist/BlogCardList.tsx'


export default async function BlogteaserlistServer({ props }: { props: BlogteaserlistProps }) {
  const blogsToRender = props.type === 'automatic' ? await fetchStories(props.limit, COMPONENTTYPE_BLOG, props.folder) : props.blogs || []
  return <BlogCardList blogs={blogsToRender.data.stories} layout={props.layout} />

}

