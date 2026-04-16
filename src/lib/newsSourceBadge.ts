const base =
  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium leading-none'

/** Tailwind-Klassen für die Quellen-Pille in NewsFeedList / PaginatedNewsList. */
export function newsSourceBadgeClassName(sourceName: string): string {
  const k = sourceName.toLowerCase()
  if (k.includes('awesome apps')) {
    return `${base} bg-blue-500/10 text-blue-800 dark:bg-blue-400/18 dark:text-blue-200`
  }
  if (k.includes('morpheuxx')) {
    return `${base} bg-red-500/10 text-red-800 dark:bg-red-400/18 dark:text-red-200`
  }
  if (k.includes('blog') || k.includes('artikel')) {
    return `${base} bg-accent/10 text-accent dark:bg-accent/20 dark:text-teal-200`
  }
  return `${base} bg-zinc-500/10 text-zinc-800 dark:bg-zinc-400/16 dark:text-zinc-200`
}
