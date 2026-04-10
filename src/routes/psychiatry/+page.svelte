<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import team from '$lib/content/team.json';
	import data from '$lib/content/psychiatry.json';
	import allConditions from '$lib/content/conditions.json';

	const psychiatryConditionSlugs = new Set(data.conditions.map(c => c.slug));
	const psychiatryConditions = allConditions.filter(c => psychiatryConditionSlugs.has(c.slug));

	const nps = team.filter(p => p.isProvider && p.isPsychiatry).sort((a, b) => a.order - b.order);

	const psychiatrySchema = {
		'@context': 'https://schema.org',
		'@type': 'MedicalOrganization',
		'@id': 'https://www.planyourrecovery.com/#psychiatry',
		name: 'Medication First DBA Plan Your Recovery',
		telephone: '314-222-5830',
		medicalSpecialty: 'Psychiatry',
		availableService: [
			{ '@type': 'MedicalTherapy', name: 'Buprenorphine Treatment for Opioid Use Disorder' },
			{ '@type': 'MedicalTherapy', name: 'Psychiatric Medication Management' },
			{ '@type': 'MedicalTherapy', name: 'Outpatient Alcohol Detoxification' }
		]
	};
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
	{@html `<script type="application/ld+json">${JSON.stringify(psychiatrySchema)}</script>`}
</svelte:head>

