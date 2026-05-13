<script>
	import Logo from './Logo.svelte';

	import site from '$lib/content/site.json';
	const navItems = site.nav;
</script>

<header class="topbar fluidtype">
	<div class="topbar-inner">
		<div class="logo">
			<a href="/" class="button--link" aria-label="Plan Your Recovery — Home">
				<Logo />
				<span class="sr-only">Plan Your Recovery</span>
			</a>
		</div>
		<div class="header-phones">
			<a href="tel:{site.contact.counselingPhone}" class="header-phone">
				<span class="header-phone-label">Counseling</span>
				<span class="phone-number">{site.contact.counselingPhone}</span>
				<span class="call-text">call/text</span>
			</a>
			<a href="tel:{site.contact.psychiatryPhone}" class="header-phone">
				<span class="header-phone-label">Psychiatry</span>
				<span class="phone-number">{site.contact.psychiatryPhone}</span>
				<span class="call-text">call/text</span>
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
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.topbar {
		width: 100%;
	}

	.topbar-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1rem;
		display: flex;
		justify-content: center;
		flex-flow: column;
		align-items: center;
		align-content: center;
	}

	.logo {
		position: relative;
		margin-bottom: 1rem;
		max-width: 300px;
		width: 100%;
	}

	.logo a:hover {
		box-shadow: none;
	}

	.logo :global(svg) {
		width: 100%;
	}

	.header-phones {
		display: flex;
		flex-wrap: wrap;
		column-gap: 1.5rem;
		row-gap: 0.5rem;
		justify-content: center;
		margin-bottom: 0rem;
	}

	.header-phone {
		display: block;
		text-align: center;
		padding: 0.5rem 0.85rem;
		border-radius: 6px;
	}

	.header-phone:nth-child(1) {
		border: 1px solid var(--c-blue);
		background: color-mix(in srgb, var(--c-blue) 12%, white);
	}

	.header-phone:nth-child(2) {
		border: 1px solid var(--c-purple);
		background: color-mix(in srgb, var(--c-purple) 12%, white);
	}

	.header-phone-label {
		display: block;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--c-gray-dark, #666);
		margin-bottom: 0.15rem;
	}

	.header-phone {
		box-shadow: none;
		text-decoration: none;
		transition: background 0.15s, box-shadow 0.15s;
	}

	.header-phone:nth-child(1):hover {
		border-color: color-mix(in srgb, var(--c-blue) 80%, black);
		box-shadow: none;
	}

	.header-phone:nth-child(1):hover .phone-number {
		color: color-mix(in srgb, var(--c-blue) 80%, black);
	}

	.header-phone:nth-child(2):hover {
		border-color: color-mix(in srgb, var(--c-purple) 80%, black);
		box-shadow: none;
	}

	.header-phone:nth-child(2):hover .phone-number {
		color: color-mix(in srgb, var(--c-purple) 80%, black);
	}

	.phone-number {
		display: block;
		font-weight: 600;
		white-space: nowrap;
		transition: color 0.15s;
	}

	.call-text {
		display: block;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--c-gray-dark, #888);
		margin-top: 0.1rem;
	}

	.navRow {
		width: 100%;
		text-align: center;
		border-top: 1px solid var(--c-gray);
		border-bottom: 1px solid var(--c-gray);
		padding: 1rem 1rem;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}

	.navRow a {
		display: block;
		padding: 0.5rem 0;
	}

	@media screen and (min-width: 1080px) {
		.topbar-inner {
			padding: 2rem 2rem;
			display: grid;
			grid-template-columns: 1fr 2fr;
			font-weight: 500;
			align-items: center;
		}

		.logo {
			max-width: 400px;
			margin-top: 20pt;
		}

		.header-phones {
			display: flex;
			flex-wrap: wrap;
			column-gap: 2rem;
			row-gap: 0rem;
			justify-content: flex-end;
			align-items: top;
			align-self: top;
		}

		.header-phone {
			text-align: left;
		}

		.navRow {
			grid-column-start: 1;
			grid-column-end: 3;
			border-top: 1px solid var(--c-gray);
			border-bottom: 1px solid var(--c-gray);
			margin-top: 1.5rem;
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
