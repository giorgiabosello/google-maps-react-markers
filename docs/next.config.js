/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'img.shields.io',
				// port: '',
				// pathname: '',
			},
		],
	},
	/**
	 * Enable static exports for the App Router.
	 *
	 * @see https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
	 */
	output: process.env.NODE_ENV === 'development' ? 'standalone' : 'export',
	/**
	 * Set base path. This is usually the slug of your repository.
	 *
	 * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
	 */
	basePath: process.env.NODE_ENV === 'development' ? '' : '/google-maps-react-markers',
	/**
	 * Disable server-based image optimization. Next.js does not support
	 * dynamic features with static exports.
	 *
	 * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
	 */
	images: {
		unoptimized: true,
	},
}

module.exports = nextConfig
