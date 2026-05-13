<script>
	import { page } from '$app/state';
	import FAQ from '$lib/components/FAQ.svelte';
	import ClinicianAvatars from '$lib/components/ClinicianAvatars.svelte';
	import team from '$lib/content/team.json';

	let { pageData, population } = $props();

	const BASE = 'https://planyourrecovery.com';

	const webPageSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		url: page.url.href,
		name: pageData.seo.title,
		description: pageData.seo.description,
		isPartOf: { '@id': `${BASE}/#website` }
	});

	const providerListSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: pageData.hero.headline,
		itemListElement: team
			.filter(p => p.isProvider && p.treatsPopulations?.includes(population))
			.sort((a, b) => a.order - b.order)
			.map((p, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: p.fullName,
				url: `${BASE}/team/${p.slug}`
			}))
	});

</script>

<svelte:head>
	<title>{pageData.seo.title}</title>
	<meta name="description" content={pageData.seo.description} />
	{@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(providerListSchema)}<\/script>`}
</svelte:head>

<div class="page" style="--accent: {pageData.color}">
	<section class="hero">
		<div class="container">
			<div class="hero-accent"></div>
			<h1>{pageData.hero.headline}</h1>
			<p class="intro">{pageData.hero.intro}</p>
			<ClinicianAvatars {population} inline={true} />
		</div>
	</section>

	<section class="concerns">
		<div class="container">
			<h2>{pageData.concerns.headline}</h2>
			<div class="concerns-grid">
				{#each pageData.concerns.items as item}
					<div class="concern-card">
						<div class="card-accent"></div>
						<div class="card-body">
							<h3>{item.title}</h3>
							<p>{item.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="approach">
		<div class="container">
			<h2>{pageData.approach.headline}</h2>
			<div class="approach-grid">
				{#each pageData.approach.items as item}
					<div class="approach-card">
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<FAQ items={pageData.faqs} heading="Common Questions" />
</div>

<style lang="scss">
	.page { width: 100%; }

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	section { padding: var(--space-large) 0; }

	.hero {
		padding: var(--space-xlarge) 0 var(--space-small);

		.hero-accent {
			height: 5px;
			width: 200px;
			border-radius: 3px;
			background: var(--accent);
			margin-bottom: var(--space-small);
		}

		h1 { margin-bottom: var(--space-tiny); }

		.intro {
			font-size: 1.125rem;
			line-height: 1.75;
			max-width: 720px;
			margin-bottom: var(--space-medium);
		}
	}

	.concerns {
		background: #f8f8f8;

		h2 { margin-bottom: var(--space-medium); }

		.concerns-grid {
			display: grid;
			gap: 1.25rem;

			@media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
		}

		.concern-card {
			background: white;
			border: 1px solid #e0e0e0;
			border-radius: 6px;
			overflow: hidden;
			display: flex;
			flex-direction: column;

			.card-accent {
				height: 4px;
				background: var(--accent);
				flex-shrink: 0;
			}

			.card-body {
				padding: var(--space-small);
				h3 { font-size: 1.05rem; margin-bottom: 0.5rem; }
				p { font-size: 0.95rem; line-height: 1.7; margin: 0; color: #555; }
			}
		}
	}

	.approach {
		h2 { margin-bottom: var(--space-medium); }

		.approach-grid {
			display: grid;
			gap: 1.25rem;

			@media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
		}

		.approach-card {
			padding: var(--space-small);
			border-radius: 6px;
			border: 1px solid #e0e0e0;
			background: white;
			transition: border-color 0.2s, box-shadow 0.2s;

			&:hover {
				border-color: var(--accent);
				box-shadow: 0 4px 16px color-mix(in srgb, var(--accent) 25%, transparent);
			}

			h3 { font-size: 1.05rem; margin-bottom: 0.5rem; }
			p { font-size: 0.95rem; line-height: 1.7; margin: 0; color: #555; }
		}
	}
</style>
