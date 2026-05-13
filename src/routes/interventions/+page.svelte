<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import ClinicianAvatars from '$lib/components/ClinicianAvatars.svelte';
	import pageData from '$lib/content/interventions.json';

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'MedicalTherapy',
		name: 'Addiction Intervention Services',
		description: pageData.seo.description,
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
			<ClinicianAvatars population="interventions" inline={true} />
		</div>
	</section>

	<section class="philosophy">
		<div class="container">
			<div class="philosophy-box">
				<h2>{pageData.philosophy.heading}</h2>
				{#each pageData.philosophy.paragraphs as p}
					<p>{p}</p>
				{/each}
			</div>
		</div>
	</section>

	<section class="what-we-offer">
		<div class="container">
			<h2>{pageData.whatWeOffer.heading}</h2>
			<div class="offer-grid">
				{#each pageData.whatWeOffer.items as item}
					<div class="offer-card">
						<div class="card-accent"></div>
						<div class="card-body">
							<h3>{item.label}</h3>
							<p>{item.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="what-to-expect">
		<div class="container">
			<h2>{pageData.whatToExpect.heading}</h2>
			{#each pageData.whatToExpect.paragraphs as p}
				<p>{p}</p>
			{/each}
		</div>
	</section>

	<FAQ items={pageData.faqs} heading="Questions About Intervention" />

</div>

<style lang="scss">
	.page { width: 100%; }

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	section {
		padding: var(--space-large) 0;
	}

	.hero {
		padding: var(--space-large) 0 var(--space-small);

		h1 { margin-bottom: var(--space-tiny); }

		.intro {
			font-size: 1.15rem;
			line-height: 1.7;
			max-width: 720px;
			margin-bottom: var(--space-small);
		}
	}

	.philosophy {
		padding: var(--space-large) 0;

		.philosophy-box {
			background-color: color-mix(in srgb, var(--c-green) 15%, white);
			border-left: 4px solid var(--c-green);
			border-radius: 6px;
			padding: var(--space-small);

			h2 { margin-bottom: var(--space-small); }

			p {
				line-height: 1.8;
				margin-bottom: var(--space-tiny);
				color: #444;

				&:last-child { margin-bottom: 0; }
			}
		}
	}

	.what-we-offer {
		padding: var(--space-large) 0;

		h2 { margin-bottom: var(--space-small); }

		.offer-grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1.25rem;

			@media (min-width: 600px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.offer-card {
			display: flex;
			flex-direction: column;
			border: 1px solid #e0e0e0;
			border-radius: 6px;
			overflow: hidden;
			transition: transform 0.2s, box-shadow 0.2s;

			&:hover {
				transform: translateY(-3px);
				box-shadow: 0 6px 20px rgba(0,0,0,0.1);
			}

			&:nth-child(1) .card-accent { background: var(--c-green); }
			&:nth-child(2) .card-accent { background: var(--c-purple); }
			&:nth-child(3) .card-accent { background: var(--c-blue); }
			&:nth-child(4) .card-accent { background: var(--c-yellow); }

			.card-accent {
				height: 6px;
				flex-shrink: 0;
			}

			.card-body {
				padding: var(--space-tiny);
				flex: 1;
				display: flex;
				flex-direction: column;

				h3 {
					font-size: 1.2rem;
					margin-bottom: 0.4rem;
					color: var(--c-dark);
				}

				p {
					font-size: 0.9rem;
					line-height: 1.5;
					color: #666;
					margin: 0;
				}
			}
		}
	}

	.what-to-expect {
		background: #f8f8f8;
		padding: var(--space-large) 0;

		h2 { margin-bottom: var(--space-small); }

		p {
			max-width: 720px;
			line-height: 1.8;
			margin-bottom: var(--space-tiny);
			color: #444;
		}
	}

</style>
