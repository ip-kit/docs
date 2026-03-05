// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'IPKit',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/ip-kit/core' },
			],
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'For Founders', slug: 'getting-started/founders' },
						{ label: 'For IP Attorneys', slug: 'getting-started/attorneys' },
						{ label: 'For Developers', slug: 'getting-started/developers' },
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
						{ label: 'Configuration', slug: 'reference/configuration' },
						{ label: 'Error Codes', slug: 'reference/error-codes' },
						{ label: 'Schemas', slug: 'reference/schemas' },
					],
				},
				{
					label: 'Architecture',
					collapsed: true,
					items: [
						{ label: 'Overview', slug: 'architecture/overview' },
						{ label: 'Adding a Provider', slug: 'architecture/adding-a-provider' },
						{ label: 'Transport Layer', slug: 'architecture/transport' },
						{ label: 'Analytics & Observability', slug: 'architecture/analytics' },
					],
				},
			],
		}),
	],
});
