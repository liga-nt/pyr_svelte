<script lang="ts">
	import { page } from '$app/state';
	import FAQ from '$lib/components/FAQ.svelte';

	let { pageData, criteriaExtra = undefined } = $props();

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'MedicalCondition',
		name: pageData.condition.name,
		alternateName: pageData.condition.alternateName ?? [],
		description: pageData.condition.schemaDescription,
		possibleTreatment: pageData.treatments.map((t: { name: string }) => ({
			'@type': 'MedicalTherapy',
			name: t.name
		}))
	};

	const webPageSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'MedicalWebPage',
		url: page.url.href,
		name: pageData.seo.title,
		description: pageData.seo.description,
		isPartOf: { '@id': 'https://planyourrecovery.com/#website' },
		specialty: 'https://schema.org/MentalHealth',
		about: { '@type': 'MedicalCondition', name: pageData.condition.name }
	});

</script>

<svelte:head>
	<title>{pageData.seo.title}</title>
	<meta name="description" content={pageData.seo.description} />
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}<\/script>`}
</svelte:head>

<div class="page" style="--accent: {pageData.color}">
	<section class="hero">
		<div class="container">
			<div class="hero-accent"></div>
			<h1>{pageData.hero.headline}</h1>
			<p class="intro">{pageData.hero.intro}</p>
		</div>
	</section>

	<section class="criteria">
		<div class="container">
			<div class="criteria-box">
				<h2>{pageData.criteria.heading}</h2>
				<p>{pageData.criteria.description}</p>
				<ul class="criteria-list">
					{#each pageData.criteria.items as item}
						<li><strong>{item.label}:</strong> {item.description}</li>
					{/each}
				</ul>
				{#if pageData.criteria.note}
					<p class="criteria-note">{pageData.criteria.note}</p>
				{/if}
				{@render criteriaExtra?.()}
			</div>
		</div>
	</section>

	<section class="how-it-feels">
		<div class="container">
			<h2>{pageData.howItFeels.heading}</h2>
			{#each pageData.howItFeels.paragraphs as p}
				<p>{p}</p>
			{/each}
		</div>
	</section>

	<section class="treatment">
		<div class="container">
			<h2>{pageData.treatmentSection.heading}</h2>
			<p>{pageData.treatmentSection.intro}</p>
			<div class="treatments-grid">
				{#each pageData.treatments as treatment}
					<div class="treatment-card">
						<div class="card-accent"></div>
						<div class="card-body">
							<h3>{treatment.name}</h3>
							<p>{treatment.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<FAQ items={pageData.faqs} heading="Common Questions" />

	{#if pageData.resources?.length}
		<section class="resources">
			<div class="container">
				<h2>Other Resources</h2>
				<div class="resources-grid">
					{#each pageData.resources as resource}
						<a
							href={resource.url}
							target="_blank"
							rel="noopener noreferrer"
							class="resource-card"
						>
							<div class="resource-header">
								<span class="resource-name">{resource.name}</span>
								{#if resource.type === 'mutual-support'}
									<span class="resource-badge peer">Peer Support</span>
								{:else if resource.type === 'family-support'}
									<span class="resource-badge family">Family Support</span>
								{:else if resource.type === 'crisis'}
									<span class="resource-badge crisis">Crisis Line</span>
								{/if}
							</div>
							<p class="resource-description">{resource.description}</p>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
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

		h1 {
			margin-bottom: var(--space-tiny);
		}

		.intro {
			font-size: 1.15rem;
			max-width: 720px;
			line-height: 1.7;
		}
	}

	.criteria {
		.criteria-box {
			background-color: color-mix(in srgb, var(--accent) 15%, white);
			border-left: 4px solid var(--accent);
			border-radius: 6px;
			padding: var(--space-small);
		}

		.criteria-list {
			margin: var(--space-tiny) 0;
			padding-left: 1.5rem;

			li {
				margin-bottom: 0.75rem;
				line-height: 1.6;
			}
		}

		.criteria-note {
			font-style: italic;
			color: #666;
			font-size: 0.925rem;
		}
	}

	.how-it-feels {
		.container {
			max-width: 760px;
		}

		p {
			line-height: 1.8;
			margin-bottom: var(--space-tiny);
		}
	}

	.treatment {
		background-color: #f8f8f8;

		h2 {
			margin-bottom: var(--space-tiny);
		}

		.treatments-grid {
			display: grid;
			gap: var(--space-small);
			margin-top: var(--space-small);

			@media (min-width: 640px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.treatment-card {
			background: white;
			border-radius: 6px;
			border: 1px solid #e0e0e0;
			overflow: hidden;
			display: flex;
			flex-direction: column;

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
				}

				p {
					font-size: 0.95rem;
					line-height: 1.6;
					margin: 0;
				}
			}
		}
	}

	.resources {
		.resources-grid {
			display: grid;
			gap: var(--space-small);
			margin-top: var(--space-small);

			@media (min-width: 640px) {
				grid-template-columns: repeat(2, 1fr);
			}

			@media (min-width: 960px) {
				grid-template-columns: repeat(3, 1fr);
			}
		}

		.resource-card {
			display: block;
			background: white;
			border: 1px solid #e0e0e0;
			border-top: 3px solid var(--accent);
			border-radius: 6px;
			padding: var(--space-tiny);
			text-decoration: none;
			color: inherit;
			transition: box-shadow 0.15s ease;

			&:hover {
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			}
		}

		.resource-header {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			margin-bottom: 0.4rem;
			flex-wrap: wrap;
		}

		.resource-name {
			font-weight: 600;
			font-size: 0.975rem;
		}

		.resource-badge {
			font-size: 0.7rem;
			font-weight: 600;
			letter-spacing: 0.03em;
			text-transform: uppercase;
			padding: 0.15rem 0.45rem;
			border-radius: 3px;
			white-space: nowrap;

			&.peer {
				background: color-mix(in srgb, var(--accent) 20%, white);
				color: color-mix(in srgb, var(--accent) 70%, #333);
			}

			&.family {
				background: #fff3e0;
				color: #b45309;
			}

			&.crisis {
				background: #fde8e8;
				color: #b91c1c;
			}
		}

		.resource-description {
			font-size: 0.875rem;
			line-height: 1.55;
			color: #555;
			margin: 0;
		}
	}
</style>
