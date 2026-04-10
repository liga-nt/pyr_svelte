<script>
	import ColorBar from '$lib/components/ColorBar.svelte';
	import team from '$lib/content/team.json';
	import approachesData from '$lib/content/approaches/approaches.json';
	import conditions from '$lib/content/conditions.json';

	const therapists = team.filter(p => p.isProvider && !p.isPsychiatry).sort((a, b) => a.order - b.order);

	// Therapy-relevant approaches: everything except MAT
	const therapyApproaches = approachesData.approaches.filter(a => a.slug !== 'mat');
</script>

<svelte:head>
	<title>Therapy | Plan Your Recovery</title>
	<meta name="description" content="Meet our therapists and learn about the evidence-based approaches we use for mental health and addiction in St. Louis." />
</svelte:head>

<div class="page">
	<!-- Therapists -->
	<section class="therapists">
		<div class="container">
			<div class="team-grid">
				{#each therapists as person}
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
							<div class="contact-links">
								<a href="tel:{person.telephone}" class="contact-link">
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
									</svg>
									{person.telephone}
								</a>
								{#if person.email}
									<a href="mailto:{person.email}" class="contact-link">
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
											<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
											<polyline points="22,6 12,13 2,6"/>
										</svg>
										{person.email}
									</a>
								{/if}
							</div>
							<a href="/team/{person.slug}/" class="profile-link">Full profile →</a>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<ColorBar />

	<!-- Approaches -->
	<section class="approaches">
		<div class="container">
			<h2>Our Approaches</h2>
			<div class="approaches-grid">
				{#each therapyApproaches as approach}
					<div class="approach-card">
						<h3>{approach.title}</h3>
						<p class="approach-intro">{approach.intro}</p>
						<a href={approach.link ?? `/approaches/#${approach.slug}`} class="read-more">Continue reading →</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<ColorBar />

	<!-- Conditions -->
	<section class="conditions">
		<div class="container">
			<h2>Conditions We Treat</h2>
			<div class="conditions-grid">
				{#each conditions as condition}
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

	<ColorBar />

	<!-- CTA -->
	<section class="cta" id="contact">
		<div class="container">
			<h2>Make an Appointment</h2>
			<p>Reach out directly to any of our therapists, or use the link below to get started.</p>
			<a href="/booking/" class="button--link">
				<button class="primary">Make an Appointment</button>
			</a>
		</div>
	</section>
</div>

<style lang="scss">
	.page { width: 100%; }

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	/* Therapist cards */
	.therapists {
		padding: var(--space-medium) 0 var(--space-xlarge);
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
				&:hover { color: var(--c-green); box-shadow: none; }
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

		.contact-links {
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
			margin-top: 0.25rem;
		}

		.contact-link {
			display: flex;
			align-items: center;
			gap: 0.4rem;
			font-size: 0.875rem;
			color: var(--c-dark);
			text-decoration: none;
			font-family: ibm-plex-sans, sans-serif;

			&:hover { color: var(--c-green); box-shadow: none; }

			svg { flex-shrink: 0; color: var(--c-green); }
		}

		.profile-link {
			display: inline-block;
			margin-top: auto;
			padding-top: var(--space-tiny);
			color: var(--c-green);
			font-weight: 600;
			text-decoration: none;
			font-size: 0.9375rem;

			&:hover { text-decoration: underline; box-shadow: none; }
		}
	}

	/* Approaches */
	.approaches {
		padding: var(--space-xlarge) 0;

		h2 { margin-bottom: var(--space-large); }

		.approaches-grid {
			display: grid;
			gap: var(--space-medium);

			@media (min-width: 640px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		.approach-card {
			padding: var(--space-medium);
			border: 1px solid var(--c-gray);
			border-radius: 6px;
			background: white;
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			transition: border-color 0.2s, box-shadow 0.2s;

			&:hover {
				border-color: var(--c-green);
				box-shadow: 0 4px 16px rgba(106, 227, 220, 0.18);
			}

			h3 {
				font-size: 1.1rem;
				margin: 0;
				color: var(--c-dark);
			}

			.approach-intro {
				font-size: 0.9375rem;
				line-height: 1.65;
				color: #555;
				margin: 0;
				flex: 1;
			}

			.read-more {
				font-size: 0.9rem;
				font-weight: 600;
				color: var(--c-green);
				text-decoration: none;
				align-self: flex-start;

				&:hover { text-decoration: underline; box-shadow: none; }
			}
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

	/* CTA */
	.cta {
		background-color: var(--c-green);
		color: white;
		padding: var(--space-xlarge) 0;
		text-align: center;

		h2 { margin-bottom: var(--space-tiny); }

		p {
			font-size: 1.05rem;
			max-width: 560px;
			margin: 0 auto var(--space-medium);
			opacity: 0.95;
		}
	}
</style>
