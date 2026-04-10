<script>
	import { page } from '$app/stores';
	import team from '$lib/content/team.json';

	const slug = $page.params.slug;
	const person = team.find(p => p.slug === slug);

	// Build Person JSON-LD schema
	const worksForId = person?.isPsychiatry
		? 'https://www.planyourrecovery.com/#psychiatry'
		: 'https://www.planyourrecovery.com/#counseling';

	const firstSentence = person?.bio?.split(/(?<=[.!?])\s/)[0] ?? '';

	const jsonLd = person
		? {
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: person.fullName,
				jobTitle: person.role,
				worksFor: { '@id': worksForId },
				telephone: person.telephone,
				...(person.email ? { email: person.email } : {}),
				url: `https://www.planyourrecovery.com/team/${person.slug}/`,
				image: `https://www.planyourrecovery.com${person.portrait}`,
				description: firstSentence
		  }
		: null;
</script>

<svelte:head>
	{#if person}
		<title>{person.fullName} | Plan Your Recovery</title>
		<meta name="description" content="{person.role} at Plan Your Recovery. {firstSentence}" />
		{#if jsonLd}
			{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
		{/if}
	{:else}
		<title>Provider Not Found | Plan Your Recovery</title>
	{/if}
</svelte:head>

<div class="page">
	{#if person}
		<div class="container">
			<nav class="breadcrumb">
				<a href="/team/">← Our Team</a>
			</nav>

			<article class="provider">
				<div class="provider-portrait">
					<img
						src={person.portrait}
						alt="Portrait of {person.fullName}"
						class="portrait"
					/>
				</div>

				<div class="provider-content">
					<h1>{person.fullName}</h1>
					<p class="role">{person.role}</p>

					<div class="bio">
						{#each person.bio.split('\n') as paragraph}
							{#if paragraph.trim()}
								<p>{paragraph}</p>
							{/if}
						{/each}
					</div>

					<div class="contact-section">
						<h2 class="section-label">Contact</h2>
						<div class="contact-items">
							<div class="contact-item">
								<span class="contact-label">Phone</span>
								<a href="tel:{person.telephone}">{person.telephone}</a>
							</div>
							{#if person.email}
								<div class="contact-item">
									<span class="contact-label">Email</span>
									<a href="mailto:{person.email}">{person.email}</a>
								</div>
							{/if}
						</div>
					</div>

					{#if person.isPsychiatry}
						<div class="insurance-section">
							<h2 class="section-label">Insurance</h2>
							{#if person.acceptedInsurance && person.acceptedInsurance.length > 0}
								<ul class="insurance-list">
									{#each person.acceptedInsurance as ins}
										<li>{ins}</li>
									{/each}
								</ul>
							{/if}
							{#if person.insuranceNote}
								<p class="insurance-note">{person.insuranceNote}</p>
							{/if}
							{#if person.teleheathDefault}
								<p class="teleheath-note">Most appointments are virtual unless in-person is preferred.</p>
							{/if}
						</div>
					{/if}

					<a href="/booking/" class="button-appt">Make an Appointment</a>
				</div>
			</article>
		</div>
	{:else}
		<div class="container not-found">
			<p>Provider not found.</p>
			<a href="/team/">← Back to Our Team</a>
		</div>
	{/if}
</div>

<style lang="scss">
	.page {
		width: 100%;
		padding: var(--space-large) 0 var(--space-xlarge);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.breadcrumb {
		margin-bottom: var(--space-medium);

		a {
			color: var(--c-green);
			text-decoration: none;
			font-size: 0.9375rem;
			font-weight: 500;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.provider {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-large);
		align-items: start;

		@media screen and (min-width: 768px) {
			grid-template-columns: 400px 1fr;
		}
	}

	.provider-portrait {
		.portrait {
			width: 100%;
			max-width: 400px;
			height: auto;
			border-radius: 6px;
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
			display: block;
		}
	}

	.provider-content {
		h1 {
			font-family: orpheuspro, serif;
			margin-bottom: 0.25rem;
			line-height: 1.2;
		}

		.role {
			font-family: ibm-plex-sans, sans-serif;
			font-size: 1rem;
			color: #777;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			margin-bottom: var(--space-medium);
		}

		.bio {
			margin-bottom: var(--space-medium);

			p {
				font-size: 1.0625rem;
				line-height: 1.75;
				color: var(--c-dark);
				margin-bottom: 1rem;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.section-label {
			font-family: ibm-plex-sans, sans-serif;
			font-size: 0.8125rem;
			text-transform: uppercase;
			letter-spacing: 0.08em;
			color: #999;
			margin-bottom: 0.75rem;
			font-weight: 600;
		}

		.contact-section {
			margin-bottom: var(--space-small);
		}

		.contact-items {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}

		.contact-item {
			display: flex;
			align-items: baseline;
			gap: 0.75rem;

			.contact-label {
				font-size: 0.875rem;
				color: #999;
				font-family: ibm-plex-sans, sans-serif;
				min-width: 3.5rem;
			}

			a {
				color: var(--c-dark);
				text-decoration: none;
				font-size: 1rem;

				&:hover {
					color: var(--c-green);
				}
			}
		}

		.insurance-section {
			margin-bottom: var(--space-medium);

			.insurance-list {
				list-style: none;
				padding: 0;
				margin: 0 0 0.5rem;
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;

				li {
					background: #f0fdf4;
					border: 1px solid #c6f6d5;
					color: #276749;
					font-size: 0.875rem;
					padding: 0.25rem 0.75rem;
					border-radius: 999px;
					font-family: ibm-plex-sans, sans-serif;
				}
			}

			.insurance-note,
			.teleheath-note {
				font-size: 0.9375rem;
				color: #666;
				margin: 0.5rem 0 0;
				line-height: 1.5;
			}
		}

		.button-appt {
			display: inline-block;
			margin-top: var(--space-small);
			background-color: var(--c-green);
			color: #fff;
			font-family: ibm-plex-sans, sans-serif;
			font-weight: 600;
			font-size: 1rem;
			padding: 0.75rem 1.75rem;
			border-radius: 4px;
			text-decoration: none;
			transition: background-color 0.2s ease, transform 0.2s ease;

			&:hover {
				background-color: #5bcf77;
				transform: translateY(-1px);
			}
		}
	}

	.not-found {
		padding: var(--space-xlarge) 0;

		p {
			margin-bottom: var(--space-small);
			color: #666;
		}

		a {
			color: var(--c-green);
			text-decoration: none;

			&:hover {
				text-decoration: underline;
			}
		}
	}
</style>
