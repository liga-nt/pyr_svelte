<script>
	const QUESTIONS = [
		{ text: 'Have you used drugs other than those required for medical reasons?',                                                                      reversed: false },
		{ text: 'Do you abuse more than one drug at a time?',                                                                                             reversed: false },
		{ text: 'Are you always able to stop using drugs when you want to? (If you never use drugs, answer "Yes.")',                                       reversed: true  },
		{ text: 'Have you had "blackouts" or "flashbacks" as a result of drug use?',                                                                      reversed: false },
		{ text: 'Do you ever feel bad or guilty about your drug use? (If you never use drugs, choose "No.")',                                             reversed: false },
		{ text: 'Does your spouse (or parents) ever complain about your involvement with drugs?',                                                          reversed: false },
		{ text: 'Have you neglected your family because of your use of drugs?',                                                                           reversed: false },
		{ text: 'Have you engaged in illegal activities in order to obtain drugs?',                                                                        reversed: false },
		{ text: 'Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?',                                               reversed: false },
		{ text: 'Have you had medical problems as a result of your drug use (e.g., memory loss, hepatitis, convulsions, bleeding, etc.)?',                reversed: false }
	];

	const OPTIONS = [
		{ label: 'No', value: 0 },
		{ label: 'Yes', value: 1 }
	];

	const BANDS = [
		{ max: 0,  label: 'No problem reported', range: '0',    note: 'No drug use problems reported in the past 12 months.' },
		{ max: 2,  label: 'Low level',           range: '1–2',  note: 'Low level of drug use problems. Monitor and reassess at a later date.' },
		{ max: 5,  label: 'Moderate level',      range: '3–5',  note: 'Moderate level of drug use problems. Further investigation with additional assessment is indicated.' },
		{ max: 8,  label: 'Substantial level',   range: '6–8',  note: 'Substantial level of drug use problems. Intensive assessment and referral to treatment is recommended.' },
		{ max: 10, label: 'Severe level',        range: '9–10', note: 'Severe level of drug use problems. Intensive assessment and treatment is strongly indicated.' }
	];

	let step = $state('closed');
	let rawAnswers = $state(Array(10).fill(null));

	const score = $derived(
		rawAnswers.reduce((sum, a, i) => {
			if (a === null) return sum;
			const val = QUESTIONS[i].reversed ? 1 - a : a;
			return sum + val;
		}, 0)
	);
	const allAnswered = $derived(rawAnswers.every((a) => a !== null));
	const band = $derived(BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1]);

	function open() { step = 'disclaimer'; }
	function agree() { step = 'questions'; }
	function submit() { if (allAnswered) step = 'results'; }
	function close() {
		step = 'closed';
		rawAnswers = Array(10).fill(null);
	}
</script>

<button class="launch-btn" onclick={open}>Launch DAST-10 &rarr;</button>

{#if step !== 'closed'}
	<div class="scrim" role="presentation" onclick={close}></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="dast10-title"
		tabindex="-1"
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		{#if step === 'disclaimer'}
			<div class="modal-header">
				<h2 id="dast10-title">DAST-10 — Before You Begin</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p>
					The DAST-10 is a validated, 10-item questionnaire used to screen for drug use problems
					over the past 12 months. It does not include alcohol or tobacco. It is designed as a
					clinical tool to support practitioner judgment — it is not a diagnostic instrument.
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
						A DAST-10 score <strong>supports, but does not replace</strong>, a full clinical evaluation.
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
				<h2 id="dast10-title">DAST-10 Drug Use Screening</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p class="prompt">
					The following questions ask about your use of drugs, <strong>not including alcohol or tobacco</strong>,
					over the <strong>past 12 months</strong>.
				</p>
				<div class="questions">
					{#each QUESTIONS as q, i}
						<fieldset class="question-group" class:answered={rawAnswers[i] !== null}>
							<legend class="question-text"><span class="q-num">{i + 1}.</span> {q.text}</legend>
							<div class="options">
								{#each OPTIONS as opt}
									<label class="option" class:selected={rawAnswers[i] === opt.value}>
										<input
											type="radio"
											name="dast10-q{i}"
											value={opt.value}
											checked={rawAnswers[i] === opt.value}
											onchange={() => (rawAnswers[i] = opt.value)}
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
				<h2 id="dast10-title">DAST-10 Results</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<div class="score-display">
					<div class="score-number">{score}<span class="score-denom">/10</span></div>
					<div class="score-range">Score range: {band.range}</div>
					<div class="score-label">{band.label}</div>
				</div>

				<div class="clinical-note">
					<p>{band.note} Clinical interpretation should account for substance type, use patterns, and functional impairment.</p>
				</div>

				<div class="score-table">
					<table>
						<thead>
							<tr><th>Score</th><th>Level</th></tr>
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
						DAST-10 scores support clinical judgment and are not diagnostic. Developed and copyrighted
						by Harvey Skinner, PhD and the Centre for Addiction and Mental Health, Toronto, Canada.
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
		background: var(--c-purple, #9b59b6);
		color: white;
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
			background: var(--c-purple, #9b59b6);
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
		background: var(--c-purple, #9b59b6);
		color: white;
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

		&.answered { border-color: var(--c-purple, #9b59b6); }
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
		flex-direction: row;
		gap: 0.4rem;
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

		input[type='radio'] { accent-color: var(--c-purple, #9b59b6); flex-shrink: 0; }

		&.selected {
			background: color-mix(in srgb, var(--c-purple, #9b59b6) 15%, white);
			border-color: var(--c-purple, #9b59b6);
			font-weight: 500;
		}

		&:hover { border-color: var(--c-purple, #9b59b6); }
	}

	.modal-footer {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid #eee;
	}

	.helper { font-size: 0.85rem !important; color: #888 !important; }

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
			color: var(--c-purple, #9b59b6);
			margin-top: 0.35rem;
			filter: brightness(0.8);
		}
	}

	.clinical-note {
		background: color-mix(in srgb, var(--c-purple, #9b59b6) 10%, white);
		border-left: 4px solid var(--c-purple, #9b59b6);
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
				background: color-mix(in srgb, var(--c-purple, #9b59b6) 15%, white);
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
