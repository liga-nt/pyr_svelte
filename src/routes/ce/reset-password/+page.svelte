<script>
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { auth } from '$lib/firebase.js';

	let email = $state('');
	let error = $state('');
	let sent = $state(false);
	let loading = $state(false);

	async function handleReset(e) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			await sendPasswordResetEmail(auth, email);
			sent = true;
		} catch (err) {
			if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
				// Don't reveal whether the email exists
				sent = true;
			} else {
				error = 'Something went wrong. Please try again.';
			}
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Password | PYR Continuing Education</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<div class="auth-header">
			<a href="/ce/login" class="back-link">← Back to sign in</a>
			<h1>Reset password</h1>
			<p>Enter your email and we'll send you a reset link.</p>
		</div>

		{#if sent}
			<div class="success-msg">
				<strong>Check your email.</strong>
				If an account exists for {email}, you'll receive a reset link shortly.
			</div>
			<p class="alt-action" style="margin-top: var(--space-tiny);">
				<a href="/ce/login">Return to sign in</a>
			</p>
		{:else}
			<form onsubmit={handleReset} novalidate>
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

				{#if error}
					<p class="error-msg" role="alert">{error}</p>
				{/if}

				<button type="submit" class="btn-primary" disabled={loading}>
					{loading ? 'Sending…' : 'Send reset link'}
				</button>
			</form>
		{/if}
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

	form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;

		label { font-size: 0.9rem; font-weight: 500; }

		input {
			width: 100%;
			padding: 0.75rem 1rem;
			border: 1.5px solid #ddd;
			border-radius: var(--border-radius);
			font-size: 1rem;
			font-family: inherit;
			-webkit-appearance: none;
			transition: border-color 0.15s;

			&:focus { border-color: var(--c-green); outline: none; }
		}
	}

	.success-msg {
		background: color-mix(in srgb, var(--c-green) 15%, white);
		border: 1px solid var(--c-green);
		border-radius: var(--border-radius);
		padding: 1rem 1.25rem;
		font-size: 0.95rem;
		line-height: 1.5;

		strong { display: block; margin-bottom: 0.25rem; }
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
