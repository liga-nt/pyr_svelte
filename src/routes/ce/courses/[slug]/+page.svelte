<script>
	// The learner's course player, at /ce/courses/<slug>. Learners see published courses only.
	// Admins can also open drafts here, which is how a draft is previewed exactly as learners will see it.
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { doc, getDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase.js';
	import { authState } from '$lib/auth.svelte.js';
	import CoursePlayer from '$lib/components/course/CoursePlayer.svelte';

	let slug = $derived(page.params.slug);
	let course = $state(null);
	let status = $state('loading'); // loading | ready | missing

	// Reset when the slug changes (client-side nav between courses reuses this component).
	$effect(() => {
		slug;
		status = 'loading';
		course = null;
	});

	$effect(() => {
		if (authState.loading || status !== 'loading') return;
		if (!authState.user) {
			goto('/ce/login');
			return;
		}
		load(slug);
	});

	async function load(slug) {
		try {
			const snap = await getDoc(doc(db, 'courses', slug));
			if (!snap.exists()) return (status = 'missing');
			const data = snap.data();
			// Drafts are hidden from everyone except admins. Firestore rules enforce this too.
			if (!data.published && !authState.isAdmin) return (status = 'missing');
			course = { id: snap.id, ...data };
			status = 'ready';
		} catch {
			status = 'missing';
		}
	}

	const leave = () => goto(authState.isAdmin && course && !course.published ? '/ce/admin' : '/ce/dashboard');
</script>

<svelte:head>
	<title>{course?.title ?? 'Course'} | PYR Continuing Education</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if status === 'ready'}
	<CoursePlayer {course} isAdmin={authState.isAdmin} isDraft={!course.published} onexit={leave} />
{:else if status === 'missing'}
	<div class="msg">
		<h1>This course isn't available</h1>
		<p>It may not be published yet, or the link may be wrong.</p>
		<a href="/ce/dashboard" class="primary-link">Back to my courses</a>
	</div>
{:else}
	<div class="msg"><div class="spinner" role="status" aria-label="Loading"></div></div>
{/if}

<style>
	.msg { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; text-align: center; padding: 2rem; }
	h1 { font-size: 1.75rem; margin: 0; }
	p { margin: 0; }
	.primary-link { margin-top: 0.75rem; }
	.spinner { width: 36px; height: 36px; border: 3px solid var(--c-gray); border-top-color: var(--c-green); border-radius: 50%; animation: spin 0.7s linear infinite; }
	@keyframes spin { to { transform: rotate(360deg); } }
</style>
