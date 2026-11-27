import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import * as demos from './demos'

export const getMDXComponents = (components?: MDXComponents) =>
	({
		...defaultMdxComponents,
		Tab,
		Tabs,
		TypeTable,
		...demos,
		...components,
	}) satisfies MDXComponents

export const useMDXComponents = getMDXComponents

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
