<script>
	import Logo from './Logo.svelte';

	import site from '$lib/content/site.json';
	const navItems = site.nav;
</script>

<header class="topbar fluidtype">
	<div class="topbar-inner">
		<div class="logo">
			<a href="/" class="button--link">
				<Logo />
			</a>
		</div>
		<div class="booking-link">
			<a href="/booking/" class="button--link button--cta">
				<button class="primary">Make An Appointment</button>
			</a>
		</div>
		<nav class="navRow">
			{#each navItems as item}
				<a href={item.link} class="button--link">
					<button>{item.title}</button>
				</a>
			{/each}
		</nav>
	</div>
</header>

<style>
	.topbar {
		width: 100%;
	}

	.topbar-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		padding-top: 3rem;
		display: flex;
		justify-content: center;
		flex-flow: column;
		align-items: center;
		align-content: center;
	}

	.logo {
		position: relative;
		margin-bottom: 2rem;
		max-width: 300px;
		width: 100%;
	}

	.logo a:hover {
		box-shadow: none;
	}

	.logo :global(svg) {
		width: 100%;
		margin-bottom: -1.3rem;
	}

	.booking-link {
		margin-bottom: 3rem;
	}

	.navRow {
		padding: 0;
		width: 100%;
		text-align: center;
		border-top: 1px solid var(--c-gray);
		border-bottom: 1px solid var(--c-gray);
		padding: 1.5rem 1rem;
	}

	.navRow a {
		display: block;
		padding: 0.5rem 0;
	}

	@media screen and (min-width: 1080px) {
		.topbar-inner {
			padding: 3rem 2rem;
			display: grid;
			grid-template-columns: 1fr 2fr;
			font-weight: 500;
			align-items: baseline;
		}

		.logo {
			margin-bottom: -1.3rem;
			max-width: 400px;
		}

		.booking-link {
			text-align: right;
			margin-bottom: 0;
		}

		.booking-link a button {
			padding: 0.75em 1em;
			border-radius: 6px;
			transition: box-shadow 0.2s, transform 0.3s;
		}

		.booking-link a:hover {
			box-shadow: none;
		}

		.booking-link a:hover button {
			transform: scale(1.02) translateY(-2%);
		}

		.navRow {
			grid-column-start: 1;
			grid-column-end: 3;
			border-top: 1px solid var(--c-gray);
			border-bottom: 1px solid var(--c-gray);
			margin-top: 3rem;
			padding: 2rem 1rem;
		}

		.navRow a {
			padding: 0 1rem;
			display: inline;
		}

		.navRow a:hover {
			box-shadow: none;
		}

		.navRow a:hover button {
			border-bottom: 2px solid var(--c-green);
		}

		.navRow a button {
			font-size: 1.125rem;
		}
	}
</style>
