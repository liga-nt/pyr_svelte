<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import ColorBar from '$lib/components/ColorBar.svelte';
	import pageData from '$lib/content/teens.json';
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

	<!-- Mental Health -->
	<section class="concern-section">
		<div class="container">
			<h2>{pageData.concerns.mental.headline}</h2>
			{#each pageData.concerns.mental.body.split('\n\n') as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</section>

	<!-- Substance Use -->
	<section class="concern-section concern-section--alt">
		<div class="container">
			<h2>{pageData.concerns.substances.headline}</h2>
			{#each pageData.concerns.substances.body.split('\n\n') as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</section>

	<!-- Screens -->
	<section class="concern-section">
		<div class="container">
			<h2>{pageData.concerns.screens.headline}</h2>
			{#each pageData.concerns.screens.body.split('\n\n') as paragraph}
				<p>{paragraph}</p>
			{/each}
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
	<section class="faq-section">
		<div class="container">
			<div class="faq-group">
				<div class="faq-group-header">
					<span class="faq-label">For Parents</span>
					<h2>Questions from Parents</h2>
				</div>
				<FAQ items={pageData.faqsParent} heading="" schema={false} />
			</div>

			<div class="faq-group faq-group--teen">
				<div class="faq-group-header">
					<span class="faq-label faq-label--teen">For Teens</span>
					<h2>Questions Teens Ask</h2>
				</div>
				<FAQ items={pageData.faqsTeen} heading="" schema={false} />
			</div>
		</div>
	</section>

	<ColorBar />

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
					<h3>Psychiatry</h3>
					<a href="tel:{siteData.contact.psychiatryPhone}">{siteData.contact.psychiatryPhone}</a>
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

	/* Concern Sections */
	.concern-section {
		padding: var(--space-xlarge) 0;

		.container {
			max-width: 800px;
		}

		h2 {
			margin-bottom: var(--space-medium);
		}

		p {
			font-size: 1rem;
			line-height: 1.8;
			margin-bottom: var(--space-small);
			color: var(--c-dark);

			&:last-child {
				margin-bottom: 0;
			}
		}

		&--alt {
			background: #f8f8f8;
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
				grid-template-columns: 1fr 1fr;
			}
		}

		.approach-card {
			padding: var(--space-medium);
			border-radius: 6px;
			border: 1px solid var(--c-gray);
			background: white;
			transition: border-color 0.2s, box-shadow 0.2s;

			&:hover {
				border-color: var(--c-purple);
				box-shadow: 0 4px 16px rgba(211, 176, 254, 0.2);
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

	/* FAQ Section */
	.faq-section {
		padding: var(--space-large) 0;

		.container {
			display: flex;
			flex-direction: column;
			gap: var(--space-xlarge);
		}
	}

	.faq-group {
		.faq-group-header {
			margin-bottom: var(--space-medium);
		}

		h2 {
			margin: 0.25rem 0 0 0;
		}
	}

	.faq-label {
		display: inline-block;
		font-family: ibm-plex-sans-condensed, sans-serif;
		font-style: italic;
		font-weight: 800;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		background: var(--c-green);
		color: white;
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		margin-bottom: 0.5rem;

		&--teen {
			background: var(--c-purple);
			color: var(--c-dark);
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
			max-width: 700px;
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
