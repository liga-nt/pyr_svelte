<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import ClinicianCard from '$lib/components/ClinicianCard.svelte';
	import team from '$lib/content/team.json';
	import data from '$lib/content/psychiatry.json';
	import allConditions from '$lib/content/conditions.json';
	import site from '$lib/content/site.json';

	const psychiatryConditionSlugs = new Set(data.conditions.map(c => c.slug));
	const psychiatryConditions = allConditions.filter(c => psychiatryConditionSlugs.has(c.slug));

	const nps = team.filter(p => p.isProvider && p.isPsychiatry).sort((a, b) => a.order - b.order);

	const BASE = 'https://planyourrecovery.com';

	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		url: `${BASE}/psychiatry`,
		name: data.seo.title,
		description: data.seo.description,
		isPartOf: { '@id': `${BASE}/#website` },
		about: { '@id': `${BASE}/#organization` }
	};

	const psychiatristListSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Our Psychiatric Providers',
		itemListElement: nps.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: p.fullName,
			url: `${BASE}/team/${p.slug}`
		}))
	};
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
	{@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(psychiatristListSchema)}<\/script>`}
</svelte:head>

<div class="page">

	<section class="page-hero">
		<div class="container">
			<h1>{data.hero.headline}</h1>
		</div>
	</section>

	<!-- NP Cards -->
	<section class="providers">
		<div class="container">
			<div class="team-grid">
				{#each nps as person}
					<ClinicianCard {person} />
				{/each}
			</div>
		</div>
	</section>

	<!-- Approaches -->
	<section class="approaches">
		<div class="container">
			<h2>What We Offer</h2>
			<div class="approaches-grid">
				{#each data.approaches as approach}
					<div class="approach-card">
						<h3>{approach.title}</h3>
						<p class="approach-desc">{approach.description}</p>
						{#if approach.detail}
							<p class="detail">{approach.detail}</p>
						{/if}
						{#if approach.link}
							<a href={approach.link} class="read-more">Continue reading →</a>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Conditions -->
	<section class="conditions">
		<div class="container">
			<h2>Conditions We Treat</h2>
			<div class="conditions-grid">
				{#each allConditions as condition}
					<a href="/{condition.slug}" class="condition-card">
						<div class="card-accent" style="background-color: {condition.color}"></div>
						<div class="card-body-condition">
							<h3>{condition.name}</h3>
							<p>{condition.description}</p>
							<span class="learn-more">Learn more →</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Insurance -->
	<section class="insurance">
		<div class="container">
			<h2>{data.insurance.heading}</h2>
			<p>{data.insurance.body}</p>
		</div>
	</section>

	<!-- FAQs -->
	<FAQ items={data.faqs} />


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
		padding: var(--space-xlarge) 0;
	}

	.page-hero {
		padding: var(--space-large) 0 0;
		h1 { margin: 0; }
	}

	/* NP Cards */
	.providers {
		padding: var(--space-large) 0;
	}

	.team-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-medium);

		@media screen and (min-width: 900px) {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Conditions */
	.conditions {
		padding: var(--space-xlarge) 0;
		background: #f8f8f8;

		h2 { margin-bottom: var(--space-large); }

		.conditions-grid {
			display: grid;
			gap: 1.25rem;

			@media (min-width: 600px) { grid-template-columns: repeat(2, 1fr); }
			@media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); }
		}

		.condition-card {
			display: flex;
			flex-direction: column;
			border: 1px solid #e0e0e0;
			border-radius: 6px;
			overflow: hidden;
			text-decoration: none;
			background: white;
			transition: transform 0.2s, box-shadow 0.2s;

			&:hover {
				transform: translateY(-3px);
				box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
			}

			.card-accent { height: 6px; }

			.card-body-condition {
				padding: var(--space-tiny);
				flex: 1;
				display: flex;
				flex-direction: column;

				h3 { font-size: 1.2rem; margin-bottom: 0.4rem; color: var(--c-dark); }
				p { font-size: 0.9rem; line-height: 1.5; color: #666; flex: 1; margin-bottom: 0.75rem; }
				.learn-more { font-size: 0.875rem; color: var(--c-green); font-weight: 500; }
			}
		}
	}

	/* Approaches */
	.approaches {
		h2 {
			margin-bottom: var(--space-large);
		}

		.approaches-grid {
			display: grid;
			gap: var(--space-medium);

			@media (min-width: 640px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		.approach-card {
			background: #fff;
			border: 1px solid var(--c-gray);
			border-radius: var(--border-radius);
			padding: var(--space-medium);
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			transition: border-color 0.2s, box-shadow 0.2s;

			&:hover {
				border-color: var(--c-purple);
				box-shadow: 0 4px 16px rgba(211, 176, 254, 0.2);
			}

			h3 {
				font-size: 1.125rem;
				margin: 0;
				color: var(--c-dark);
			}

			.approach-desc {
				font-size: 0.975rem;
				line-height: 1.65;
				margin: 0;
				color: #555;
				flex: 1;
			}

			.detail {
				font-weight: 600;
				color: var(--c-dark);
				font-size: 0.9rem;
				margin: 0;
			}

			.read-more {
				font-size: 0.9rem;
				font-weight: 600;
				color: var(--c-purple);
				text-decoration: none;
				align-self: flex-start;

				&:hover { text-decoration: underline; box-shadow: none; }
			}
		}
	}

	/* Insurance */
	.insurance {
		background-color: #f8f8f8;

		h2 {
			margin-bottom: var(--space-small);
		}

		p {
			max-width: 680px;
			font-size: 1rem;
			line-height: 1.7;
		}
	}


</style>
