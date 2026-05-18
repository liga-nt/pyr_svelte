<script>
	import { goto } from '$app/navigation';
	import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
	import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
	import { auth, db } from '$lib/firebase.js';
	import { authState } from '$lib/auth.svelte.js';

	let fullName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let licenseType = $state('');
	let licenseNumber = $state('');
	let licenseState = $state('');
	let error = $state('');
	let loading = $state(false);

	$effect(() => {
		if (authState.user) goto('/ce/dashboard');
	});

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

	async function handleRegister(e) {
		e.preventDefault();
		error = '';

		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}
		if (password.length < 8) {
			error = 'Password must be at least 8 characters.';
			return;
		}

		loading = true;
		try {
			const cred = await createUserWithEmailAndPassword(auth, email, password);
			await updateProfile(cred.user, { displayName: fullName });
			await setDoc(doc(db, 'users', cred.user.uid), {
				name: fullName,
				email,
				licenseType,
				licenseNumber,
				licenseState,
				createdAt: serverTimestamp()
			});
			goto('/ce/dashboard');
		} catch (err) {
			error = friendlyError(err.code);
		} finally {
			loading = false;
		}
	}

	async function handleGoogleSignIn() {
		error = '';
		loading = true;
		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			const userRef = doc(db, 'users', user.uid);
			const userSnap = await getDoc(userRef);
			if (!userSnap.exists()) {
				await setDoc(userRef, {
					name: user.displayName || '',
					email: user.email,
					licenseType: '',
					licenseNumber: '',
					licenseState: '',
					createdAt: serverTimestamp()
				});
			}
			goto('/ce/dashboard');
		} catch (err) {
			if (err.code !== 'auth/popup-closed-by-user') {
				error = 'Google sign-in failed. Please try again.';
			}
		} finally {
			loading = false;
		}
	}

	function friendlyError(code) {
		if (code === 'auth/email-already-in-use') return 'An account with this email already exists.';
		if (code === 'auth/weak-password') return 'Password must be at least 8 characters.';
		if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
		return 'Something went wrong. Please try again.';
	}
</script>

