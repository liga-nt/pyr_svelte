<script>
	const TRAUMA_PREAMBLE = 'Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. For example: a serious accident or fire; a physical or sexual assault or abuse; an earthquake or flood; a war; seeing someone be killed or seriously injured; having a loved one die through homicide or suicide.';

	const QUESTIONS = [
		'Had nightmares about the event(s) or thought about the event(s) when you did not want to?',
		'Tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?',
		'Been constantly on guard, watchful, or easily startled?',
		'Felt numb or detached from people, activities, or your surroundings?',
		'Felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?'
	];

	const CUTOFF = 4;

	let step = $state('closed');
	let traumaExposed = $state(null);
	let answers = $state(Array(5).fill(null));

	const yesCount = $derived(answers.filter((a) => a === 1).length);
	const allAnswered = $derived(answers.every((a) => a !== null));
	const positiveScreen = $derived(allAnswered && yesCount >= CUTOFF);

	function open() { step = 'disclaimer'; }
	function agree() { step = 'trauma'; }
	function selectTrauma(exposed) {
		traumaExposed = exposed;
		if (exposed) {
			step = 'questions';
		} else {
			step = 'results';
		}
	}
	function submit() { if (allAnswered) step = 'results'; }
	function close() {
		step = 'closed';
		traumaExposed = null;
		answers = Array(5).fill(null);
	}
</script>

<button class="launch-btn" onclick={open}>Launch PC-PTSD-5 &rarr;</button>

