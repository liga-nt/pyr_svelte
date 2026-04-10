<script>
	import '$lib/styles/global.scss';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import site from '$lib/content/site.json';

	let { children } = $props();

	const schema = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': ['MedicalOrganization', 'LocalBusiness'],
				'@id': 'https://www.planyourrecovery.com/#counseling',
				name: site.org.counseling.name,
				url: site.org.counseling.url,
				telephone: site.org.counseling.telephone,
				email: site.org.counseling.email,
				description: site.org.counseling.description,
				medicalSpecialty: 'MentalHealth',
				priceRange: '$-$$',
				address: {
					'@type': 'PostalAddress',
					streetAddress: site.address.streetAddress,
					addressLocality: site.address.addressLocality,
					addressRegion: site.address.addressRegion,
					postalCode: site.address.postalCode,
					addressCountry: site.address.addressCountry
				},
				sameAs: ['https://www.planyourrecovery.com']
			},
			{
				'@type': ['MedicalOrganization', 'LocalBusiness'],
				'@id': 'https://www.planyourrecovery.com/#psychiatry',
				name: site.org.psychiatry.name,
				url: site.org.psychiatry.url,
				telephone: site.org.psychiatry.telephone,
				description: site.org.psychiatry.description,
				medicalSpecialty: 'Psychiatry',
				priceRange: '$-$$',
				address: {
					'@type': 'PostalAddress',
					streetAddress: site.address.streetAddress,
					addressLocality: site.address.addressLocality,
					addressRegion: site.address.addressRegion,
					postalCode: site.address.postalCode,
					addressCountry: site.address.addressCountry
				},
				acceptedOffer: site.org.psychiatry.acceptedInsurance.map((ins) => ({
					'@type': 'Offer',
					name: ins
				}))
			},
			{
				'@type': 'WebSite',
				'@id': 'https://www.planyourrecovery.com/#website',
				url: 'https://www.planyourrecovery.com',
				name: 'Plan Your Recovery',
				publisher: { '@id': 'https://www.planyourrecovery.com/#counseling' }
			}
		]
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<Navbar />

<main>
	{@render children?.()}
</main>

<Footer />
