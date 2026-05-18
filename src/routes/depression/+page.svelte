<script>
	import ConditionPage from '$lib/components/ConditionPage.svelte';
	import pageData from '$lib/content/conditions/depression.json';
</script>

<ConditionPage {pageData}>
	{#snippet criteriaExtra()}
		<a href="/clinical-tools" class="tool-link">PHQ-9 depression screening (clinical tool) &rarr;</a>
	{/snippet}
</ConditionPage>

<style>
	.tool-link {
		display: inline;
		font-size: 0.9rem;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 500;
		color: var(--c-dark);
		box-shadow: 0 1px 0 0 currentColor;
		transition: color 0.2s, box-shadow 0.2s;
		margin-top: 1.25rem;
	}

	.tool-link:hover {
		color: var(--accent);
		box-shadow: 0 2px 0 0 var(--accent);
	}
</style>
