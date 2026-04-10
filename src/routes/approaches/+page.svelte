<script>
	import ColorBar from '$lib/components/ColorBar.svelte';
	import pageData from '$lib/content/approaches/approaches.json';
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

	{#each pageData.approaches as approach, i}
		<article class="approach-article" id={approach.slug}>
			<div class="container">
				<h2>
					{#if approach.link}
						<a href={approach.link}>{approach.title}</a>
					{:else}
						{approach.title}
					{/if}
				</h2>
				<p class="approach-intro">{approach.intro}</p>

				<div class="approach-body">
					{#each approach.body as paragraph}
						<p>{paragraph}</p>
					{/each}
				</div>

				<div class="expect-grid">
					{#each approach.whatToExpect as item}
						<div class="expect-card">
							<h3>{item.label}</h3>
							<p>{item.description}</p>
						</div>
					{/each}
				</div>

				{#if approach.link}
					<a href={approach.link} class="full-article-link">Read the full article →</a>
				{/if}
			</div>
		</article>
		{#if i < pageData.approaches.length - 1}
			<ColorBar />
		{/if}
	{/each}

	<section class="cta">
		<div class="container">
			<h2>Ready to Get Started?</h2>
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

	.hero {
		padding: var(--space-xlarge) 0 var(--space-large);

		.container {
			max-width: 800px;
		}

		h1 {
			margin-bottom: var(--space-tiny);
		}

		.intro {
			font-size: 1.125rem;
			line-height: 1.75;
			color: var(--c-dark);
		}
	}

	.approach-article {
		padding: var(--space-xlarge) 0;

		&:nth-child(even) {
			background: #f8f8f8;
		}

		.container {
			max-width: 800px;
		}

		h2 {
			margin-bottom: var(--space-small);

			a {
				color: var(--c-dark);
				text-decoration: none;

				&:hover {
					color: var(--c-green);
					box-shadow: none;
				}
			}
		}

		.approach-intro {
			font-size: 1.1rem;
			line-height: 1.75;
			color: var(--c-dark);
			margin-bottom: var(--space-medium);
			font-style: italic;
		}

		.approach-body {
			margin-bottom: var(--space-medium);

			p {
				font-size: 1rem;
				line-height: 1.8;
				margin-bottom: var(--space-small);
				color: var(--c-dark);

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.expect-grid {
			display: grid;
			gap: var(--space-small);
			margin-top: var(--space-medium);
			margin-bottom: var(--space-medium);

			@media (min-width: 640px) {
				grid-template-columns: 1fr 1fr;
			}

			.expect-card {
				border-left: 3px solid var(--c-green);
				padding-left: var(--space-small);

				h3 {
					font-size: 1rem;
					font-weight: 700;
					margin-bottom: 0.35rem;
					color: var(--c-dark);
				}

				p {
					font-size: 0.9375rem;
					line-height: 1.6;
					margin: 0;
					color: #555;
				}
			}
		}

		.full-article-link {
			display: inline-block;
			font-size: 0.9375rem;
			font-weight: 600;
			color: var(--c-green);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
				box-shadow: none;
			}
		}
	}

	.cta {
		background-color: var(--c-green);
		color: white;
		text-align: center;
		padding: var(--space-xlarge) 0;

		h2 {
			margin-bottom: var(--space-tiny);
		}

		p {
			margin-bottom: var(--space-small);
			opacity: 0.9;
			font-size: 1.05rem;
		}
	}
</style>
