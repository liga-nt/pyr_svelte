<script>
	const QUESTIONS = [
		'Little interest or pleasure in doing things',
		'Feeling down, depressed, or hopeless',
		'Trouble falling or staying asleep, or sleeping too much',
		'Feeling tired or having little energy',
		'Poor appetite or overeating',
		'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
		'Trouble concentrating on things, such as reading the newspaper or watching television',
		'Moving or speaking so slowly that other people could have noticed — or being so fidgety or restless that you have been moving around a lot more than usual',
		'Thoughts that you would be better off dead, or of hurting yourself in some way'
	];

	const OPTIONS = [
		{ label: 'Not at all', value: 0 },
		{ label: 'Several days', value: 1 },
		{ label: 'More than half the days', value: 2 },
		{ label: 'Nearly every day', value: 3 }
	];

	const BANDS = [
		{
			max: 4,
			label: 'Minimal symptoms',
			message:
				'Your responses suggest minimal depression symptoms. Many people experience occasional low periods that don\'t rise to the level of a clinical condition. If you\'re concerned, or if things change, speaking with a clinician is always a reasonable step.'
		},
		{
			max: 9,
			label: 'Mild symptoms',
			message:
				'Your responses suggest mild depression symptoms. Mild depression often responds well to structured support — therapy, lifestyle changes, and sometimes medication. If symptoms persist or worsen, a clinical evaluation is worthwhile.'
		},
		{
			max: 14,
			label: 'Moderate symptoms',
			message:
				'Your responses suggest moderate depression. At this level, symptoms typically cause meaningful difficulty in daily life. Evidence-based treatment — therapy, medication, or both — is likely to help significantly.'
		},
		{
			max: 19,
			label: 'Moderately severe symptoms',
			message:
				'Your responses suggest moderately severe depression. Most people at this level benefit from professional treatment. A combination of therapy and medication is often the most effective approach.'
		},
		{
			max: 27,
			label: 'Severe symptoms',
			message:
				'Your responses suggest severe depression. Symptoms at this level significantly impair daily functioning. Professional treatment — including evaluation for medication — is strongly recommended. Please don\'t wait to reach out.'
		}
	];

	let step = $state('closed');
	let answers = $state(Array(9).fill(null));

	const score = $derived(answers.reduce((sum, a) => sum + (a ?? 0), 0));
	const suicidalFlag = $derived(answers[8] !== null && answers[8] > 0);
	const allAnswered = $derived(answers.every((a) => a !== null));
	const band = $derived(BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1]);

	function open() {
		step = 'disclaimer';
	}
	function agree() {
		step = 'questions';
	}
	function submit() {
		if (allAnswered) step = 'results';
	}
	function close() {
		step = 'closed';
		answers = Array(9).fill(null);
	}
</script>

<button class="screening-trigger" onclick={open}>
	Take a brief depression screening (PHQ-9) &rarr;
</button>

