<script>
	// Multiple-choice exam. Correct answers are shown only after a pass, so a retry cannot
	// simply copy the key. `questions` are { id, prompt, choices, correctIndex }.
	let { questions = [], passingScore = 80, onpass = () => {} } = $props();

	let answers = $state([]);
	let submitted = $state(false);

	const answered = $derived(answers.filter((a) => a !== undefined).length);
	const correct = $derived(questions.filter((q, i) => answers[i] === q.correctIndex).length);
	const percent = $derived(questions.length ? Math.round((correct / questions.length) * 100) : 0);
	const passed = $derived(percent >= passingScore);

	function retry() {
		answers = [];
		submitted = false;
	}
</script>

<div class="exam">
	{#each questions as q, i}
		<fieldset class="question" disabled={submitted}>
			<legend><span class="num">{i + 1}.</span> {q.prompt}</legend>
			{#each q.choices as choice, ci}
				<label
					class="choice"
					class:right={submitted && passed && ci === q.correctIndex}
					class:wrong={submitted && answers[i] === ci && ci !== q.correctIndex}
				>
					<input type="radio" name="q{i}" value={ci} bind:group={answers[i]} />
					<span>{choice}</span>
				</label>
			{/each}
		</fieldset>
	{/each}

	{#if !submitted}
		<div class="actions">
			<span class="count">{answered} of {questions.length} answered</span>
			<button type="button" class="primary" disabled={answered < questions.length} onclick={() => (submitted = true)}>
				Submit answers
			</button>
		</div>
	{:else}
		<div class="result" class:passed role="status">
			<h2>{passed ? 'You passed' : 'Not quite yet'}</h2>
			<p>You answered {correct} of {questions.length} correctly ({percent} percent). The passing score is {passingScore} percent.</p>
			{#if passed}
				<button type="button" class="primary" onclick={onpass}>Continue</button>
			{:else}
				<button type="button" class="primary" onclick={retry}>Try again</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.exam { display: flex; flex-direction: column; gap: 1.75rem; }
	.question { border: 0; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; min-width: 0; }
	legend { font-size: 1.15rem; line-height: 1.5; font-weight: 500; margin-bottom: 0.5rem; padding: 0; }
	.num { color: var(--c-green-text, #1e7a3c); }
	.choice {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		min-height: 48px;
		padding: 0.65rem 0.9rem;
		border: 1.5px solid #ddd;
		border-radius: 6px;
		cursor: pointer;
		line-height: 1.5;
	}
	.choice:has(input:checked) { border-color: var(--c-green); background: color-mix(in srgb, var(--c-green) 12%, white); }
	.choice.right { border-color: var(--c-green); background: color-mix(in srgb, var(--c-green) 20%, white); }
	.choice.wrong { border-color: #999; background: #f5f5f5; text-decoration: line-through; text-decoration-color: #999; }
	.choice input { margin-top: 0.3rem; accent-color: #444; }
	.actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
	.count { font-size: 0.875rem; color: var(--c-text-muted, #666); }
	.result { border-left: 4px solid var(--c-gray); padding: 0.5rem 0 0.5rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; align-items: flex-start; }
	.result.passed { border-left-color: var(--c-green); }
	.result h2 { margin: 0; font-size: 1.5rem; }
	.result p { margin: 0; }
	.primary { min-height: 48px; padding-inline: 1.25em; }
	button:disabled { opacity: 0.6; cursor: default; }
	button:focus-visible, input:focus-visible { outline: 2px solid var(--c-dark); outline-offset: 2px; }
</style>
