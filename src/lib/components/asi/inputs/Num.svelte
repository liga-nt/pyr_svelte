<script>
	let { value = $bindable(), label = '', id = '', max = null, placeholder = '0', na = false, composite = false } = $props();
</script>

<div class="field" class:composite>
	{#if label}
		<label for={id} class="field-label">{label}</label>
	{/if}
	<div class="input-row">
		<input
			type="number"
			{id}
			min="0"
			{max}
			{placeholder}
			bind:value
			class="num-input"
		/>
		{#if na}
			<button
				type="button"
				class="na-btn"
				class:active={value === -8}
				onclick={() => value = value === -8 ? null : -8}
				title="Not applicable"
			>N/A</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.field { display: flex; flex-direction: column; gap: 0.25rem; }
	.field-label { font-size: 0.82rem; font-weight: 500; color: #555; }
	.input-row { display: flex; gap: 0.4rem; align-items: center; }

	.num-input {
		width: 80px;
		padding: 0.35rem 0.5rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		font-size: 0.9rem;
		font-family: ibm-plex-mono, monospace;
		color: var(--c-dark);
		background: white;

		&:focus { outline: none; border-color: var(--c-blue); }
		&:disabled { background: #f5f5f5; }
	}

	.na-btn {
		font-size: 0.72rem;
		font-weight: 600;
		padding: 0.3rem 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: white;
		color: #888;
		cursor: pointer;
		box-shadow: none;

		&.active { background: #f0f0f0; color: var(--c-dark); border-color: #999; }
		&:hover { border-color: #999; box-shadow: none; }
	}

	.composite .num-input { border-color: color-mix(in srgb, var(--c-blue) 50%, #d0d0d0); }
</style>