{#if step !== 'closed'}
	<div class="scrim" role="presentation" onclick={close}></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="phq9-title"
		tabindex="-1"
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		{#if step === 'disclaimer'}
			<div class="modal-header">
				<h2 id="phq9-title">Before you begin</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<div class="crisis-bar">
					If you are experiencing a mental health crisis, you may call or text <a href="tel:988"><strong>988</strong></a> or text <strong>HOME</strong> to <strong>741741</strong> to be connected to a crisis specialist 24/7.
				</div>
				<p>
					This screening uses the PHQ-9, a validated questionnaire used in clinical settings to screen
					for depression symptoms over the past two weeks.
				</p>
				<ul class="disclaimer-list">
					<li>
						Your responses are <strong>not saved, collected, or transmitted</strong> — they exist only
						in your browser during this session.
					</li>
					<li>
						Results are <strong>not reviewed by any clinician</strong> at Plan Your Recovery or
						elsewhere.
					</li>
					<li>
						This is a <strong>self-screening tool, not a clinical assessment</strong>. It cannot
						diagnose depression.
					</li>
					<li>If you think you suffer from depression, you may benefit from a full evaluation by a mental health professional.</li>
				</ul>
				<button class="btn-primary" onclick={agree}>I understand — show me the screening</button>
			</div>

		{:else if step === 'questions'}
			<div class="modal-header">
				<h2 id="phq9-title">PHQ-9 Depression Screening</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p class="prompt">
					Over the <strong>last 2 weeks</strong>, how often have you been bothered by any of the
					following?
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
											name="phq9-q{i}"
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
						<p class="helper">Answer all 9 questions to see your results.</p>
					{/if}
					<button class="btn-primary" onclick={submit} disabled={!allAnswered}>
						See my results
					</button>
				</div>
			</div>

		{:else if step === 'results'}
			<div class="modal-header">
				<h2 id="phq9-title">Your Results</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				{#if suicidalFlag}
					<div class="safety-alert">
						<strong>Your response to question 9 indicates thoughts of death or self-harm.</strong>
						<p>
							For immediate help, you can call or text <a href="tel:988"><strong>988</strong></a> to
							get free, confidential support 24/7. You can also text <strong>HOME</strong> to
							<strong>741741</strong> to be connected to someone trained in crisis intervention for a
							text-based conversation.
						</p>
					</div>
				{/if}

				<div class="score-display">
					<div class="score-number">{score}<span class="score-denom">/27</span></div>
					<div class="score-label">{band.label}</div>
				</div>

				<p class="result-message">{band.message}</p>

				<div class="result-note">
					<p>
						This screening tool is for informational purposes only and cannot replace a full,
						professional diagnostic evaluation.
					</p>
				</div>

				<div class="result-cta">
					<a href="/booking/" class="btn-primary">Schedule a consultation</a>
				</div>

				<div class="crisis-bar">
					<strong>Crisis support:</strong> Call or text <a href="tel:988">988</a> anytime, 24/7.
					Text <strong>HOME</strong> to <strong>741741</strong> for the Crisis Text Line.
				</div>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.screening-trigger {
		display: inline;
		background: none;
		border: none;
		padding: 0;
		font-size: 0.9rem;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 500;
		color: var(--c-dark);
		cursor: pointer;
		box-shadow: 0 1px 0 0 currentColor;
		transition: color 0.2s, box-shadow 0.2s;
		margin-top: 1.25rem;

		&:hover {
			color: var(--accent);
			box-shadow: 0 2px 0 0 var(--accent);
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
		width: min(640px, calc(100vw - 2rem));
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
		display: flex;
		flex-direction: column;

		&::before {
			content: '';
			display: block;
			height: 5px;
			background: var(--accent, var(--c-blue));
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

		a {
			color: var(--c-dark);
			font-weight: 600;
		}
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
		background: var(--accent, var(--c-blue));
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

		&:hover {
			opacity: 0.85;
			color: var(--c-dark);
			box-shadow: none;
		}

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}

	.prompt {
		font-size: 0.95rem;
		color: #555;
	}

	.questions {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.question-group {
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 0.9rem 1rem;
		transition: border-color 0.15s;

		&.answered {
			border-color: var(--accent, var(--c-blue));
		}
	}

	.question-text {
		font-size: 0.9rem;
		font-weight: 500;
		line-height: 1.5;
		color: var(--c-dark);
		margin-bottom: 0.75rem;

		.q-num {
			font-weight: 700;
		}
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

		input[type='radio'] {
			accent-color: var(--accent, var(--c-blue));
			flex-shrink: 0;
		}

		&.selected {
			background: color-mix(in srgb, var(--accent, var(--c-blue)) 20%, white);
			border-color: var(--accent, var(--c-blue));
			font-weight: 500;
		}

		&:hover {
			border-color: var(--accent, var(--c-blue));
		}
	}

	.modal-footer {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid #eee;
	}

	.helper {
		font-size: 0.85rem !important;
		color: #888 !important;
	}

	.safety-alert {
		background: #fef2f2;
		border-left: 4px solid #dc2626;
		border-radius: 4px;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;

		strong {
			font-size: 0.95rem;
			color: #b91c1c;
		}

		p {
			font-size: 0.9rem !important;
			color: #7f1d1d !important;

			a {
				color: #b91c1c;
				font-weight: 700;
			}
		}
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

		.score-label {
			font-size: 1rem;
			font-weight: 600;
			color: var(--accent, var(--c-blue));
			margin-top: 0.35rem;
			filter: brightness(0.7);
		}
	}

	.result-message {
		font-size: 0.95rem !important;
		line-height: 1.75 !important;
	}

	.result-note {
		background: #f8f8f8;
		border-radius: 4px;
		padding: 0.75rem 1rem;

		p {
			font-size: 0.85rem !important;
			color: #666 !important;
			font-style: italic;
		}
	}

	.result-cta {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding-top: 0.25rem;

		p {
			font-weight: 500;
		}
	}
</style>
