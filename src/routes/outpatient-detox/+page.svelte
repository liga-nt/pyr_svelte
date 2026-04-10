<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import ColorBar from '$lib/components/ColorBar.svelte';
	import pageData from '$lib/content/approaches/outpatient-detox.json';
</script>

<svelte:head>
	<title>{pageData.seo.title}</title>
	<meta name="description" content={pageData.seo.description} />
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

	<section class="who-its-for">
		<div class="container">
			<h2>{pageData.whoItsFor.heading}</h2>
			<ul>
				{#each pageData.whoItsFor.items as item}
					<li>{item}</li>
				{/each}
			</ul>
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

	<FAQ items={pageData.faqs} heading="Questions About Outpatient Detox" />

	<section class="related">
		<div class="container">
			<h2>Alcohol Treatment at Plan Your Recovery</h2>
			<p>
				Outpatient detox is the beginning of treatment, not the end. We provide ongoing medication
				management and therapy for alcohol use disorder following detoxification.
			</p>
			<div class="related-links">
				<a href="/alcohol-use-disorder/">Alcohol Use Disorder</a>
				<a href="/mat/">Medication-Assisted Treatment</a>
				<a href="/cbt/">Cognitive Behavioral Therapy</a>
				<a href="/psychiatry/">Psychiatry & Medication</a>
			</div>
		</div>
	</section>

	<section class="cta">
		<div class="container">
			<h2>Ready to Get Started?</h2>
			<p>Call to discuss whether outpatient detox is right for you.</p>
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

	.what-it-is {
		p {
			line-height: 1.8;
			margin-bottom: var(--space-tiny);
		}

		.container {
			max-width: 760px;
		}
	}

	.who-its-for {
		background-color: #f8f8f8;

		ul {
			padding-left: 1.5rem;
			margin-top: var(--space-tiny);

			li {
				margin-bottom: 0.6rem;
				line-height: 1.6;
			}
		}
	}

	.what-to-expect {
		.expect-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
			gap: var(--space-small);
			margin-top: var(--space-small);
		}

		.expect-card {
			border-left: 3px solid var(--c-purple);
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
					border-color: var(--c-purple);
					color: var(--c-purple);
					box-shadow: none;
				}
			}
		}
	}

	.cta {
		background-color: var(--c-purple);
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
