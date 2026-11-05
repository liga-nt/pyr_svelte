<script>
	// A course, start to finish, full screen: intro, each module in order, then completion.
	// `course` has the shape of a Firestore courses document. Progress is not saved yet.
	import { marked } from 'marked';
	import ColorBar from '../ColorBar.svelte';
	import SlideStage from './SlideStage.svelte';
	import ExamScreen from './ExamScreen.svelte';

	let { course, isAdmin = false, isDraft = false, onexit = () => {} } = $props();

	// -1 = intro, 0..n-1 = a module, n = finished
	let step = $state(-1);

	const modules = $derived([...(course.modules ?? [])].sort((a, b) => a.order - b.order));

	function minutes(m) {
		if (m.type === 'slideshow') {
			const secs = m.slides.reduce(
				(n, s) => n + (s.audioDurationSec ?? (s.script?.split(/\s+/).filter(Boolean).length ?? 0) / 2.5),
				0
			);
			return Math.max(1, Math.round(secs / 60));
		}
		if (m.type === 'article') return Math.max(1, Math.round((m.articleMarkdown?.split(/\s+/).length ?? 0) / 200));
		return null;
	}

	function label(m) {
		if (m.type === 'slideshow') return `${minutes(m)} min`;
		if (m.type === 'article') return `${minutes(m)} min reading`;
		if (m.type === 'exam') return `${m.questions?.length ?? 0} questions`;
		return '';
	}

	function next() {
		step += 1;
		window.scrollTo?.({ top: 0 });
	}

	const current = $derived(step >= 0 && step < modules.length ? modules[step] : null);
</script>

{#if step === -1}
	<div class="screen">
		<button type="button" class="close" aria-label="Leave the course" onclick={onexit}>×</button>
		<div class="col intro">
			{#if isDraft}<p class="draft">Draft preview. Only admins can see this course.</p>{/if}
			<ColorBar color="green" position="left" />
			<p class="eyebrow">Continuing education</p>
			<h1>{course.title}</h1>
			{#if course.description}<p class="lead">{course.description}</p>{/if}
			<dl class="facts">
				<div><dt>Credit</dt><dd>{course.creditHours} hour{course.creditHours === 1 ? '' : 's'}</dd></div>
				{#if course.creditType}<div><dt>Type</dt><dd>{course.creditType}</dd></div>{/if}
				{#if modules.some((m) => m.type === 'exam')}<div><dt>Passing score</dt><dd>{course.passingScore} percent</dd></div>{/if}
			</dl>
			<ol class="modules">
				{#each modules as m}
					<li><span>{m.title}</span><span class="len">{label(m)}</span></li>
				{/each}
			</ol>
			<p class="hint">Turn your sound on. The course plays on its own, one slide after another.</p>
			<button type="button" class="primary begin" onclick={next}>Begin</button>
		</div>
	</div>
{:else if current?.type === 'slideshow'}
	{#key current.id}
		<SlideStage slides={current.slides} canSkip={isAdmin} onfinish={next} {onexit} />
	{/key}
{:else if current}
	<div class="screen">
		<button type="button" class="close" aria-label="Leave the course" onclick={onexit}>×</button>
		<div class="col">
			<p class="eyebrow">Module {step + 1} of {modules.length}</p>
			<h1 class="small">{current.title}</h1>
			{#key current.id}
				{#if current.type === 'article'}
					<article class="prose">{@html marked.parse(current.articleMarkdown ?? '')}</article>
					<button type="button" class="primary" onclick={next}>Continue</button>
				{:else if current.type === 'exam'}
					<ExamScreen questions={current.questions} passingScore={course.passingScore} onpass={next} />
				{:else}
					<p>This kind of module isn't supported yet.</p>
					<button type="button" class="primary" onclick={next}>Continue</button>
				{/if}
			{/key}
		</div>
	</div>
{:else}
	<div class="screen">
		<div class="col intro">
			<ColorBar color="green" position="left" />
			<p class="eyebrow">Course complete</p>
			<h1>{course.title}</h1>
			<p class="lead">
				You finished all {modules.length} module{modules.length === 1 ? '' : 's'}.
				{#if isDraft}This was a draft preview, so nothing was recorded.{:else}Certificates are not available yet, and your progress was not saved.{/if}
			</p>
			<button type="button" class="primary begin" onclick={onexit}>Done</button>
		</div>
	</div>
{/if}

<style>
	.screen {
		position: fixed;
		inset: 0;
		background: #fff;
		overflow-y: auto;
		display: flex;
		justify-content: center;
		padding: clamp(4rem, 10vh, 6rem) clamp(1.25rem, 5vw, 3rem) 4rem;
	}
	.col { width: min(100%, 720px); display: flex; flex-direction: column; gap: 1.1rem; align-self: flex-start; }
	.intro { gap: 1.1rem; }
	.close {
		position: fixed;
		top: 0.75rem;
		left: 0.75rem;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1px solid #e8e4ee;
		background: #fff;
		font-family: ibm-plex-sans, sans-serif;
		font-style: normal;
		font-size: 1.6rem;
		line-height: 1;
		text-transform: none;
		color: var(--c-dark);
		padding: 0;
	}
	.draft {
		margin: 0;
		align-self: flex-start;
		background: color-mix(in srgb, var(--c-yellow) 30%, white);
		border: 1px solid color-mix(in srgb, var(--c-yellow) 60%, white);
		border-radius: 6px;
		padding: 0.4rem 0.75rem;
		font-size: 0.875rem;
	}
	.eyebrow {
		margin: 0;
		font-family: ibm-plex-sans-condensed, sans-serif;
		font-size: 0.8rem;
		font-weight: 800;
		font-style: italic;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--c-green-text, #1e7a3c);
	}
	h1 { font-size: clamp(2rem, 6vw, 3.25rem); line-height: 1.15; margin: 0; }
	h1.small { font-size: clamp(1.5rem, 4.5vw, 2.1rem); }
	.lead { font-size: 1.15rem; line-height: 1.7; margin: 0; }
	.facts { display: flex; flex-wrap: wrap; gap: 0.5rem 2rem; margin: 0.25rem 0 0; }
	.facts div { display: flex; flex-direction: column; }
	dt { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--c-text-muted, #666); }
	dd { margin: 0; font-weight: 500; }
	.modules { list-style: none; margin: 0.5rem 0; padding: 0; }
	.modules li { display: flex; justify-content: space-between; gap: 1rem; padding: 0.7rem 0; border-top: 1px solid var(--c-gray); }
	.modules li:last-child { border-bottom: 1px solid var(--c-gray); }
	.len { color: var(--c-text-muted, #666); font-size: 0.9rem; white-space: nowrap; }
	.hint { margin: 0; font-size: 0.9375rem; color: var(--c-text-muted, #666); }
	.primary { align-self: flex-start; min-height: 48px; padding-inline: 1.5em; }
	.begin { margin-top: 0.5rem; }
	.prose { line-height: 1.7; font-size: 1.05rem; }
	.prose :global(h1), .prose :global(h2) { font-size: 1.5rem; margin: 1.5rem 0 0.75rem; }
	.prose :global(ul), .prose :global(ol) { padding-left: 1.4rem; }
	.prose :global(li) { margin-bottom: 0.4rem; }
	button:focus-visible { outline: 2px solid var(--c-dark); outline-offset: 2px; }
</style>
