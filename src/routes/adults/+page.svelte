<script>
	import PatientPage from '$lib/components/PatientPage.svelte';
	import pageData from '$lib/content/adults.json';
</script>

<PatientPage {pageData} population="adults" />
