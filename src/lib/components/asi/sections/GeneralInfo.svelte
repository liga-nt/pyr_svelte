<script>
	import { form } from '../store.svelte.js';
	import Select from '../inputs/Select.svelte';
	import Num from '../inputs/Num.svelte';

	const g = $derived(form.g);

	const genderOpts = [{ value: 1, label: '1 — Male' }, { value: 2, label: '2 — Female' }];
	const classOpts = [{ value: 1, label: '1 — Intake' }, { value: 2, label: '2 — Follow-up' }];
	const contactOpts = [{ value: 1, label: '1 — In person' }, { value: 2, label: '2 — Telephone' }];
	const specialOpts = [
		{ value: 1, label: '1 — Patient terminated' },
		{ value: 2, label: '2 — Patient refused' },
		{ value: 3, label: '3 — Patient unable to respond' },
	];
	const raceOpts = [
		{ value: 1, label: '1 — White (not Hisp)' }, { value: 2, label: '2 — Black (not Hisp)' },
		{ value: 3, label: '3 — American Indian' }, { value: 4, label: '4 — Alaskan Native' },
		{ value: 5, label: '5 — Asian/Pacific' }, { value: 6, label: '6 — Hispanic-Mexican' },
		{ value: 7, label: '7 — Hispanic-Puerto Rican' }, { value: 8, label: '8 — Hispanic-Cuban' },
		{ value: 9, label: '9 — Unknown' },
	];
	const religionOpts = [
		{ value: 1, label: '1 — Protestant' }, { value: 2, label: '2 — Catholic' },
		{ value: 3, label: '3 — Jewish' }, { value: 4, label: '4 — Islamic' },
		{ value: 5, label: '5 — Other' }, { value: 6, label: '6 — None' },
	];
	const envOpts = [
		{ value: 1, label: '1 — No (not in controlled environment)' },
		{ value: 2, label: '2 — Jail/prison' }, { value: 3, label: '3 — Alcohol or drug tx' },
		{ value: 4, label: '4 — Medical tx' }, { value: 5, label: '5 — Psychiatric tx' },
		{ value: 6, label: '6 — Other' },
	];
</script>

<div class="section-body">
	<div class="form-grid">
		<div class="questions">
			<div class="q-block">
				<div class="q-row">
					<span class="q-id">G1</span>
					<label class="q-text">ID Number</label>
					<input type="text" bind:value={form.g.g1} class="text-input short" />
				</div>
				<div class="q-row">
					<span class="q-id">G4</span>
					<label class="q-text">Date of Admission (mm/dd/yyyy)</label>
					<input type="text" bind:value={form.g.g4} placeholder="mm/dd/yyyy" class="text-input short" />
				</div>
				<div class="q-row">
					<span class="q-id">G5</span>
					<label class="q-text">Date of Interview (mm/dd/yyyy)</label>
					<input type="text" bind:value={form.g.g5} placeholder="mm/dd/yyyy" class="text-input short" />
				</div>
				<div class="q-row">
					<span class="q-id">G6</span>
					<label class="q-text">Time Begun (24-hr, HH:MM)</label>
					<input type="text" bind:value={form.g.g6} placeholder="HH:MM" class="text-input short" />
				</div>
				<div class="q-row">
					<span class="q-id">G7</span>
					<label class="q-text">Time Ended (HH:MM)</label>
					<div class="inline-pair">
						<input type="text" bind:value={form.g.g7h} placeholder="HH" class="text-input tiny" />
						<span>:</span>
						<input type="text" bind:value={form.g.g7m} placeholder="MM" class="text-input tiny" />
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">G8</span>
					<div class="q-text">
						<Select label="Class" options={classOpts} bind:value={form.g.g8} id="g8" />
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">G9</span>
					<div class="q-text">
						<Select label="Contact Code" options={contactOpts} bind:value={form.g.g9} id="g9" />
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">G10</span>
					<div class="q-text">
						<Select label="Gender" options={genderOpts} bind:value={form.g.g10} id="g10" />
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">G99</span>
					<label class="q-text">Treatment Episode Number</label>
					<input type="text" bind:value={form.g.g99} class="text-input short" />
				</div>
				<div class="q-row">
					<span class="q-id">G11</span>
					<label class="q-text">Interviewer Code Number</label>
					<input type="text" bind:value={form.g.g11} class="text-input short" />
				</div>
				<div class="q-row">
					<span class="q-id">G12</span>
					<div class="q-text">
						<Select label="Special" options={specialOpts} bind:value={form.g.g12} id="g12" />
					</div>
				</div>
			</div>

			<div class="q-block">
				<div class="q-row">
					<span class="q-id">G14</span>
					<label class="q-text">How long at current address?</label>
					<div class="inline-pair">
						<Num bind:value={form.g.g14y} placeholder="Yrs" id="g14y" />
						<span class="unit">yrs</span>
						<Num bind:value={form.g.g14m} placeholder="Mos" id="g14m" max={11} />
						<span class="unit">mos</span>
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">G15</span>
					<label class="q-text">Residence owned by you or family? (0=No, 1=Yes)</label>
					<Num bind:value={form.g.g15} max={1} id="g15" />
				</div>
				<div class="q-row">
					<span class="q-id">G16</span>
					<label class="q-text">Date of Birth (mm/dd/yyyy)</label>
					<input type="text" bind:value={form.g.g16} placeholder="mm/dd/yyyy" class="text-input short" />
				</div>
				<div class="q-row">
					<span class="q-id">G17</span>
					<div class="q-text">
						<Select label="Race" options={raceOpts} bind:value={form.g.g17} id="g17" />
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">G18</span>
					<div class="q-text">
						<Select label="Religious Preference" options={religionOpts} bind:value={form.g.g18} id="g18" />
					</div>
				</div>
				<div class="q-row">
					<span class="q-id">G19</span>
					<div class="q-text">
						<Select label="Controlled environment past 30 days?" options={envOpts} bind:value={form.g.g19} id="g19" />
					</div>
				</div>
				{#if form.g.g19 !== null && form.g.g19 !== 1}
					<div class="q-row">
						<span class="q-id">G20</span>
						<label class="q-text">How many days?</label>
						<Num bind:value={form.g.g20} max={30} id="g20" />
					</div>
				{/if}
			</div>
		</div>

		<div class="comments-col">
			<div class="comments-label">General Information Comments</div>
			<p class="comments-hint">Include the question number with your notes.</p>
			<textarea bind:value={form.g.comments} class="comments-area" rows="20"></textarea>
		</div>
	</div>
</div>

<style lang="scss">
	@import './section-shared.scss';
</style>