<div class="page">

	<!-- NP Cards -->
	<section class="providers">
		<div class="container">
			<div class="team-grid">
				{#each nps as person}
					<div class="card">
						<a href="/team/{person.slug}/" class="card-portrait-link">
							<img
								src={person.portrait}
								alt="Portrait of {person.fullName}"
								class="portrait"
								width="200"
								height="200"
							/>
						</a>
						<div class="card-body">
							<h3><a href="/team/{person.slug}/">{person.fullName}</a></h3>
							<p class="role">{person.role}</p>
							{#if person.acceptedInsurance}
								<p class="insurance-note">Accepts: {person.acceptedInsurance.join(', ')}</p>
							{:else if person.insuranceNote}
								<p class="insurance-note">{person.insuranceNote}</p>
							{/if}
							<a href="tel:{person.telephone}" class="contact-link">
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
								</svg>
								{person.telephone}
							</a>
							<a href="/team/{person.slug}/" class="profile-link">Full profile →</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Approaches -->
	<section class="approaches">
		<div class="container">
			<h2>What We Offer</h2>
			<div class="approaches-grid">
				{#each data.approaches as approach}
					<div class="approach-card">
						<h3>{approach.title}</h3>
						<p class="approach-desc">{approach.description}</p>
						{#if approach.detail}
							<p class="detail">{approach.detail}</p>
						{/if}
						{#if approach.link}
							<a href={approach.link} class="read-more">Continue reading →</a>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Conditions -->
	<section class="conditions">
		<div class="container">
			<h2>Conditions We Treat</h2>
			<div class="conditions-grid">
				{#each allConditions as condition}
					<a href="/{condition.slug}/" class="condition-card">
						<div class="card-accent" style="background-color: {condition.color}"></div>
						<div class="card-body-condition">
							<h3>{condition.name}</h3>
							<p>{condition.description}</p>
							<span class="learn-more">Learn more →</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Insurance -->
	<section class="insurance">
		<div class="container">
			<h2>{data.insurance.heading}</h2>
			<p>{data.insurance.body}</p>
		</div>
	</section>

	<!-- FAQs -->
	<FAQ items={data.faqs} />

	<!-- CTA -->
	<section class="cta">
		<div class="container">
			<h2>{data.cta.heading}</h2>
			<p>{data.cta.body}</p>
			<div class="cta-contacts">
				<div class="cta-contact">
					<span class="cta-label">Main line</span>
					<a href="tel:{data.cta.phone}">{data.cta.phone}</a>
				</div>
				<div class="cta-contact">
					<span class="cta-label">{data.cta.phoneAltLabel}</span>
					<a href="tel:{data.cta.phoneAlt}">{data.cta.phoneAlt}</a>
				</div>
			</div>
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

	/* NP Cards */
	.providers {
		padding: var(--space-large) 0;
	}

	.team-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-medium);

		@media screen and (min-width: 900px) {
			grid-template-columns: 1fr 1fr;
		}
	}

	.card {
		background: #fafafa;
		border: 1px solid #e8e4ee;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: box-shadow 0.2s ease, transform 0.2s ease;

		@media screen and (min-width: 560px) {
			flex-direction: row;
			align-items: stretch;
		}

		&:hover {
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
			transform: translateY(-2px);
		}
	}

	.card-portrait-link {
		display: block;
		width: 100%;
		flex-shrink: 0;

		@media screen and (min-width: 560px) {
			width: 200px;
		}
	}

	.portrait {
		width: 100%;
		height: 260px;
		object-fit: cover;
		object-position: center top;
		display: block;

		@media screen and (min-width: 560px) {
			height: 100%;
			min-height: 300px;
		}
	}

	.card-body {
		padding: var(--space-small);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;

		h3 {
			margin: 0;
			font-size: 1.2rem;
			font-family: orpheuspro, serif;

			a {
				color: var(--c-dark);
				text-decoration: none;
				box-shadow: none;

				&:hover { color: var(--c-purple); box-shadow: none; }
			}
		}

		.role {
			margin: 0;
			font-size: 0.875rem;
			color: #777;
			font-family: ibm-plex-sans, sans-serif;
			text-transform: uppercase;
			letter-spacing: 0.04em;
		}

		.insurance-note {
			margin: 0;
			font-size: 0.875rem;
			color: #555;
			font-family: ibm-plex-sans, sans-serif;
		}

		.contact-link {
			display: flex;
			align-items: center;
			gap: 0.4rem;
			font-size: 0.875rem;
			color: var(--c-dark);
			text-decoration: none;
			font-family: ibm-plex-sans, sans-serif;

			&:hover { color: var(--c-purple); }

			svg {
				flex-shrink: 0;
				color: var(--c-purple);
			}
		}

		.profile-link {
			display: inline-block;
			margin-top: auto;
			padding-top: var(--space-tiny);
			color: var(--c-purple);
			font-weight: 600;
			text-decoration: none;
			font-size: 0.9375rem;

			&:hover { text-decoration: underline; }
		}
	}

	/* Conditions */
	.conditions {
		padding: var(--space-xlarge) 0;
		background: #f8f8f8;

		h2 { margin-bottom: var(--space-large); }

		.conditions-grid {
			display: grid;
			gap: 1.25rem;

			@media (min-width: 600px) { grid-template-columns: repeat(2, 1fr); }
			@media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); }
		}

		.condition-card {
			display: flex;
			flex-direction: column;
			border: 1px solid #e0e0e0;
			border-radius: 6px;
			overflow: hidden;
			text-decoration: none;
			background: white;
			transition: transform 0.2s, box-shadow 0.2s;

			&:hover {
				transform: translateY(-3px);
				box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
			}

			.card-accent { height: 6px; }

			.card-body-condition {
				padding: var(--space-tiny);
				flex: 1;
				display: flex;
				flex-direction: column;

				h3 { font-size: 1.2rem; margin-bottom: 0.4rem; color: var(--c-dark); }
				p { font-size: 0.9rem; line-height: 1.5; color: #666; flex: 1; margin-bottom: 0.75rem; }
				.learn-more { font-size: 0.875rem; color: var(--c-green); font-weight: 500; }
			}
		}
	}

	/* Approaches */
	.approaches {
		h2 {
			margin-bottom: var(--space-large);
		}

		.approaches-grid {
			display: grid;
			gap: var(--space-medium);

			@media (min-width: 640px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		.approach-card {
			background: #fff;
			border: 1px solid var(--c-gray);
			border-radius: var(--border-radius);
			padding: var(--space-medium);
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			transition: border-color 0.2s, box-shadow 0.2s;

			&:hover {
				border-color: var(--c-purple);
				box-shadow: 0 4px 16px rgba(211, 176, 254, 0.2);
			}

			h3 {
				font-size: 1.125rem;
				margin: 0;
				color: var(--c-dark);
			}

			.approach-desc {
				font-size: 0.975rem;
				line-height: 1.65;
				margin: 0;
				color: #555;
				flex: 1;
			}

			.detail {
				font-weight: 600;
				color: var(--c-dark);
				font-size: 0.9rem;
				margin: 0;
			}

			.read-more {
				font-size: 0.9rem;
				font-weight: 600;
				color: var(--c-purple);
				text-decoration: none;
				align-self: flex-start;

				&:hover { text-decoration: underline; box-shadow: none; }
			}
		}
	}

	/* Insurance */
	.insurance {
		background-color: #f8f8f8;

		h2 {
			margin-bottom: var(--space-small);
		}

		p {
			max-width: 680px;
			font-size: 1rem;
			line-height: 1.7;
		}
	}

	/* CTA */
	.cta {
		background-color: var(--c-green);
		text-align: center;

		h2 {
			margin-bottom: var(--space-small);
		}

		p {
			font-size: 1.0625rem;
			margin-bottom: var(--space-medium);
		}

		.cta-contacts {
			display: flex;
			gap: var(--space-medium);
			justify-content: center;
			flex-wrap: wrap;
		}

		.cta-contact {
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
		}

		.cta-label {
			font-family: ibm-plex-sans-condensed, sans-serif;
			font-size: 0.85rem;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			opacity: 0.8;
		}

		a {
			font-size: 1.375rem;
			font-weight: 600;
			color: var(--c-dark);
			text-decoration: none;
			box-shadow: 0 1px 0 0 var(--c-dark);

			&:hover {
				box-shadow: 0 2px 0 0 var(--c-dark);
			}
		}
	}
</style>
