<script>
	// Renders a slide with its template's component. `slide.data` holds that template's fields.
	import { getTemplate } from './index.js';

	let { slide, showAlt = false } = $props();

	const Template = $derived(getTemplate(slide?.layout)?.component);
</script>

{#if Template}
	<Template {...slide.data} {showAlt} />
{:else}
	<p class="unknown">Unknown slide template "{slide?.layout}".</p>
{/if}

<style>
	.unknown { padding: 1rem; background: #fff8dc; border-radius: 6px; }
</style>
