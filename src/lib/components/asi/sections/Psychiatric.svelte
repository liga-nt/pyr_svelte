<script>
	import { form } from '../store.svelte.js';
	import Num from '../inputs/Num.svelte';
	import Rating from '../inputs/Rating.svelte';
	import YesNo from '../inputs/YesNo.svelte';

	const SYMPTOMS = [
		{ key: 'p4a',  label: 'Experienced serious depression?' },
		{ key: 'p5a',  label: 'Experienced serious anxiety or tension?' },
		{ key: 'p6a',  label: 'Experienced hallucinations?' },
		{ key: 'p7a',  label: 'Experienced trouble understanding, concentrating, or remembering?' },
		{ key: 'p8a',  label: 'Experienced trouble controlling violent behavior?' },
		{ key: 'p9a',  label: 'Experienced serious thoughts of suicide?' },
		{ key: 'p10a', label: 'Attempted suicide?' },
		{ key: 'p11a', label: 'Been prescribed medication for any psychological or emotional problems?' },
	];
</script>

<div class="section-body" class:scoring-mode={form.mode === 'scoring'}>
	<div class="form-grid">
		<div class="questions">
			<div class="q-block">
				<div class="q-row">
					<span class="q-id">P1</span>
					<div class="q-text">How many times have you been treated for any psychological or emotional problems?</div>
					<Num bind:value={form.p.p1} id="p1" />
				</div>
				<div class="q-row">
					<span class="q-id">P2</span>
					<div class="q-text">How many times have you been hospitalized for any psychological or emotional problems?</div>
					<Num bind:value={form.p.p2} id="p2" />
				</div>
				<div class="q-row">
					<span class="q-id">P3</span>
					<div class="q-text">Do you receive a pension for a psychiatric disability?</div>
					<YesNo bind:value={form.p.p3} />
				</div>
			</div>

			<div class="q-block">
				<div class="q-group-header composite-header">
					Composite — In the past 30 days, have you had a significant period of time in which you have:
				</div>
				{#each SYMPTOMS as sym}
					{@const pany = /** @type {any} */ (form.p)}
					<div class="q-row composite-row">
						<span class="q-id">{sym.key.toUpperCase()}</span>
						<div class="q-text">{sym.label}</div>
						<span class="composite-badge">Composite</span>
						<YesNo bind:value={pany[sym.key]} composite />
					</div>
				{/each}
			</div>

			<div class="q-block">
				<div class="q-row composite-row">
					<span class="q-id">P12</span>
					<div class="q-text">How many days in the past 30 have you experienced psychological or emotional problems?</div>
					<span class="composite-badge">Composite</span>
					<Num bind:value={form.p.p12} max={30} id="p12" composite />
				</div>
				<div class="q-group-header">Patient Rating Scale (0–4)</div>
				<div class="q-row composite-row">
					<span class="q-id">P13</span>
					<div class="q-text">How troubled or bothered have you been in the past 30 days by psychological or emotional problems?</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.p.p13} scale="patient" composite />
				</div>
				<div class="q-row composite-row">
					<span class="q-id">P14</span>
					<div class="q-text">How important to you now is treatment for these psychological or emotional problems?</div>
					<span class="composite-badge">Composite</span>
					<Rating bind:value={form.p.p14} scale="patient" composite />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Interviewer Severity Rating (0–9)</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">P15</span>
					<div class="q-text">How would you rate the patient's need for psychiatric/psychological treatment?</div>
					<Rating bind:value={form.p.p15} scale="severity" />
				</div>
			</div>

			<div class="rating-group">
				<div class="rating-group-label">Confidence Ratings</div>
				<div class="q-row" style="border:none;padding:0;margin-bottom:0.5rem;">
					<span class="q-id">P16</span>
					<div class="q-text">Client's misrepresentation?</div>
					<YesNo bind:value={form.p.p16} />
				</div>
				<div class="q-row" style="border:none;padding:0;">
					<span class="q-id">P17</span>
					<div class="q-text">Client's inability to understand?</div>
					<YesNo bind:value={form.p.p17} />
				</div>
			</div>
		</div>

		<div class="comments-col">
			<div class="comments-label">Psychiatric Comments</div>
			<p class="comments-hint">Include the question number with your notes.</p>
			<textarea bind:value={form.p.comments} class="comments-area" rows="24"></textarea>
		</div>
	</div>
</div>

<style lang="scss">
	@use './section-shared' as *;
	.composite-header { background: color-mix(in srgb, var(--c-blue) 12%, white); }
</style>
