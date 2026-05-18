<script>
	import { form } from './store.svelte.js';
	import Num from './inputs/Num.svelte';
	import Rating from './inputs/Rating.svelte';
	import YesNo from './inputs/YesNo.svelte';

	const DRUG_SUBSTANCES = [
		{ key: 'd3a',  label: 'Heroin' },
		{ key: 'd4a',  label: 'Methadone' },
		{ key: 'd5a',  label: 'Other Opiates / Analgesics' },
		{ key: 'd6a',  label: 'Barbiturates' },
		{ key: 'd7a',  label: 'Other Sedatives / Hypnotics / Tranq.' },
		{ key: 'd8a',  label: 'Cocaine' },
		{ key: 'd9a',  label: 'Amphetamines' },
		{ key: 'd10a', label: 'Cannabis' },
		{ key: 'd11a', label: 'Hallucinogens' },
		{ key: 'd13a', label: 'Multiple substances per day (incl. alc)' },
	];

	const RELATIONSHIPS = [
		{ key: 'f18a', label: 'Mother' },
		{ key: 'f19a', label: 'Father' },
		{ key: 'f20a', label: 'Brothers / Sisters' },
		{ key: 'f21a', label: 'Sexual Partner / Spouse' },
		{ key: 'f22a', label: 'Children' },
		{ key: 'f23a', label: 'Other significant family' },
		{ key: 'f24a', label: 'Close friends' },
		{ key: 'f25a', label: 'Neighbors' },
		{ key: 'f26a', label: 'Co-workers' },
	];

	const PSYCH_SYMPTOMS = [
		{ key: 'p4a',  label: 'Serious depression' },
		{ key: 'p5a',  label: 'Serious anxiety or tension' },
		{ key: 'p6a',  label: 'Hallucinations' },
		{ key: 'p7a',  label: 'Trouble concentrating / remembering' },
		{ key: 'p8a',  label: 'Trouble controlling violent behavior' },
		{ key: 'p9a',  label: 'Serious thoughts of suicide' },
		{ key: 'p10a', label: 'Attempted suicide' },
		{ key: 'p11a', label: 'Prescribed medication for psych problems' },
	];

	/** @param {number | null} current */
	function cycleContact(current) {
		if (current === null) return 0;
		if (current === 0) return 1;
		if (current === 1) return -8;
		return null;
	}

	/** @param {number | null} v */
	function contactLabel(v) {
		if (v === null) return '—';
		if (v === 0) return 'No';
		if (v === 1) return 'Yes';
		return 'N/C';
	}

	/** @param {number | null} v */
	function contactClass(v) {
		if (v === 0) return 'val-no';
		if (v === 1) return 'val-yes';
		if (v === -8) return 'val-nr';
		return 'val-empty';
	}

	/** @param {string} key @returns {number | null} */
	const fget = (key) => /** @type {any} */ (form.f)[key];
	/** @param {string} key @param {number | null} val */
	const fset = (key, val) => { /** @type {any} */ (form.f)[key] = val; };

	/** @param {string} key @returns {number | null} */
	const dget = (key) => /** @type {any} */ (form.d)[key];
	/** @param {string} key @param {number | null} val */
	const dset = (key, val) => { /** @type {any} */ (form.d)[key] = val; };
</script>

