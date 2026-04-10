<script>
	import data from '$lib/content/booking.json';
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
</svelte:head>

<div class="page">

	<!-- Hero -->
	<section class="hero">
		<div class="container">
			<h1>{data.hero.headline}</h1>
			<p class="intro">{data.hero.intro}</p>
		</div>
	</section>

	<!-- Contact Cards -->
	<section class="contacts">
		<div class="container">
			<div class="contacts-grid">
				{#each data.contacts as contact}
					<div class="contact-card">
						<h2>{contact.label}</h2>
						{#if contact.phone}
							<a href="tel:{contact.phone}" class="phone">{contact.phone}</a>
						{/if}
						{#if contact.phoneAlt}
							<a href="tel:{contact.phoneAlt}" class="phone phone--alt">
								<span class="phone-alt-label">{contact.phoneAltLabel}:</span> {contact.phoneAlt}
							</a>
						{/if}
						{#if contact.email}
							<a href="mailto:{contact.email}" class="email">{contact.email}</a>
						{/if}
						{#if contact.note}
							<p class="contact-note">{contact.note}</p>
						{/if}
					</div>
				{/each}
			</div>
			<p class="direct-note">
				{data.directNote} <a href="/team/">View our team →</a>
			</p>
		</div>
	</section>

	<!-- What to Expect -->
	<section class="expect">
		<div class="container">
			<h2>{data.whatToExpect.heading}</h2>
			<div class="steps-grid">
				{#each data.whatToExpect.steps as step, i}
					<div class="step-card">
						<span class="step-number">{i + 1}</span>
						<h3>{step.title}</h3>
						<p>{step.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Team link -->
	<section class="team-link">
		<div class="container">
			<p>Want to find a specific clinician?</p>
			<a href="/team/" class="button--link">
				<button class="primary">Meet Our Team</button>
			</a>
		</div>
	</section>

</div>

<style lang="scss">
	.page {
		width: 100%;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	section {
		padding: var(--space-xlarge) 0;
	}

	/* Hero */
	.hero {
		background-color: var(--c-yellow);

		h1 {
			margin-bottom: var(--space-small);
		}

		.intro {
			max-width: 680px;
			font-size: 1.125rem;
			line-height: 1.7;
		}
	}

	/* Contacts */
	.contacts {
		.contacts-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
			gap: var(--space-small);
			margin-bottom: var(--space-medium);
		}

		.contact-card {
			background: #fff;
			border: 2px solid var(--c-green);
			border-radius: var(--border-radius);
			padding: var(--space-medium);
			display: flex;
			flex-direction: column;
			gap: 0.5rem;

			h2 {
				font-family: ibm-plex-sans-condensed, sans-serif;
				font-size: 0.9rem;
				text-transform: uppercase;
				letter-spacing: 0.06em;
				color: var(--c-dark);
				margin: 0 0 0.25rem 0;
			}

			.phone {
				font-family: orpheuspro, serif;
				font-size: 1.75rem;
				font-weight: 600;
				color: var(--c-dark);
				text-decoration: none;
				line-height: 1.2;

				&:hover {
					color: darken(#444, 10%);
					text-decoration: underline;
				}
			}

			.phone--alt {
				font-size: 1.125rem;
				font-family: ibm-plex-sans, sans-serif;
				font-weight: 500;
			}

			.phone-alt-label {
				font-size: 0.875rem;
				font-family: ibm-plex-sans-condensed, sans-serif;
				text-transform: uppercase;
				letter-spacing: 0.04em;
				opacity: 0.7;
			}

			.email {
				font-size: 1rem;
				color: var(--c-dark);
				text-decoration: none;
				box-shadow: 0 1px 0 0 var(--c-dark);

				&:hover {
					box-shadow: 0 2px 0 0 var(--c-dark);
				}
			}

			.contact-note {
				font-size: 0.9rem;
				line-height: 1.6;
				margin: 0.25rem 0 0;
				opacity: 0.8;
			}
		}

		.direct-note {
			font-size: 1rem;
			line-height: 1.6;

			a {
				color: var(--c-dark);
				font-weight: 500;
			}
		}
	}

	/* What to Expect */
	.expect {
		background-color: #f8f8f8;

		h2 {
			margin-bottom: var(--space-medium);
		}

		.steps-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
			gap: var(--space-small);
		}

		.step-card {
			background: #fff;
			border-radius: var(--border-radius);
			padding: var(--space-medium);
			border: 1px solid var(--c-gray);

			.step-number {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 2rem;
				height: 2rem;
				border-radius: 50%;
				background-color: var(--c-green);
				color: white;
				font-family: ibm-plex-sans-condensed, sans-serif;
				font-weight: 700;
				font-size: 1rem;
				margin-bottom: var(--space-tiny);
			}

			h3 {
				font-size: 1.0625rem;
				margin-bottom: 0.5rem;
				color: var(--c-dark);
			}

			p {
				font-size: 0.975rem;
				line-height: 1.65;
				margin: 0;
			}
		}
	}

	/* Team link */
	.team-link {
		text-align: center;
		padding: var(--space-large) 0;

		p {
			font-size: 1.0625rem;
			margin-bottom: var(--space-small);
		}
	}
</style>
