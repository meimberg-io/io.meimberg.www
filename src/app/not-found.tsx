import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="sm:px-8 mt-16 sm:mt-32">
      <div className="mx-auto w-full max-w-7xl lg:px-8">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-2xl lg:max-w-5xl">
            <div className="max-w-xl">
              <p className="text-base font-semibold text-zinc-400 dark:text-zinc-500">
                404
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                Seite nicht gefunden
              </h1>
              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                Die gesuchte Seite existiert leider nicht oder wurde verschoben.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-interactive hover:text-interactive-hover transition-colors"
                >
                  &larr; Zurück zur Startseite
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
