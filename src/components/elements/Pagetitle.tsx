import { Prose } from '@/components/spotlight/Prose.tsx'
import { clsx } from 'clsx'


export interface PagetitleProps {
	pagetitle: string;
	layout?: string;
	pageintro: string | false | undefined;
	whitetitle?: boolean;
}

export default function Pagetitle({ blok }: {blok:PagetitleProps}) {
console.log(blok);
	const textcolor_title =( blok.layout === 'home' || blok.whitetitle) ? 'text-zinc-300 dark:text-white ' : 'text-teal-900 dark:text-teal-300 ';
	const textcolor_intro =( blok.layout === 'home' || blok.whitetitle) ? 'text-zinc-300 dark:text-zinc-300 ' : 'text-teal-900 dark:text-teal-300 ';
	return (

		<Prose>
			<header className="max-w-2xl mt-0">
				<div className="text-base">
					<h1 className={textcolor_title}>{blok.pagetitle}</h1>
					<p className={clsx('italic', textcolor_intro)}>{blok.pageintro}</p></div>
			</header>
		</Prose>

	)
}
