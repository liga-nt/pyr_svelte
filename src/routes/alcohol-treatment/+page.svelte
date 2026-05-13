<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import pageData from '$lib/content/approaches/alcohol-treatment.json';

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'MedicalTherapy',
		name: 'Alcohol Use Disorder Treatment',
		alternateName: ['Alcohol Treatment', 'AUD Treatment', 'Naltrexone Treatment'],
		description: pageData.seo.description,
		recognizingAuthority: {
			'@type': 'Organization',
			name: 'Substance Abuse and Mental Health Services Administration'
		},
		relevantSpecialty: ['Psychiatry', 'MentalHealth'],
		availableAtOrFrom: {
			'@type': 'MedicalClinic',
			name: 'Plan Your Recovery',
			address: {
				'@type': 'PostalAddress',
				streetAddress: '9904 Clayton Road, Suite 135',
				addressLocality: 'Saint Louis',
				addressRegion: 'MO',
				postalCode: '63124'
			}
		}
	};
</script>

<svelte:head>
	<title>{pageData.seo.title}</title>
	<meta name="description" content={pageData.seo.description} />
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`}
</svelte:head>

<div class="page">
	<section class="hero">
		<div class="container">
			<h1>{pageData.hero.headline}</h1>
			<p class="intro">{pageData.hero.intro}</p>
		</div>
	</section>


	<section class="why">
		<div class="container">
			<h2>{pageData.why.heading}</h2>
			{#each pageData.why.paragraphs as p}
				<p>{p}</p>
			{/each}
		</div>
	</section>

	<section class="what-we-offer">
		<div class="container">
			<h2>{pageData.whatWeOffer.heading}</h2>
			<div class="offer-grid">
				{#each pageData.whatWeOffer.items as item}
					<div class="offer-card">
						<h3>{item.label}</h3>
						<p>{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>


	<section class="providers">
		<div class="container">
			<h2>{pageData.providers.heading}</h2>
			<p class="providers-intro">{pageData.providers.intro}</p>
			<div class="providers-grid">
				{#each pageData.providers.items as provider}
					<a href="/team/{provider.slug}" class="provider-card">
						<strong>{provider.name}</strong>
						<span class="credentials">{provider.credentials}</span>
						<span class="note">{provider.note}</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<FAQ items={pageData.faqs} heading="Questions About Alcohol Treatment" />

	<section class="related">
		<div class="container">
			<h2>Related</h2>
			<div class="related-links">
				{#each pageData.related as link}
					<a href={link.href}>{link.label}</a>
				{/each}
			</div>
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
		padding: var(--space-xlarge) 0 var(--space-large);

		h1 {
			margin-bottom: var(--space-tiny);
		}

		.intro {
			font-size: 1.15rem;
			max-width: 720px;
			line-height: 1.7;
		}
	}

	.why {
		.container {
			max-width: 760px;
		}

		p {
			line-height: 1.8;
			margin-bottom: var(--space-tiny);
		}
	}

	.what-we-offer {
		background-color: #f8f8f8;

		.offer-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
			gap: var(--space-small);
			margin-top: var(--space-small);
		}

		.offer-card {
			background: white;
			padding: var(--space-small);
			border-radius: 6px;
			border: 1px solid #e0e0e0;

			h3 {
				font-size: 1.05rem;
				margin-bottom: 0.5rem;
			}

			p {
				font-size: 0.95rem;
				line-height: 1.6;
				margin: 0;
			}
		}
	}

	.providers {
		.providers-intro {
			max-width: 640px;
			line-height: 1.7;
			margin-bottom: var(--space-small);
		}

		.providers-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
			gap: var(--space-small);
			max-width: 560px;
		}

		.provider-card {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			background: white;
			border: 1px solid #e0e0e0;
			border-radius: 6px;
			padding: var(--space-small);
			text-decoration: none;
			color: inherit;
			transition: border-color 0.2s;

			&:hover {
				border-color: var(--c-green);
			}

			strong {
				font-size: 1.05rem;
			}

			.credentials {
				font-size: 0.875rem;
				color: #555;
			}

			.note {
				font-size: 0.875rem;
				color: var(--c-green);
			}
		}
	}

	.related {
		background: #f8f8f8;

		.related-links {
			display: flex;
			flex-wrap: wrap;
			gap: 0.75rem;
			margin-top: var(--space-small);

			a {
				background: white;
				border: 1px solid var(--c-gray);
				padding: 0.4rem 1rem;
				border-radius: 6px;
				font-size: 0.95rem;
				transition: border-color 0.2s, color 0.2s;

				&:hover {
					border-color: var(--c-green);
					color: var(--c-green);
					box-shadow: none;
				}
			}
		}
	}

	.cta {
		background-color: var(--c-green);
		color: white;
		text-align: center;

		h2 {
			margin-bottom: var(--space-tiny);
		}

		p {
			margin-bottom: var(--space-small);
			opacity: 0.9;
			max-width: 600px;
			margin-left: auto;
			margin-right: auto;
		}

		.cta-actions {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
		}

		.contact-info {
			font-size: 1.1rem;

			a {
				color: white;
				box-shadow: 0 1px 0 0 white;
			}
		}
	}

	@media (min-width: 768px) {
		.cta .cta-actions {
			flex-direction: row;
			justify-content: center;
		}
	}
</style>
