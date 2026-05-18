<script>
	import { form } from '../store.svelte.js';
	import Num from '../inputs/Num.svelte';
	import Rating from '../inputs/Rating.svelte';
	import YesNo from '../inputs/YesNo.svelte';

	const ARRESTS = [
		{ key: 'l3',  label: 'Shoplifting / Vandalism' },
		{ key: 'l4',  label: 'Parole / Probation Violations' },
		{ key: 'l5',  label: 'Drug Charges' },
		{ key: 'l6',  label: 'Forgery' },
		{ key: 'l7',  label: 'Weapons Offense' },
		{ key: 'l8',  label: 'Burglary / Larceny / Breaking & Entering' },
		{ key: 'l9',  label: 'Robbery' },
		{ key: 'l10', label: 'Assault' },
		{ key: 'l11', label: 'Arson' },
		{ key: 'l12', label: 'Rape' },
		{ key: 'l13', label: 'Homicide / Manslaughter' },
		{ key: 'l14', label: 'Prostitution' },
		{ key: 'l15', label: 'Contempt of Court' },
		{ key: 'l16', label: 'Other' },
	];
</script>

<div class="section-body" class:scoring-mode={form.mode === 'scoring'}>
	<div class="form-grid">
		<div class="questions">
			<div class="q-block">
				<div class="q-row">
					<span class="q-id">L1</span>
					<div class="q-text">Was this admission prompted or suggested by the criminal justice system?
						<div class="q-hint">Judge, probation/parole officer, etc.</div>
					</div>
					<YesNo bind:value={form.l.l1} />
				</div>
				<div class="q-row">
					<span class="q-id">L2</span>
					<div class="q-text">Are you on probation or parole?
						<div class="q-hint">Note duration and level in comments.</div>
					</div>
					<YesNo bind:value={form.l.l2} />
				</div>
			</div>

			<div class="q-block">
				<div class="q-group-header">How many times in your life have you been arrested and charged with:</div>
				{#each ARRESTS as a}
					{@const lany = /** @type {any} */ (form.l)}
					<div class="q-row">
						<span class="q-id">{a.key.toUpperCase()}</span>
						<div class="q-text">{a.label}</div>
						<Num bind:value={lany[a.key]} id={a.key} />
					</div>
				{/each}
				<div class="q-row">
					<span class="q-id">L17</span>
					<div class="q-text">How many of these charges resulted in convictions?
						<div class="q-hint">Include fines, probation, incarcerations, suspended sentences, guilty pleas, plea bargaining. Do not include misdemeanor offenses from L18–L20.</div>
					</div>
					<Num bind:value={form.l.l17} id="l17" />
				</div>
			</div>

			<div class="q-block">
				<div class="q-group-header">How many times in your life have you been charged with:</div>
				<div class="q-row">
					<span class="q-id">L18</span>
					<div class="q-text">Disorderly conduct, vagrancy, public intoxication</div>
					<Num bind:value={form.l.l18} id="l18" />
				</div>
				<div class="q-row">
					<span class="q-id">L19</span>
					<div class="q-text">Driving while intoxicated</div>
					<Num bind:value={form.l.l19} id="l19" />
				</div>
				<div class="q-row">
					<span class="q-id">L20</span>
					<div class="q-text">Major driving violations (speeding, reckless driving, no license)</div>
					<Num bind:value={form.l.l20} id="l20" />
				</div>
			</div>

			<div class="q-block">
				<div class="q-row">
					<span class="q-id">L21</span>
					<div class="q-text">How many months were you incarcerated in your life?
						<div class="q-hint">If incarcerated 2+ weeks, round up to 1 month.</div>
					</div>
					<Num bind:value={form.l.l21} id="l21" />
				</div>
				<div class="q-row">
					<span class="q-id">L22</span>
					<div class="q-text">How long was your last incarceration? (months; if 2+ weeks)
						<div class="q-hint">Code -8 if never incarcerated.</div>
					</div>
					<Num bind:value={form.l.l22} id="l22" na />
				</div>
				<div class="q-row">
					<span class="q-id">L23</span>
					<div class="q-text">What was it for? (use codes L3–L16, L18–L20; code most severe)</div>
					<Num bind:value={form.l.l23} id="l23" na />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">L24</span>
					<div class="q-text">Are you presently awaiting charges, trial, or sentence?</div>
					<span class="composite-badge">Composite</span>
					<YesNo bind:value={form.l.l24} composite />
				</div>
				{#if form.l.l24 === 1}
					<div class="q-row">
						<span class="q-id">L25</span>
						<div class="q-text">What for? (use codes L3–L16, L18–L20; code most severe)</div>
						<Num bind:value={form.l.l25} id="l25" />
					</div>
				{/if}
				<div class="q-row">
					<span class="q-id">L26</span>
					<div class="q-text">How many days in the past 30 were you detained or incarcerated?
						<div class="q-hint">Include being arrested and released the same day.</div>
					</div>
					<Num bind:value={form.l.l26} max={30} id="l26" />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">L27</span>
					<div class="q-text">How many days in the past 30 have you engaged in illegal activities for profit?
						<div class="q-hint">Exclude simple drug possession. May be cross-checked with E17.</div>
					</div>
					<span class="composite-badge">Composite</span>
					<Num bind:value={form.l.l27} max={30} id="l27" composite />
				</div>
			</div>

			<div class="q-block">
				<div class="q-group-header">Patient Rating Scale (0–4)</div>
				<div class="q-row composite-row">
					<span class="q-id">L28</span>
					<div class="q-text">How serious do you feel your present legal problems are?
						<div class="q-hint">Exclude civil problems.</div>
					</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.l.l28} scale="patient" composite />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">L29</span>
					<div class="q-text">How important to you now is counseling or referral for these legal problems?
						<div class="q-hint">This is for additional referral to legal counsel, not defense against charges.</div>
					</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.l.l29} scale="patient" composite />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Interviewer Severity Rating (0–9)</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">L30</span>
					<div class="q-text">How would you rate the patient's need for legal services or counseling?</div>
					<Rating bind:value={form.l.l30} scale="severity" />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Confidence Ratings</div>
				<div class="q-row" style="border:none;padding:0;margin-bottom:0.5rem;">
					<span class="q-id">L31</span>
					<div class="q-text">Client's misrepresentation?</div>
					<YesNo bind:value={form.l.l31} />
				</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">L32</span>
					<div class="q-text">Client's inability to understand?</div>
					<YesNo bind:value={form.l.l32} />
				</div>
			</div>
		</div>

		<div class="comments-col">
			<div class="comments-label">Legal Comments</div>
			<p class="comments-hint">Include the question number with your notes.</p>
			<textarea bind:value={form.l.comments} class="comments-area" rows="40"></textarea>
		</div>
	</div>
</div>

<style lang="scss">
	@use './section-shared' as *;
	.q-hint { font-size: 0.75rem; color: #888; font-style: italic; margin-top: 0.2rem; line-height: 1.4; }
</style>
