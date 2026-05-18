<script>
	import { form, SECTIONS } from './store.svelte.js';
</script>

<nav class="stepper no-print">
	<div class="steps">
		{#each SECTIONS as sec, i}
			<button
				type="button"
				class="step"
				class:active={form.currentSection === i}
				class:done={form.currentSection > i}
				onclick={() => form.currentSection = i}
				title={sec.label}
			>
				<span class="step-num">{i + 1}</span>
				<span class="step-label">{sec.label}</span>
			</button>
			{#if i < SECTIONS.length - 1}
				<span class="step-connector" class:filled={form.currentSection > i}></span>
			{/if}
		{/each}
	</div>

	<div class="step-nav">
		{#if form.currentSection > 0}
			<button type="button" class="nav-btn" onclick={() => form.currentSection--}>
				&larr; Previous
			</button>
		{/if}
		{#if form.currentSection < SECTIONS.length - 1}
			<button type="button" class="nav-btn primary" onclick={() => form.currentSection++}>
				Next &rarr;
			</button>
		{/if}
	</div>
</nav>

<style lang="scss">
	.stepper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-bottom: 1.25rem;
		border-bottom: 2px solid #e8e8e8;
		margin-bottom: 1.5rem;
	}

	.steps {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0;
		overflow-x: auto;
	}

	.step {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.5rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		box-shadow: none;
		transition: background 0.15s, border-color 0.15s;
		white-space: nowrap;

		&.active {
			background: var(--c-dark);
			border-color: var(--c-dark);
			color: white;
			.step-num { background: white; color: var(--c-dark); }
		}

		&.done {
			background: #f0f0f0;
			border-color: #ccc;
			color: #555;
		}

		&:hover:not(.active) {
			border-color: #999;
			box-shadow: none;
		}
	}

	.step-num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #e0e0e0;
		color: #555;
		font-size: 0.65rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.step-label {
		font-size: 0.75rem;
		font-weight: 600;

		@media (max-width: 700px) {
			display: none;
		}
	}

	.step-connector {
		width: 16px;
		height: 2px;
		background: #e0e0e0;
		flex-shrink: 0;

		&.filled { background: #ccc; }
	}

	.step-nav {
		display: flex;
		gap: 0.5rem;
	}

	.nav-btn {
		padding: 0.45rem 1rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		background: white;
		font-size: 0.85rem;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 600;
		color: var(--c-dark);
		cursor: pointer;
		box-shadow: none;
		transition: background 0.15s;

		&.primary {
			background: var(--c-dark);
			border-color: var(--c-dark);
			color: white;
		}

		&:hover { opacity: 0.85; box-shadow: none; }
	}

	@media print { .no-print { display: none !important; } }
</style>
