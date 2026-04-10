<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import ColorBar from '$lib/components/ColorBar.svelte';
	import pageData from '$lib/content/approaches/cbt.json';

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'MedicalTherapy',
		name: 'Cognitive Behavioral Therapy',
		alternateName: 'CBT',
		description: pageData.seo.description,
		recognizingAuthority: {
			'@type': 'Organization',
			name: 'American Psychological Association'
		},
		relevantSpecialty: ['Psychiatry', 'MentalHealth']
	};
</script>

<svelte:head>
	<title>{pageData.seo.title}</title>
	<meta name="description" content={pageData.seo.description} />
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<div class="page">
	<section class="hero">
		<div class="container">
			<h1>{pageData.hero.headline}</h1>
			<p class="intro">{pageData.hero.intro}</p>
		</div>
	</section>

	<ColorBar />

	<section class="what-it-is">
		<div class="container">
			<h2>{pageData.whatItIs.heading}</h2>
			{#each pageData.whatItIs.paragraphs as p}
				<p>{p}</p>
			{/each}
		</div>
	</section>

	<section class="for-addiction">
		<div class="container">
			<h2>{pageData.forAddiction.heading}</h2>
			{#each pageData.forAddiction.paragraphs as p}
				<p>{p}</p>
			{/each}
		</div>
	</section>

	<ColorBar />

	<section class="what-to-expect">
		<div class="container">
			<h2>{pageData.whatToExpect.heading}</h2>
			<div class="expect-grid">
				{#each pageData.whatToExpect.items as item}
					<div class="expect-card">
						<h3>{item.label}</h3>
						<p>{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<FAQ items={pageData.faqs} heading="Questions About CBT" />

	<section class="related">
		<div class="container">
			<h2>CBT at Plan Your Recovery</h2>
			<p>
				CBT is used across our practice — for depression, anxiety, addiction, trauma, and more. Most
				of our clinicians are trained in CBT and integrate it with other approaches depending on your
				needs.
			</p>
			<div class="related-links">
				<a href="/depression/">Depression</a>
				<a href="/anxiety/">Anxiety</a>
				<a href="/opioid-use-disorder/">Opioid Use Disorder</a>
				<a href="/alcohol-use-disorder/">Alcohol Use Disorder</a>
				<a href="/ptsd/">PTSD & Trauma</a>
				<a href="/ocd/">OCD</a>
			</div>
		</div>
	</section>

	<section class="cta">
		<div class="container">
			<h2>Ready to Start?</h2>
			<p>Getting started begins with a single conversation.</p>
			<a href="/booking/" class="button--link">
				<button class="primary">Make an Appointment</button>
			</a>
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

	.what-it-is,
	.for-addiction {
		p {
			line-height: 1.8;
			margin-bottom: var(--space-tiny);
		}

		.container {
			max-width: 760px;
		}
	}

	.for-addiction {
		background-color: #f8f8f8;
	}

	.what-to-expect {
		.expect-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
			gap: var(--space-small);
			margin-top: var(--space-small);
		}

		.expect-card {
			border-left: 3px solid var(--c-green);
			padding-left: var(--space-tiny);

			h3 {
				font-size: 1.05rem;
				margin-bottom: 0.4rem;
			}

			p {
				font-size: 0.95rem;
				line-height: 1.6;
				margin: 0;
			}
		}
	}

	.related {
		background: #f8f8f8;

		p {
			max-width: 640px;
			line-height: 1.7;
			margin-bottom: var(--space-small);
		}

		.related-links {
			display: flex;
			flex-wrap: wrap;
			gap: 0.75rem;

			a {
				background: white;
				border: 1px solid var(--c-gray);
				padding: 0.4rem 1rem;
				border-radius: 6px;
				font-size: 0.95rem;
				box-shadow: none;
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
		}
	}
</style>
