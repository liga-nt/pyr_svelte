<script>
	let { value = $bindable(), label = '', options = [], id = '', composite = false } = $props();
</script>

<div class="select-field" class:composite>
	{#if label}<label for={id} class="field-label">{label}</label>{/if}
	<select {id} bind:value class="sel">
		<option value={null}>—</option>
		{#each options as opt}
			<option value={opt.value}>{opt.label}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	.select-field { display: flex; flex-direction: column; gap: 0.25rem; }
	.field-label { font-size: 0.82rem; font-weight: 500; color: #555; }

	.sel {
		padding: 0.35rem 0.5rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		font-size: 0.88rem;
		color: var(--c-dark);
		background: white;
		max-width: 260px;

		&:focus { outline: none; border-color: var(--c-blue); }
	}
</style>
