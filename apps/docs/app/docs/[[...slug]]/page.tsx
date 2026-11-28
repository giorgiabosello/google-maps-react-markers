import { DocsBody, DocsDescription, DocsPage, DocsTitle, EditOnGitHub } from 'fumadocs-ui/layouts/docs/page'
import { createRelativeLink } from 'fumadocs-ui/mdx'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import { gitConfig } from '@/lib/shared'
import { source } from '@/lib/source'

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
	const params = await props.params
	const page = source.getPage(params.slug)
	if (!page) notFound()

	const MDX = page.data.body

	return (
		<DocsPage
			toc={page.data.toc}
			full={page.data.full}
			// "On this page" becomes a navigation landmark named by its heading.
			tableOfContent={{ container: { role: 'navigation', 'aria-labelledby': 'toc-title' } }}
		>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
			</DocsBody>
			<EditOnGitHub
				href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/apps/docs/content/docs/${page.path}`}
			/>
		</DocsPage>
	)
}

export const generateStaticParams = () => source.generateParams()

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
	const params = await props.params
	const page = source.getPage(params.slug)
	if (!page) notFound()
	return { title: page.data.title, description: page.data.description }
}
