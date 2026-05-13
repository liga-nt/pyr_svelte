<script>
	import Video from '$lib/components/Video.svelte';
	import data from '$lib/content/videos.json';

	const BASE = 'https://planyourrecovery.com';

	const videoSchemas = data.videos.map(v => ({
		'@context': 'https://schema.org',
		'@type': 'VideoObject',
		name: v.title,
		description: v.description,
		uploadDate: v.uploadDate,
		thumbnailUrl: `https://img.youtube.com/vi/${v.videoID}/hqdefault.jpg`,
		embedUrl: `https://www.youtube.com/embed/${v.videoID}`,
		url: `https://www.youtube.com/watch?v=${v.videoID}`,
		publisher: {
			'@type': 'Organization',
			name: 'Plan Your Recovery',
			url: BASE
		}
	}));
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
	{#each videoSchemas as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`}
	{/each}
</svelte:head>

<div class="page">

	<section class="hero">
		<div class="container">
			<h1>Educational Videos on Addiction &amp; Mental Health</h1>
			<p class="intro">{data.intro}</p>
		</div>
	</section>

	<section class="videos">
		<div class="container">
			<div class="videos-grid">
				{#each data.videos as video}
					<div class="video-card">
						<Video videoID={video.videoID} title={video.title} vidService="youtube" />
						<div class="video-meta">
							<span class="video-category">{video.category}</span>
							<h2 class="video-title">{video.title}</h2>
							<p class="video-description">{video.description}</p>
						</div>
					</div>
				{/each}
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

	/* Hero */
	.hero {
		padding: var(--space-large) 0 var(--space-medium);

		h1 {
			margin-bottom: var(--space-small);
		}

		.intro {
			font-size: 1.0625rem;
			line-height: 1.7;
			color: #555;
			margin: 0;
			max-width: 680px;
		}
	}

	/* Videos */
	.videos {
		padding: 0 0 var(--space-xlarge);

		.videos-grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: var(--space-large);

			@media screen and (min-width: 768px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		.video-card {
			display: flex;
			flex-direction: column;
		}

		.video-meta {
			margin-top: var(--space-tiny);
		}

		.video-category {
			font-family: ibm-plex-sans-condensed, sans-serif;
			font-size: 0.8rem;
			text-transform: uppercase;
			letter-spacing: 0.07em;
			color: var(--c-dark);
			opacity: 0.6;
			display: block;
			margin-bottom: 0.25rem;
		}

		.video-title {
			font-size: 1.0625rem;
			font-family: ibm-plex-sans, sans-serif;
			font-weight: 500;
			color: var(--c-dark);
			margin: 0 0 0.5rem;
			line-height: 1.4;
		}

		.video-description {
			font-size: 0.9375rem;
			line-height: 1.65;
			color: #555;
			margin: 0;
		}
	}
</style>
