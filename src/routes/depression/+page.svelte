<script>
	import ConditionPage from '$lib/components/ConditionPage.svelte';
	import PHQ9Modal from '$lib/components/PHQ9Modal.svelte';
	import pageData from '$lib/content/conditions/depression.json';
</script>

<ConditionPage {pageData}>
	{#snippet criteriaExtra()}
		<PHQ9Modal />
	{/snippet}
</ConditionPage>
