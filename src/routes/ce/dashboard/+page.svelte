<script>
	import { signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { doc, getDoc, updateDoc } from 'firebase/firestore';
	import { auth, db } from '$lib/firebase.js';
	import { authState } from '$lib/auth.svelte.js';

	let userDoc = $state(null);
	let profileOpen = $state(false);

	// Profile form fields
	let editName = $state('');
	let editLicenseType = $state('');
	let editLicenseNumber = $state('');
	let editLicenseState = $state('');
	let saving = $state(false);
	let saveSuccess = $state(false);

	const licenseTypes = [
		'LCSW', 'LMSW', 'LPC', 'LPC-A', 'LMFT', 'LCPC',
		'CADC', 'CRADC', 'CAADC', 'NAADAC/NCC AP',
		'RN', 'NP', 'MD / DO', 'PhD / PsyD',
		'Student / Intern', 'Other'
	];

	const usStates = [
		'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
		'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
		'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
		'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
		'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
	];

	$effect(() => {
		if (authState.user) {
			loadUserDoc(authState.user.uid);
		}
	});

	async function loadUserDoc(uid) {
		const snap = await getDoc(doc(db, 'users', uid));
		if (snap.exists()) {
			userDoc = snap.data();
			editName = userDoc.name || '';
			editLicenseType = userDoc.licenseType || '';
			editLicenseNumber = userDoc.licenseNumber || '';
			editLicenseState = userDoc.licenseState || '';
		}
	}

	async function saveProfile(e) {
		e.preventDefault();
		saving = true;
		saveSuccess = false;
		try {
			await updateDoc(doc(db, 'users', authState.user.uid), {
				name: editName,
				licenseType: editLicenseType,
				licenseNumber: editLicenseNumber,
				licenseState: editLicenseState
			});
			userDoc = { ...userDoc, name: editName, licenseType: editLicenseType, licenseNumber: editLicenseNumber, licenseState: editLicenseState };
			saveSuccess = true;
			setTimeout(() => {
				saveSuccess = false;
				profileOpen = false;
			}, 1500);
		} finally {
			saving = false;
		}
	}

	async function handleLogout() {
		await signOut(auth);
		goto('/ce');
	}

	let profileIncomplete = $derived(userDoc && !userDoc.licenseType);
</script>

<svelte:head>
	<title>My Courses | PYR Continuing Education</title>
</svelte:head>

<div class="dashboard">
	<header class="ce-header">
		<div class="ce-header-inner">
			<div class="ce-brand">
				<a href="/ce">PYR <span>Continuing Education</span></a>
			</div>
			<nav class="ce-nav">
				<a href="/ce/dashboard" class="active">My Courses</a>
				<a href="/ce/dashboard/certificates">Certificates</a>
				{#if authState.isAdmin}
					<a href="/ce/admin">Admin</a>
				{/if}
			</nav>
			<button class="logout-btn" onclick={handleLogout}>Sign out</button>
		</div>
	</header>

	<div class="dashboard-body">
		<div class="container">
			<div class="welcome">
				<h1>Welcome{userDoc?.name ? `, ${userDoc.name.split(' ')[0]}` : ''}</h1>
				<a href="/ce" class="browse-link">Browse courses →</a>
			</div>

			{#if profileIncomplete}
				<div class="profile-banner">
					<div class="banner-text">
						<strong>Complete your profile</strong>
						Your license information is needed to generate CE certificates.
					</div>
					<button class="banner-btn" onclick={() => profileOpen = !profileOpen}>
						{profileOpen ? 'Cancel' : 'Add now'}
					</button>
				</div>

				{#if profileOpen}
					<form class="profile-form" onsubmit={saveProfile}>
						<div class="profile-fields">
							<div class="field">
								<label for="editName">Full name (for certificates)</label>
								<input id="editName" type="text" bind:value={editName} placeholder="Your full legal name" />
							</div>
							<div class="field">
								<label for="editLicenseType">License / credential type</label>
								<select id="editLicenseType" bind:value={editLicenseType}>
									<option value="">Select…</option>
									{#each licenseTypes as lt}
										<option value={lt}>{lt}</option>
									{/each}
								</select>
							</div>
							<div class="field-row">
								<div class="field">
									<label for="editLicenseNumber">License number</label>
									<input id="editLicenseNumber" type="text" bind:value={editLicenseNumber} placeholder="e.g. 123456" />
								</div>
								<div class="field">
									<label for="editLicenseState">License state</label>
									<select id="editLicenseState" bind:value={editLicenseState}>
										<option value="">State…</option>
										{#each usStates as s}
											<option value={s}>{s}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>
						<button type="submit" class="btn-save" disabled={saving}>
							{#if saveSuccess}
								Saved ✓
							{:else}
								{saving ? 'Saving…' : 'Save profile'}
							{/if}
						</button>
					</form>
				{/if}
			{/if}

			<section class="section">
				<h2>Enrolled courses</h2>
				<div class="empty-state">
					<div class="empty-icon">📚</div>
					<p>You haven't enrolled in any courses yet.</p>
					<a href="/ce" class="btn-primary">Browse courses</a>
				</div>
			</section>

			<section class="section">
				<h2>Certificates</h2>
				<div class="empty-state">
					<div class="empty-icon">🎓</div>
					<p>Complete a course to earn your first certificate.</p>
				</div>
			</section>
		</div>
	</div>
</div>

<style lang="scss">
	.dashboard { min-height: 80vh; }

	.ce-header {
		border-bottom: 1px solid #eee;
		background: white;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.ce-header-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
		height: 56px;
		display: flex;
		align-items: center;
		gap: var(--space-small);
	}

	.ce-brand a {
		font-weight: 700;
		font-size: 1rem;
		color: var(--c-dark);
		box-shadow: none;
		white-space: nowrap;

		span { font-weight: 400; color: #666; }
		&:hover { box-shadow: none; color: var(--c-dark); }
	}

	.ce-nav {
		display: flex;
		gap: 0.25rem;
		flex: 1;

		a {
			padding: 0.35rem 0.75rem;
			border-radius: 20px;
			font-size: 0.9rem;
			color: #666;
			box-shadow: none;
			transition: background 0.15s, color 0.15s;

			&:hover { background: #f5f5f5; color: var(--c-dark); box-shadow: none; }
			&.active { background: color-mix(in srgb, var(--c-green) 20%, white); color: var(--c-dark); font-weight: 500; }
		}

		@media (max-width: 480px) { display: none; }
	}

	.logout-btn {
		margin-left: auto;
		padding: 0.35rem 0.9rem;
		background: none;
		border: 1.5px solid #ddd;
		border-radius: 20px;
		font-size: 0.85rem;
		font-family: inherit;
		color: #666;
		cursor: pointer;
		white-space: nowrap;
		transition: border-color 0.15s, color 0.15s;

		&:hover { border-color: var(--c-dark); color: var(--c-dark); }
	}

	.dashboard-body {
		padding: var(--space-medium) 0 var(--space-xlarge);
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.welcome {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: var(--space-small);

		h1 { font-size: 1.75rem; font-weight: 700; }

		.browse-link {
			font-size: 0.9rem;
			color: #666;
			box-shadow: none;
			&:hover { color: var(--c-dark); }
		}
	}

	.profile-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		background: color-mix(in srgb, var(--c-yellow) 30%, white);
		border: 1px solid color-mix(in srgb, var(--c-yellow) 60%, white);
		border-radius: var(--border-radius);
		padding: 0.9rem 1.1rem;
		margin-bottom: var(--space-tiny);

		.banner-text {
			font-size: 0.9rem;
			line-height: 1.4;

			strong { display: block; margin-bottom: 0.1rem; }
		}

		.banner-btn {
			flex-shrink: 0;
			padding: 0.4rem 1rem;
			background: var(--c-dark);
			color: white;
			border: none;
			border-radius: 20px;
			font-size: 0.85rem;
			font-weight: 500;
			font-family: inherit;
			cursor: pointer;
			transition: opacity 0.15s;

			&:hover { opacity: 0.8; }
		}
	}

	.profile-form {
		background: #fafafa;
		border: 1px solid #eee;
		border-radius: var(--border-radius);
		padding: var(--space-small);
		margin-bottom: var(--space-small);
	}

	.profile-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		flex: 1;

		label { font-size: 0.88rem; font-weight: 500; color: #555; }

		input, select {
			padding: 0.65rem 0.9rem;
			border: 1.5px solid #ddd;
			border-radius: var(--border-radius);
			font-size: 0.95rem;
			font-family: inherit;
			background: white;
			-webkit-appearance: none;
			transition: border-color 0.15s;

			&:focus { border-color: var(--c-green); outline: none; }
		}
	}

	.field-row {
		display: flex;
		gap: 1rem;

		@media (max-width: 480px) { flex-direction: column; }
	}

	.btn-save {
		padding: 0.65rem 1.5rem;
		background: var(--c-green);
		color: var(--c-dark);
		border: none;
		border-radius: var(--border-radius);
		font-size: 0.9rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: opacity 0.15s;

		&:hover:not(:disabled) { opacity: 0.85; }
		&:disabled { opacity: 0.6; cursor: default; }
	}

	.section {
		margin-bottom: var(--space-medium);

		h2 {
			font-size: 1.1rem;
			font-weight: 600;
			margin-bottom: var(--space-tiny);
			padding-bottom: 0.5rem;
			border-bottom: 1px solid #eee;
		}
	}

	.empty-state {
		padding: var(--space-medium) var(--space-small);
		text-align: center;
		color: #888;

		.empty-icon { font-size: 2rem; margin-bottom: 0.75rem; }
		p { font-size: 0.95rem; margin-bottom: var(--space-tiny); }
	}

	.btn-primary {
		display: inline-block;
		padding: 0.6rem 1.5rem;
		background: var(--c-green);
		color: var(--c-dark);
		font-size: 0.9rem;
		font-weight: 600;
		border-radius: var(--border-radius);
		box-shadow: none;
		transition: opacity 0.15s;

		&:hover { opacity: 0.88; box-shadow: none; }
	}
</style>
