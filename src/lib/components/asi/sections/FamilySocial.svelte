<script>
	import { form } from '../store.svelte.js';
	import Num from '../inputs/Num.svelte';
	import Rating from '../inputs/Rating.svelte';
	import YesNo from '../inputs/YesNo.svelte';
	import Select from '../inputs/Select.svelte';

	const maritalOpts = [
		{ value: 1, label: '1 — Married' }, { value: 2, label: '2 — Remarried' },
		{ value: 3, label: '3 — Widowed' }, { value: 4, label: '4 — Separated' },
		{ value: 5, label: '5 — Divorced' }, { value: 6, label: '6 — Never married' },
	];

	const RELATIONSHIPS = [
		{ key: 'f18a', label: 'Mother' },
		{ key: 'f19a', label: 'Father' },
		{ key: 'f20a', label: 'Brothers / Sisters' },
		{ key: 'f21a', label: 'Sexual Partner / Spouse' },
		{ key: 'f22a', label: 'Children' },
		{ key: 'f23a', label: 'Other significant family members' },
		{ key: 'f24a', label: 'Close friends' },
		{ key: 'f25a', label: 'Neighbors' },
		{ key: 'f26a', label: 'Co-workers' },
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
		if (v === -8 || v === -98) return 'No contact';
		return '—';
	}

	/** @param {number | null} v */
	function contactClass(v) {
		if (v === 0) return 'val-no';
		if (v === 1) return 'val-yes';
		if (v === -8 || v === -98) return 'val-nr';
		return 'val-empty';
	}

	/** @param {string} key @returns {number | null} */
	const fget = (key) => /** @type {any} */ (form.f)[key];
	/** @param {string} key @param {number | null} val */
	const fset = (key, val) => { /** @type {any} */ (form.f)[key] = val; };
</script>

<div class="section-body" class:scoring-mode={form.mode === 'scoring'}>
	<div class="form-grid">
		<div class="questions">
			<div class="q-block">
				<div class="q-row">
					<span class="q-id">F1</span>
					<div class="q-text">
						<Select label="Marital Status" options={maritalOpts} bind:value={form.f.f1} id="f1" />
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">F2</span>
					<label class="q-text">How long? (years / months)</label>
					<div class="inline-pair">
						<Num bind:value={form.f.f2y} placeholder="Yrs" id="f2y" />
						<span class="unit">yrs</span>
						<Num bind:value={form.f.f2m} placeholder="Mos" id="f2m" max={11} />
						<span class="unit">mos</span>
					</div>
				</div>
				<div class="q-row composite-row">
					<span class="q-id">F3</span>
					<div class="q-text">Are you satisfied with your current marital status?
						<div class="q-hint">Reversed in composite: No=2, Yes=0</div>
					</div>
					<span class="composite-badge">Composite</span>
					<YesNo bind:value={form.f.f3} composite />
				</div>
				<div class="q-row">
					<span class="q-id">F4</span>
					<label class="q-text">How many people lived with you in the past 30 days?</label>
					<Num bind:value={form.f.f4} id="f4" />
				</div>
				<div class="q-row">
					<span class="q-id">F5</span>
					<div class="q-text">Do you live alone?</div>
					<YesNo bind:value={form.f.f5} />
				</div>
			</div>

			<div class="q-block">
				<div class="q-group-header composite-header">
					Composite — In the past 30 days, have you had significant periods of serious problems getting along with:
				</div>
				<div class="rel-hint">Click to cycle: — (unanswered) → No → Yes → No contact → —</div>
				<table class="rel-table">
					<thead>
						<tr>
							<th>Relationship</th>
							<th>Problems past 30 days?</th>
							<th>Importance of counseling (0–4)</th>
						</tr>
					</thead>
					<tbody>
						{#each RELATIONSHIPS as rel}
							{@const fany = /** @type {any} */ (form.f)}
							{@const bKey = rel.key.replace('a', 'b')}
							<tr>
								<td class="rel-label">{rel.label}</td>
								<td>
									<button
										type="button"
										class="contact-btn {contactClass(fget(rel.key))}"
										onclick={() => fset(rel.key, cycleContact(fget(rel.key)))}
									>{contactLabel(fget(rel.key))}</button>
									<span class="composite-badge" style="margin-left:0.3rem;">C</span>
								</td>
								<td>
									<Rating bind:value={fany[bKey]} scale="patient" />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="q-block">
				<div class="q-row">
					<span class="q-id">F27</span>
					<div class="q-text">Interviewer severity for family/social — How many days has patient experienced family/social problems past 30?</div>
					<Rating bind:value={form.f.f27} scale="severity" />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">F30</span>
					<div class="q-text">How many days in the past 30 have you experienced family or social problems?</div>
					<span class="composite-badge">Composite</span>
					<Num bind:value={form.f.f30} max={30} id="f30" composite />
				</div>
				<div class="q-group-header">Patient Rating Scale (0–4)</div>
				<div class="q-row composite-row">
					<span class="q-id">F32</span>
					<div class="q-text">How troubled or bothered have you been in the past 30 days by these family or social problems?</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.f.f32} scale="patient" composite />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">F34</span>
					<div class="q-text">How important to you now is treatment for these family or social problems?</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.f.f34} scale="patient" composite />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Confidence Ratings</div>
				<div class="q-row" style="border:none;padding:0;margin-bottom:0.5rem;">
					<span class="q-id">F28</span>
					<div class="q-text">Client's misrepresentation?</div>
					<YesNo bind:value={form.f.f28} />
				</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">F29</span>
					<div class="q-text">Client's inability to understand?</div>
					<YesNo bind:value={form.f.f29} />
				</div>
			</div>
		</div>

		<div class="comments-col">
			<div class="comments-label">Family / Social Comments</div>
			<p class="comments-hint">Include the question number with your notes.</p>
			<textarea bind:value={form.f.comments} class="comments-area" rows="28"></textarea>
		</div>
	</div>
</div>

<style lang="scss">
	@use './section-shared' as *;

	.q-hint { font-size: 0.75rem; color: #888; font-style: italic; margin-top: 0.2rem; line-height: 1.4; }
	.composite-header { background: color-mix(in srgb, var(--c-blue) 12%, white); }
	.rel-hint { font-size: 0.75rem; color: #888; font-style: italic; padding: 0.3rem 0.85rem; border-bottom: 1px solid #f0f0f0; }

	.rel-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.84rem;

		th {
			text-align: left;
			padding: 0.4rem 0.75rem;
			background: #f5f5f5;
			border-bottom: 2px solid #e0e0e0;
			font-weight: 600;
			color: #555;
			font-size: 0.78rem;
		}

		td {
			padding: 0.4rem 0.75rem;
			border-bottom: 1px solid #f0f0f0;
			vertical-align: middle;
		}

		tr:last-child td { border-bottom: none; }
	}

	.rel-label { color: var(--c-dark); font-size: 0.85rem; }

	.contact-btn {
		padding: 0.25rem 0.65rem;
		border-radius: 4px;
		border: 1px solid #d0d0d0;
		font-size: 0.8rem;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 600;
		cursor: pointer;
		box-shadow: none;
		min-width: 80px;
		text-align: center;
		transition: background 0.1s;

		&:hover { opacity: 0.85; box-shadow: none; }
	}

	.val-empty { background: white; color: #bbb; border-color: #e0e0e0; }
	.val-no    { background: #f0f0f0; color: #555; border-color: #ccc; }
	.val-yes   { background: var(--c-blue); color: var(--c-dark); border-color: var(--c-blue); }
	.val-nr    { background: #e8e8e8; color: #888; border-color: #ccc; font-style: italic; }
</style>