<svelte:head>
	<title>Create Account | PYR Continuing Education</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<div class="auth-header">
			<a href="/ce" class="back-link">← CE Courses</a>
			<h1>Create account</h1>
			<p>Your name and license info will appear on your certificates.</p>
		</div>

		<button class="btn-google" onclick={handleGoogleSignIn} disabled={loading}>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
				<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
				<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
				<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
			</svg>
			Continue with Google
		</button>

		<div class="divider"><span>or sign up with email</span></div>

		<form onsubmit={handleRegister} novalidate>
			<div class="field">
				<label for="fullName">Full name <span class="req">*</span></label>
				<input
					id="fullName"
					type="text"
					autocomplete="name"
					bind:value={fullName}
					required
					placeholder="As it should appear on certificates"
				/>
			</div>

			<div class="field">
				<label for="email">Email <span class="req">*</span></label>
				<input
					id="email"
					type="email"
					autocomplete="email"
					bind:value={email}
					required
					placeholder="you@example.com"
				/>
			</div>

			<div class="field-row">
				<div class="field">
					<label for="password">Password <span class="req">*</span></label>
					<input
						id="password"
						type="password"
						autocomplete="new-password"
						bind:value={password}
						required
						placeholder="8+ characters"
					/>
				</div>
				<div class="field">
					<label for="confirmPassword">Confirm password <span class="req">*</span></label>
					<input
						id="confirmPassword"
						type="password"
						autocomplete="new-password"
						bind:value={confirmPassword}
						required
						placeholder="••••••••"
					/>
				</div>
			</div>

			<div class="section-label">License information <span class="optional">(for certificates)</span></div>

			<div class="field">
				<label for="licenseType">License / credential type</label>
				<select id="licenseType" bind:value={licenseType}>
					<option value="">Select…</option>
					{#each licenseTypes as lt}
						<option value={lt}>{lt}</option>
					{/each}
				</select>
			</div>

			<div class="field-row">
				<div class="field">
					<label for="licenseNumber">License number</label>
					<input
						id="licenseNumber"
						type="text"
						bind:value={licenseNumber}
						placeholder="e.g. 123456"
					/>
				</div>
				<div class="field">
					<label for="licenseState">License state</label>
					<select id="licenseState" bind:value={licenseState}>
						<option value="">State…</option>
						{#each usStates as s}
							<option value={s}>{s}</option>
						{/each}
					</select>
				</div>
			</div>

			{#if error}
				<p class="error-msg" role="alert">{error}</p>
			{/if}

			<button type="submit" class="btn-primary" disabled={loading}>
				{loading ? 'Creating account…' : 'Create account'}
			</button>
		</form>

		<p class="alt-action">
			Already have an account? <a href="/ce/login">Sign in</a>
		</p>
	</div>
</div>

<style lang="scss">
	.auth-page {
		min-height: 60vh;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: var(--space-medium) var(--container-padding);
	}

	.auth-card {
		width: 100%;
		max-width: 520px;
	}

	.auth-header {
		margin-bottom: var(--space-small);

		.back-link {
			display: inline-block;
			font-size: 0.85rem;
			color: #888;
			margin-bottom: var(--space-tiny);
			box-shadow: none;
			&:hover { color: var(--c-dark); box-shadow: none; }
		}

		h1 {
			font-size: 1.75rem;
			font-weight: 700;
			margin-bottom: 0.25rem;
		}

		p { color: #666; font-size: 0.95rem; }
	}

	.btn-google {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: white;
		border: 1.5px solid #ddd;
		border-radius: var(--border-radius);
		font-size: 0.95rem;
		font-weight: 500;
		font-family: inherit;
		color: var(--c-dark);
		cursor: pointer;
		transition: border-color 0.15s, box-shadow 0.15s;

		svg { width: 18px; height: 18px; flex-shrink: 0; }

		&:hover:not(:disabled) {
			border-color: #bbb;
			box-shadow: 0 1px 4px rgba(0,0,0,0.08);
		}

		&:disabled { opacity: 0.5; cursor: default; }
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 1.25rem 0;
		color: #bbb;
		font-size: 0.85rem;

		&::before, &::after {
			content: '';
			flex: 1;
			height: 1px;
			background: #eee;
		}
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		flex: 1;

		label {
			font-size: 0.9rem;
			font-weight: 500;
		}

		input, select {
			width: 100%;
			padding: 0.75rem 1rem;
			border: 1.5px solid #ddd;
			border-radius: var(--border-radius);
			font-size: 1rem;
			font-family: inherit;
			background: white;
			-webkit-appearance: none;
			transition: border-color 0.15s;

			&:focus {
				border-color: var(--c-green);
				outline: none;
			}
		}
	}

	.field-row {
		display: flex;
		gap: 1rem;

		@media (max-width: 480px) {
			flex-direction: column;
		}
	}

	.section-label {
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: #888;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid #eee;
		margin-bottom: -0.25rem;

		.optional {
			font-weight: 400;
			text-transform: none;
			letter-spacing: 0;
		}
	}

	.req { color: #c0392b; margin-left: 2px; }

	.error-msg {
		color: #c0392b;
		font-size: 0.88rem;
		background: #fdf2f2;
		border: 1px solid #f5c6c6;
		border-radius: var(--border-radius);
		padding: 0.6rem 0.9rem;
	}

	.btn-primary {
		width: 100%;
		padding: 0.85rem;
		background: var(--c-green);
		color: var(--c-dark);
		font-size: 1rem;
		font-weight: 600;
		font-family: inherit;
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
		transition: opacity 0.15s, transform 0.1s;
		margin-top: 0.25rem;

		&:hover:not(:disabled) { opacity: 0.88; }
		&:active:not(:disabled) { transform: scale(0.99); }
		&:disabled { opacity: 0.5; cursor: default; }
	}

	.alt-action {
		margin-top: var(--space-tiny);
		text-align: center;
		font-size: 0.9rem;
		color: #666;

		a { color: var(--c-dark); }
	}
</style>
