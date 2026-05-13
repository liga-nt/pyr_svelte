<script>
	import '$lib/styles/global.scss';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import site from '$lib/content/site.json';
	import { page } from '$app/state';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { getBreadcrumbs, toBreadcrumbSchema } from '$lib/breadcrumbs.js';

	let { children } = $props();

	let crumbs = $derived(getBreadcrumbs(page.url.pathname));
	let breadcrumbSchema = $derived(crumbs ? toBreadcrumbSchema(crumbs) : null);

	const schema = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': ['MedicalOrganization', 'LocalBusiness'],
				'@id': 'https://planyourrecovery.com/#organization',
				name: 'Plan Your Recovery',
				url: 'https://planyourrecovery.com',
				image: 'https://planyourrecovery.com/img/illustration/pyr-home.png',
				telephone: [site.org.counseling.telephone, site.org.psychiatry.telephone],
				email: site.org.counseling.email,
				description: site.org.counseling.description,
				medicalSpecialty: ['MentalHealth', 'Psychiatry'],
				priceRange: '$-$$',
				address: {
					'@type': 'PostalAddress',
					streetAddress: site.address.streetAddress,
					addressLocality: site.address.addressLocality,
					addressRegion: site.address.addressRegion,
					postalCode: site.address.postalCode,
					addressCountry: site.address.addressCountry
				},
				sameAs: [
					site.social.linkedinBusiness,
					site.social.facebook,
					site.social.x,
					site.social.youtube,
					site.social.googleBusiness
				],
				hasOfferCatalog: {
					'@type': 'OfferCatalog',
					itemListElement: site.org.psychiatry.acceptedInsurance.map((ins) => ({
						'@type': 'Offer',
						name: ins
					}))
				}
			},
			{
				'@type': 'WebSite',
				'@id': 'https://planyourrecovery.com/#website',
				url: 'https://planyourrecovery.com',
				name: 'Plan Your Recovery',
				publisher: { '@id': 'https://planyourrecovery.com/#organization' }
			}
		]
	};
</script>

<svelte:head>
	<link rel="canonical" href="{PUBLIC_SITE_URL}{page.url.pathname}" />
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-2736WEPL36"></script>
	{@html `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-2736WEPL36');<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`}
	{#if breadcrumbSchema}
		{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}<\/script>`}
	{/if}
</svelte:head>

<Navbar />

<main>
	{@render children?.()}
</main>

<Footer />
