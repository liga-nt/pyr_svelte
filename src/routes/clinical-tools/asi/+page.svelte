<script>
	import { form, SECTIONS } from '$lib/components/asi/store.svelte.js';
	import Stepper from '$lib/components/asi/Stepper.svelte';
	import CompositePanel from '$lib/components/asi/CompositePanel.svelte';
	import GeneralInfo from '$lib/components/asi/sections/GeneralInfo.svelte';
	import Medical from '$lib/components/asi/sections/Medical.svelte';
	import Employment from '$lib/components/asi/sections/Employment.svelte';
	import AlcoholDrugs from '$lib/components/asi/sections/AlcoholDrugs.svelte';
	import Legal from '$lib/components/asi/sections/Legal.svelte';
	import FamilyHistory from '$lib/components/asi/sections/FamilyHistory.svelte';
	import FamilySocial from '$lib/components/asi/sections/FamilySocial.svelte';
	import Psychiatric from '$lib/components/asi/sections/Psychiatric.svelte';
	import Results from '$lib/components/asi/sections/Results.svelte';
	import ScoringSheet from '$lib/components/asi/ScoringSheet.svelte';

	const currentLabel = $derived(
		form.mode === 'scoring' && form.currentSection !== 8
			? 'Composite Items'
			: (SECTIONS[form.currentSection]?.label ?? '')
	);
</script>

<svelte:head>
	<title>ASI-5 — Addiction Severity Index | Clinical Tools | Plan Your Recovery</title>
	<meta
		name="description"
		content="Digital ASI-5 (Addiction Severity Index, 5th Edition) with automatic composite score calculation. Full interview mode and scoring-only mode for clinicians using the paper form."
	/>
</svelte:head>

