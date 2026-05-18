<script>
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Page Not Found | Plan Your Recovery</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="error-page">
	<div class="container">
		<p class="eyebrow">404</p>
		<h1>Page not found</h1>
		<p class="message">The page you're looking for has moved or no longer exists.</p>
		<div class="links">
			<a href="/" class="btn-primary">Go to homepage</a>
			<a href="/booking" class="btn-secondary">Request an appointment</a>
		</div>
	</div>
</div>

<style lang="scss">
	.error-page {
		min-height: 60vh;
		display: flex;
		align-items: center;
		padding: var(--space-xlarge) 0;
	}

	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
		text-align: center;
	}

	.eyebrow {
		font-family: ibm-plex-sans-condensed, sans-serif;
		font-size: 0.8rem;
		font-weight: 800;
		font-style: italic;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--c-green);
		margin-bottom: var(--space-small);
	}

	h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		margin-bottom: var(--space-medium);
	}

	.message {
		font-size: 1.1rem;
		color: #555;
		line-height: 1.7;
		margin-bottom: var(--space-large);
	}

	.links {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-primary {
		background: var(--c-green);
		color: white;
		padding: 0.75rem 1.75rem;
		border-radius: var(--border-radius);
		font-weight: 600;
		text-decoration: none;
		transition: opacity 0.2s ease;

		&:hover {
			opacity: 0.9;
		}
	}

	.btn-secondary {
		border: 2px solid var(--c-green);
		color: var(--c-green);
		padding: 0.75rem 1.75rem;
		border-radius: var(--border-radius);
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;

		&:hover {
			background: var(--c-green);
			color: white;
		}
	}
</style>
