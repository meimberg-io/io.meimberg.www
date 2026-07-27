import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc'
import { SpecialchapterStoryblok } from '@/types/component-types-sb'
import { SpecialChapterLayout } from '@/components/layout/SpecialChapterLayout.tsx'

export default function SpecialChapter({
  blok
}: Readonly<{ blok: SpecialchapterStoryblok }>) {
  return (
    <SpecialChapterLayout chapter={blok} {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </SpecialChapterLayout>
  )
}
