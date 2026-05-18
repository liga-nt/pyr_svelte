<script>
	import { form, getComposites } from '../store.svelte.js';
	const composites = $derived(getComposites());

	const DOMAINS = [
		{ key: 'medcomp', label: 'Medical', color: 'var(--c-blue)' },
		{ key: 'empcomp', label: 'Employment', color: 'var(--c-green)' },
		{ key: 'alccomp', label: 'Alcohol', color: 'var(--c-yellow)' },
		{ key: 'drgcomp', label: 'Drug', color: 'var(--c-purple)' },
		{ key: 'legcomp', label: 'Legal', color: '#e76f51' },
		{ key: 'famcomp', label: 'Family / Social', color: '#2a9d8f' },
		{ key: 'psycomp', label: 'Psychiatric', color: '#9b59b6' },
	];

	/** @param {number | null | undefined} v */
	function fmt(v) {
		if (v === null || v === undefined) return '—';
		return Math.min(v, 1).toFixed(3);
	}

	/** @param {number | null | undefined} v */
	function pct(v) {
		if (v === null || v === undefined) return 0;
		return Math.min(Math.max(v, 0), 1) * 100;
	}

	/** @param {number | null | undefined} v */
	function severity(v) {
		if (v === null || v === undefined) return 'Incomplete';
		const c = Math.min(v, 1);
		if (c < 0.06) return 'Minimal';
		if (c < 0.25) return 'Low';
		if (c < 0.45) return 'Moderate';
		if (c < 0.65) return 'Substantial';
		return 'High';
	}

	/** @param {number | null | undefined} v */
	function severityClass(v) {
		if (v === null || v === undefined) return 'sev-incomplete';
		const c = Math.min(v, 1);
		if (c < 0.06) return 'sev-minimal';
		if (c < 0.25) return 'sev-low';
		if (c < 0.45) return 'sev-moderate';
		if (c < 0.65) return 'sev-substantial';
		return 'sev-high';
	}

	const clientId = $derived(form.g.g1 || '—');
	const interviewDate = $derived(form.g.g5 || '—');
	const interviewerCode = $derived(form.g.g11 || '—');
	const isIntake = $derived(form.g.g8 === 1 ? 'Intake' : form.g.g8 === 2 ? 'Follow-up' : '—');
</script>

