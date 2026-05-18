<script>
	import { form } from '../store.svelte.js';
	import Num from '../inputs/Num.svelte';
	import Rating from '../inputs/Rating.svelte';
	import YesNo from '../inputs/YesNo.svelte';
	import Select from '../inputs/Select.svelte';

	const empPatternOpts = [
		{ value: 1, label: '1 — Full time (35+ hrs)' }, { value: 2, label: '2 — Part time (regular)' },
		{ value: 3, label: '3 — Part time (irregular)' }, { value: 4, label: '4 — Student' },
		{ value: 5, label: '5 — Military service' }, { value: 6, label: '6 — Retired/disability' },
		{ value: 7, label: '7 — Unemployed' }, { value: 8, label: '8 — In controlled environment' },
	];
</script>

<div class="section-body" class:scoring-mode={form.mode === 'scoring'}>
	<div class="form-grid">
		<div class="questions">
			<div class="q-block">
				<div class="q-row">
					<span class="q-id">E1</span>
					<label class="q-text">Education completed (formal education only)</label>
					<div class="inline-pair">
						<Num bind:value={form.e.e1y} id="e1y" placeholder="Yrs" />
						<span class="unit">yrs</span>
						<Num bind:value={form.e.e1m} id="e1m" placeholder="Mos" max={11} />
						<span class="unit">mos</span>
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">E2</span>
					<label class="q-text">Training or technical education completed (months)</label>
					<Num bind:value={form.e.e2} id="e2" />
				</div>
				<div class="q-row">
					<span class="q-id">E3</span>
					<div class="q-text">Do you have a profession, trade, or skill?</div>
					<YesNo bind:value={form.e.e3} />
				</div>
				{#if form.e.e3 === 1}
					<div class="q-row">
						<span class="q-id"></span>
						<label class="q-text">Specify:</label>
						<input type="text" bind:value={form.e.e3spec} class="text-input medium" />
					</div>
				{/if}
				<div class="q-row composite-row">
					<span class="q-id">E4</span>
					<div class="q-text">Do you have a valid driver's license?</div>
					<span class="composite-badge">Composite</span>
					<YesNo bind:value={form.e.e4} composite />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">E5</span>
					<div class="q-text">Do you have an automobile available for use?
						<div class="q-hint">If E4=No, then E5 must be No.</div>
					</div>
					<span class="composite-badge">Composite</span>
					<YesNo bind:value={form.e.e5} composite />
				</div>
				<div class="q-row">
					<span class="q-id">E6</span>
					<label class="q-text">How long was your longest full-time job? (35+ hrs/wk)</label>
					<div class="inline-pair">
						<Num bind:value={form.e.e6y} placeholder="Yrs" />
						<span class="unit">yrs</span>
						<Num bind:value={form.e.e6m} placeholder="Mos" max={11} />
						<span class="unit">mos</span>
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">E7</span>
					<div class="q-text">Usual (or last) occupation — Hollingshead code (1–7)
						<div class="q-hint">Use Hollingshead Categories Reference Sheet</div>
					</div>
					<Num bind:value={form.e.e7} max={7} id="e7" />
				</div>
				<div class="q-row">
					<span class="q-id"></span>
					<label class="q-text">Specify occupation:</label>
					<input type="text" bind:value={form.e.e7spec} class="text-input medium" />
				</div>
				<div class="q-row">
					<span class="q-id">E8</span>
					<div class="q-text">Does someone contribute to your support in any way?
						<div class="q-hint">Regular cash, food, or housing support from family/friends; exclude institutional support.</div>
					</div>
					<YesNo bind:value={form.e.e8} />
				</div>
				{#if form.e.e8 === 1}
					<div class="q-row">
						<span class="q-id">E9</span>
						<div class="q-text">Does this support constitute the majority of your support?</div>
						<YesNo bind:value={form.e.e9} />
					</div>
				{/if}
				<div class="q-row">
					<span class="q-id">E10</span>
					<div class="q-text">
						<Select label="Usual employment pattern, past 3 years?" options={empPatternOpts} bind:value={form.e.e10} id="e10" />
					</div>
				</div>
			</div>

			<div class="q-block">
				<div class="q-row composite-row">
					<span class="q-id">E11</span>
					<div class="q-text">How many days were you paid for working in the past 30 days?
						<div class="q-hint">Include "under-the-table" work, paid sick days and vacation.</div>
					</div>
					<span class="composite-badge">Composite</span>
					<Num bind:value={form.e.e11} max={30} id="e11" composite />
				</div>
				<div class="q-group-header">How much money did you receive from the following sources in the past 30 days?</div>
				<div class="q-row composite-row">
					<span class="q-id">E12</span>
					<div class="q-text">Employment (net/"take home" pay)</div>
					<span class="composite-badge">Composite</span>
					<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" bind:value={form.e.e12} min="0" class="num-input" placeholder="0" /></div>
				</div>
				<div class="q-row">
					<span class="q-id">E13</span>
					<div class="q-text">Unemployment compensation</div>
					<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" bind:value={form.e.e13} min="0" class="num-input" placeholder="0" /></div>
				</div>
				<div class="q-row">
					<span class="q-id">E14</span>
					<div class="q-text">Welfare (include food stamps, transportation money)</div>
					<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" bind:value={form.e.e14} min="0" class="num-input" placeholder="0" /></div>
				</div>
				<div class="q-row">
					<span class="q-id">E15</span>
					<div class="q-text">Pension, benefits, or Social Security</div>
					<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" bind:value={form.e.e15} min="0" class="num-input" placeholder="0" /></div>
				</div>
				<div class="q-row">
					<span class="q-id">E16</span>
					<div class="q-text">Mate, family, or friends</div>
					<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" bind:value={form.e.e16} min="0" class="num-input" placeholder="0" /></div>
				</div>
				<div class="q-row composite-row">
					<span class="q-id">E17</span>
					<div class="q-text">Illegal income
						<div class="q-hint">Cash from drug dealing, stealing, prostitution, etc. Do not convert drugs to dollar value.</div>
					</div>
					<span class="composite-badge">Composite</span>
					<div class="currency-wrap"><span class="currency-sym">$</span><input type="number" bind:value={form.e.e17} min="0" class="num-input" placeholder="0" /></div>
				</div>
				<div class="q-row">
					<span class="q-id">E18</span>
					<div class="q-text">How many people depend on you for the majority of their food, shelter, etc.?</div>
					<Num bind:value={form.e.e18} id="e18" />
				</div>
				<div class="q-row">
					<span class="q-id">E19</span>
					<div class="q-text">How many days have you experienced employment problems in the past 30?</div>
					<Num bind:value={form.e.e19} max={30} id="e19" />
				</div>
			</div>

			<div class="q-block">
				<div class="q-group-header">Patient Rating Scale (0=Not at all · 4=Extremely)</div>
				<div class="q-row">
					<span class="q-id">E20</span>
					<div class="q-text">How troubled or bothered have you been by these employment problems in the past 30 days?</div>
					<Rating bind:value={form.e.e20} scale="patient" />
				</div>
				<div class="q-row">
					<span class="q-id">E21</span>
					<div class="q-text">How important to you now is counseling for these employment problems?</div>
					<Rating bind:value={form.e.e21} scale="patient" />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Interviewer Severity Rating (0–9)</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">E22</span>
					<div class="q-text">How would you rate the patient's need for employment counseling?</div>
					<Rating bind:value={form.e.e22} scale="severity" />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Confidence Ratings</div>
				<div class="q-row" style="border:none;padding:0;margin-bottom:0.5rem;">
					<span class="q-id">E23</span>
					<div class="q-text">Client's misrepresentation?</div>
					<YesNo bind:value={form.e.e23} />
				</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">E24</span>
					<div class="q-text">Client's inability to understand?</div>
					<YesNo bind:value={form.e.e24} />
				</div>
			</div>
		</div>

		<div class="comments-col">
			<div class="comments-label">Employment / Support Comments</div>
			<p class="comments-hint">Include the question number with your notes.</p>
			<textarea bind:value={form.e.comments} class="comments-area" rows="36"></textarea>
		</div>
	</div>
</div>

<style lang="scss">
	@use './section-shared' as *;
	.q-hint { font-size: 0.75rem; color: #888; font-style: italic; margin-top: 0.2rem; line-height: 1.4; }
	.currency-wrap { display: flex; align-items: center; gap: 0.2rem; }
	.currency-sym { font-size: 0.85rem; color: #666; }
	.num-input {
		width: 110px;
		padding: 0.35rem 0.5rem;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		font-size: 0.9rem;
		font-family: ibm-plex-mono, monospace;
		color: var(--c-dark);
		&:focus { outline: none; border-color: var(--c-blue); }
	}
</style>
