<script>
	import { goto } from '$app/navigation';
	import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
	import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
	import { auth, db } from '$lib/firebase.js';
	import { authState } from '$lib/auth.svelte.js';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	$effect(() => {
		if (authState.user && !loading) goto('/ce/dashboard');
	});

	async function handleLogin(e) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			await signInWithEmailAndPassword(auth, email, password);
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
			console.log('[google-signin] auth ok, uid:', user.uid);
			const userRef = doc(db, 'users', user.uid);
			const userSnap = await getDoc(userRef);
			console.log('[google-signin] doc exists:', userSnap.exists());
			if (!userSnap.exists()) {
				await setDoc(userRef, {
					name: user.displayName || '',
					email: user.email,
					licenseType: '',
					licenseNumber: '',
					licenseState: '',
					createdAt: serverTimestamp()
				});
				console.log('[google-signin] doc written');
			}
			goto('/ce/dashboard');
		} catch (err) {
			console.error('[google-signin] error:', err);
			if (err.code !== 'auth/popup-closed-by-user') {
				error = 'Google sign-in failed. Please try again.';
			}
		} finally {
			loading = false;
		}
	}

	function friendlyError(code) {
		if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
			return 'Incorrect email or password.';
		}
		if (code === 'auth/too-many-requests') {
			return 'Too many attempts. Please wait a moment and try again.';
		}
		return 'Something went wrong. Please try again.';
	}
</script>

<svelte:head>
	<title>Sign In | PYR Continuing Education</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<div class="auth-header">
			<a href="/ce" class="back-link">← CE Courses</a>
			<h1>Sign in</h1>
			<p>Access your courses and certificates.</p>
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

		<div class="divider"><span>or</span></div>

		<form onsubmit={handleLogin} novalidate>
			<div class="field">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					autocomplete="email"
					bind:value={email}
					required
					placeholder="you@example.com"
				/>
			</div>

			<div class="field">
				<label for="password">
					Password
					<a href="/ce/reset-password" class="forgot">Forgot?</a>
				</label>
				<input
					id="password"
					type="password"
					autocomplete="current-password"
					bind:value={password}
					required
					placeholder="••••••••"
				/>
			</div>

			{#if error}
				<p class="error-msg" role="alert">{error}</p>
			{/if}

			<button type="submit" class="btn-primary" disabled={loading}>
				{loading ? 'Signing in…' : 'Sign in'}
			</button>
		</form>

		<p class="alt-action">
			Don't have an account? <a href="/ce/register">Create one</a>
		</p>
	</div>
</div>

<style lang="scss">
	.auth-page {
		min-height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-medium) var(--container-padding);
	}

	.auth-card {
		width: 100%;
		max-width: 420px;
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

		h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; }
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

		svg {
			width: 18px;
			height: 18px;
			flex-shrink: 0;
		}

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

		label {
			font-size: 0.9rem;
			font-weight: 500;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.forgot {
			font-size: 0.82rem;
			font-weight: 400;
			color: #888;
			box-shadow: none;
			&:hover { color: var(--c-dark); }
		}

		input {
			width: 100%;
			padding: 0.75rem 1rem;
			border: 1.5px solid #ddd;
			border-radius: var(--border-radius);
			font-size: 1rem;
			font-family: inherit;
			transition: border-color 0.15s;
			-webkit-appearance: none;

			&:focus { border-color: var(--c-green); outline: none; }
		}
	}

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
