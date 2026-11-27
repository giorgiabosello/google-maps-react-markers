import type { MetadataRoute } from 'next'
import { source } from '@/lib/source'

export const dynamic = 'force-static'

const site = 'https://giorgiabosello.github.io/google-maps-react-markers'

export default function sitemap(): MetadataRoute.Sitemap {
	return [{ url: `${site}/` }, ...source.getPages().map((page) => ({ url: `${site}${page.url}/` }))]
}
