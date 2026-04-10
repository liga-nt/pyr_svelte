<script>
	import Video from '$lib/components/Video.svelte';
	import data from '$lib/content/videos.json';
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
</svelte:head>

<div class="page">

	<section class="hero">
		<div class="container">
			<h1>Videos</h1>
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
			margin: 0;
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
			margin: 0;
			line-height: 1.4;
		}
	}
</style>
