import { Prose } from '@/components/util/Prose.tsx'
import { clsx } from 'clsx'
import { storyblokEditable } from '@storyblok/react/rsc'
import { PagetitleStoryblok } from '@/types/component-types-sb'


export interface PagetitleProps {
  pagetitle: string;
  layout?: string;
  pageintro: string | false | undefined;
  whitetitle?: boolean;
}

export default function Pagetitle({ blok }: { blok: PagetitleStoryblok | PagetitleProps }) {
  const textcolor_title = (blok.layout === 'home' || blok.whitetitle) ? 'text-zinc-800 dark:text-white ' : 'text-teal-900 dark:text-teal-300 '
  const textcolor_intro = (blok.layout === 'home' || blok.whitetitle) ? 'text-zinc-800 dark:text-zinc-300 ' : 'text-teal-900 dark:text-teal-300 '
  return (
    <div {...(blok as PagetitleStoryblok).content && storyblokEditable(blok as PagetitleStoryblok)}>

      <Prose>
        <header className="max-w-2xl mt-0">
          <div className="text-base">
            <h1 className={textcolor_title}>{blok.pagetitle}</h1>
            <p className={clsx('italic', textcolor_intro)}>{blok.pageintro}</p></div>
        </header>
      </Prose>
    </div>
  )
}
