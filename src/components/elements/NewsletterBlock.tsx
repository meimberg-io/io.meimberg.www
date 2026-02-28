import { storyblokEditable } from '@storyblok/react/rsc'
import NewsletterForm from '@/components/elements/NewsletterForm.tsx'
import type { NewsletterStoryblok } from '@/types/component-types-sb'

export default function NewsletterBlock({ blok }: Readonly<{ blok: NewsletterStoryblok }>) {
  return (
    <div {...storyblokEditable(blok)}>
      <NewsletterForm
        variant={blok.variant || 'default'}
        title={blok.title || undefined}
        description={blok.description || undefined}
      />
    </div>
  )
}
