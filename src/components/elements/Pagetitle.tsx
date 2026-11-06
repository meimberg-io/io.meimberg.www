import Image from 'next/image'
import { Prose } from '@/components/util/Prose.tsx'
import { clsx } from 'clsx'
import { storyblokEditable } from '@storyblok/react/rsc'
import { PagetitleStoryblok } from '@/types/component-types-sb'
import avatarImage from '@/images/avatar.webp'


export interface PagetitleProps {
  pagetitle: string;
  layout?: string;
  pageintro: string | false | undefined;
  whitetitle?: boolean;
}

export default function Pagetitle({ blok }: { blok: PagetitleStoryblok | PagetitleProps }) {
  const isHome = blok.layout === 'home'
  const textcolor_title = isHome ? 'text-zinc-800 dark:text-white ' : 'text-display '
  const textcolor_intro = isHome ? 'text-zinc-800 dark:text-zinc-300 ' : 'text-lead '
  return (
    <div {...(blok as PagetitleStoryblok).content && storyblokEditable(blok as PagetitleStoryblok)}>

      <div className={clsx(isHome && 'flex flex-col-reverse gap-8 sm:flex-row sm:items-center sm:gap-12')}>
        <Prose className={clsx(isHome && 'min-w-0 flex-1')}>
          <header className="max-w-3xl mt-0">
            <div className="text-base">
              <h1 className={clsx('mb-8', textcolor_title)}>{blok.pagetitle}</h1>
              <p className={clsx('italic', textcolor_intro)}>{blok.pageintro}</p></div>
          </header>
        </Prose>
        {isHome && (
          <Image
            src={avatarImage}
            alt="Oliver Meimberg"
            sizes="10rem"
            className="h-28 w-28 shrink-0 rounded-full bg-zinc-100 object-cover ring-1 shadow-lg shadow-zinc-800/5 ring-zinc-900/5 sm:h-40 sm:w-40 dark:bg-zinc-800 dark:ring-white/10"
            priority
          />
        )}
      </div>
    </div>
  )
}
