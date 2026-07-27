import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc'
import { SpecialStoryblok } from '@/types/component-types-sb'
import { SpecialLayout } from '@/components/layout/SpecialLayout.tsx'

export default function Special({ blok }: Readonly<{ blok: SpecialStoryblok }>) {
  return (
    <SpecialLayout special={blok} {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </SpecialLayout>
  )
}
