<script>
	const MEASURES = {
		drinks_per_occasion: {
			substance: 'alcohol',
			shortLabel: 'Per occasion',
			label: 'Drinks per occasion',
			unit: 'drinks',
			maxDisplay: 10,
			sliderMax: 20,
			step: 1,
			defaultVal: 2,
			xTicks: [0, 2, 4, 6, 8, 10],
			isBinary: false,
			desc: 'Average number of standard drinks on a typical drinking occasion.',
			nonuserText: "say they don't drink at all",
			feedbackText: (v) => `say they have ${v} or fewer drink${v === 1 ? '' : 's'} per occasion`
		},
		alc_days_month: {
			substance: 'alcohol',
			shortLabel: 'Days/month',
			label: 'Drinking days per month',
			unit: 'days',
			maxDisplay: 20,
			sliderMax: 30,
			step: 1,
			defaultVal: 4,
			xTicks: [0, 5, 10, 15, 20],
			isBinary: false,
			desc: 'Number of days alcohol was consumed in the past 30 days.',
			nonuserText: "say they don't drink at all",
			feedbackText: (v) => `say they drink ${v} or fewer day${v === 1 ? '' : 's'} per month`
		},
		binge_days_month: {
			substance: 'alcohol',
			shortLabel: 'Binge days',
			label: 'Binge drinking days / month',
			unit: 'days',
			maxDisplay: 10,
			sliderMax: 30,
			step: 1,
			defaultVal: 1,
			xTicks: [0, 2, 4, 6, 8, 10],
			isBinary: false,
			desc: 'Days with 5 or more drinks (4+ for women) in the past 30 days.',
			nonuserText: "say they don't binge at all",
			feedbackText: (v) => `say they binge ${v} or fewer day${v === 1 ? '' : 's'} per month`
		},
		cig_days_month: {
			substance: 'nicotine',
			shortLabel: 'Smoking days',
			label: 'Cigarette smoking days per month',
			unit: 'days',
			maxDisplay: 30,
			sliderMax: 30,
			step: 1,
			defaultVal: 5,
			xTicks: [0, 5, 10, 15, 20, 25, 30],
			isBinary: false,
			desc: 'Number of days cigarettes were smoked in the past 30 days.',
			nonuserText: "say they don't smoke cigarettes",
			feedbackText: (v) => `say they smoke ${v} or fewer day${v === 1 ? '' : 's'} per month`
		},
		mj_days_month: {
			substance: 'cannabis',
			shortLabel: 'Use days',
			label: 'Cannabis use days per month',
			unit: 'days',
			maxDisplay: 30,
			sliderMax: 30,
			step: 1,
			defaultVal: 4,
			xTicks: [0, 5, 10, 15, 20, 25, 30],
			isBinary: false,
			desc: 'Number of days marijuana or cannabis was used in the past 30 days.',
			nonuserText: "say they don't use cannabis",
			feedbackText: (v) => `say they use cannabis ${v} or fewer day${v === 1 ? '' : 's'} per month`
		},
		her_any_year: {
			substance: 'opioids',
			shortLabel: 'Heroin',
			label: 'Heroin use in past year',
			unit: 'any use',
			isBinary: true,
			defaultVal: 0,
			desc: 'Any heroin use in the past year.',
			nonuserText: 'report no heroin use in the past year',
			feedbackText: (v) =>
				v === 0
					? 'report no heroin use in the past year'
					: 'also used heroin in the past year'
		},
		pnr_any_year: {
			substance: 'rx_opioids',
			shortLabel: 'Rx opioids',
			label: 'Prescription opioid misuse in past year',
			unit: 'any use',
			isBinary: true,
			defaultVal: 0,
			desc: 'Non-medical use of prescription opioids (pain relievers) in the past year.',
			nonuserText: 'report no non-medical prescription opioid use in the past year',
			feedbackText: (v) =>
				v === 0
					? 'report no non-medical prescription opioid use in the past year'
					: 'also used prescription opioids non-medically in the past year'
		},
		stim_illicit_any_year: {
			substance: 'stim_illicit',
			shortLabel: 'Cocaine/meth',
			label: 'Cocaine or methamphetamine use in past year',
			unit: 'any use',
			isBinary: true,
			defaultVal: 0,
			desc: 'Any cocaine or methamphetamine use in the past year.',
			nonuserText: 'report no cocaine or methamphetamine use in the past year',
			feedbackText: (v) =>
				v === 0
					? 'report no cocaine or methamphetamine use in the past year'
					: 'also used cocaine or methamphetamine in the past year'
		},
		stim_rx_any_year: {
			substance: 'stim_rx',
			shortLabel: 'Rx stimulants',
			label: 'Prescription stimulant misuse in past year',
			unit: 'any use',
			isBinary: true,
			defaultVal: 0,
			desc: 'Non-medical use of prescription stimulants (e.g., Adderall, Ritalin) in the past year.',
			nonuserText: 'report no non-medical prescription stimulant use in the past year',
			feedbackText: (v) =>
				v === 0
					? 'report no non-medical prescription stimulant use in the past year'
					: 'also used prescription stimulants non-medically in the past year'
		}
	};

	const SUBSTANCES = {
		alcohol: {
			label: 'Alcohol',
			color: '#d97706',
			defaultMeasure: 'drinks_per_occasion',
			measureKeys: ['drinks_per_occasion', 'alc_days_month', 'binge_days_month']
		},
		nicotine: {
			label: 'Nicotine',
			color: '#64748b',
			defaultMeasure: 'cig_days_month',
			measureKeys: ['cig_days_month']
		},
		cannabis: {
			label: 'Cannabis',
			color: '#16a34a',
			defaultMeasure: 'mj_days_month',
			measureKeys: ['mj_days_month']
		},
		opioids: {
			label: 'Opioids',
			color: '#dc2626',
			defaultMeasure: 'her_any_year',
			measureKeys: ['her_any_year']
		},
		rx_opioids: {
			label: 'Rx Opioids',
			color: '#7c3aed',
			defaultMeasure: 'pnr_any_year',
			measureKeys: ['pnr_any_year']
		},
		stim_illicit: {
			label: 'Cocaine/Meth',
			color: '#ea580c',
			defaultMeasure: 'stim_illicit_any_year',
			measureKeys: ['stim_illicit_any_year']
		},
		stim_rx: {
			label: 'Rx Stimulants',
			color: '#0284c7',
			defaultMeasure: 'stim_rx_any_year',
			measureKeys: ['stim_rx_any_year']
		}
	};

	const AGE_GROUPS = [
		{ value: '18plus', label: 'Adults 18+' },
		{ value: '18-25', label: '18–25' },
		{ value: '26-34', label: '26–34' },
		{ value: '35-49', label: '35–49' },
		{ value: '50-64', label: '50–64' },
		{ value: '65+', label: '65+' }
	];

	const SVG_W = 560;
	const SVG_H = 140;

	let isOpen = $state(false);
	let data = $state(null);
	let loading = $state(false);
	let substance = $state('alcohol');
	let ageGroup = $state('18plus');
	let gender = $state('all');
	let measure = $state('drinks_per_occasion');
	let userValue = $state(2);

	async function open() {
		isOpen = true;
		if (!data && !loading) {
			loading = true;
			try {
				const res = await fetch('/data/nsduh_norms.json');
				data = await res.json();
			} finally {
				loading = false;
			}
		}
	}

	function close() {
		isOpen = false;
	}

	$effect(() => {
		void substance;
		measure = SUBSTANCES[substance].defaultMeasure;
	});

	$effect(() => {
		void measure;
		userValue = MEASURES[measure].defaultVal;
	});

	const subColor = $derived(SUBSTANCES[substance].color);
	const subMeasureKeys = $derived(SUBSTANCES[substance].measureKeys);
	const groupKey = $derived(`${ageGroup}_${gender}`);
	const groupData = $derived(data?.[measure]?.groups?.[groupKey] ?? null);
	const pctNonuser = $derived(groupData?.pct_nonuser ?? 0);

	const percentile = $derived.by(() => {
		if (!groupData) return null;
		const cdf = groupData.cdf;
		const v = userValue;
		if (v <= cdf[0].v) return cdf[0].p;
		if (v >= cdf[cdf.length - 1].v) return cdf[cdf.length - 1].p;
		for (let i = 0; i < cdf.length - 1; i++) {
			if (v >= cdf[i].v && v <= cdf[i + 1].v) {
				const t = (v - cdf[i].v) / (cdf[i + 1].v - cdf[i].v);
				return cdf[i].p + t * (cdf[i + 1].p - cdf[i].p);
			}
		}
		return cdf[cdf.length - 1].p;
	});

	function interpCdf(cdf, v) {
		if (v <= cdf[0].v) return cdf[0].p;
		if (v >= cdf[cdf.length - 1].v) return cdf[cdf.length - 1].p;
		for (let i = 0; i < cdf.length - 1; i++) {
			if (v >= cdf[i].v && v <= cdf[i + 1].v) {
				const t = (v - cdf[i].v) / (cdf[i + 1].v - cdf[i].v);
				return cdf[i].p + t * (cdf[i + 1].p - cdf[i].p);
			}
		}
		return cdf[cdf.length - 1].p;
	}

	const chartBars = $derived.by(() => {
		if (!groupData || MEASURES[measure].isBinary) return [];
		const cfg = MEASURES[measure];
		const maxD = cfg.maxDisplay;
		const cdf = groupData.cdf;

		// Resample at evenly-spaced integer points so all bars have equal width
		const raw = [];
		let maxProp = 0;
		for (let v = 0; v < maxD; v++) {
			const prop = interpCdf(cdf, v + 1) - interpCdf(cdf, v);
			if (prop < 0.0001) continue;
			if (prop > maxProp) maxProp = prop;
			raw.push({ x0: v, x1: v + 1, prop });
		}

		const barW = SVG_W / maxD;
		return raw.map((b) => ({
			...b,
			svgX: (b.x0 / maxD) * SVG_W,
			svgW: Math.max(barW - 2, 1),
			svgH: maxProp > 0 ? (b.prop / maxProp) * SVG_H : 0,
			highlighted: userValue > 0 && (b.x0 + b.x1) / 2 <= userValue
		}));
	});

	const userSvgX = $derived(
		MEASURES[measure].isBinary
			? 0
			: (Math.min(userValue, MEASURES[measure].maxDisplay) / MEASURES[measure].maxDisplay) * SVG_W
	);

	function formatPct(p) {
		if (p === null || p === undefined) return '—';
		if (p >= 0.995) return '>99%';
		if (p < 0.01) return '<1%';
		return `${Math.round(p * 100)}%`;
	}

	function getNonuserText() {
		if (measure === 'binge_days_month') {
			if (gender === 'male') return 'say they never had 5 or more drinks in a day';
			if (gender === 'female') return 'say they never had 4 or more drinks in a day';
		}
		return MEASURES[measure].nonuserText;
	}

	function getFeedbackText(v) {
		if (measure === 'binge_days_month') {
			const threshold = gender === 'male' ? '5' : gender === 'female' ? '4' : null;
			if (threshold) {
				return `say they had ${threshold} or more drinks ${v} or fewer day${v === 1 ? '' : 's'} per month`;
			}
		}
		return MEASURES[measure].feedbackText(v);
	}

	function getDemoLabel() {
		const agLabel = ageGroup === '18plus' ? 'adults 18+' : `adults aged ${ageGroup}`;
		if (gender === 'all') return agLabel;
		return `${gender} ${agLabel}`;
	}
