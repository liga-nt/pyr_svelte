<script>
	import PatientPage from '$lib/components/PatientPage.svelte';
	import pageData from '$lib/content/students.json';
</script>

<PatientPage {pageData} population="students" />
