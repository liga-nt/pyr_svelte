<script>
	import SlideShell from '../_shared/SlideShell.svelte';

	// showAlt is for authors reviewing a draft. Learners never see the alt text as
	// a separate block; screen readers get it from the image.
	let { alt, heading = '', src = '', caption = '', showAlt = false } = $props();
</script>

<SlideShell blob="none">
	{#if heading}<h2>{heading}</h2>{/if}
	<figure>
		{#if src}
			<img {src} {alt} />
		{:else}
			<div class="empty" role="img" aria-label={alt}>Figure not made yet</div>
		{/if}
		{#if caption}<figcaption>{caption}</figcaption>{/if}
	</figure>
	{#if showAlt}<p class="alt"><strong>Alt text:</strong> {alt}</p>{/if}
</SlideShell>

<style lang="scss">
	figure { margin: 0; display: flex; flex-direction: column; gap: 0.75rem; }
	img { display: block; width: 100%; height: auto; border-radius: 6px; }
	.empty {
		border: 1px dashed #ddd;
		border-radius: 6px;
		background: #f8f8f8;
		min-height: 170px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8125rem;
		color: var(--c-text-muted, #666);
	}
	figcaption { font-size: 0.9rem; color: #555; line-height: 1.55; }
	.alt {
		font-size: 0.8125rem !important;
		color: var(--c-text-muted, #666);
		background: #f8f8f8;
		border-left: 4px solid var(--c-gray);
		padding: 0.5rem 0.75rem;
		border-radius: 0 6px 6px 0;
	}
	@container slides (min-width: 700px) { .empty { min-height: 240px; } }
</style>
