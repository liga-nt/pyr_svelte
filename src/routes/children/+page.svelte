<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import ColorBar from '$lib/components/ColorBar.svelte';
	import pageData from '$lib/content/children.json';
	import siteData from '$lib/content/site.json';
</script>

<svelte:head>
	<title>{pageData.seo.title}</title>
	<meta name="description" content={pageData.seo.description} />
</svelte:head>

<div class="page">
	<!-- Hero -->
	<section class="hero">
		<div class="container">
			<h1>{pageData.hero.headline}</h1>
			<p class="intro">{pageData.hero.intro}</p>
			<a href={pageData.cta.bookingLink} class="button--link">
				<button class="primary">Make An Appointment</button>
			</a>
		</div>
	</section>

	<ColorBar />

	<!-- Common Concerns -->
	<section class="concerns">
		<div class="container">
			<h2>{pageData.concerns.headline}</h2>
			<div class="concerns-grid">
				{#each pageData.concerns.items as item}
					<div class="concern-card">
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<ColorBar />

	<!-- Approach -->
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

	<ColorBar />

	<!-- FAQs -->
	<FAQ items={pageData.faqs} heading="Common Questions" />

	<!-- CTA -->
	<section class="cta" id="contact">
		<div class="container">
			<h2>{pageData.cta.headline}</h2>
			<p>{pageData.cta.body}</p>
			<div class="contact-grid">
				<div class="contact-item">
					<h3>Counseling</h3>
					<a href="tel:{siteData.contact.counselingPhone}">{siteData.contact.counselingPhone}</a>
				</div>
				<div class="contact-item">
					<h3>Email</h3>
					<a href="mailto:{siteData.contact.email}">{siteData.contact.email}</a>
				</div>
			</div>
			<a href={pageData.cta.bookingLink} class="button--link">
				<button class="primary">Make An Appointment</button>
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

	/* Hero */
	.hero {
		padding: var(--space-xlarge) 0;

		.container {
			max-width: 800px;
		}

		h1 {
			margin-bottom: var(--space-small);
		}

		.intro {
			font-size: 1.125rem;
			line-height: 1.75;
			margin-bottom: var(--space-medium);
			color: var(--c-dark);
		}
	}

	/* Concerns */
	.concerns {
		padding: var(--space-xlarge) 0;
		background: #f8f8f8;

		h2 {
			margin-bottom: var(--space-large);
		}

		.concerns-grid {
			display: grid;
			gap: var(--space-medium);

			@media screen and (min-width: 768px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		.concern-card {
			padding: var(--space-medium);
			border-radius: 6px;
			border: 1px solid var(--c-gray);
			background: white;

			h3 {
				font-size: 1.1rem;
				margin-bottom: 0.75rem;
				color: var(--c-dark);
			}

			p {
				font-size: 0.975rem;
				line-height: 1.7;
				margin: 0;
				color: var(--c-dark);
			}
		}
	}

	/* Approach */
	.approach {
		padding: var(--space-xlarge) 0;

		h2 {
			margin-bottom: var(--space-large);
		}

		.approach-grid {
			display: grid;
			gap: var(--space-medium);

			@media screen and (min-width: 768px) {
				grid-template-columns: 1fr 1fr 1fr;
			}
		}

		.approach-card {
			padding: var(--space-medium);
			border-radius: 6px;
			border: 1px solid var(--c-gray);
			background: white;
			transition: border-color 0.2s, box-shadow 0.2s;

			&:hover {
				border-color: var(--c-green);
				box-shadow: 0 4px 16px rgba(106, 227, 220, 0.15);
			}

			h3 {
				font-size: 1.1rem;
				margin-bottom: 0.75rem;
				color: var(--c-dark);
			}

			p {
				font-size: 0.975rem;
				line-height: 1.7;
				margin: 0;
				color: var(--c-dark);
			}
		}
	}

	/* CTA */
	.cta {
		background-color: var(--c-green);
		color: white;
		padding: var(--space-xlarge) 0;
		text-align: center;

		h2 {
			margin-bottom: var(--space-small);
		}

		p {
			font-size: 1.05rem;
			max-width: 600px;
			margin: 0 auto var(--space-large) auto;
			line-height: 1.7;
			opacity: 0.95;
		}

		.contact-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
			gap: var(--space-medium);
			margin-bottom: var(--space-large);
			max-width: 500px;
			margin-left: auto;
			margin-right: auto;
		}

		.contact-item {
			h3 {
				font-family: ibm-plex-sans-condensed, sans-serif;
				font-size: 0.85rem;
				text-transform: uppercase;
				letter-spacing: 0.06em;
				font-weight: 800;
				margin-bottom: 0.4rem;
				font-style: italic;
			}

			a {
				color: white;
				font-size: 1.1rem;
				font-weight: 500;
				text-decoration: none;
				box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.7);

				&:hover {
					box-shadow: 0 2px 0 0 white;
				}
			}
		}

		.button--link {
			display: inline-block;
			margin-top: var(--space-small);

			button {
				background: white;
				color: var(--c-dark);
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

				&:hover {
					background: white;
					opacity: 0.92;
				}
			}
		}
	}
</style>
