import { Footer } from '@/components/global/Footer.tsx'
import { Header } from '@/components/global/Header.tsx'
import { GlobalsettingsStoryblok } from '@/types/component-types-sb'

export function Layout({
  children,
  globalsettings
}: {
  children: React.ReactNode
  globalsettings: GlobalsettingsStoryblok
}) {
  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative flex w-full flex-col">
        <Header topnav={globalsettings.topnav} />
        <main className="flex-auto">{children}</main>
        <Footer footernav={globalsettings.footernav} copyright={globalsettings.copyright} />
      </div>
    </>
  )
}
