import { loader } from 'fumadocs-core/source'
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema'
import { applyMdxPreset } from 'fumadocs-mdx/config'
import { defineDocs } from 'fumadocs-mdx/macro'
import { codeThemes } from './shared'
import { docsRoute } from './shared'

const docs = defineDocs({
	dir: 'content/docs',
	// High contrast themes: every token reaches 7:1 (WCAG AAA).
	docs: { schema: pageSchema, mdxOptions: applyMdxPreset({ rehypeCodeOptions: { themes: codeThemes } }) },
	meta: { schema: metaSchema },
})

export const source = loader({
	baseUrl: docsRoute,
	source: docs.toFumadocsSource(),
})