{#if form.currentSection === -1}
	<!-- Landing / mode selection -->
	<div class="landing">
		<div class="landing-inner">
			<p class="eyebrow">Clinical Screening Tool</p>
			<h1>Addiction Severity Index — 5th Edition</h1>
			<p class="intro">
				The ASI-5 is a structured clinical interview covering seven problem domains: Medical,
				Employment, Alcohol, Drug, Legal, Family/Social, and Psychiatric. Composite scores (0–1)
				are calculated automatically as you enter data. Nothing is saved or transmitted — all
				processing happens in your browser.
			</p>

			<div class="mode-cards">
				<button
					class="mode-card"
					onclick={() => { form.mode = 'full'; form.currentSection = 0; }}
				>
					<div class="mode-icon">&#9776;</div>
					<div class="mode-title">Full Interview</div>
					<div class="mode-desc">
						Complete digital ASI-5 — all sections, all questions. Administer during intake or enter
						responses after the interview.
					</div>
					<div class="mode-tag">~45–60 min</div>
				</button>

				<button
					class="mode-card"
					onclick={() => { form.mode = 'scoring'; form.currentSection = 0; }}
				>
					<div class="mode-icon">&#9998;</div>
					<div class="mode-title">Score a Paper Form</div>
					<div class="mode-desc">
						Already have a completed paper ASI? Enter only the composite-scored items to calculate
						and print the seven domain scores.
					</div>
					<div class="mode-tag">~5–10 min</div>
				</button>
			</div>

			<div class="disclaimer">
				<p>
					<strong>No data is collected or stored.</strong> Responses exist only in your browser
					session. If you are using this tool on behalf of a client, do not enter any personally
					identifying information — enter ID numbers only.
				</p>
				<p>
					This tool is designed for use by trained clinicians familiar with ASI administration.
					Results should be interpreted in the context of the full clinical interview.
					If you are experiencing a mental health or substance use crisis, call or text
					<a href="tel:988"><strong>988</strong></a> (Suicide & Crisis Lifeline, 24/7).
				</p>
			</div>
		</div>
	</div>

{:else}
	<!-- Interview / scoring interface -->
	<div class="asi-layout">
		<div class="asi-main">
			<div class="asi-header no-print">
				<div class="header-left">
					<button class="back-link" onclick={() => form.currentSection = -1}>
						&larr; ASI-5
					</button>
					<div class="mode-badge" class:scoring={form.mode === 'scoring'}>
						{form.mode === 'scoring' ? 'Scoring Mode' : 'Full Interview'}
					</div>
				</div>
				<div class="section-title">{currentLabel}</div>
			</div>

			{#if form.mode === 'scoring' && form.currentSection !== 8}
				<div class="section-content">
					<ScoringSheet />
				</div>
			{:else}
				<Stepper />
				<div class="section-content">
					{#if form.currentSection === 0}
						<GeneralInfo />
					{:else if form.currentSection === 1}
						<Medical />
					{:else if form.currentSection === 2}
						<Employment />
					{:else if form.currentSection === 3}
						<AlcoholDrugs />
					{:else if form.currentSection === 4}
						<Legal />
					{:else if form.currentSection === 5}
						<FamilyHistory />
					{:else if form.currentSection === 6}
						<FamilySocial />
					{:else if form.currentSection === 7}
						<Psychiatric />
					{:else if form.currentSection === 8}
						<Results />
					{/if}
				</div>
			{/if}
		</div>

		{#if form.currentSection < 8}
			<div class="sidebar no-print">
				<CompositePanel />
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	/* Landing */
	.landing {
		width: 100%;
		padding: var(--space-large) 0;
	}

	.landing-inner {
		max-width: 780px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.eyebrow {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--c-dark);
		opacity: 0.5;
		margin: 0;
	}

	h1 { margin: 0; }

	.intro {
		font-size: 1rem;
		line-height: 1.7;
		color: #444;
		margin: 0;
	}

	.mode-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;

		@media (min-width: 600px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.mode-card {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 1.25rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		background: white;
		cursor: pointer;
		text-align: left;
		box-shadow: none;
		transition: border-color 0.2s, box-shadow 0.2s;

		&:hover {
			border-color: var(--c-dark);
			box-shadow: 0 4px 16px rgba(0,0,0,0.1);
		}
	}

	.mode-icon {
		font-size: 1.5rem;
		color: #666;
	}

	.mode-title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--c-dark);
	}

	.mode-desc {
		font-size: 0.88rem;
		line-height: 1.55;
		color: #555;
	}

	.mode-tag {
		font-size: 0.75rem;
		font-family: ibm-plex-mono, monospace;
		color: #888;
		background: #f0f0f0;
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
	}

	.disclaimer {
		background: #fff8e1;
		border-left: 4px solid #f59e0b;
		border-radius: 4px;
		padding: 0.85rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;

		p { font-size: 0.85rem; line-height: 1.6; color: var(--c-dark); margin: 0; }
		a { color: var(--c-dark); font-weight: 700; }
	}

	/* Interview layout */
	.asi-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		max-width: 1300px;
		margin: 0 auto;
		padding: var(--space-small) var(--container-padding);

		@media (min-width: 1100px) {
			grid-template-columns: 1fr 220px;
			align-items: flex-start;
		}
	}

	.asi-main {
		display: flex;
		flex-direction: column;
		gap: 0;
		min-width: 0;
	}

	.asi-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 0.75rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid #e8e8e8;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.back-link {
		font-size: 0.82rem;
		font-weight: 600;
		color: #888;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		box-shadow: none;

		&:hover { color: var(--c-dark); box-shadow: none; }
	}

	.mode-badge {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: #f0f0f0;
		color: #666;
		padding: 0.2rem 0.6rem;
		border-radius: 3px;

		&.scoring {
			background: color-mix(in srgb, var(--c-blue) 25%, white);
			color: var(--c-dark);
		}
	}

	.section-title {
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--c-dark);
	}

	.scoring-notice {
		background: color-mix(in srgb, var(--c-blue) 12%, white);
		border: 1px solid color-mix(in srgb, var(--c-blue) 30%, white);
		border-radius: 4px;
		padding: 0.6rem 0.85rem;
		font-size: 0.82rem;
		color: var(--c-dark);
		margin-bottom: 0.85rem;
	}

	.section-content { padding-bottom: var(--space-large); }

	.sidebar {
		@media (max-width: 1099px) { display: none; }
	}

	@media print {
		.no-print { display: none !important; }

		:global(header), :global(footer) { display: none !important; }

		.asi-layout {
			padding: 0;
			grid-template-columns: 1fr;
		}
	}
</style>
