<script>
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	if (browser) goto('/conditions', { replaceState: true });
</script>

<svelte:head>
	<link rel="canonical" href="https://planyourrecovery.com/conditions" />
	<meta http-equiv="refresh" content="0;url=/conditions" />
</svelte:head>
