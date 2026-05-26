<script>
	const QUESTIONS = [
		'Feeling nervous, anxious, or on edge',
		'Not being able to stop or control worrying',
		'Worrying too much about different things',
		'Trouble relaxing',
		'Being so restless that it is hard to sit still',
		'Becoming easily annoyed or irritable',
		'Feeling afraid, as if something awful might happen'
	];

	const OPTIONS = [
		{ label: 'Not at all', value: 0 },
		{ label: 'Several days', value: 1 },
		{ label: 'More than half the days', value: 2 },
		{ label: 'Nearly every day', value: 3 }
	];

	const BANDS = [
		{ max: 4,  label: 'Minimal anxiety',  range: '0–4',   note: 'Scores in this range indicate minimal anxiety symptoms.' },
		{ max: 9,  label: 'Mild anxiety',     range: '5–9',   note: 'Scores in this range indicate mild anxiety. Monitor and reassess.' },
		{ max: 14, label: 'Moderate anxiety', range: '10–14', note: 'Scores in this range indicate moderate anxiety severity.' },
		{ max: 21, label: 'Severe anxiety',   range: '15–21', note: 'Scores in this range indicate severe anxiety warranting further assessment and treatment.' }
	];

	let step = $state('closed');
	let answers = $state(Array(7).fill(null));

	const score = $derived(answers.reduce((sum, a) => sum + (a ?? 0), 0));
	const allAnswered = $derived(answers.every((a) => a !== null));
	const band = $derived(BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1]);

	function open() { step = 'disclaimer'; }
	function agree() { step = 'questions'; }
	function submit() { if (allAnswered) step = 'results'; }
	function close() {
		step = 'closed';
		answers = Array(7).fill(null);
	}
</script>

<button class="launch-btn" onclick={open}>Launch GAD-7 &rarr;</button>

{#if step !== 'closed'}
	<div class="scrim" role="presentation" onclick={close}></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="gad7-title"
		tabindex="-1"
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		{#if step === 'disclaimer'}
			<div class="modal-header">
				<h2 id="gad7-title">GAD-7 — Before You Begin</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<div class="crisis-bar">
					If you or someone you are with is experiencing a mental health crisis, call or text <a href="tel:988"><strong>988</strong></a> or text <strong>HOME</strong> to <strong>741741</strong> to reach a crisis specialist, 24/7.
				</div>
				<p>
					The GAD-7 is a validated, 7-item questionnaire used in clinical settings to screen for
					and monitor generalized anxiety disorder severity. It is designed as a clinical tool to
					support practitioner judgment — it is not a diagnostic instrument.
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
						A GAD-7 score <strong>supports, but does not replace</strong>, a full clinical evaluation.
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
				<h2 id="gad7-title">GAD-7 Anxiety Screening</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p class="prompt">
					Over the <strong>last 2 weeks</strong>, how often have you been bothered by any of the
					following problems?
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
											name="gad7-q{i}"
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
						<p class="helper">Answer all 7 questions to see results.</p>
					{/if}
					<button class="btn-primary" onclick={submit} disabled={!allAnswered}>
						View results
					</button>
				</div>
			</div>

		{:else if step === 'results'}
			<div class="modal-header">
				<h2 id="gad7-title">GAD-7 Results</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<div class="score-display">
					<div class="score-number">{score}<span class="score-denom">/21</span></div>
					<div class="score-range">Score range: {band.range}</div>
					<div class="score-label">{band.label}</div>
				</div>

				<div class="clinical-note">
					<p>{band.note} Clinical interpretation should account for symptom duration, functional impairment, and context.</p>
				</div>

				<div class="score-table">
					<table>
						<thead>
							<tr><th>Score</th><th>Severity</th></tr>
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
						GAD-7 scores support clinical judgment and are not diagnostic. Functional impairment,
						duration of symptoms, and clinical context should inform treatment decisions.
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
		background: var(--accent, var(--c-green));
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
			background: var(--c-green, #34a853);
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
		background: var(--c-green, #34a853);
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

		&.answered { border-color: var(--c-green, #34a853); }
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

		input[type='radio'] { accent-color: var(--c-green, #34a853); flex-shrink: 0; }

		&.selected {
			background: color-mix(in srgb, var(--c-green, #34a853) 15%, white);
			border-color: var(--c-green, #34a853);
			font-weight: 500;
		}

		&:hover { border-color: var(--c-green, #34a853); }
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
			color: var(--c-green, #34a853);
			margin-top: 0.35rem;
			filter: brightness(0.75);
		}
	}

	.clinical-note {
		background: color-mix(in srgb, var(--c-green, #34a853) 10%, white);
		border-left: 4px solid var(--c-green, #34a853);
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
				background: color-mix(in srgb, var(--c-green, #34a853) 15%, white);
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
