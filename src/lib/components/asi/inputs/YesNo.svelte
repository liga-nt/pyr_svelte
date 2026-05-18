<script>
	// values: 0=No, 1=Yes (standard), or 0=No, 2=Yes (f3), or 0/1/-8 (no contact)
	let { value = $bindable(), label = '', noContact = false, composite = false } = $props();
</script>

<div class="yesno" class:composite>
	{#if label}<div class="field-label">{label}</div>{/if}
	<div class="btn-row">
		<button type="button" class="opt" class:active={value === 0}
			onclick={() => value = value === 0 ? null : 0}>0 — No</button>
		<button type="button" class="opt" class:active={value === 1}
			onclick={() => value = value === 1 ? null : 1}>1 — Yes</button>
		{#if noContact}
			<button type="button" class="opt no-contact" class:active={value === -8}
				onclick={() => value = value === -8 ? null : -8}>No contact</button>
		{/if}
	</div>
</div>

<style lang="scss">
	.yesno { display: flex; flex-direction: column; gap: 0.25rem; }
	.field-label { font-size: 0.82rem; font-weight: 500; color: #555; }
	.btn-row { display: flex; gap: 0.35rem; flex-wrap: wrap; }

	.opt {
		padding: 0.3rem 0.75rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		background: white;
		font-size: 0.82rem;
		font-family: ibm-plex-mono, monospace;
		color: #555;
		cursor: pointer;
		box-shadow: none;
		transition: background 0.1s, border-color 0.1s;

		&.active { background: var(--c-blue); border-color: var(--c-blue); color: var(--c-dark); font-weight: 700; }
		&.no-contact.active { background: #f0f0f0; border-color: #999; color: #555; }
		&:hover:not(.active) { border-color: #999; box-shadow: none; }
	}
</style>
