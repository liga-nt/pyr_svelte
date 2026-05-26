<script>
	const QUESTIONS = [
		{
			text: 'How often do you have a drink containing alcohol?',
			options: [
				{ label: 'Never', value: 0 },
				{ label: 'Monthly or less', value: 1 },
				{ label: '2–4 times a month', value: 2 },
				{ label: '2–3 times a week', value: 3 },
				{ label: '4 or more times a week', value: 4 }
			]
		},
		{
			text: 'How many drinks containing alcohol do you have on a typical day when you are drinking?',
			options: [
				{ label: '1 or 2', value: 0 },
				{ label: '3 or 4', value: 1 },
				{ label: '5 or 6', value: 2 },
				{ label: '7 to 9', value: 3 },
				{ label: '10 or more', value: 4 }
			]
		},
		{
			text: 'How often do you have six or more drinks on one occasion?',
			options: [
				{ label: 'Never', value: 0 },
				{ label: 'Less than monthly', value: 1 },
				{ label: 'Monthly', value: 2 },
				{ label: 'Weekly', value: 3 },
				{ label: 'Daily or almost daily', value: 4 }
			]
		},
		{
			text: 'How often during the last year have you found that you were not able to stop drinking once you had started?',
			options: [
				{ label: 'Never', value: 0 },
				{ label: 'Less than monthly', value: 1 },
				{ label: 'Monthly', value: 2 },
				{ label: 'Weekly', value: 3 },
				{ label: 'Daily or almost daily', value: 4 }
			]
		},
		{
			text: 'How often during the last year have you failed to do what was normally expected of you because of drinking?',
			options: [
				{ label: 'Never', value: 0 },
				{ label: 'Less than monthly', value: 1 },
				{ label: 'Monthly', value: 2 },
				{ label: 'Weekly', value: 3 },
				{ label: 'Daily or almost daily', value: 4 }
			]
		},
		{
			text: 'How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?',
			options: [
				{ label: 'Never', value: 0 },
				{ label: 'Less than monthly', value: 1 },
				{ label: 'Monthly', value: 2 },
				{ label: 'Weekly', value: 3 },
				{ label: 'Daily or almost daily', value: 4 }
			]
		},
		{
			text: 'How often during the last year have you had a feeling of guilt or remorse after drinking?',
			options: [
				{ label: 'Never', value: 0 },
				{ label: 'Less than monthly', value: 1 },
				{ label: 'Monthly', value: 2 },
				{ label: 'Weekly', value: 3 },
				{ label: 'Daily or almost daily', value: 4 }
			]
		},
		{
			text: 'How often during the last year have you been unable to remember what happened the night before because of your drinking?',
			options: [
				{ label: 'Never', value: 0 },
				{ label: 'Less than monthly', value: 1 },
				{ label: 'Monthly', value: 2 },
				{ label: 'Weekly', value: 3 },
				{ label: 'Daily or almost daily', value: 4 }
			]
		},
		{
			text: 'Have you or someone else been injured as a result of your drinking?',
			options: [
				{ label: 'No', value: 0 },
				{ label: 'Yes, but not in the last year', value: 2 },
				{ label: 'Yes, during the last year', value: 4 }
			]
		},
		{
			text: 'Has a relative, friend, doctor, or other health worker been concerned about your drinking or suggested you cut down?',
			options: [
				{ label: 'No', value: 0 },
				{ label: 'Yes, but not in the last year', value: 2 },
				{ label: 'Yes, during the last year', value: 4 }
			]
		}
	];

	const BANDS = [
		{ max: 7,  label: 'Lower risk',          range: '0–7',   note: 'Scores in this range suggest low-risk drinking. Provide alcohol education as appropriate.' },
		{ max: 15, label: 'Increasing risk',      range: '8–15',  note: 'Scores in this range suggest hazardous or harmful alcohol use. Simple advice about cutting down is indicated.' },
		{ max: 19, label: 'Higher risk',          range: '16–19', note: 'Scores in this range suggest harmful drinking. Brief counseling and continued monitoring are recommended.' },
		{ max: 40, label: 'Possible dependence',  range: '20–40', note: 'Scores in this range suggest possible alcohol dependence. Referral to a specialist for diagnostic evaluation and treatment is indicated.' }
	];

	let step = $state('closed');
	let answers = $state(Array(10).fill(null));

	const score = $derived(answers.reduce((sum, a) => sum + (a ?? 0), 0));
	const allAnswered = $derived(answers.every((a) => a !== null));
	const band = $derived(BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1]);
	const injuryFlag = $derived(answers[8] === 4 || answers[9] === 4);

	function open() { step = 'disclaimer'; }
	function agree() { step = 'questions'; }
	function submit() { if (allAnswered) step = 'results'; }
	function close() {
		step = 'closed';
		answers = Array(10).fill(null);
	}