<div class="scoring-sheet">

	<!-- Medical -->
	<div class="domain">
		<div class="domain-header">
			<span class="domain-name">Medical</span>
			<span class="domain-hint">Past 30 days</span>
		</div>
		<div class="rows">
			<div class="row">
				<span class="q-id">M6</span>
				<span class="q-label">Days with medical problems</span>
				<Num bind:value={form.m.m6} id="s-m6" max={30} />
			</div>
			<div class="row">
				<span class="q-id">M7</span>
				<span class="q-label">How troubled by medical problems (0–4)</span>
				<Rating bind:value={form.m.m7} scale="patient" />
			</div>
			<div class="row">
				<span class="q-id">M8</span>
				<span class="q-label">Importance of treatment (0–4)</span>
				<Rating bind:value={form.m.m8} scale="patient" />
			</div>
		</div>
	</div>

	<!-- Employment -->
	<div class="domain">
		<div class="domain-header">
			<span class="domain-name">Employment</span>
		</div>
		<div class="rows">
			<div class="row">
				<span class="q-id">E4</span>
				<span class="q-label">Valid driver's license?</span>
				<YesNo bind:value={form.e.e4} />
			</div>
			<div class="row">
				<span class="q-id">E5</span>
				<span class="q-label">Automobile available for use? (if E4 = Yes)</span>
				<YesNo bind:value={form.e.e5} />
			</div>
			<div class="row">
				<span class="q-id">E11</span>
				<span class="q-label">Days of paid work in past 30</span>
				<Num bind:value={form.e.e11} id="s-e11" max={30} />
			</div>
			<div class="row">
				<span class="q-id">E12</span>
				<span class="q-label">Employment / wages income past 30 ($)</span>
				<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" min="0" bind:value={form.e.e12} class="num-input" /></div>
			</div>
			<div class="row">
				<span class="q-id">E17</span>
				<span class="q-label">Illegal income past 30 ($) <span class="also-legal">→ also Legal composite</span></span>
				<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" min="0" bind:value={form.e.e17} class="num-input" /></div>
			</div>
		</div>
	</div>

	<!-- Alcohol -->
	<div class="domain">
		<div class="domain-header">
			<span class="domain-name">Alcohol</span>
			<span class="domain-hint">Days = past 30 days</span>
		</div>
		<div class="rows">
			<div class="row">
				<span class="q-id">D1</span>
				<span class="q-label">Days — any alcohol use</span>
				<Num bind:value={form.d.d1a} id="s-d1a" max={30} />
			</div>
			<div class="row">
				<span class="q-id">D2</span>
				<span class="q-label">Days — alcohol to intoxication</span>
				<Num bind:value={form.d.d2a} id="s-d2a" max={30} />
			</div>
			<div class="row">
				<span class="q-id">D23</span>
				<span class="q-label">Money spent on alcohol past 30 ($)</span>
				<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" min="0" bind:value={form.d.d23} class="num-input" /></div>
			</div>
			<div class="row">
				<span class="q-id">D26</span>
				<span class="q-label">Days with alcohol problems</span>
				<Num bind:value={form.d.d26} id="s-d26" max={30} />
			</div>
			<div class="row">
				<span class="q-id">D28</span>
				<span class="q-label">How troubled by alcohol problems (0–4)</span>
				<Rating bind:value={form.d.d28} scale="patient" />
			</div>
			<div class="row">
				<span class="q-id">D30</span>
				<span class="q-label">Importance of alcohol treatment (0–4)</span>
				<Rating bind:value={form.d.d30} scale="patient" />
			</div>
		</div>
	</div>

	<!-- Drug -->
	<div class="domain">
		<div class="domain-header">
			<span class="domain-name">Drug</span>
			<span class="domain-hint">Days used in past 30</span>
		</div>
		<div class="rows">
			{#each DRUG_SUBSTANCES as sub}
				{@const dany = /** @type {any} */ (form.d)}
				<div class="row">
					<span class="q-id">{sub.key.replace('a','').toUpperCase()}</span>
					<span class="q-label">{sub.label}</span>
					<Num bind:value={dany[sub.key]} id="s-{sub.key}" max={30} />
				</div>
			{/each}
			<div class="row">
				<span class="q-id">D27</span>
				<span class="q-label">Days with drug problems</span>
				<Num bind:value={form.d.d27} id="s-d27" max={30} />
			</div>
			<div class="row">
				<span class="q-id">D29</span>
				<span class="q-label">How troubled by drug problems (0–4)</span>
				<Rating bind:value={form.d.d29} scale="patient" />
			</div>
			<div class="row">
				<span class="q-id">D31</span>
				<span class="q-label">Importance of drug treatment (0–4)</span>
				<Rating bind:value={form.d.d31} scale="patient" />
			</div>
		</div>
	</div>

	<!-- Legal -->
	<div class="domain">
		<div class="domain-header">
			<span class="domain-name">Legal</span>
			<span class="domain-hint">Illegal income entered above under Employment</span>
		</div>
		<div class="rows">
			<div class="row">
				<span class="q-id">L24</span>
				<span class="q-label">Presently awaiting charges, trial, or sentence?</span>
				<YesNo bind:value={form.l.l24} />
			</div>
			<div class="row">
				<span class="q-id">L27</span>
				<span class="q-label">Days of illegal activity past 30</span>
				<Num bind:value={form.l.l27} id="s-l27" max={30} />
			</div>
			<div class="row">
				<span class="q-id">L28</span>
				<span class="q-label">How serious are your legal problems (0–4)</span>
				<Rating bind:value={form.l.l28} scale="patient" />
			</div>
			<div class="row">
				<span class="q-id">L29</span>
				<span class="q-label">Importance of counseling for legal problems (0–4)</span>
				<Rating bind:value={form.l.l29} scale="patient" />
			</div>
		</div>
	</div>

	<!-- Family / Social -->
	<div class="domain">
		<div class="domain-header">
			<span class="domain-name">Family / Social</span>
		</div>
		<div class="rows">
			<div class="row">
				<span class="q-id">F3</span>
				<span class="q-label">Satisfied with current marital status? <span class="rev-note">(reversed: No=2, Yes=0)</span></span>
				<YesNo bind:value={form.f.f3} />
			</div>
		</div>

		<div class="rel-block">
			<div class="rel-header">F18–F26 — Serious problems in past 30 days with: <span class="cycle-hint">click to cycle No → Yes → No contact</span></div>
			<div class="rel-grid">
				{#each RELATIONSHIPS as rel}
					<div class="rel-row">
						<span class="rel-label">{rel.label}</span>
						<button
							type="button"
							class="contact-btn {contactClass(fget(rel.key))}"
							onclick={() => fset(rel.key, cycleContact(fget(rel.key)))}
						>{contactLabel(fget(rel.key))}</button>
					</div>
				{/each}
			</div>
		</div>

		<div class="rows">
			<div class="row">
				<span class="q-id">F30</span>
				<span class="q-label">Days with family / social problems past 30</span>
				<Num bind:value={form.f.f30} id="s-f30" max={30} />
			</div>
			<div class="row">
				<span class="q-id">F32</span>
				<span class="q-label">How troubled by family / social problems (0–4)</span>
				<Rating bind:value={form.f.f32} scale="patient" />
			</div>
			<div class="row">
				<span class="q-id">F34</span>
				<span class="q-label">Importance of treatment for family / social (0–4)</span>
				<Rating bind:value={form.f.f34} scale="patient" />
			</div>
		</div>
	</div>

	<!-- Psychiatric -->
	<div class="domain">
		<div class="domain-header">
			<span class="domain-name">Psychiatric</span>
			<span class="domain-hint">Past 30 days — significant period of time in which you have:</span>
		</div>
		<div class="rows">
			{#each PSYCH_SYMPTOMS as sym}
				{@const pany = /** @type {any} */ (form.p)}
				<div class="row">
					<span class="q-id">{sym.key.toUpperCase()}</span>
					<span class="q-label">{sym.label}</span>
					<YesNo bind:value={pany[sym.key]} />
				</div>
			{/each}
			<div class="row">
				<span class="q-id">P12</span>
				<span class="q-label">Days with psychological / emotional problems</span>
				<Num bind:value={form.p.p12} id="s-p12" max={30} />
			</div>
			<div class="row">
				<span class="q-id">P13</span>
				<span class="q-label">How troubled by psych problems (0–4)</span>
				<Rating bind:value={form.p.p13} scale="patient" />
			</div>
			<div class="row">
				<span class="q-id">P14</span>
				<span class="q-label">Importance of treatment for psych problems (0–4)</span>
				<Rating bind:value={form.p.p14} scale="patient" />
			</div>
		</div>
	</div>

	<div class="sheet-footer">
		<button
			class="results-btn"
			onclick={() => { form.currentSection = 8; }}
		>View Composite Scores &rarr;</button>
	</div>

</div>

<style lang="scss">
	.scoring-sheet {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding-bottom: var(--space-large);
	}

	.domain {
		border-bottom: 2px solid #e8e8e8;
		padding: 1.25rem 0 1rem;

		&:last-of-type { border-bottom: none; }
	}

	.domain-header {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.domain-name {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #888;
	}

	.domain-hint {
		font-size: 0.72rem;
		color: #bbb;
		font-style: italic;
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.row {
		display: grid;
		grid-template-columns: 36px 1fr auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid #f5f5f5;

		&:last-child { border-bottom: none; }
	}

	.q-id {
		font-size: 0.68rem;
		font-family: ibm-plex-mono, monospace;
		font-weight: 700;
		color: #bbb;
		text-align: right;
	}

	.q-label {
		font-size: 0.85rem;
		color: var(--c-dark);
		line-height: 1.4;
	}

	.rev-note, .also-legal {
		font-size: 0.72rem;
		color: #aaa;
		font-style: italic;
	}

	.currency-wrap {
		display: flex;
		align-items: center;
		gap: 0.2rem;
	}

	.currency-sym {
		font-size: 0.85rem;
		color: #888;
	}

	.num-input {
		width: 90px;
		padding: 0.35rem 0.5rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		font-size: 0.9rem;
		font-family: ibm-plex-mono, monospace;
		color: var(--c-dark);
		background: white;

		&:focus { outline: none; border-color: var(--c-blue); }
	}

	/* Relationship grid */
	.rel-block {
		margin: 0.5rem 0 0.75rem;
		border: 1px solid #eee;
		border-radius: 6px;
		overflow: hidden;
	}

	.rel-header {
		font-size: 0.72rem;
		font-weight: 600;
		color: #888;
		background: #f8f8f8;
		padding: 0.4rem 0.75rem;
		border-bottom: 1px solid #eee;
	}

	.cycle-hint {
		font-weight: 400;
		color: #bbb;
		font-style: italic;
		margin-left: 0.4rem;
	}

	.rel-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	}

	.rel-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.4rem 0.75rem;
		border-bottom: 1px solid #f5f5f5;
		border-right: 1px solid #f5f5f5;

		&:nth-last-child(-n+2) { border-bottom: none; }
	}

	.rel-label {
		font-size: 0.82rem;
		color: var(--c-dark);
	}

	.contact-btn {
		padding: 0.2rem 0.55rem;
		border-radius: 4px;
		border: 1px solid #d0d0d0;
		font-size: 0.75rem;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 600;
		cursor: pointer;
		box-shadow: none;
		min-width: 52px;
		text-align: center;
		transition: background 0.1s;
		flex-shrink: 0;

		&:hover { opacity: 0.85; box-shadow: none; }
	}

	.val-empty { background: white; color: #bbb; border-color: #e0e0e0; }
	.val-no    { background: #f0f0f0; color: #555; border-color: #ccc; }
	.val-yes   { background: var(--c-blue); color: var(--c-dark); border-color: var(--c-blue); }
	.val-nr    { background: #e8e8e8; color: #888; border-color: #ccc; font-style: italic; }

	.sheet-footer {
		padding-top: 1.5rem;
		display: flex;
		justify-content: flex-end;
	}

	.results-btn {
		background: var(--c-dark);
		color: white;
		border: none;
		border-radius: 5px;
		padding: 0.7rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: none;

		&:hover { opacity: 0.85; box-shadow: none; }
	}
</style>
