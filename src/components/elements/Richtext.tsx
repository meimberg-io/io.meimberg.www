import { BlockTypes, storyblokEditable } from '@storyblok/react/rsc'
import { RichtextStoryblok } from '@/types/component-types-sb'
import { richTextResolver } from '@storyblok/richtext'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { Prose } from '@/components/util/Prose.tsx'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypePrism from 'rehype-prism-plus'
import styles from './Richtext.module.css'



export default function Richtext({ blok }: { blok: RichtextStoryblok }) {

	const escapeHtml = (str: string) => {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	};

	const tableCellResolver = (tag: string) => (node: any, context: any) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { colspan, rowspan, colwidth, backgroundColor, textAlign, ...rest } = node.attrs || {}
		const styles: string[] = []
		if (backgroundColor) styles.push(`background-color: ${backgroundColor}`)
		if (textAlign) styles.push(`text-align: ${textAlign}`)
		return context.render(tag, {
			...rest,
			...(colspan > 1 ? { colspan } : {}),
			...(rowspan > 1 ? { rowspan } : {}),
			...(styles.length > 0 ? { style: styles.join('; ') } : {}),
		}, node.children)
	}

	const rawHtml = richTextResolver({
		resolvers: {
			[BlockTypes.CODE_BLOCK]: (node) => {
				const language = node.attrs?.class?.replace("language-", "") || "plaintext";
				const codeContent = node.content?.map((child) => child.text).join("\n") || "";

				return `<pre class="language-${language}"><code class="language-${language}">${escapeHtml(
					codeContent
				)}</code></pre>`;
			},
			['table_row' as any]: (node: any, context: any) => context.render('tr', {}, node.children),
			['table_cell' as any]: tableCellResolver('td'),
			['table_header' as any]: tableCellResolver('th'),
		},
	}).render(blok.content) as string;

	const highlightedHtml = unified()
		.use(rehypeParse, { fragment: true })
		.use(rehypePrism)
		.use(rehypeStringify)
		.processSync(rawHtml)
		.toString();

	return (
		<ElementWrapper>
			<div className="max-w-3xl" {...storyblokEditable(blok)}>
				<Prose>
					<div className={`space-y-7 text-base ${styles.content}`} dangerouslySetInnerHTML={{ __html: highlightedHtml }}></div>
				</Prose>
			</div>
		</ElementWrapper>
	)
}
