<script>
	import ColorBar from '$lib/components/ColorBar.svelte';
	import Video from '$lib/components/Video.svelte';
	import ShapeHome from '$lib/components/ShapeHome.svelte';
	import ConditionIcon from '$lib/components/ConditionIcon.svelte';
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
			<div class="hero-content">
				<div class="hero-text">
					<h1>{homeData.hero.headline}</h1>
					<p class="hero-subheadline">{homeData.hero.subheadline}</p>
					<div class="hero-ctas">
						<a href="#contact" class="button--link">
							<button class="primary">{homeData.hero.ctaPrimary}</button>
						</a>
					</div>
				</div>
				<div class="hero-image">
					<ShapeHome />
					<img
						src="/img/illustration/women-talking.png"
						alt="Illustration of two women talking"
						width="400"
						height="432"
					/>
				</div>
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
								<ConditionIcon icon={condition.icon} color={condition.color} />
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
				<a href="/what-we-treat">View all conditions →</a>
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

	<!-- SEO Content -->
	<section class="seo-content">
		<div class="container">
			<h2>{homeData.seoContent.headline}</h2>
			{#each homeData.seoContent.paragraphs as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
	</section>

	<!-- Video Section -->
	<section class="video-section">
		<div class="container">
			<Video videoID={homeData.videoID} />
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
		padding: var(--space-xlarge) 0;

		.hero-content {
			display: grid;
			gap: var(--space-large);
			align-items: center;
		}

		h1 {
			margin-bottom: var(--space-small);
		}

		.hero-subheadline {
			font-size: 1.25rem;
			margin-bottom: var(--space-medium);
			max-width: 600px;
		}

		.hero-ctas {
			display: flex;
			gap: 1rem;
			flex-wrap: wrap;
		}

		.hero-image {
			position: relative;
			max-width: 400px;
			margin: 0 auto;

			img {
				width: 100%;
			}

			:global(svg) {
				position: absolute;
				top: 50%;
				transform: translateY(-23%) translateX(-16%);
			}
		}
	}

	@media screen and (min-width: 768px) {
		.hero .hero-content {
			grid-template-columns: 1fr 1fr;
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

	/* SEO Content */
	.seo-content {
		text-align: center;

		h2 {
			margin-bottom: var(--space-medium);
		}

		p {
			max-width: 800px;
			margin: 0 auto var(--space-medium) auto;
			font-size: 1.0625rem;
			line-height: 1.7;
		}
	}

	/* Video Section */
	.video-section {
		padding: var(--space-xlarge) 0;
		background-color: #f8f8f8;

		.container {
			max-width: 800px;
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
