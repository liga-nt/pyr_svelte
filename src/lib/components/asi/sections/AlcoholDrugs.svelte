<script>
	import { form } from '../store.svelte.js';
	import Num from '../inputs/Num.svelte';
	import Rating from '../inputs/Rating.svelte';
	import YesNo from '../inputs/YesNo.svelte';

	const SUBSTANCES = [
		{ key: 'd1', label: 'Alcohol (any use at all)', route: false },
		{ key: 'd2', label: 'Alcohol (to intoxication)', route: false },
		{ key: 'd3', label: 'Heroin', route: true },
		{ key: 'd4', label: 'Methadone', route: true },
		{ key: 'd5', label: 'Other Opiates / Analgesics', route: true },
		{ key: 'd6', label: 'Barbiturates', route: true },
		{ key: 'd7', label: 'Other Sedatives / Hypnotics / Tranquilizers', route: true },
		{ key: 'd8', label: 'Cocaine', route: true },
		{ key: 'd9', label: 'Amphetamines', route: true },
		{ key: 'd10', label: 'Cannabis', route: true },
		{ key: 'd11', label: 'Hallucinogens', route: true },
		{ key: 'd12', label: 'Inhalants', route: true },
		{ key: 'd13', label: 'More than one substance per day (incl. alcohol)', route: false },
	];

	// Which past-30 (a) columns feed the drug composite (all except d2a, d12a)
	const drugCompositeKeys = new Set(['d1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d13']);
	const alcCompositeKeys = new Set(['d1','d2']);

	const ROUTES = ['1-Oral','2-Nasal','3-Smoking','4-Non-IV Inj','5-IV'];

	/** @param {string} key @returns {any} */
	const dget = (key) => /** @type {any} */ (form.d)[key];
	/** @param {string} key @param {any} val */
	const dset = (key, val) => { /** @type {any} */ (form.d)[key] = val; };
</script>

