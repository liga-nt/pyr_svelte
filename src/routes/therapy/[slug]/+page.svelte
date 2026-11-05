<script lang="ts">
	import { page } from '$app/state';
	import suburbs from '$lib/content/locations/suburbs.json';
	import LocationPage from '$lib/components/LocationPage.svelte';

	import clayton from '$lib/content/locations/therapy/clayton.json';
	import ladue from '$lib/content/locations/therapy/ladue.json';
	import websterGroves from '$lib/content/locations/therapy/webster-groves.json';
	import kirkwood from '$lib/content/locations/therapy/kirkwood.json';
	import creveCoeur from '$lib/content/locations/therapy/creve-coeur.json';

	const content: Record<string, typeof clayton> = {
		clayton,
		ladue,
		'webster-groves': websterGroves,
		kirkwood,
		'creve-coeur': creveCoeur
	};

	let slug = $derived(page.params.slug);
	let suburb = $derived(suburbs.find((s) => s.slug === slug));
	let pageData = $derived(slug ? content[slug] : undefined);
</script>

{#if suburb && pageData}
	<LocationPage {pageData} {suburb} service="therapy" />
{/if}
