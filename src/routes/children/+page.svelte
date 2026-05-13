<script>
	import PatientPage from '$lib/components/PatientPage.svelte';
	import pageData from '$lib/content/children.json';
</script>

<PatientPage {pageData} population="children" />
