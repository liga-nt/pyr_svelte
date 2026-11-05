<script>
	import Logo from './Logo.svelte';
	import site from '$lib/content/site.json';
	import suburbs from '$lib/content/locations/suburbs.json';
</script>

<footer>
	<div class="footer-inner">
		<div class="logostuff">
			<div class="logo">
				<a href="/" class="button--link" aria-label="Plan Your Recovery — Home">
					<Logo />
					<span class="sr-only">Plan Your Recovery</span>
				</a>
			</div>
			<address>
				<p>{site.address.streetAddress}<br />{site.address.addressLocality}, {site.address.addressRegion} {site.address.postalCode}</p>
				<p>
					<a href="tel:{site.contact.counselingPhone}">{site.contact.counselingPhone}</a> ({site.footer.counselingLabel})<br />
					<a href="tel:{site.contact.psychiatryPhone}">{site.contact.psychiatryPhone}</a> ({site.footer.psychiatryLabel})
				</p>
				<p><a href="mailto:{site.contact.email}">{site.contact.email}</a></p>
			</address>
		</div>
		<nav class="footer-nav" aria-label="Footer">
			<ul>
				{#each site.nav as item}
					<li><a href={item.link} class="button--link"><span class="nav-btn">{item.title}</span></a></li>
				{/each}
			</ul>
		</nav>
		<nav class="footer-locations" aria-label="Therapy near you">
			<h2>Therapy Near You</h2>
			<ul>
				{#each suburbs as suburb}
					<li><a href="/therapy/{suburb.slug}">Therapy in {suburb.name}, MO</a></li>
				{/each}
			</ul>
		</nav>
		<nav class="footer-locations" aria-label="Psychiatry near you">
			<h2>Psychiatry Near You</h2>
			<ul>
				{#each suburbs as suburb}
					<li><a href="/psychiatry/{suburb.slug}">Psychiatry in {suburb.name}, MO</a></li>
				{/each}
			</ul>
		</nav>
	</div>
	<div class="subfooter">
		<span>© {new Date().getFullYear()} {site.footer.copyrightName}</span>
	</div>
</footer>

<style lang="scss">
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

	footer {
		background-color: #eee;
		padding: var(--space-medium) 0 0;
	}

	.footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		margin-bottom: var(--space-small);
		padding: 0 var(--container-padding);
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-medium);

		@media screen and (min-width: 640px) {
			grid-template-columns: 1fr 1fr;
		}
	}

	.logostuff {
		text-align: center;

		.logo {
			max-width: 260px;
			margin: 0 auto var(--space-tiny);

			a:hover {
				box-shadow: none;
			}

			:global(svg) {
				width: 100%;
			}
		}
	}

	address {
		font-style: normal;
		margin-bottom: var(--space-tiny);
		line-height: 1.7;

		p {
			margin-bottom: 0.5rem;
			font-size: 0.9rem;
		}
	}

	.footer-nav {
		ul {
			padding: 0;
			list-style: none;
			text-align: center;
		}

		li {
			margin-bottom: var(--space-tiny);
		}

		a {
			box-shadow: none;

			&:hover {
				box-shadow: none;
			}
		}
	}

	.footer-locations {
		text-align: center;

		h2 {
			font-size: 0.875rem;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			color: var(--c-text-muted);
			margin-bottom: var(--space-tiny);
		}

		ul {
			padding: 0;
			list-style: none;
		}

		li {
			margin-bottom: 0.5rem;
		}

		a {
			box-shadow: none;
			font-size: 0.9rem;

			&:hover {
				box-shadow: none;
			}
		}
	}

	.subfooter {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.75rem var(--container-padding);
		border-top: 1px solid var(--c-gray);
		font-size: 0.875rem;
		color: var(--c-text-muted);
	}

	@media screen and (min-width: 1000px) {
		.footer-inner {
			grid-template-columns: 1.2fr 0.8fr 1fr 1fr;
		}

		.logostuff {
			text-align: left;

			.logo {
				margin-left: 0;
			}
		}

		.footer-nav ul {
			text-align: left;
		}

		.footer-locations {
			text-align: left;
		}
	}
</style>
