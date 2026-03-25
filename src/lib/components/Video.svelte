<script>
	let { videoID, title = '', vidService = 'vimeo' } = $props();
</script>

<div class="video-wrapper">
	<div class="video-container">
		{#if vidService === 'vimeo'}
			<iframe
				src="https://player.vimeo.com/video/{videoID}?title=0&byline=0&portrait=0"
				frameborder="0"
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
				title={title}
			></iframe>
		{:else if vidService === 'youtube'}
			<iframe
				src="https://www.youtube.com/embed/{videoID}"
				title={title || 'YouTube video player'}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		{/if}
	</div>
	{#if title}
		<h5>{title}</h5>
	{/if}
</div>

<style>
	.video-container {
		position: relative;
		padding-bottom: 57%; /*16:9*/
		height: auto;
		overflow: hidden;
		opacity: 1;
		border-radius: 20px;
		box-shadow: var(--big-shadow);
		margin-bottom: 1rem;
	}

	.video-container iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
