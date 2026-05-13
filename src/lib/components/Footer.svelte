<script>
	import Logo from './Logo.svelte';
	import site from '$lib/content/site.json';
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
		<nav class="footer-nav">
			<ul>
				{#each site.nav as item}
					<li><a href={item.link} class="button--link"><button>{item.title}</button></a></li>
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

	.subfooter {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.75rem var(--container-padding);
		border-top: 1px solid var(--c-gray);
		font-size: 0.875rem;
		color: #888;
	}

	@media screen and (min-width: 1000px) {
		.footer-inner {
			grid-template-columns: 1fr 1fr;
		}

		.logostuff {
			text-align: left;

			.logo {
				margin-left: 0;
			}
		}

		.footer-nav ul {
			text-align: right;
		}
	}
</style>
