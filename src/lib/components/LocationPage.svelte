<script lang="ts">
	import { page } from '$app/state';
	import FAQ from '$lib/components/FAQ.svelte';
	import site from '$lib/content/site.json';

	let { pageData, suburb, service } = $props();

	let isPsychiatry = $derived(service === 'psychiatry');
	let serviceLabel = $derived(isPsychiatry ? 'Psychiatry' : 'Therapy');
	let phone = $derived(isPsychiatry ? site.contact.psychiatryPhone : site.contact.counselingPhone);
	let orgEntity = $derived(isPsychiatry ? site.org.psychiatry : site.org.counseling);
	let accent = $derived(isPsychiatry ? 'var(--c-purple)' : 'var(--c-blue)');

	let orgSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'MedicalOrganization',
		name: orgEntity.name,
		telephone: phone,
		medicalSpecialty: orgEntity.medicalSpecialty,
		address: {
			'@type': 'PostalAddress',
			streetAddress: site.address.streetAddress,
			addressLocality: site.address.addressLocality,
			addressRegion: site.address.addressRegion,
			postalCode: site.address.postalCode,
			addressCountry: site.address.addressCountry
		},
		areaServed: {
			'@type': 'City',
			name: suburb.name,
			containedInPlace: { '@type': 'State', name: 'Missouri' }
		}
	});

	const breadcrumbSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://planyourrecovery.com/' },
			{
				'@type': 'ListItem',
				position: 2,
				name: serviceLabel,
				item: `https://planyourrecovery.com/${service}`
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: suburb.name,
				item: page.url.href
			}
		]
	});

	const webPageSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'MedicalWebPage',
		url: page.url.href,
		name: pageData.seo.title,
		description: pageData.seo.description,
		isPartOf: { '@id': 'https://planyourrecovery.com/#website' },
		specialty: 'https://schema.org/MentalHealth',
		about: { '@type': 'City', name: suburb.name }
	});
</script>

<svelte:head>
	<title>{pageData.seo.title}</title>
	<meta name="description" content={pageData.seo.description} />
	{@html `<script type="application/ld+json">${JSON.stringify(orgSchema)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}<\/script>`}
</svelte:head>

<div class="page" style="--accent: {accent}">
	<section class="hero">
		<div class="container">
			<div class="hero-accent"></div>
			<p class="breadcrumb">
				<a href="/{service}">{serviceLabel}</a> / {suburb.name}
			</p>
			<h1>{pageData.hero.headline}</h1>
			<p class="intro">{pageData.hero.intro}</p>
		</div>
	</section>

	<section class="why-locals">
		<div class="container">
			<h2>{pageData.whyLocals.heading}</h2>
			<p>{pageData.whyLocals.paragraph}</p>
		</div>
	</section>

	{#if pageData.localStat}
		<section class="stat">
			<div class="container">
				<div class="stat-box">
					<p class="stat-value">{pageData.localStat.value}</p>
					<p class="stat-measure">{pageData.localStat.measure}</p>
					<p class="stat-source">
						Source: {pageData.localStat.source}, {pageData.localStat.year} &mdash; {pageData.localStat.note}
					</p>
				</div>
			</div>
		</section>
	{/if}

	<section class="treatment">
		<div class="container">
			<h2>Services for {suburb.name} Clients</h2>
			<p>{pageData.treatmentSection.intro}</p>
			<div class="services-grid">
				{#each pageData.services as item}
					<a href={item.link} class="service-card">
						<div class="card-accent"></div>
						<div class="card-body">
							<h3>{item.name}</h3>
							<p>{item.description}</p>
							<span class="learn-more">Learn more &rarr;</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<FAQ items={pageData.localFaqs} heading="Common Questions from {suburb.name} Clients" />

	<section class="cta">
		<div class="container">
			<h2>Get Started from {suburb.name}</h2>
			<p>Our office is {suburb.driveTime} from {suburb.name}. Call or text to schedule &mdash; no referral required.</p>
			<a href="tel:{phone}" class="cta-button">{phone}</a>
		</div>
	</section>
</div>

<style lang="scss">
	.page {
		width: 100%;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	section {
		padding: var(--space-large) 0;
	}

	.hero {
		padding: var(--space-xlarge) 0 var(--space-small);

		.hero-accent {
			height: 5px;
			width: 200px;
			border-radius: 3px;
			background: var(--accent);
			margin-bottom: var(--space-small);
		}

		.breadcrumb {
			font-size: 0.875rem;
			color: var(--c-text-muted);
			margin-bottom: var(--space-tiny);

			a {
				color: var(--c-text-muted);
			}
		}

		h1 {
			margin-bottom: var(--space-tiny);
		}

		.intro {
			font-size: 1.15rem;
			max-width: 720px;
			line-height: 1.7;
		}
	}

	.why-locals {
		.container {
			max-width: 760px;
		}

		p {
			line-height: 1.8;
			margin-top: var(--space-tiny);
		}
	}

	.stat {
		padding-top: 0;
		padding-bottom: var(--space-small);

		.stat-box {
			background-color: color-mix(in srgb, var(--accent) 12%, white);
			border-left: 4px solid var(--accent);
			border-radius: 6px;
			padding: var(--space-small);
			max-width: 760px;
		}

		.stat-value {
			font-size: 2rem;
			font-weight: 700;
			font-family: orpheuspro, serif;
			color: var(--c-dark);
			margin: 0 0 0.25rem;
		}

		.stat-measure {
			margin: 0 0 0.5rem;
			line-height: 1.6;
		}

		.stat-source {
			margin: 0;
			font-size: 0.85rem;
			color: var(--c-text-muted);
			font-style: italic;
		}
	}

	.treatment {
		background-color: #f8f8f8;

		h2 {
			margin-bottom: var(--space-tiny);
		}

		.services-grid {
			display: grid;
			gap: var(--space-small);
			margin-top: var(--space-small);

			@media (min-width: 640px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.service-card {
			background: white;
			border-radius: 6px;
			border: 1px solid #e0e0e0;
			overflow: hidden;
			display: flex;
			flex-direction: column;
			text-decoration: none;
			color: inherit;
			box-shadow: none;
			transition: box-shadow 0.15s ease;

			&:hover {
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			}

			.card-accent {
				height: 4px;
				background: var(--accent);
				flex-shrink: 0;
			}

			.card-body {
				padding: var(--space-tiny);

				h3 {
					margin-bottom: 0.5rem;
					font-size: 1.05rem;
					color: var(--c-dark);
				}

				p {
					font-size: 0.95rem;
					line-height: 1.6;
					margin: 0 0 0.5rem;
					color: var(--c-dark);
				}

				.learn-more {
					font-size: 0.875rem;
					font-weight: 600;
					color: color-mix(in srgb, var(--accent) 60%, black);
				}
			}
		}
	}

	.cta {
		text-align: center;

		.container {
			max-width: 600px;
		}

		p {
			line-height: 1.7;
			margin-bottom: var(--space-small);
		}

		.cta-button {
			display: inline-block;
			background: var(--accent);
			color: var(--c-dark);
			font-weight: 700;
			padding: 0.9rem 2rem;
			border-radius: 6px;
			text-decoration: none;
			box-shadow: none;
			font-size: 1.1rem;
		}
	}
</style>