<div class="results-page">
	<div class="results-header no-print-hide">
		<h2>ASI-5 Composite Scores</h2>
		<div class="meta-row">
			<span>ID: <strong>{clientId}</strong></span>
			<span>Interview Date: <strong>{interviewDate}</strong></span>
			<span>Interviewer: <strong>{interviewerCode}</strong></span>
			<span>Type: <strong>{isIntake}</strong></span>
		</div>
	</div>

	<div class="scores-grid">
		{#each DOMAINS as d}
			{@const val = (/** @type {any} */ (composites))[d.key]}
			<div class="score-card">
				<div class="score-accent" style="background: {d.color}"></div>
				<div class="score-body">
					<div class="score-label">{d.label}</div>
					<div class="score-val">{fmt(val)}</div>
					<div class="bar-track">
						<div class="bar-fill" style="width: {pct(val)}%; background: {d.color}"></div>
					</div>
					<div class="severity-tag {severityClass(val)}">{severity(val)}</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="scores-table-wrap">
		<table class="scores-table">
			<thead>
				<tr>
					<th>Domain</th>
					<th>Composite Score (0–1)</th>
					<th>Range Indication</th>
				</tr>
			</thead>
			<tbody>
				{#each DOMAINS as d}
					{@const cv = (/** @type {any} */ (composites))[d.key]}
					<tr>
						<td>{d.label}</td>
						<td class="score-cell">{fmt(cv)}</td>
						<td><span class="sev-pill {severityClass(cv)}">{severity(cv)}</span></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="print-note">
		<p>
			Composite scores range from 0 (no problem severity indicated) to 1 (maximum problem severity).
			Scores reflect responses from the past 30 days and should be interpreted alongside the full clinical
			interview, not in isolation. Scores labeled "Incomplete" have one or more required items unanswered.
		</p>
	</div>

	<div class="print-actions no-print-hide">
		<button class="print-btn" onclick={() => window.print()}>Print / Save as PDF</button>
	</div>

	<!-- Severity Reference -->
	<div class="ref-box no-print-hide">
		<div class="ref-title">Score Range Reference</div>
		<div class="ref-row"><span class="sev-pill sev-minimal">Minimal</span><span>0.00–0.05</span></div>
		<div class="ref-row"><span class="sev-pill sev-low">Low</span><span>0.06–0.24</span></div>
		<div class="ref-row"><span class="sev-pill sev-moderate">Moderate</span><span>0.25–0.44</span></div>
		<div class="ref-row"><span class="sev-pill sev-substantial">Substantial</span><span>0.45–0.64</span></div>
		<div class="ref-row"><span class="sev-pill sev-high">High</span><span>0.65–1.00</span></div>
	</div>
</div>

<style lang="scss">
	.results-page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 900px;
	}

	.results-header {
		h2 { font-size: 1.4rem; margin-bottom: 0.4rem; }
	}

	.meta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.85rem;
		color: #555;

		strong { color: var(--c-dark); }
	}

	.scores-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.85rem;
	}

	.score-card {
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		overflow: hidden;
	}

	.score-accent {
		height: 5px;
	}

	.score-body {
		padding: 0.75rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.score-label {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #666;
	}

	.score-val {
		font-size: 1.6rem;
		font-weight: 700;
		font-family: ibm-plex-mono, monospace;
		color: var(--c-dark);
		line-height: 1.1;
	}

	.bar-track {
		height: 6px;
		background: #f0f0f0;
		border-radius: 3px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 0.3s ease;
		min-width: 2px;
	}

	.severity-tag {
		font-size: 0.72rem;
		font-weight: 600;
		align-self: flex-start;
	}

	.scores-table-wrap { overflow-x: auto; }

	.scores-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.88rem;

		th {
			text-align: left;
			padding: 0.5rem 0.75rem;
			background: #f5f5f5;
			border-bottom: 2px solid #e0e0e0;
			font-weight: 600;
			color: #555;
		}

		td {
			padding: 0.45rem 0.75rem;
			border-bottom: 1px solid #f0f0f0;
			color: var(--c-dark);
		}

		tr:last-child td { border-bottom: none; }
	}

	.score-cell {
		font-family: ibm-plex-mono, monospace;
		font-weight: 600;
	}

	.sev-pill {
		display: inline-block;
		font-size: 0.72rem;
		font-weight: 700;
		padding: 0.15rem 0.5rem;
		border-radius: 20px;
	}

	.sev-incomplete { color: #888; }
	.sev-minimal    { background: #f0f0f0; color: #666; }
	.sev-low        { background: color-mix(in srgb, var(--c-green) 35%, white); color: #2d7a45; }
	.sev-moderate   { background: color-mix(in srgb, var(--c-yellow) 50%, white); color: #7a5f00; }
	.sev-substantial { background: color-mix(in srgb, #e76f51 30%, white); color: #8b3a20; }
	.sev-high       { background: color-mix(in srgb, #dc2626 25%, white); color: #7f1d1d; }

	.print-note {
		background: #f8f8f8;
		border-radius: 4px;
		padding: 0.75rem 1rem;

		p { font-size: 0.82rem; color: #666; line-height: 1.6; margin: 0; font-style: italic; }
	}

	.print-actions {
		display: flex;
		gap: 0.75rem;
	}

	.print-btn {
		background: var(--c-dark);
		color: white;
		border: none;
		border-radius: 4px;
		padding: 0.65rem 1.5rem;
		font-size: 0.9rem;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 600;
		cursor: pointer;
		box-shadow: none;
		transition: opacity 0.15s;

		&:hover { opacity: 0.82; box-shadow: none; }
	}

	.ref-box {
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 0.85rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		max-width: 300px;
	}

	.ref-title {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #666;
		margin-bottom: 0.25rem;
	}

	.ref-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.8rem;
		font-family: ibm-plex-mono, monospace;
		color: #555;
	}

	@media print {
		.no-print-hide { display: none !important; }

		.results-page {
			gap: 1rem;
		}

		.scores-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: 0.5rem;
		}

		.score-card {
			page-break-inside: avoid;
		}

		.score-body {
			padding: 0.5rem 0.75rem;
		}
	}
</style>
