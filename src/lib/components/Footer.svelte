<script>
	import Logo from './Logo.svelte';
	import site from '$lib/content/site.json';
</script>

<footer>
	<div class="footer-inner">
		<div class="logostuff">
			<div class="logo">
				<a href="/" class="button--link">
					<Logo />
				</a>
			</div>
			<address>
				<p>9904 Clayton Road, Suite 135<br />Saint Louis, MO 63124</p>
				<p>
					<a href="tel:{site.contact.counselingPhone}">{site.contact.counselingPhone}</a> (Counseling)<br />
					<a href="tel:{site.contact.psychiatryPhone}">{site.contact.psychiatryPhone}</a> (Psychiatry)
				</p>
				<p><a href="mailto:{site.contact.email}">{site.contact.email}</a></p>
			</address>
			<div class="booking-link">
				<a href="/booking/" class="button--link">
					<button class="primary">Make An Appointment</button>
				</a>
			</div>
		</div>
		<nav class="footer-nav">
			<ul>
				{#each site.nav as item}
					<li><a href={item.link} class="button--link"><button>{item.title}</button></a></li>
				{/each}
				<li><a href="/privacy/" class="button--link"><button>Privacy Policy</button></a></li>
			</ul>
		</nav>
	</div>
	<div class="subfooter">
		<span>© {new Date().getFullYear()} Plan Your Recovery</span>
	</div>
</footer>

<style lang="scss">
	footer {
		background-color: #eee;
		padding: var(--space-medium) var(--container-padding) 0;
	}

	.footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		margin-bottom: var(--space-small);
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
				margin-bottom: -1rem;
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

	.booking-link {
		margin-top: var(--space-tiny);
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
		padding: 0.75rem 0;
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
			text-align: left;
		}
	}
</style>
