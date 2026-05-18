<script>
	import { goto } from '$app/navigation';
	import { authState } from '$lib/auth.svelte.js';

	let { children } = $props();

	$effect(() => {
		if (!authState.loading) {
			if (!authState.user) goto('/ce/login');
			else if (!authState.isAdmin) goto('/ce/dashboard');
		}
	});
</script>

{#if authState.loading}
	<div class="loading"><div class="spinner"></div></div>
{:else if authState.isAdmin}
	{@render children()}
{/if}

<style lang="scss">
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 40vh;
	}
	.spinner {
		width: 36px;
		height: 36px;
		border: 3px solid var(--c-gray);
		border-top-color: var(--c-green);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin { to { transform: rotate(360deg); } }
</style>
