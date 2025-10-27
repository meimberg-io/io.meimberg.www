import { BlockTypes, storyblokEditable } from '@storyblok/react/rsc'
import { RichtextStoryblok } from '@/types/component-types-sb'
import { richTextResolver } from '@storyblok/richtext'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { Prose } from '@/components/util/Prose.tsx'
import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import rehypePrism from '@mapbox/rehype-prism'



export default function Richtext({ blok }: { blok: RichtextStoryblok }) {

	const escapeHtml = (str: string) => {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	};

	const rawHtml = richTextResolver({
		resolvers: {
			[BlockTypes.CODE_BLOCK]: (node) => {
				const language = node.attrs?.class?.replace("language-", "") || "plaintext";
				const codeContent = node.content?.map((child) => child.text).join("\n") || "";

				return `<pre class="language-${language}"><code class="language-${language}">${escapeHtml(
					codeContent
				)}</code></pre>`;
			},
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
			<div className="max-w-2xl" {...storyblokEditable(blok)}>
				<Prose>
					<div className="space-y-7 text-base " dangerouslySetInnerHTML={{ __html: highlightedHtml }}></div>
				</Prose>
			</div>
		</ElementWrapper>
	)
}