{#if step !== 'closed'}
	<div class="scrim" role="presentation" onclick={close}></div>

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="pcptsd5-title"
		tabindex="-1"
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		{#if step === 'disclaimer'}
			<div class="modal-header">
				<h2 id="pcptsd5-title">PC-PTSD-5 — Before You Begin</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<div class="crisis-bar">
					If you or someone you are with is experiencing a mental health crisis, call or text <a href="tel:988"><strong>988</strong></a> or text <strong>HOME</strong> to <strong>741741</strong> to reach a crisis specialist, 24/7.
				</div>
				<p>
					The PC-PTSD-5 is a validated 5-item screener designed for primary care and other medical
					settings to identify individuals who may have PTSD. It is designed to support practitioner
					judgment — it is not a diagnostic instrument.
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
						A positive screen indicates <strong>possible PTSD</strong> warranting further evaluation;
						it is not a diagnosis.
					</li>
					<li>
						If you are using this tool for yourself rather than in a clinical context, please consult
						a mental health professional to interpret your results.
					</li>
				</ul>
				<button class="btn-primary" onclick={agree}>I understand — begin screening</button>
			</div>

		{:else if step === 'trauma'}
			<div class="modal-header">
				<h2 id="pcptsd5-title">PC-PTSD-5 — Trauma Exposure</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p class="prompt">{TRAUMA_PREAMBLE}</p>
				<p class="trauma-question">Have you ever experienced this kind of event?</p>
				<div class="trauma-options">
					<button class="trauma-btn" onclick={() => selectTrauma(true)}>Yes</button>
					<button class="trauma-btn trauma-btn-no" onclick={() => selectTrauma(false)}>No</button>
				</div>
			</div>

		{:else if step === 'questions'}
			<div class="modal-header">
				<h2 id="pcptsd5-title">PC-PTSD-5 Screening</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				<p class="prompt">
					In the <strong>past month</strong>, in relation to the traumatic event(s) you experienced:
				</p>
				<div class="questions">
					{#each QUESTIONS as q, i}
						<fieldset class="question-group" class:answered={answers[i] !== null}>
							<legend class="question-text"><span class="q-num">{i + 1}.</span> {q}</legend>
							<div class="options">
								<label class="option" class:selected={answers[i] === 0}>
									<input
										type="radio"
										name="pcptsd5-q{i}"
										value={0}
										checked={answers[i] === 0}
										onchange={() => (answers[i] = 0)}
									/>
									No
								</label>
								<label class="option" class:selected={answers[i] === 1}>
									<input
										type="radio"
										name="pcptsd5-q{i}"
										value={1}
										checked={answers[i] === 1}
										onchange={() => (answers[i] = 1)}
									/>
									Yes
								</label>
							</div>
						</fieldset>
					{/each}
				</div>
				<div class="modal-footer">
					{#if !allAnswered}
						<p class="helper">Answer all 5 questions to see results.</p>
					{/if}
					<button class="btn-primary" onclick={submit} disabled={!allAnswered}>
						View results
					</button>
				</div>
			</div>

		{:else if step === 'results'}
			<div class="modal-header">
				<h2 id="pcptsd5-title">PC-PTSD-5 Results</h2>
				<button class="close-btn" onclick={close} aria-label="Close">&times;</button>
			</div>
			<div class="modal-body">
				{#if !traumaExposed}
					<div class="screen-result negative">
						<div class="result-label">Negative Screen</div>
						<div class="result-sub">No trauma exposure reported</div>
					</div>
					<div class="clinical-note">
						<p>
							The patient did not endorse prior trauma exposure. PC-PTSD-5 criteria items were
							not administered. Clinical judgment should guide further assessment if trauma exposure
							is suspected based on other information.
						</p>
					</div>
				{:else}
					<div class="screen-result" class:positive={positiveScreen} class:negative={!positiveScreen}>
						<div class="result-label">{positiveScreen ? 'Positive Screen' : 'Negative Screen'}</div>
						<div class="result-sub">{yesCount} / 5 criteria endorsed</div>
					</div>

					{#if positiveScreen}
						<div class="clinical-note positive">
							<p>
								{yesCount} of 5 items endorsed (threshold: {CUTOFF}). This result is consistent with
								possible PTSD. A comprehensive trauma-focused clinical evaluation is recommended,
								such as the PCL-5 or CAPS-5.
							</p>
						</div>
					{:else}
						<div class="clinical-note">
							<p>
								{yesCount} of 5 items endorsed (threshold: {CUTOFF}). This result does not meet
								the threshold for a positive screen. Clinical judgment and patient history should
								still guide further evaluation when indicated.
							</p>
						</div>
					{/if}

					<div class="criteria-table">
						<table>
							<thead>
								<tr><th>#</th><th>Criterion</th><th>Response</th></tr>
							</thead>
							<tbody>
								{#each QUESTIONS as q, i}
									<tr class:endorsed={answers[i] === 1}>
										<td>{i + 1}</td>
										<td>{q}</td>
										<td>{answers[i] === 1 ? 'Yes' : 'No'}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}

				<div class="result-note">
					<p>
						PC-PTSD-5 scores support clinical judgment and are not diagnostic. Developed by
						Prins et al. (2016) and available from the VA/DoD National Center for PTSD.
						A cut-point of 3 may be used in settings where high sensitivity is preferred.
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
		background: #2a9d8f;
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
			background: #2a9d8f;
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
		background: #2a9d8f;
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

	.prompt { font-size: 0.95rem !important; color: #555 !important; }

	.trauma-question {
		font-size: 1rem !important;
		font-weight: 600;
		color: var(--c-dark) !important;
	}

	.trauma-options {
		display: flex;
		gap: 0.75rem;
	}

	.trauma-btn {
		background: #2a9d8f;
		color: white;
		font-family: ibm-plex-sans, sans-serif;
		font-weight: 600;
		font-size: 0.95rem;
		border: none;
		border-radius: 4px;
		padding: 0.65rem 1.5rem;
		cursor: pointer;
		box-shadow: none;
		transition: opacity 0.15s;

		&:hover { opacity: 0.85; box-shadow: none; }

		&.trauma-btn-no {
			background: #f5f5f5;
			color: #555;
			border: 1px solid #ddd;

			&:hover { background: #eee; }
		}
	}

	.questions { display: flex; flex-direction: column; gap: 1.25rem; }

	.question-group {
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		padding: 0.9rem 1rem;
		transition: border-color 0.15s;

		&.answered { border-color: #2a9d8f; }
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

		input[type='radio'] { accent-color: #2a9d8f; flex-shrink: 0; }

		&.selected {
			background: color-mix(in srgb, #2a9d8f 15%, white);
			border-color: #2a9d8f;
			font-weight: 500;
		}

		&:hover { border-color: #2a9d8f; }
	}

	.modal-footer {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid #eee;
	}

	.helper { font-size: 0.85rem !important; color: #888 !important; }

	.screen-result {
		text-align: center;
		padding: 1.25rem 1rem;
		border-radius: 8px;
		background: #f5f5f5;
		border: 2px solid #e0e0e0;

		&.positive {
			background: color-mix(in srgb, #2a9d8f 12%, white);
			border-color: #2a9d8f;
		}

		&.negative {
			background: #f5f5f5;
			border-color: #ddd;
		}

		.result-label {
			font-size: 1.4rem;
			font-weight: 700;
			color: var(--c-dark);
		}

		.result-sub {
			font-size: 0.85rem;
			color: #777;
			margin-top: 0.25rem;
			font-family: ibm-plex-mono, monospace;
		}
	}

	.clinical-note {
		background: #f5f5f5;
		border-left: 4px solid #ccc;
		border-radius: 4px;
		padding: 0.75rem 1rem;

		&.positive {
			background: color-mix(in srgb, #2a9d8f 10%, white);
			border-left-color: #2a9d8f;
		}

		p { font-size: 0.9rem !important; }
	}

	.criteria-table {
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
				vertical-align: top;

				&:first-child { width: 2rem; }
				&:last-child { width: 3rem; white-space: nowrap; }
			}

			tr.endorsed td {
				background: color-mix(in srgb, #2a9d8f 12%, white);
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