</script>

<button class="launch-btn" onclick={open}>How does my use compare? &rarr;</button>

{#if isOpen}
	<div class="scrim" role="presentation" onclick={close}></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="norms-title"
		tabindex="-1"
		style:--sub-color={subColor}
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		<div class="modal-header">
			<h2 id="norms-title">Substance Use: Population Norms</h2>
			<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
		</div>

		<div class="modal-body">
			{#if loading}
				<div class="loading">Loading data…</div>
			{:else if !data}
				<div class="loading">Something went wrong loading data.</div>
			{:else}
				<!-- Substance selector -->
				<div class="substance-row">
					{#each Object.entries(SUBSTANCES) as [key, cfg]}
						<button
							class="substance-tab"
							class:active={substance === key}
							style:--btn-color={cfg.color}
							onclick={() => (substance = key)}>{cfg.label}</button
						>
					{/each}
				</div>

				<!-- Demographics -->
				<div class="demo-section">
					<div class="demo-row">
						<span class="demo-label">Age</span>
						<div class="toggle-group">
							{#each AGE_GROUPS as ag}
								<button
									class="toggle-btn"
									class:active={ageGroup === ag.value}
									onclick={() => (ageGroup = ag.value)}>{ag.label}</button
								>
							{/each}
						</div>
					</div>
					<div class="demo-row">
						<span class="demo-label">Gender</span>
						<div class="toggle-group">
							{#each [['all', 'All'], ['male', 'Male'], ['female', 'Female']] as [v, lbl]}
								<button
									class="toggle-btn"
									class:active={gender === v}
									onclick={() => (gender = v)}>{lbl}</button
								>
							{/each}
						</div>
					</div>
				</div>

				<!-- Measure tabs (only when substance has multiple measures) -->
				{#if subMeasureKeys.length > 1}
					<div class="measure-tabs">
						{#each subMeasureKeys as key}
							<button
								class="measure-tab"
								class:active={measure === key}
								onclick={() => (measure = key)}>{MEASURES[key].shortLabel}</button
							>
						{/each}
					</div>
				{/if}

				<p class="measure-desc">{MEASURES[measure].desc}</p>

				{#if groupData}
					<!-- Stats block -->
					<div class="stats-block">
						{#if MEASURES[measure].isBinary}
							{#if userValue === 1}
								<div class="feedback">
									<div class="feedback-stat">
										<span class="pct-big">{formatPct(1 - pctNonuser)}</span>
										<span class="pct-label">of {getDemoLabel()} {getFeedbackText(1)}</span>
									</div>
								</div>
							{/if}
							<div class="nonuser-badge">
								<span class="nonuser-pct">{formatPct(pctNonuser)}</span>
								<span class="nonuser-text">of {getDemoLabel()} {getNonuserText()}</span>
							</div>
						{:else}
							{#if percentile !== null && userValue > 0}
								<div class="feedback">
									<div class="feedback-stat">
										<span class="pct-big">{formatPct(percentile)}</span>
										<span class="pct-label"
											>of {getDemoLabel()} {getFeedbackText(userValue)}</span
										>
									</div>
									{#if percentile >= 0.95}
										<div class="high-note">
											This level is higher than {formatPct(percentile)} of {getDemoLabel()} — a range where a conversation with a healthcare provider may be worthwhile.
										</div>
									{/if}
								</div>
							{/if}
							{#if pctNonuser > 0}
								<div class="nonuser-badge">
									<span class="nonuser-pct">{Math.round(pctNonuser * 100)}%</span>
									<span class="nonuser-text">of {getDemoLabel()} {getNonuserText()}</span>
								</div>
							{/if}
						{/if}
					</div>

					<!-- Chart / Input -->
					{#if MEASURES[measure].isBinary}
						<div class="binary-chart">
							<button
								class="binary-row"
								class:selected={userValue === 0}
								onclick={() => (userValue = 0)}
							>
								<span class="binary-row-label">No use</span>
								<div class="binary-track">
									<div class="binary-fill" style:width="{pctNonuser * 100}%"></div>
								</div>
								<span class="binary-row-pct">{formatPct(pctNonuser)}</span>
							</button>
							<button
								class="binary-row"
								class:selected={userValue === 1}
								onclick={() => (userValue = 1)}
							>
								<span class="binary-row-label">Any use (past year)</span>
								<div class="binary-track">
									<div class="binary-fill" style:width="{(1 - pctNonuser) * 100}%"></div>
								</div>
								<span class="binary-row-pct">{formatPct(1 - pctNonuser)}</span>
							</button>
						</div>
					{:else}
						<div class="chart-wrap">
							<svg
								viewBox="0 0 {SVG_W} {SVG_H}"
								width="100%"
								preserveAspectRatio="xMidYMid meet"
								class="chart-svg"
								aria-hidden="true"
							>
								{#each chartBars as bar}
									<rect
										x={bar.svgX + 1}
										y={SVG_H - bar.svgH}
										width={bar.svgW}
										height={bar.svgH}
										fill={bar.highlighted ? 'var(--sub-color, #d97706)' : '#e0e0e0'}
										rx="2"
									/>
								{/each}
								{#if userValue > 0}
									<line
										x1={userSvgX}
										y1="0"
										x2={userSvgX}
										y2={SVG_H}
										stroke="#1a1a2e"
										stroke-width="2"
										stroke-dasharray="5 3"
									/>
									<polygon
										points="{userSvgX - 6},4 {userSvgX + 6},4 {userSvgX},16"
										fill="#1a1a2e"
									/>
								{/if}
							</svg>
							<div class="x-axis">
								{#each MEASURES[measure].xTicks as tick}
									<span
										class="x-tick"
										style="left: {(tick / MEASURES[measure].maxDisplay) * 100}%">{tick}</span
									>
								{/each}
								<span class="x-unit">{MEASURES[measure].unit}</span>
							</div>
						</div>
						<div class="input-row">
							<label class="input-label" for="norms-slider">Value</label>
							<div class="slider-wrap">
								<input
									id="norms-slider"
									type="range"
									min="0"
									max={MEASURES[measure].sliderMax}
									step={MEASURES[measure].step}
									bind:value={userValue}
									class="slider"
								/>
								<span class="value-display">
									<span class="value-num">{userValue}</span>
									<span class="value-unit">{MEASURES[measure].unit}</span>
								</span>
							</div>
						</div>
					{/if}
				{:else}
					<div class="no-data">No data available for this group.</div>
				{/if}

				<p class="footnote">
					Based on 2021–2024 NSDUH data (SAMHSA), n&nbsp;&#8776;&nbsp;232,000. Alcohol, nicotine,
					and cannabis show past-30-day frequency distributions (full population, non-users at 0).
					Opioid and stimulant measures show past-year prevalence. Self-reported survey data
					underestimates actual use. All calculations happen in your browser; no data is collected
					or stored.
				</p>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.launch-btn {
		display: inline-block;
		background: #f59e0b;
		color: #1a1a2e;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 600;
		font-size: 0.9rem;
		border: none;
		border-radius: 4px;
		padding: 0.65rem 1.25rem;
		cursor: pointer;
		transition: opacity 0.15s;
		box-shadow: none;
		&:hover {
			opacity: 0.85;
			box-shadow: none;
		}
	}

	.scrim {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
		z-index: 1000;
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1001;
		background: white;
		border-radius: 8px;
		width: min(860px, calc(100vw - 2rem));
		max-height: 92vh;
		overflow-y: auto;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;

		&::before {
			content: '';
			display: block;
			height: 5px;
			background: var(--sub-color, #d97706);
			border-radius: 8px 8px 0 0;
			flex-shrink: 0;
			transition: background 0.2s;
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem 0.75rem;
		border-bottom: 1px solid #eee;
		flex-shrink: 0;

		h2 {
			font-size: 1.15rem;
			margin: 0;
			color: var(--c-dark);
		}
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		line-height: 1;
		color: #888;
		cursor: pointer;
		padding: 0 0 0 1rem;
		&:hover {
			color: var(--c-dark);
			box-shadow: none;
		}
	}

	.modal-body {
		padding: 1.25rem 1.5rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.loading {
		text-align: center;
		padding: 2rem;
		color: #888;
		font-size: 0.9rem;
	}

	.substance-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.substance-tab {
		font-size: 0.82rem;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 500;
		padding: 0.4rem 0.9rem;
		border: 2px solid #ddd;
		border-radius: 20px;
		background: white;
		color: #555;
		cursor: pointer;
		transition: all 0.12s;
		box-shadow: none;

		&:hover:not(.active) {
			border-color: var(--btn-color);
			color: var(--btn-color);
			box-shadow: none;
		}

		&.active {
			background: var(--btn-color);
			border-color: var(--btn-color);
			color: white;
			font-weight: 700;
			box-shadow: none;
		}
	}

	.demo-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: #f8f8f8;
		border-radius: 6px;
		padding: 0.75rem 1rem;
	}

	.demo-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.demo-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: #888;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		min-width: 46px;
		font-family: ibm-plex-mono, monospace;
	}

	.toggle-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
	}

	.toggle-btn {
		font-size: 0.8rem;
		font-family: ibm-plex-sans, sans-serif;
		padding: 0.25rem 0.65rem;
		border: 1px solid #ddd;
		border-radius: 20px;
		background: white;
		color: #555;
		cursor: pointer;
		transition: all 0.12s;
		box-shadow: none;

		&:hover:not(.active) {
			border-color: var(--sub-color, #d97706);
			color: #333;
			box-shadow: none;
		}

		&.active {
			background: var(--sub-color, #d97706);
			border-color: var(--sub-color, #d97706);
			color: white;
			font-weight: 600;
			box-shadow: none;
		}
	}

	.measure-tabs {
		display: flex;
		gap: 0.3rem;
		flex-wrap: wrap;
	}

	.measure-tab {
		font-size: 0.82rem;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 500;
		padding: 0.35rem 0.85rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		color: #666;
		cursor: pointer;
		transition: all 0.12s;
		box-shadow: none;

		&:hover:not(.active) {
			border-color: var(--sub-color, #d97706);
			box-shadow: none;
		}

		&.active {
			background: color-mix(in srgb, var(--sub-color, #d97706) 12%, white);
			border-color: var(--sub-color, #d97706);
			color: color-mix(in srgb, var(--sub-color, #d97706) 80%, black);
			font-weight: 600;
			box-shadow: none;
		}
	}

	.measure-desc {
		font-size: 0.85rem;
		color: #666;
		margin: -0.25rem 0 0;
		line-height: 1.5;
	}

	.stats-block {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.nonuser-badge {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 4px;
		padding: 0.35rem 0.9rem;
	}

	.nonuser-pct {
		font-size: 0.85rem;
		font-weight: 700;
		color: #166534;
		font-family: ibm-plex-mono, monospace;
	}

	.nonuser-text {
		font-size: 0.8rem;
		color: #166534;
	}

	/* Binary chart */
	.binary-chart {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: #fafafa;
		border: 1px solid #eee;
		border-radius: 4px;
		padding: 0.85rem 1rem;
	}

	.binary-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.4rem 0.6rem;
		border-radius: 4px;
		cursor: pointer;
		border: 1px solid transparent;
		background: transparent;
		width: 100%;
		text-align: left;
		transition: background 0.1s, border-color 0.1s;
		box-shadow: none;

		&:hover {
			background: rgba(0, 0, 0, 0.03);
			box-shadow: none;
		}

		&.selected {
			background: color-mix(in srgb, var(--sub-color, #d97706) 8%, white);
			border-color: color-mix(in srgb, var(--sub-color, #d97706) 30%, transparent);
		}
	}

	.binary-row-label {
		font-size: 0.82rem;
		color: #555;
		min-width: 140px;
		font-family: ibm-plex-sans, sans-serif;
		flex-shrink: 0;
	}

	.binary-track {
		flex: 1;
		height: 18px;
		background: #e5e7eb;
		border-radius: 3px;
		overflow: hidden;
	}

	.binary-fill {
		height: 100%;
		background: #ccc;
		border-radius: 3px;
		transition: width 0.3s;

		.binary-row.selected & {
			background: var(--sub-color, #d97706);
		}
	}

	.binary-row-pct {
		font-size: 0.85rem;
		font-family: ibm-plex-mono, monospace;
		font-weight: 600;
		color: #555;
		min-width: 42px;
		text-align: right;
		flex-shrink: 0;
	}

	/* Continuous chart */
	.chart-wrap {
		position: relative;
		padding-bottom: 1.75rem;
	}

	.chart-svg {
		display: block;
		border-radius: 4px;
		background: #fafafa;
		border: 1px solid #eee;
	}

	.x-axis {
		position: relative;
		height: 1.5rem;
		margin-top: 0.25rem;
	}

	.x-tick {
		position: absolute;
		transform: translateX(-50%);
		font-size: 0.7rem;
		font-family: ibm-plex-mono, monospace;
		color: #999;
		top: 2px;
	}

	.x-unit {
		position: absolute;
		right: 0;
		bottom: 0;
		font-size: 0.7rem;
		color: #bbb;
		font-family: ibm-plex-mono, monospace;
		font-style: italic;
	}

	.input-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.input-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: #666;
		white-space: nowrap;
		min-width: 72px;
	}

	.slider-wrap {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.slider {
		flex: 1;
		accent-color: var(--sub-color, #d97706);
		cursor: pointer;
	}

	.value-display {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		min-width: 100px;
	}

	.value-num {
		font-size: 1.3rem;
		font-weight: 700;
		font-family: ibm-plex-mono, monospace;
		color: #1a1a2e;
	}

	.value-unit {
		font-size: 0.75rem;
		color: #888;
		font-family: ibm-plex-mono, monospace;
	}

	.feedback {
		background: color-mix(in srgb, var(--sub-color, #d97706) 10%, white);
		border-left: 4px solid var(--sub-color, #d97706);
		border-radius: 4px;
		padding: 1rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.feedback-stat {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.pct-big {
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1;
		color: color-mix(in srgb, var(--sub-color, #d97706) 80%, black);
		font-family: ibm-plex-mono, monospace;
	}

	.pct-label {
		font-size: 1rem;
		color: color-mix(in srgb, var(--sub-color, #d97706) 60%, black);
		line-height: 1.4;
	}

	.high-note {
		font-size: 0.85rem;
		color: color-mix(in srgb, var(--sub-color, #d97706) 70%, black);
		background: color-mix(in srgb, var(--sub-color, #d97706) 15%, white);
		border-radius: 4px;
		padding: 0.5rem 0.75rem;
		line-height: 1.5;
	}

	.no-data {
		text-align: center;
		padding: 1.5rem;
		color: #aaa;
		font-size: 0.9rem;
	}

	.footnote {
		font-size: 0.78rem;
		color: #aaa;
		line-height: 1.6;
		font-style: italic;
		margin: 0;
		border-top: 1px solid #eee;
		padding-top: 0.75rem;
	}
</style>
