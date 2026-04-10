<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import data from '$lib/content/referrals.json';
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
</svelte:head>

<div class="page">

	<!-- Hero -->
	<section class="hero">
		<div class="container">
			<h1>{data.hero.headline}</h1>
			<p class="intro">{data.hero.intro}</p>
		</div>
	</section>

	<!-- Key Points -->
	<section class="key-points">
		<div class="container">
			<h2>{data.keyPoints.heading}</h2>
			<div class="points-grid">
				{#each data.keyPoints.items as point}
					<div class="point-card">
						<h3>{point.title}</h3>
						<p>{point.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- FAQs -->
	<FAQ items={data.faqs} />

	<!-- CTA -->
	<section class="cta">
		<div class="container">
			<h2>{data.cta.heading}</h2>
			<p>{data.cta.body}</p>
			<div class="cta-contacts">
				<div class="cta-contact">
					<span class="cta-label">Call or text</span>
					<a href="tel:{data.cta.phone}">{data.cta.phone}</a>
				</div>
				<div class="cta-contact">
					<span class="cta-label">Email</span>
					<a href="mailto:{data.cta.email}">{data.cta.email}</a>
				</div>
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
		padding: var(--space-xlarge) 0;
	}

	/* Hero */
	.hero {
		background-color: var(--c-blue);

		h1 {
			margin-bottom: var(--space-small);
		}

		.intro {
			max-width: 760px;
			font-size: 1.125rem;
			line-height: 1.7;
		}
	}

	/* Key Points */
	.key-points {
		h2 {
			margin-bottom: var(--space-medium);
		}

		.points-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
			gap: var(--space-small);
		}

		.point-card {
			background: #fff;
			border: 1px solid var(--c-gray);
			border-radius: var(--border-radius);
			padding: var(--space-medium);

			h3 {
				font-size: 1.0625rem;
				margin-bottom: var(--space-tiny);
				color: var(--c-dark);
			}

			p {
				font-size: 0.975rem;
				line-height: 1.65;
				margin: 0;
			}
		}
	}

	/* CTA */
	.cta {
		background-color: var(--c-green);
		text-align: center;

		h2 {
			margin-bottom: var(--space-small);
		}

		p {
			font-size: 1.0625rem;
			margin-bottom: var(--space-medium);
			max-width: 600px;
			margin-left: auto;
			margin-right: auto;
		}

		.cta-contacts {
			display: flex;
			gap: var(--space-medium);
			justify-content: center;
			flex-wrap: wrap;
		}

		.cta-contact {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
		}

		.cta-label {
			font-family: ibm-plex-sans-condensed, sans-serif;
			font-size: 0.85rem;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			opacity: 0.8;
		}

		a {
			font-size: 1.375rem;
			font-weight: 600;
			color: var(--c-dark);
			text-decoration: none;
			box-shadow: 0 1px 0 0 var(--c-dark);

			&:hover {
				box-shadow: 0 2px 0 0 var(--c-dark);
			}
		}
	}
</style>
