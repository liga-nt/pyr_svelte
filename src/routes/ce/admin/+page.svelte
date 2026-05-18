<script>
	import { goto } from '$app/navigation';
	import { collection, getDocs, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase.js';
	import { authState } from '$lib/auth.svelte.js';

	let courses = $state([]);
	let loading = $state(true);

	async function loadCourses() {
		const q = query(collection(db, 'courses'), orderBy('title'));
		const snap = await getDocs(q);
		courses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
		loading = false;
	}

	// Wait until auth is confirmed before querying
	$effect(() => {
		if (!authState.loading && authState.isAdmin) {
			loadCourses();
		}
	});
</script>

<svelte:head>
	<title>Admin | PYR CE</title>
</svelte:head>

<div class="admin-page">
	<header class="admin-header">
		<div class="admin-header-inner">
			<a href="/ce/dashboard" class="back-link">← Dashboard</a>
			<h1>Course Admin</h1>
			<button class="btn-new" onclick={() => goto('/ce/admin/courses/new')}>+ New course</button>
		</div>
	</header>

	<div class="admin-body">
		{#if loading}
			<p class="loading-msg">Loading…</p>
		{:else if courses.length === 0}
			<div class="empty">
				<p>No courses yet.</p>
				<button class="btn-primary" onclick={() => goto('/ce/admin/courses/new')}>Create your first course</button>
			</div>
		{:else}
			<ul class="course-list">
				{#each courses as course}
					<li class="course-item">
						<div class="course-info">
							<span class="course-title">{course.title}</span>
							<span class="course-meta">
								{course.creditHours} hr{course.creditHours !== 1 ? 's' : ''} · {course.modules?.length ?? 0} modules
							</span>
						</div>
						<div class="course-actions">
							<span class="badge" class:published={course.published}>{course.published ? 'Published' : 'Draft'}</span>
							<button class="btn-edit" onclick={() => goto(`/ce/admin/courses/${course.id}`)}>Edit</button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style lang="scss">
	.admin-page { min-height: 80vh; }

	.admin-header {
		border-bottom: 1px solid #eee;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.admin-header-inner {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
		height: 60px;
		display: flex;
		align-items: center;
		gap: 1rem;

		.back-link {
			font-size: 0.85rem;
			color: #888;
			box-shadow: none;
			white-space: nowrap;
			&:hover { color: var(--c-dark); box-shadow: none; }
		}

		h1 { font-size: 1.1rem; font-weight: 700; flex: 1; }
	}

	.btn-new {
		padding: 0.5rem 1.1rem;
		background: var(--c-green);
		color: var(--c-dark);
		border: none;
		border-radius: var(--border-radius);
		font-size: 0.9rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		white-space: nowrap;
		transition: opacity 0.15s;
		&:hover { opacity: 0.85; }
	}

	.admin-body {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-medium) var(--container-padding);
	}

	.loading-msg { color: #888; }

	.empty {
		text-align: center;
		padding: var(--space-large) 0;
		color: #888;
		p { margin-bottom: var(--space-tiny); }
	}

	.btn-primary {
		padding: 0.65rem 1.5rem;
		background: var(--c-green);
		color: var(--c-dark);
		border: none;
		border-radius: var(--border-radius);
		font-size: 0.95rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: opacity 0.15s;
		&:hover { opacity: 0.85; }
	}

	.course-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.course-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 0;
		border-bottom: 1px solid #f0f0f0;

		&:first-child { border-top: 1px solid #f0f0f0; }
	}

	.course-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;

		.course-title { font-weight: 600; font-size: 0.95rem; }
		.course-meta { font-size: 0.82rem; color: #888; }
	}

	.course-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.badge {
		font-size: 0.75rem;
		padding: 0.25rem 0.6rem;
		border-radius: 20px;
		background: #f0f0f0;
		color: #888;

		&.published {
			background: color-mix(in srgb, var(--c-green) 25%, white);
			color: #2a7a3a;
		}
	}

	.btn-edit {
		padding: 0.35rem 0.9rem;
		background: none;
		border: 1.5px solid #ddd;
		border-radius: var(--border-radius);
		font-size: 0.85rem;
		font-family: inherit;
		cursor: pointer;
		transition: border-color 0.15s;
		&:hover { border-color: var(--c-dark); }
	}
</style>
