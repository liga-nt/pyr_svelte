<script>
	import PatientPage from '$lib/components/PatientPage.svelte';
	import pageData from '$lib/content/teens.json';
</script>

<PatientPage {pageData} population="teens" />
