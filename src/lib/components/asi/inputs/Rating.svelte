<script>
	// scale: 'patient' (0-4) | 'severity' (0-9)
	let { value = $bindable(), label = '', scale = 'patient', composite = false } = $props();

	const patientLabels = ['Not at all', 'Slightly', 'Moderately', 'Considerably', 'Extremely'];
	const count = scale === 'patient' ? 5 : 10;
</script>

<div class="rating-field" class:composite>
	{#if label}<div class="field-label">{label}</div>{/if}
	<div class="btn-row">
		{#each Array(count) as _, i}
			<button
				type="button"
				class="rating-btn"
				class:active={value === i}
				onclick={() => value = value === i ? null : i}
				title={scale === 'patient' ? patientLabels[i] : String(i)}
			>
				{i}
			</button>
		{/each}
	</div>
	{#if scale === 'patient' && value !== null && value >= 0}
		<div class="rating-label">{patientLabels[value]}</div>
	{/if}
	{#if value === null || value === undefined}
		<span class="unanswered-print">Not answered</span>
	{/if}
</div>

<style lang="scss">
	.rating-field { display: flex; flex-direction: column; gap: 0.3rem; }
	.field-label { font-size: 0.82rem; font-weight: 500; color: #555; }
	.rating-label { font-size: 0.75rem; color: var(--c-text-muted); font-style: italic; }

	.btn-row {
		display: flex;
		gap: 3px;
		flex-wrap: wrap;
	}

	.rating-btn {
		width: 32px;
		height: 32px;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		background: white;
		font-size: 0.82rem;
		font-family: ibm-plex-mono, monospace;
		color: #666;
		cursor: pointer;
		box-shadow: none;
		transition: background 0.1s, border-color 0.1s;

		&.active {
			background: var(--c-blue);
			border-color: var(--c-blue);
			color: var(--c-dark);
			font-weight: 700;
		}

		&:hover:not(.active) { border-color: #999; box-shadow: none; }
	}

	.composite .rating-btn.active { background: var(--c-blue); }

	.unanswered-print {
		display: none;
	}

	@media print {
		.rating-btn:not(.active) { display: none; }

		.rating-btn.active {
			background: white !important;
			border: 1.5px solid var(--c-dark) !important;
			color: var(--c-dark) !important;
		}

		.unanswered-print {
			display: inline;
			font-size: 0.8rem;
			font-style: italic;
			color: #888;
		}
	}
</style>
