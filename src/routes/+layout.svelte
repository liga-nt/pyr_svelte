<script>
	import '$lib/styles/global.scss';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<Navbar />

{@render children?.()}
