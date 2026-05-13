<script>
	let { children } = $props();
</script>

{@render children()}

<style>
	/* Hide site nav/footer on dev pages */
	:global(header.topbar),
	:global(footer) {
		display: none !important;
	}

	:global(main) {
		padding: 0 !important;
	}
</style>
