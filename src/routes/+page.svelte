<script>
	import ColorBar from '$lib/components/ColorBar.svelte';
	import homeData from '$lib/content/home.json';

	let conditionsScroll;

	function scrollLeft() {
		if (conditionsScroll) {
			conditionsScroll.scrollBy({ left: -300, behavior: 'smooth' });
		}
	}

	function scrollRight() {
		if (conditionsScroll) {
			conditionsScroll.scrollBy({ left: 300, behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>{homeData.seo.metaTitle}</title>
	<meta name="description" content={homeData.seo.metaDesc} />
	<meta name="keywords" content={homeData.seo.metaKeywords} />
</svelte:head>

<div class="page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<p class="hero-eyebrow">{homeData.hero.eyebrow}</p>
			<h1>{homeData.hero.headline}</h1>
			<p class="hero-subheadline">{homeData.hero.subheadline}</p>
			<div class="hero-differentiators">
				{#each homeData.hero.differentiators as d}
					<div class="hero-diff-card">
						<h3>{d.heading}</h3>
						<p>{d.body}</p>
					</div>
				{/each}
			</div>
			<div class="hero-ctas">
				<a href="/booking/" class="button--link">
					<button class="primary">{homeData.hero.ctaPrimary}</button>
				</a>
				<a href="/team/" class="hero-secondary-cta">{homeData.hero.ctaSecondary} →</a>
			</div>
		</div>
	</section>

	<!-- Who We Treat -->
	<section class="who-we-treat">
		<div class="container">
			<h2>{homeData.whoWetreat.headline}</h2>
			<div class="who-icons">
				{#each homeData.whoWetreat.groups as group}
					<a href={group.link} class="who-card">
						<div class="who-icon">
							<img src={group.icon} alt={group.label} width="100" height="100" />
						</div>
						<h3>{group.label}</h3>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Mental Health Conditions -->
	<section class="conditions">
		<div class="container">
			<h2>{homeData.conditions.headline}</h2>
			<div class="conditions-carousel-wrapper">
				<button class="carousel-arrow carousel-arrow-left" onclick={scrollLeft} aria-label="Scroll left">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<div class="conditions-scroll" bind:this={conditionsScroll}>
					{#each homeData.conditions.items as condition}
						<a href={condition.linkUrl} class="condition-card">
							<div class="condition-icon">
								<img src={condition.icon} alt={condition.name} width="100" height="100" />
							</div>
							<h3>{condition.name}</h3>
						</a>
					{/each}
				</div>
				<button class="carousel-arrow carousel-arrow-right" onclick={scrollRight} aria-label="Scroll right">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
			<div class="view-all">
				<a href="/conditions/">View all conditions →</a>
			</div>
		</div>
	</section>

	<!-- Evidence-Based Treatments -->
	<section class="treatments">
		<div class="container">
			<h2>{homeData.treatments.headline}</h2>
			<div class="treatments-grid">
				{#each homeData.treatments.items as treatment}
					<div class="treatment-card">
						<h3>{treatment.name}</h3>
						<p>{treatment.description}</p>
						<a href={treatment.linkUrl}>Learn more →</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="final-cta" id="contact">
		<div class="container">
			<h2>Ready to Take the First Step?</h2>
			<div class="contact-info">
				<div class="contact-item">
					<h3>Counseling</h3>
					<a href="tel:{homeData.contact.counselingPhone}">{homeData.contact.counselingPhone}</a>
				</div>
				<div class="contact-item">
					<h3>Psychiatry</h3>
					<a href="tel:{homeData.contact.psychiatryPhone}">{homeData.contact.psychiatryPhone}</a>
				</div>
				<div class="contact-item">
					<h3>Email</h3>
					<a href="mailto:{homeData.contact.email}">{homeData.contact.email}</a>
				</div>
			</div>
			<p class="contact-note">Or browse our resources to learn more about our treatment approaches.</p>
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
		padding: var(--section-stack) 0;
	}

	/* Hero Section */
	.hero {
		padding: var(--space-xlarge) 0 var(--space-xlarge);
		border-bottom: 1px solid var(--c-gray);

		.container {
			max-width: 900px;
		}

		.hero-eyebrow {
			font-family: ibm-plex-sans-condensed, sans-serif;
			font-size: 0.8rem;
			font-weight: 800;
			font-style: italic;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			color: var(--c-green);
			margin-bottom: var(--space-small);
		}

		h1 {
			font-size: clamp(2rem, 5vw, 3.25rem);
			line-height: 1.15;
			margin-bottom: var(--space-medium);
			max-width: 800px;
		}

		.hero-subheadline {
			font-size: 1.15rem;
			line-height: 1.75;
			max-width: 720px;
			margin-bottom: var(--space-large);
			color: #444;
		}

		.hero-differentiators {
			display: grid;
			gap: var(--space-small);
			margin-bottom: var(--space-large);

			@media (min-width: 640px) {
				grid-template-columns: repeat(3, 1fr);
			}
		}

		.hero-diff-card {
			border-left: 3px solid var(--c-green);
			padding-left: var(--space-small);

			h3 {
				font-size: 0.95rem;
				font-weight: 700;
				margin-bottom: 0.4rem;
				color: var(--c-dark);
				font-style: normal;
				text-transform: none;
				letter-spacing: 0;
			}

			p {
				font-size: 0.9rem;
				line-height: 1.6;
				color: #555;
				margin: 0;
			}
		}

		.hero-ctas {
			display: flex;
			align-items: center;
			gap: var(--space-medium);
			flex-wrap: wrap;
		}

		.hero-secondary-cta {
			font-size: 1rem;
			font-weight: 500;
			color: var(--c-dark);
		}
	}

	/* Who We Treat */
	.who-we-treat {
		padding: var(--space-xlarge) 0;
		background: #f8f8f8;

		h2 {
			text-align: center;
			margin-bottom: var(--space-large);
		}

		.who-icons {
			display: flex;
			gap: 2rem;
			justify-content: center;
			flex-wrap: wrap;
			padding: 1rem 0;
		}

		.who-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-decoration: none;
			flex-shrink: 0;
			width: 120px;
			transition: transform 0.3s ease;

			&:hover {
				transform: translateY(-4px);
			}

			.who-icon {
				width: 100px;
				height: 100px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: var(--space-small);
				transition: transform 0.3s ease;

				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
					mix-blend-mode: multiply;
				}
			}

			&:hover .who-icon {
				transform: scale(1.1);
			}

			h3 {
				font-size: 0.95rem;
				color: var(--c-dark);
				text-align: center;
				margin: 0;
				line-height: 1.3;
			}
		}
	}

	/* Conditions Section */
	.conditions {
		padding: var(--space-xlarge) 0;

		h2 {
			text-align: center;
			margin-bottom: var(--space-large);
		}

		.conditions-carousel-wrapper {
			position: relative;
			display: flex;
			align-items: center;
			gap: 1rem;
			margin-bottom: var(--space-medium);
		}

		.carousel-arrow {
			flex-shrink: 0;
			width: 48px;
			height: 48px;
			border-radius: 50%;
			border: 2px solid var(--c-green);
			background: white;
			color: var(--c-green);
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s ease;
			z-index: 10;

			&:hover {
				background: var(--c-green);
				color: white;
				transform: scale(1.1);
			}

			&:active {
				transform: scale(0.95);
			}
		}

		.conditions-scroll {
			display: flex;
			gap: 2rem;
			overflow-x: auto;
			scroll-behavior: smooth;
			padding: 1rem 0;
			flex: 1;
			justify-content: center;

			/* Hide scrollbar but keep functionality */
			scrollbar-width: none;
			-ms-overflow-style: none;
			&::-webkit-scrollbar {
				display: none;
			}
		}

		.condition-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-decoration: none;
			flex-shrink: 0;
			width: 120px;
			transition: transform 0.3s ease;

			&:hover {
				transform: translateY(-4px);
			}

			.condition-icon {
				width: 100px;
				height: 100px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: var(--space-small);
				transition: transform 0.3s ease;

				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
					mix-blend-mode: multiply;
				}
			}

			&:hover .condition-icon {
				transform: scale(1.1);
			}

			h3 {
				font-size: 0.95rem;
				color: var(--c-dark);
				text-align: center;
				margin: 0;
				line-height: 1.3;
			}
		}

		.view-all {
			text-align: center;
			margin-top: var(--space-medium);

			a {
				color: var(--c-green);
				font-weight: 500;
				font-size: 1.1rem;
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}

	/* Treatments */
	.treatments {
		background-color: #f8f8f8;
		padding: var(--space-xlarge) 0;

		h2 {
			text-align: center;
			margin-bottom: var(--space-large);
		}

		.treatments-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
			gap: var(--space-medium);
		}

		.treatment-card {
			background: white;
			padding: var(--space-medium);
			border-radius: var(--border-radius);
			border: 1px solid #e0e0e0;

			h3 {
				margin-bottom: var(--space-small);
				color: var(--c-dark);
			}

			p {
				margin-bottom: var(--space-small);
				font-size: 0.95rem;
				line-height: 1.6;
			}

			a {
				color: var(--c-green);
				font-weight: 500;
			}
		}
	}

	/* Final CTA */
	.final-cta {
		background-color: var(--c-green);
		color: white;
		padding: var(--space-xlarge) 0;
		text-align: center;

		h2 {
			margin-bottom: var(--space-large);
		}

		.contact-info {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			gap: var(--space-medium);
			margin-bottom: var(--space-medium);
		}

		.contact-item {
			h3 {
				font-size: 1rem;
				margin-bottom: var(--space-tiny);
				font-family: ibm-plex-sans-condensed, sans-serif;
				text-transform: uppercase;
				letter-spacing: 0.05em;
			}

			a {
				color: white;
				font-size: 1.25rem;
				font-weight: 500;
				text-decoration: none;
				box-shadow: 0 1px 0 0 white;

				&:hover {
					box-shadow: 0 2px 0 0 white;
				}
			}
		}

		.contact-note {
			font-size: 1rem;
			opacity: 0.9;
		}
	}
</style>