<div class="section-body" class:scoring-mode={form.mode === 'scoring'}>
	<div class="form-grid">
		<div class="questions">

			<!-- Drug Use Grid -->
			<div class="q-block">
				<div class="q-group-header">Substance Use Grid</div>
				<div class="drug-grid-wrap">
					<table class="drug-grid">
						<thead>
							<tr>
								<th class="sub-col">Substance</th>
								<th class="num-col">Past 30 Days</th>
								<th class="num-col">Lifetime (Yrs)</th>
								<th class="route-col">Route</th>
							</tr>
						</thead>
						<tbody>
							{#each SUBSTANCES as sub}
								{@const isAlcComp = alcCompositeKeys.has(sub.key)}
								{@const isDrgComp = drugCompositeKeys.has(sub.key) && !alcCompositeKeys.has(sub.key)}
								<tr class:alc-composite={isAlcComp} class:drg-composite={isDrgComp}>
									<td class="sub-label">
										{sub.label}
										{#if isAlcComp}<span class="badge-alc">Alc</span>{/if}
										{#if isDrgComp}<span class="badge-drg">Drug</span>{/if}
									</td>
									<td>
										<input type="number" min="0" max="30"
											value={dget(`${sub.key}a`)}
											oninput={(e) => dset(`${sub.key}a`, e.currentTarget.valueAsNumber)}
											class="grid-num" />
									</td>
									<td>
										<input type="number" min="0"
											value={dget(`${sub.key}b`)}
											oninput={(e) => dset(`${sub.key}b`, e.currentTarget.valueAsNumber)}
											class="grid-num" />
									</td>
									<td>
										{#if sub.route}
											<select value={dget(`${sub.key}c`)}
												onchange={(e) => dset(`${sub.key}c`, Number(e.currentTarget.value) || null)}
												class="route-sel">
												<option value={null}>—</option>
												{#each ROUTES as r, i}
													<option value={i + 1}>{r}</option>
												{/each}
											</select>
										{:else}
											<span class="na-cell">N/A</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="q-hint-block">Composite badges: <span class="badge-alc">Alc</span> = Alcohol composite &nbsp; <span class="badge-drg">Drug</span> = Drug composite (past 30 days column)</div>
			</div>

			<!-- Interviewer: major substance -->
			<div class="q-block">
				<div class="q-row">
					<span class="q-id">D14</span>
					<div class="q-text">According to the interviewer, which substance is/are the major problem?
						<div class="q-hint">Code D1–D12 number, or: 00=no problem, 15=alcohol+drugs, 16=drugs only (no alcohol)</div>
					</div>
					<Num bind:value={form.d.d14a} id="d14a" />
					<Num bind:value={form.d.d14b} id="d14b" />
				</div>
				<div class="q-row">
					<span class="q-id">D15</span>
					<div class="q-text">How long was your last period of voluntary abstinence from the major substance? (months)
						<div class="q-hint">00 = never abstinent. Does not include hospitalization/incarceration periods.</div>
					</div>
					<Num bind:value={form.d.d15} id="d15" />
				</div>
				<div class="q-row">
					<span class="q-id">D16</span>
					<div class="q-text">How many months ago did this abstinence end? (If D15=0, code -8)</div>
					<Num bind:value={form.d.d16} id="d16" na />
				</div>
				<div class="q-row">
					<span class="q-id">D17</span>
					<div class="q-text">How many times in your life have you had Alcohol DTs?</div>
					<Num bind:value={form.d.d17} id="d17" />
				</div>
				<div class="q-row">
					<span class="q-id">D18</span>
					<div class="q-text">How many times have you overdosed on drugs?
						<div class="q-hint">Requires intervention by someone to recover; include suicide attempts by OD.</div>
					</div>
					<Num bind:value={form.d.d18} id="d18" />
				</div>
			</div>

			<!-- Treatment history -->
			<div class="q-block">
				<div class="q-group-header">Treatment History</div>
				<div class="q-row">
					<span class="q-id">D19</span>
					<div class="q-text">Times treated for alcohol abuse in your life?</div>
					<Num bind:value={form.d.d19} id="d19" />
				</div>
				<div class="q-row">
					<span class="q-id">D20</span>
					<div class="q-text">Times treated for drug abuse in your life?</div>
					<Num bind:value={form.d.d20} id="d20" />
				</div>
				<div class="q-row">
					<span class="q-id">D21</span>
					<div class="q-text">Of D19, how many were detox only? (If D19=0, code -8)</div>
					<Num bind:value={form.d.d21} id="d21" na />
				</div>
				<div class="q-row">
					<span class="q-id">D22</span>
					<div class="q-text">Of D20, how many were detox only? (If D20=0, code -8)</div>
					<Num bind:value={form.d.d22} id="d22" na />
				</div>
				<div class="q-group-header">Money spent in the past 30 days on:</div>
				<div class="q-row composite-row">
					<span class="q-id">D23</span>
					<div class="q-text">Alcohol</div>
					<span class="composite-badge">Composite</span>
					<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" min="0" bind:value={form.d.d23} class="grid-num wider" /></div>
				</div>
				<div class="q-row">
					<span class="q-id">D24</span>
					<div class="q-text">Drugs</div>
					<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" min="0" bind:value={form.d.d24} class="grid-num wider" /></div>
				</div>
				<div class="q-row">
					<span class="q-id">D25</span>
					<div class="q-text">Days treated in an outpatient setting for alcohol or drugs in the past 30 days (include AA/NA)</div>
					<Num bind:value={form.d.d25} max={30} id="d25" />
				</div>
			</div>

			<!-- Past 30 days problems -->
			<div class="q-block">
				<div class="q-group-header">How many days in the past 30 have you experienced:</div>
				<div class="q-row composite-row">
					<span class="q-id">D26</span>
					<div class="q-text">Alcohol problems?</div>
					<span class="composite-badge">Composite</span>
					<Num bind:value={form.d.d26} max={30} id="d26" composite />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">D27</span>
					<div class="q-text">Drug problems?
						<div class="q-hint">Include craving, withdrawal, disturbing effects, or wanting to stop and being unable.</div>
					</div>
					<span class="composite-badge">Composite</span>
					<Num bind:value={form.d.d27} max={30} id="d27" composite />
				</div>

				<div class="q-group-header">Patient Rating Scale — How troubled or bothered in the past 30 days by:</div>
				<div class="q-row composite-row">
					<span class="q-id">D28</span>
					<div class="q-text">Alcohol problems</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.d.d28} scale="patient" composite />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">D29</span>
					<div class="q-text">Drug problems</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.d.d29} scale="patient" composite />
				</div>
				<div class="q-group-header">How important to you now is treatment for:</div>
				<div class="q-row composite-row">
					<span class="q-id">D30</span>
					<div class="q-text">Alcohol problems</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.d.d30} scale="patient" composite />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">D31</span>
					<div class="q-text">Drug problems</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.d.d31} scale="patient" composite />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Interviewer Severity Ratings (0–9)</div>
				<div class="q-row" style="border:none;padding:0;margin-bottom:0.5rem;">
					<span class="q-id">D32</span>
					<div class="q-text">Patient's need for treatment for alcohol problems</div>
					<Rating bind:value={form.d.d32} scale="severity" />
				</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">D33</span>
					<div class="q-text">Patient's need for treatment for drug problems</div>
					<Rating bind:value={form.d.d33} scale="severity" />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Confidence Ratings</div>
				<div class="q-row" style="border:none;padding:0;margin-bottom:0.5rem;">
					<span class="q-id">D34</span>
					<div class="q-text">Client's misrepresentation?</div>
					<YesNo bind:value={form.d.d34} />
				</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">D35</span>
					<div class="q-text">Client's inability to understand?</div>
					<YesNo bind:value={form.d.d35} />
				</div>
			</div>
		</div>

		<div class="comments-col">
			<div class="comments-label">Alcohol / Drug Comments</div>
			<p class="comments-hint">Include the question number with your notes.</p>
			<textarea bind:value={form.d.comments} class="comments-area" rows="40"></textarea>
		</div>
	</div>
</div>

<style lang="scss">
	@use './section-shared' as *;

	.q-hint { font-size: 0.75rem; color: #888; font-style: italic; margin-top: 0.2rem; line-height: 1.4; }
	.q-hint-block { padding: 0.5rem 0.85rem; font-size: 0.75rem; color: #888; border-top: 1px solid #f0f0f0; }
	.currency-wrap { display: flex; align-items: center; gap: 0.2rem; }
	.currency-sym { font-size: 0.85rem; color: #666; }

	.drug-grid-wrap { overflow-x: auto; }

	.drug-grid {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;

		th {
			background: #f5f5f5;
			padding: 0.4rem 0.6rem;
			text-align: left;
			font-weight: 600;
			color: #555;
			border-bottom: 2px solid #e0e0e0;
			white-space: nowrap;
		}

		td {
			padding: 0.35rem 0.5rem;
			border-bottom: 1px solid #f0f0f0;
			vertical-align: middle;
		}

		tr:last-child td { border-bottom: none; }
		tr.alc-composite { background: color-mix(in srgb, var(--c-blue) 8%, white); }
		tr.drg-composite { background: color-mix(in srgb, var(--c-green) 8%, white); }
	}

	.sub-col { width: 45%; }
	.num-col { width: 18%; }
	.route-col { width: 19%; }

	.sub-label { display: flex; align-items: center; gap: 0.4rem; color: var(--c-dark); line-height: 1.35; }

	.badge-alc {
		font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em;
		background: var(--c-blue); color: var(--c-dark);
		padding: 0.1rem 0.3rem; border-radius: 3px; white-space: nowrap; flex-shrink: 0;
	}
	.badge-drg {
		font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em;
		background: var(--c-green); color: var(--c-dark);
		padding: 0.1rem 0.3rem; border-radius: 3px; white-space: nowrap; flex-shrink: 0;
	}

	.grid-num {
		width: 56px;
		padding: 0.3rem 0.4rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		font-size: 0.82rem;
		font-family: ibm-plex-mono, monospace;
		&:focus { outline: none; border-color: var(--c-blue); }
		&.wider { width: 90px; }
	}

	.route-sel {
		padding: 0.3rem 0.3rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		font-size: 0.78rem;
		background: white;
		max-width: 140px;
		&:focus { outline: none; border-color: var(--c-blue); }
	}

	.na-cell { font-size: 0.75rem; color: #bbb; font-style: italic; }
</style>
