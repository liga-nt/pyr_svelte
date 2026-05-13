<script>
	import { page } from '$app/state';
	import FAQ from '$lib/components/FAQ.svelte';

	let { pageData } = $props();

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'MedicalTherapy',
		name: pageData.hero.headline,
		description: pageData.seo.description
	};

	const webPageSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'MedicalWebPage',
		url: page.url.href,
		name: pageData.seo.title,
		description: pageData.seo.description,
		isPartOf: { '@id': 'https://planyourrecovery.com/#website' },
		specialty: 'https://schema.org/MentalHealth'
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

	{#each pageData.body as section, i}
		<section class="body-section" class:alt={i % 2 === 1}>
			<div class="container">
				{#if i === 0}
					<div class="accent-box">
						<h2>{section.heading}</h2>
						{#if section.paragraphs}
							{#each section.paragraphs as p}
								<p>{p}</p>
							{/each}
						{:else if section.items}
							<ul>
								{#each section.items as item}
									<li>{item}</li>
								{/each}
							</ul>
						{/if}
					</div>
				{:else}
					<h2>{section.heading}</h2>
					{#if section.paragraphs}
						{#each section.paragraphs as p}
							<p>{p}</p>
						{/each}
					{:else if section.items}
						<ul>
							{#each section.items as item}
								<li>{item}</li>
							{/each}
						</ul>
					{/if}
				{/if}
			</div>
		</section>
	{/each}

	<section class="what-to-expect">
		<div class="container">
			<h2>{pageData.whatToExpect.heading}</h2>
			<div class="expect-grid">
				{#each pageData.whatToExpect.items as item}
					<div class="expect-card">
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
			font-size: 1.15rem;
			max-width: 720px;
			line-height: 1.7;
		}
	}

	.body-section {
		h2 { margin-bottom: var(--space-small); }

		p {
			max-width: 720px;
			line-height: 1.8;
			margin-bottom: var(--space-tiny);
			color: #444;
			&:last-child { margin-bottom: 0; }
		}

		ul {
			max-width: 720px;
			padding-left: 1.5rem;
			margin-top: var(--space-tiny);
			li {
				margin-bottom: 0.6rem;
				line-height: 1.7;
				color: #444;
			}
		}
	}

	.accent-box {
		background-color: color-mix(in srgb, var(--accent) 15%, white);
		border-left: 4px solid var(--accent);
		border-radius: 6px;
		padding: var(--space-small);

		h2 { margin-bottom: var(--space-small); }

		p {
			line-height: 1.8;
			margin-bottom: var(--space-tiny);
			color: #444;
			&:last-child { margin-bottom: 0; }
		}

		ul {
			padding-left: 1.5rem;
			margin-top: var(--space-tiny);
			li {
				margin-bottom: 0.6rem;
				line-height: 1.7;
				color: #444;
			}
		}
	}

	.what-to-expect {
		background: color-mix(in srgb, var(--accent) 10%, white);

		h2 { margin-bottom: var(--space-medium); }

		.expect-grid {
			display: grid;
			gap: 1.25rem;

			@media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
		}

		.expect-card {
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
				p { font-size: 0.95rem; line-height: 1.6; margin: 0; color: #555; }
			}
		}
	}
</style>