</script>

<button class="launch-btn" onclick={open}>Launch AUDIT &rarr;</button>

{#if step !== 'closed'}
	<div class="scrim" role="presentation" onclick={close}></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="audit-title"
		tabindex="-1"
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		{#if step === 'disclaimer'}
			<div class="modal-header">
				<h2 id="audit-title">AUDIT — Before You Begin</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p>
					The AUDIT is a validated, 10-item questionnaire developed by the World Health Organization
					to identify hazardous, harmful, and dependent alcohol use. It is designed as a clinical
					tool to support practitioner judgment — it is not a diagnostic instrument.
				</p>
				<ul class="disclaimer-list">
					<li>
						Responses are <strong>not saved, collected, or transmitted</strong> — they exist only
						in your browser during this session.
					</li>
					<li>
						Results are <strong>not reviewed by any clinician</strong> at Plan Your Recovery or elsewhere.
					</li>
					<li>
						An AUDIT score <strong>supports, but does not replace</strong>, a full clinical evaluation.
					</li>
					<li>
						If you are using this tool for yourself rather than in a clinical context, please consult
						a healthcare professional to interpret your results.
					</li>
				</ul>
				<button class="btn-primary" onclick={agree}>I understand — begin screening</button>
			</div>

		{:else if step === 'questions'}
			<div class="modal-header">
				<h2 id="audit-title">AUDIT Alcohol Screening</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p class="prompt">
					Please answer the following questions about your <strong>alcohol use</strong>.
				</p>
				<div class="questions">
					{#each QUESTIONS as q, i}
						<fieldset class="question-group" class:answered={answers[i] !== null}>
							<legend class="question-text"><span class="q-num">{i + 1}.</span> {q.text}</legend>
							<div class="options">
								{#each q.options as opt}
									<label class="option" class:selected={answers[i] === opt.value}>
										<input
											type="radio"
											name="audit-q{i}"
											value={opt.value}
											checked={answers[i] === opt.value}
											onchange={() => (answers[i] = opt.value)}
										/>
										{opt.label}
									</label>
								{/each}
							</div>
						</fieldset>
					{/each}
				</div>
				<div class="modal-footer">
					{#if !allAnswered}
						<p class="helper">Answer all 10 questions to see results.</p>
					{/if}
					<button class="btn-primary" onclick={submit} disabled={!allAnswered}>
						View results
					</button>
				</div>
			</div>

		{:else if step === 'results'}
			<div class="modal-header">
				<h2 id="audit-title">AUDIT Results</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				{#if injuryFlag}
					<div class="injury-alert">
						<strong>Items 9 or 10 flagged: injury or concern from others reported in the last year.</strong>
						<p>Direct clinical follow-up is recommended to assess harm and explore treatment options.</p>
					</div>
				{/if}

				<div class="score-display">
					<div class="score-number">{score}<span class="score-denom">/40</span></div>
					<div class="score-range">Score range: {band.range}</div>
					<div class="score-label">{band.label}</div>
				</div>

				<div class="clinical-note">
					<p>{band.note} Clinical interpretation should account for drinking patterns, tolerance, and clinical context.</p>
				</div>

				<div class="score-table">
					<table>
						<thead>
							<tr><th>Score</th><th>Risk level</th></tr>
						</thead>
						<tbody>
							{#each BANDS as b}
								<tr class:current={b.label === band.label}>
									<td>{b.range}</td>
									<td>{b.label}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="result-note">
					<p>
						AUDIT scores support clinical judgment and are not diagnostic. Developed by the World
						Health Organization. Clinical context, drinking patterns, and comorbidities should inform
						treatment decisions.
					</p>
				</div>

				<div class="crisis-bar">
					<strong>SAMHSA Helpline:</strong> <a href="tel:18006624357">1-800-662-4357</a> — free, confidential treatment referrals, 24/7.
					Mental health crisis: call or text <a href="tel:988">988</a>.
				</div>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.launch-btn {
		display: inline-block;
		background: var(--c-yellow, #f5a623);
		color: var(--c-dark);
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 600;
		font-size: 0.9rem;
		border: none;
		border-radius: 4px;
		padding: 0.65rem 1.25rem;
		cursor: pointer;
		text-decoration: none;
		box-shadow: none;
		transition: opacity 0.15s;

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
		width: min(680px, calc(100vw - 2rem));
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;

		&::before {
			content: '';
			display: block;
			height: 5px;
			background: var(--c-yellow, #f5a623);
			border-radius: 8px 8px 0 0;
			flex-shrink: 0;
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

		&:hover { color: var(--c-dark); box-shadow: none; }
	}

	.modal-body {
		padding: 1.25rem 1.5rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		p {
			line-height: 1.7;
			margin: 0;
			font-size: 0.95rem;
			color: var(--c-dark);
		}
	}

	.crisis-bar {
		background: #fff8e1;
		border-left: 4px solid #f59e0b;
		border-radius: 4px;
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		line-height: 1.6;

		a { color: var(--c-dark); font-weight: 600; }
	}

	.disclaimer-list {
		padding-left: 1.25rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		li {
			font-size: 0.9rem;
			line-height: 1.6;
			color: var(--c-dark);
		}
	}

	.btn-primary {
		display: inline-block;
		background: var(--c-yellow, #f5a623);
		color: var(--c-dark);
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 600;
		font-size: 0.9rem;
		border: none;
		border-radius: 4px;
		padding: 0.65rem 1.25rem;
		cursor: pointer;
		text-decoration: none;
		box-shadow: none;
		transition: opacity 0.15s;
		align-self: flex-start;

		&:hover { opacity: 0.85; box-shadow: none; }
		&:disabled { opacity: 0.4; cursor: not-allowed; }
	}

	.prompt { font-size: 0.95rem; color: #555; }

	.questions { display: flex; flex-direction: column; gap: 1.25rem; }

	.question-group {
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 0.9rem 1rem;
		transition: border-color 0.15s;

		&.answered { border-color: var(--c-yellow, #f5a623); }
	}

	.question-text {
		font-size: 0.9rem;
		font-weight: 500;
		line-height: 1.5;
		color: var(--c-dark);
		margin-bottom: 0.75rem;

		.q-num { font-weight: 700; }
	}

	.options {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;

		@media (min-width: 500px) {
			flex-direction: row;
			flex-wrap: wrap;
		}
	}

	.option {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.85rem;
		padding: 0.4rem 0.75rem;
		border: 1px solid #ddd;
		border-radius: 20px;
		cursor: pointer;
		transition: background 0.12s, border-color 0.12s;
		line-height: 1.3;
		box-shadow: none;

		input[type='radio'] { accent-color: var(--c-yellow, #f5a623); flex-shrink: 0; }

		&.selected {
			background: color-mix(in srgb, var(--c-yellow, #f5a623) 20%, white);
			border-color: var(--c-yellow, #f5a623);
			font-weight: 500;
		}

		&:hover { border-color: var(--c-yellow, #f5a623); }
	}

	.modal-footer {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid #eee;
	}

	.helper { font-size: 0.85rem !important; color: #888 !important; }

	.injury-alert {
		background: #fef2f2;
		border-left: 4px solid #dc2626;
		border-radius: 4px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;

		strong { font-size: 0.95rem; color: #b91c1c; }
		p { font-size: 0.9rem !important; color: #7f1d1d !important; }
	}

	.score-display {
		text-align: center;
		padding: 1rem 0 0.5rem;

		.score-number {
			font-size: 3rem;
			font-weight: 700;
			line-height: 1;
			color: var(--c-dark);

			.score-denom {
				font-size: 1.25rem;
				color: #999;
				font-weight: 400;
			}
		}

		.score-range {
			font-size: 0.8rem;
			color: #888;
			margin-top: 0.25rem;
			font-family: ibm-plex-mono, monospace;
		}

		.score-label {
			font-size: 1rem;
			font-weight: 600;
			color: var(--c-yellow, #f5a623);
			margin-top: 0.35rem;
			filter: brightness(0.7);
		}
	}

	.clinical-note {
		background: color-mix(in srgb, var(--c-yellow, #f5a623) 12%, white);
		border-left: 4px solid var(--c-yellow, #f5a623);
		border-radius: 4px;
		padding: 0.75rem 1rem;

		p { font-size: 0.9rem !important; }
	}

	.score-table {
		overflow-x: auto;

		table {
			width: 100%;
			border-collapse: collapse;
			font-size: 0.85rem;

			th {
				text-align: left;
				padding: 0.4rem 0.75rem;
				background: #f5f5f5;
				border-bottom: 2px solid #e0e0e0;
				font-weight: 600;
				color: #555;
			}

			td {
				padding: 0.4rem 0.75rem;
				border-bottom: 1px solid #eee;
				color: #444;
			}

			tr.current td {
				background: color-mix(in srgb, var(--c-yellow, #f5a623) 18%, white);
				font-weight: 600;
				color: var(--c-dark);
			}
		}
	}

	.result-note {
		background: #f8f8f8;
		border-radius: 4px;
		padding: 0.75rem 1rem;

		p { font-size: 0.85rem !important; color: #666 !important; font-style: italic; }
	}
</style>
