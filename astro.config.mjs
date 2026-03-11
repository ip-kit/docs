// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.ipkit.ai',
	integrations: [
		starlight({
			lastUpdated: true,
			title: 'IPKit',
			logo: {
				src: './public/favicon.svg',
				alt: 'IPKit',
			},
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: 'https://docs.ipkit.ai/og-image.png' },
				},
				{
					tag: 'meta',
					attrs: { property: 'og:url', content: 'https://docs.ipkit.ai' },
				},
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'For Founders', slug: 'getting-started/founders' },
						{ label: 'For IP Attorneys', slug: 'getting-started/attorneys' },
						{ label: 'For Platform Integrators', slug: 'getting-started/integrators' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Trademark Search', slug: 'guides/trademark-search' },
						{ label: 'Trademark Clearance', slug: 'guides/trademark-clearance' },
						{ label: 'Design Search', slug: 'guides/design-search' },
						{ label: 'Patent Search', slug: 'guides/patent-search' },
						{ label: 'Monitoring & Webhooks', slug: 'guides/monitoring' },
						{ label: 'Filing Readiness', slug: 'guides/filing-readiness' },
						{ label: 'Distinctiveness Analysis', slug: 'guides/distinctiveness' },
					],
				},
				{
					label: 'Tool Reference',
					collapsed: true,
					items: [
						{
							label: 'Trademark Tools',
							autogenerate: { directory: 'reference/tools/trademark' },
						},
						{
							label: 'Nice Classification',
							autogenerate: { directory: 'reference/tools/nice-classification' },
						},
						{
							label: 'Goods & Services',
							autogenerate: { directory: 'reference/tools/goods-services' },
						},
						{
							label: 'Design Tools',
							autogenerate: { directory: 'reference/tools/design' },
						},
						{
							label: 'Patent Tools',
							autogenerate: { directory: 'reference/tools/patent' },
						},
						{
							label: 'Person & Portfolio',
							autogenerate: { directory: 'reference/tools/person' },
						},
						{
							label: 'Monitoring & Webhooks',
							autogenerate: { directory: 'reference/tools/monitoring' },
						},
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Providers', slug: 'reference/providers' },
						{ label: 'Error Codes', slug: 'reference/error-codes' },
					],
				},
				],
		}),
	],
});
