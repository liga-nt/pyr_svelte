<script>
	const QUESTIONS = [
		'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?',
		'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
		'How often do you have problems remembering appointments or obligations?',
		'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
		'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
		'How often do you feel overly active and compelled to do things, like you were driven by a motor?'
	];

	const OPTIONS = [
		{ label: 'Never', value: 0 },
		{ label: 'Rarely', value: 1 },
		{ label: 'Sometimes', value: 2 },
		{ label: 'Often', value: 3 },
		{ label: 'Very often', value: 4 }
	];

	// Q1–Q3: positive at Sometimes (≥2); Q4–Q6: positive at Often (≥3)
	const THRESHOLDS = [2, 2, 2, 3, 3, 3];

	let step = $state('closed');
	let answers = $state(Array(6).fill(null));

	const positiveCount = $derived(
		answers.filter((a, i) => a !== null && a >= THRESHOLDS[i]).length
	);
	const allAnswered = $derived(answers.every((a) => a !== null));
	const positiveScreen = $derived(allAnswered && positiveCount >= 4);

	function open() { step = 'disclaimer'; }
	function agree() { step = 'questions'; }
	function submit() { if (allAnswered) step = 'results'; }
	function close() {
		step = 'closed';
		answers = Array(6).fill(null);
	}
</script>

<button class="launch-btn" onclick={open}>Launch ASRS-6 &rarr;</button>

{#if step !== 'closed'}
	<div class="scrim" role="presentation" onclick={close}></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="asrs6-title"
		tabindex="-1"
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		{#if step === 'disclaimer'}
			<div class="modal-header">
				<h2 id="asrs6-title">ASRS-6 — Before You Begin</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p>
					The ASRS-6 (Part A of the Adult ADHD Self-Report Scale v1.1) is a validated 6-item
					screener developed with the World Health Organization to identify adult ADHD symptoms.
					It is designed as a clinical screening tool — it is not a diagnostic instrument.
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
						A positive screen indicates symptoms <strong>consistent with</strong> ADHD; a formal diagnosis
						requires a comprehensive clinical evaluation.
					</li>
					<li>
						If you are using this tool for yourself rather than in a clinical context, please consult
						a mental health professional to interpret your results.
					</li>
				</ul>
				<button class="btn-primary" onclick={agree}>I understand — begin screening</button>
			</div>

		{:else if step === 'questions'}
			<div class="modal-header">
				<h2 id="asrs6-title">ASRS-6 ADHD Screening</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p class="prompt">
					Please rate how often you have experienced each of the following over the
					<strong>past 6 months</strong>.
				</p>
				<div class="questions">
					{#each QUESTIONS as q, i}
						<fieldset class="question-group" class:answered={answers[i] !== null}>
							<legend class="question-text"><span class="q-num">{i + 1}.</span> {q}</legend>
							<div class="options">
								{#each OPTIONS as opt}
									<label class="option" class:selected={answers[i] === opt.value}>
										<input
											type="radio"
											name="asrs6-q{i}"
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
						<p class="helper">Answer all 6 questions to see results.</p>
					{/if}
					<button class="btn-primary" onclick={submit} disabled={!allAnswered}>
						View results
					</button>
				</div>
			</div>

		{:else if step === 'results'}
			<div class="modal-header">
				<h2 id="asrs6-title">ASRS-6 Results</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<div class="score-display" class:positive={positiveScreen}>
					<div class="score-number">{positiveCount}<span class="score-denom">/6</span></div>
					<div class="score-range">items above symptom threshold</div>
					<div class="score-label" class:positive={positiveScreen}>
						{positiveScreen ? 'Positive screen' : 'Negative screen'}
					</div>
				</div>

				<div class="clinical-note" class:positive={positiveScreen}>
					{#if positiveScreen}
						<p>
							4 or more items above threshold is highly consistent with adult ADHD symptoms in
							research samples. A comprehensive clinical evaluation is recommended to confirm the
							diagnosis and rule out other conditions.
						</p>
					{:else}
						<p>
							Fewer than 4 items above threshold suggests symptoms are less consistent with adult ADHD.
							Clinical context and history should still be considered.
						</p>
					{/if}
				</div>

				<div class="threshold-table">
					<table>
						<thead>
							<tr><th>#</th><th>Your response</th><th>Threshold</th><th>Positive</th></tr>
						</thead>
						<tbody>
							{#each QUESTIONS as q, i}
								{@const itemPositive = answers[i] !== null && answers[i] >= THRESHOLDS[i]}
								{@const thresholdLabel = THRESHOLDS[i] === 2 ? 'Sometimes' : 'Often'}
								{@const responseLabel = answers[i] !== null ? OPTIONS[answers[i]].label : '—'}
								<tr class:item-positive={itemPositive}>
									<td>{i + 1}</td>
									<td>{responseLabel}</td>
									<td>≥ {thresholdLabel}</td>
									<td>{itemPositive ? '✓' : '—'}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="result-note">
					<p>
						ASRS-6 results support clinical judgment and are not diagnostic. Adult ADHD diagnosis
						requires ruling out other conditions and assessing impairment across settings. Developed
						with the World Health Organization (Kessler et al., 2005).
					</p>
				</div>

				<div class="crisis-bar">
					<strong>Crisis line:</strong> Call or text <a href="tel:988">988</a> anytime, 24/7.
					Text <strong>HOME</strong> to <strong>741741</strong> for the Crisis Text Line.
				</div>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.launch-btn {
		display: inline-block;
		background: #e76f51;
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
			background: #e76f51;
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
		background: #e76f51;
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

		&.answered { border-color: #e76f51; }
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

		input[type='radio'] { accent-color: #e76f51; flex-shrink: 0; }

		&.selected {
			background: color-mix(in srgb, #e76f51 15%, white);
			border-color: #e76f51;
			font-weight: 500;
		}

		&:hover { border-color: #e76f51; }
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
			color: #888;
			margin-top: 0.35rem;

			&.positive { color: #e76f51; filter: brightness(0.85); }
		}
	}

	.clinical-note {
		background: #f5f5f5;
		border-left: 4px solid #ccc;
		border-radius: 4px;
		padding: 0.75rem 1rem;

		&.positive {
			background: color-mix(in srgb, #e76f51 10%, white);
			border-left-color: #e76f51;
		}

		p { font-size: 0.9rem !important; }
	}

	.threshold-table {
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

			tr.item-positive td {
				background: color-mix(in srgb, #e76f51 12%, white);
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
