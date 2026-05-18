<script>
	import { form } from '../store.svelte.js';
	import Num from '../inputs/Num.svelte';
	import Rating from '../inputs/Rating.svelte';
	import YesNo from '../inputs/YesNo.svelte';
</script>

<div class="section-body" class:scoring-mode={form.mode === 'scoring'}>
	<div class="form-grid">
		<div class="questions">
			<div class="q-block">
				<div class="q-row">
					<span class="q-id">M1</span>
					<div class="q-text">How many times have you been hospitalized for medical problems in your life?
						<div class="q-hint">Exclude detox, alcohol/drug, psychiatric treatment, and childbirth (if no complications).</div>
					</div>
					<Num bind:value={form.m.m1} id="m1" />
				</div>
				<div class="q-row">
					<span class="q-id">M2</span>
					<label class="q-text">How long ago was your last hospitalization for a physical problem?</label>
					<div class="inline-pair">
						<Num bind:value={form.m.m2y} placeholder="Yrs" id="m2y" na />
						<span class="unit">yrs</span>
						<Num bind:value={form.m.m2m} placeholder="Mos" id="m2m" max={11} na />
						<span class="unit">mos</span>
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">M3</span>
					<div class="q-text">Do you have any chronic medical problems that continue to interfere with your life?</div>
					<YesNo bind:value={form.m.m3} />
				</div>
				<div class="q-row">
					<span class="q-id">M4</span>
					<div class="q-text">Are you taking any prescribed medication on a regular basis for a physical problem?
						<div class="q-hint">For MD-prescribed medical conditions; not psychiatric medicines.</div>
					</div>
					<YesNo bind:value={form.m.m4} />
				</div>
				<div class="q-row">
					<span class="q-id">M5</span>
					<div class="q-text">Do you receive a pension for a physical disability?
						<div class="q-hint">Include workers' compensation; exclude psychiatric disability.</div>
					</div>
					<YesNo bind:value={form.m.m5} />
				</div>
			</div>

			<div class="q-block">
				<div class="q-row composite-row">
					<span class="q-id">M6</span>
					<div class="q-text">How many days have you experienced medical problems in the past 30 days?
						<div class="q-hint">Include flu, colds, etc. Include serious ailments related to drugs/alcohol.</div>
					</div>
					<span class="composite-badge">Composite</span>
					<Num bind:value={form.m.m6} max={30} id="m6" composite />
				</div>

				<div class="q-group-header">Patient Rating Scale (0=Not at all · 1=Slightly · 2=Moderately · 3=Considerably · 4=Extremely)</div>

				<div class="q-row composite-row">
					<span class="q-id">M7</span>
					<div class="q-text">How troubled or bothered have you been by these medical problems in the past 30 days?</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.m.m7} scale="patient" composite />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">M8</span>
					<div class="q-text">How important to you now is treatment for these medical problems?</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.m.m8} scale="patient" composite />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Interviewer Severity Rating (0=No problem · 9=Extreme problem)</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">M9</span>
					<div class="q-text">How would you rate the patient's need for medical treatment?</div>
					<Rating bind:value={form.m.m9} scale="severity" />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Confidence Ratings — Is the above information significantly distorted by:</div>
				<div class="q-row" style="border:none;padding:0;margin-bottom:0.5rem;">
					<span class="q-id">M10</span>
					<div class="q-text">Patient's misrepresentation?</div>
					<YesNo bind:value={form.m.m10} />
				</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">M11</span>
					<div class="q-text">Patient's inability to understand?</div>
					<YesNo bind:value={form.m.m11} />
				</div>
			</div>
		</div>

		<div class="comments-col">
			<div class="comments-label">Medical Comments</div>
			<p class="comments-hint">Include the question number with your notes.</p>
			<textarea bind:value={form.m.comments} class="comments-area" rows="24"></textarea>
		</div>
	</div>
</div>

<style lang="scss">
	@use './section-shared' as *;
	.q-hint { font-size: 0.75rem; color: #888; font-style: italic; margin-top: 0.2rem; line-height: 1.4; }
</style>
