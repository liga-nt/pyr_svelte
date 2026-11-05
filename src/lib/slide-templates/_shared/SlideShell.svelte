<script>
	// Shared frame for every slide layout. It follows the site's look: content sits on the
	// page rather than in a card, the soft green blob from the home page sits behind, and
	// type scales with the width of the surrounding "slides" container (cqi units), so a slide
	// reflows correctly in whatever column it is placed in.
	let { children, blob = 'top-right' } = $props();
</script>

<section class="slide blob-{blob}">
	{@render children()}
</section>

<style lang="scss">
	.slide {
		position: relative;
		isolation: isolate;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem 0.25rem 1.75rem;
		border-bottom: var(--slide-rule, 1px solid var(--c-gray));
		overflow: hidden;

		:global(h1),
		:global(h2),
		:global(h3) {
			margin: 0;
			line-height: 1.2;
		}
		:global(h1) { font-size: clamp(1.9rem, 8cqi, 3.75rem); line-height: 1.15; }
		:global(h2) { font-size: clamp(1.5rem, 6.4cqi, 2.75rem); }
		:global(h3) { font-size: clamp(1.1rem, 4cqi, 1.6rem); }
		:global(p) { font-size: clamp(1rem, 3.4cqi, 1.4rem); line-height: 1.7; margin: 0; color: #444; }

		/* The site's eyebrow: green condensed italic caps. --c-green-text keeps it readable on white. */
		:global(.eyebrow) {
			font-family: ibm-plex-sans-condensed, sans-serif;
			font-size: 0.8rem;
			font-weight: 800;
			font-style: italic;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			color: var(--c-green-text, #1e7a3c);
		}
		:global(.meta) { font-size: 0.9rem; color: var(--c-text-muted, #666); }
		:global(.source) { font-size: 0.8125rem; color: var(--c-text-muted, #666); line-height: 1.5; }
	}

	/* The organic shape from the home page hero, already at 10% opacity in the SVG. */
	.slide::before {
		content: '';
		position: absolute;
		z-index: -1;
		width: min(56%, 300px);
		aspect-ratio: 527 / 377;
		background: url('/img/illustration/shape-home.svg') no-repeat center / contain;
		pointer-events: none;
	}
	.blob-top-right::before { top: 0; right: 0; }
	.blob-bottom-left::before { bottom: 0; left: 0; }
	.blob-none::before { display: none; }

	@container slides (min-width: 700px) {
		.slide { padding: 2.25rem 0.5rem 2.5rem; gap: 1.25rem; }
	}
</style>
