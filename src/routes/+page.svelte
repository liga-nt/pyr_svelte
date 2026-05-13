<script lang="ts">
	import homeData from '$lib/content/home.json';
	import site from '$lib/content/site.json';
	import videosData from '$lib/content/videos.json';
	import teamData from '$lib/content/team.json';

	const BASE = 'https://planyourrecovery.com';

	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${BASE}/#webpage`,
		url: `${BASE}/`,
		name: homeData.seo.metaTitle,
		description: homeData.seo.metaDesc,
		isPartOf: { '@id': `${BASE}/#website` },
		about: { '@id': `${BASE}/#organization` }
	};

	const cliniciansListSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Our Therapists and Prescribers',
		itemListElement: teamData.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: p.fullName,
			url: `${BASE}/team/${p.slug}`
		}))
	};

	let conditionsScroll: HTMLElement;
	let cliniciansScroll: HTMLElement;
	let videosScroll: HTMLElement;

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

	function cliniciansLeft() {
		if (cliniciansScroll) {
			cliniciansScroll.scrollBy({ left: -300, behavior: 'smooth' });
		}
	}

	function cliniciansRight() {
		if (cliniciansScroll) {
			cliniciansScroll.scrollBy({ left: 300, behavior: 'smooth' });
		}
	}

	function videosLeft() {
		if (videosScroll) {
			videosScroll.scrollBy({ left: -300, behavior: 'smooth' });
		}
	}

	function videosRight() {
		if (videosScroll) {
			videosScroll.scrollBy({ left: 300, behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>{homeData.seo.metaTitle}</title>
	<meta name="description" content={homeData.seo.metaDesc} />
	<meta name="keywords" content={homeData.seo.metaKeywords} />
	{@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(cliniciansListSchema)}<\/script>`}
</svelte:head>

<div class="page">
	<!-- Hero Section -->
	<section class="hero">
		<div class="container">
			<div class="hero-top">
				<div class="hero-intro">
					<p class="hero-eyebrow">{homeData.hero.eyebrow}</p>
					<h1>{homeData.hero.headline}</h1>
					<p class="hero-subheadline">{homeData.hero.subheadline}</p>
				</div>
				<div class="hero-illustration" aria-hidden="true">
					<img src="/img/illustration/shape-home.svg" class="illus-shape" alt="" />
					<img src="/img/illustration/pyr-home.png" class="illus-people" alt="" />
				</div>
			</div>
			<div class="hero-differentiators">
				{#each homeData.hero.differentiators as d}
					<div class="hero-diff-card">
						<h3>{d.heading}</h3>
						<p>{d.body}</p>
					</div>
				{/each}
			</div>
			<div class="clinicians-carousel-wrapper">
				<button class="carousel-arrow carousel-arrow-left" onclick={cliniciansLeft} aria-label="Scroll left">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<div class="clinicians-scroll" bind:this={cliniciansScroll}>
					{#each teamData as clinician}
						<a href="/team/{clinician.slug}" class="clinician-card">
							<div class="clinician-portrait">
								<img src={clinician.portrait} alt={clinician.fullName} width="120" height="120" />
							</div>
							<span class="clinician-name">{clinician.firstName} {clinician.lastName}</span>
							<span class="clinician-credentials">{clinician.credentials}</span>
							<span class="clinician-role">{clinician.role}</span>
						</a>
					{/each}
				</div>
				<button class="carousel-arrow carousel-arrow-right" onclick={cliniciansRight} aria-label="Scroll right">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
			<div class="view-all-link">
				<a href="/team">Meet all our clinicians →</a>
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
							<img src={group.icon} alt="" width="100" height="100" />
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
			</div>
			<div class="view-all">
				<a href="/conditions">View all conditions →</a>
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

	<!-- Videos -->
	<section class="videos-section">
		<div class="container">
			<h2>Educational Videos</h2>
			<div class="videos-carousel-wrapper">
				<button class="carousel-arrow carousel-arrow-left" onclick={videosLeft} aria-label="Scroll left">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M15 18l-6-6 6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
				<div class="videos-scroll" bind:this={videosScroll}>
					{#each videosData.videos as video}
						<a href="/videos" class="video-thumb-card">
							<img
								src="https://img.youtube.com/vi/{video.videoID}/mqdefault.jpg"
								alt={video.title}
								width="320"
								height="180"
								class="video-thumb"
							/>
							<span class="video-thumb-category">{video.category}</span>
							<span class="video-thumb-title">{video.title}</span>
						</a>
					{/each}
				</div>
				<button class="carousel-arrow carousel-arrow-right" onclick={videosRight} aria-label="Scroll right">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
			<div class="view-all">
				<a href="/videos">View all videos →</a>
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
		padding: var(--section-stack) 0;
	}

	/* Hero Section */
	.hero {
		padding: var(--space-large) 0 var(--space-xlarge);
		border-bottom: 1px solid var(--c-gray);

		.container {
			max-width: 1000px;
		}

		.hero-top {
			display: grid;
			grid-template-columns: 1fr 380px;
			gap: var(--space-large);
			align-items: center;
			margin-bottom: var(--space-large);

			@media (max-width: 820px) {
				grid-template-columns: 1fr;
			}
		}

		.hero-illustration {
			position: relative;

			.illus-shape {
				position: absolute;
				width: 130%;
				left: -15%;
				top: 50%;
				transform: translateY(-50%);
			}

			.illus-people {
				position: relative;
				z-index: 1;
				width: 115%;
				height: auto;
				display: block;
				margin-top: -2rem;
			}

			@media (max-width: 820px) {
				display: none;
			}
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

		.clinicians-carousel-wrapper {
			position: relative;
			display: flex;
			align-items: center;
			gap: 1rem;
			margin-bottom: var(--space-small);
		}

		.clinicians-scroll {
			display: flex;
			gap: 1.5rem;
			overflow-x: auto;
			scroll-behavior: smooth;
			padding: 1rem 0;
			flex: 1;
			scrollbar-width: none;
			-ms-overflow-style: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		.clinician-card {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-decoration: none;
			flex-shrink: 0;
			width: 130px;
			transition: transform 0.3s ease;

			&:hover {
				transform: translateY(-4px);
				box-shadow: none;
			}
		}

		.clinician-portrait {
			width: 100px;
			height: 100px;
			border-radius: 50%;
			overflow: hidden;
			margin-bottom: 0.6rem;
			border: 2px solid var(--c-gray);
			flex-shrink: 0;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: top;
			}
		}

		.clinician-name {
			font-size: 0.9rem;
			font-weight: 600;
			color: var(--c-dark);
			text-align: center;
			line-height: 1.3;
		}

		.clinician-credentials {
			font-size: 0.75rem;
			color: var(--c-green);
			text-align: center;
			margin-top: 0.15rem;
		}

		.clinician-role {
			font-size: 0.75rem;
			color: #777;
			text-align: center;
			margin-top: 0.1rem;
			line-height: 1.3;
		}

		.view-all-link {
			margin-top: var(--space-small);

			a {
				font-size: 0.9375rem;
				color: var(--c-green);
				font-weight: 600;
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}

	/* Who We Treat */
	.who-we-treat {
		padding: var(--space-xlarge) 0;
		background: #f8f8f8;

		h2 {
			text-align: center;
			margin-bottom: var(--space-large);

			&::after {
				content: '';
				display: block;
				width: 60px;
				height: 3px;
				background: var(--c-green);
				margin: 0.5rem auto 0;
				border-radius: 2px;
			}
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
			box-shadow: none;
			flex-shrink: 0;
			width: 140px;
			transition: transform 0.3s ease;

			&:hover {
				transform: translateY(-4px);
				box-shadow: none;
			}

			.who-icon {
				width: 100px;
				height: 100px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: var(--space-small);
				transition: transform 0.3s ease;
				border-radius: 50%;
				border: 5px solid transparent;
				padding: 8px;
				box-sizing: content-box;
				background: #f8f8f8;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}

			&:hover .who-icon {
				transform: scale(1.1);
			}

			&:nth-child(1) .who-icon { border-color: var(--c-green); }
			&:nth-child(2) .who-icon { border-color: var(--c-purple); }
			&:nth-child(3) .who-icon { border-color: var(--c-yellow); }
			&:nth-child(4) .who-icon { border-color: var(--c-blue); }

			h3 {
				font-size: 0.95rem;
				color: var(--c-green);
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

			&::after {
				content: '';
				display: block;
				width: 60px;
				height: 3px;
				background: var(--c-green);
				margin: 0.5rem auto 0;
				border-radius: 2px;
			}
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

			@media (max-width: 480px) {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				overflow-x: visible;
				gap: 1rem;
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

			@media (max-width: 480px) {
				width: auto;
			}

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
				border-radius: 50%;
				border: 5px solid transparent;
				padding: 8px;
				box-sizing: content-box;
				background: #f8f8f8;
				overflow: hidden;

				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}

			&:hover .condition-icon {
				transform: scale(1.1);
			}

			&:nth-child(1) .condition-icon { border-color: var(--c-blue); }
			&:nth-child(2) .condition-icon { border-color: var(--c-purple); }
			&:nth-child(3) .condition-icon { border-color: var(--c-green); }
			&:nth-child(4) .condition-icon { border-color: var(--c-yellow); }

			h3 {
				font-size: 0.95rem;
				color: var(--c-green);
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

	/* Videos */
	.videos-section {
		padding: var(--space-xlarge) 0;

		h2 {
			text-align: center;
			margin-bottom: var(--space-large);
		}

		.videos-carousel-wrapper {
			position: relative;
			display: flex;
			align-items: center;
		}

		.videos-scroll {
			display: flex;
			gap: 1.25rem;
			overflow-x: auto;
			scroll-behavior: smooth;
			padding: 0.5rem 0 1rem;
			scrollbar-width: none;
			-ms-overflow-style: none;

			&::-webkit-scrollbar {
				display: none;
			}
		}

		.video-thumb-card {
			display: flex;
			flex-direction: column;
			flex-shrink: 0;
			width: 260px;
			text-decoration: none;
			transition: transform 0.2s ease;

			&:hover {
				transform: translateY(-3px);

				.video-thumb {
					box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
				}
			}
		}

		.video-thumb {
			width: 100%;
			height: auto;
			border-radius: 4px;
			display: block;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			transition: box-shadow 0.2s ease;
			margin-bottom: 0.5rem;
		}

		.video-thumb-category {
			font-family: ibm-plex-sans-condensed, sans-serif;
			font-size: 0.72rem;
			text-transform: uppercase;
			letter-spacing: 0.07em;
			color: #999;
			display: block;
			margin-bottom: 0.2rem;
		}

		.video-thumb-title {
			font-family: ibm-plex-sans, sans-serif;
			font-size: 0.9375rem;
			font-weight: 500;
			color: var(--c-dark);
			line-height: 1.4;
		}

		.view-all {
			text-align: center;
			margin-top: var(--space-medium);

			a {
				color: var(--c-green);
				font-weight: 500;
				font-size: 1rem;
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
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
