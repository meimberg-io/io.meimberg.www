import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc'
import { BlogStoryblok } from '@/types/component-types-sb'
import { BlogLayout } from '@/components/layout/BlogLayout.tsx'

export default function Blog({ blok }: Readonly<{ blok: BlogStoryblok }>) {
  return (
    <BlogLayout blog={blok} {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </BlogLayout>
  )
}

