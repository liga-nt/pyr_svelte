<script>
	import conditions from '$lib/content/conditions.json';
</script>

<svelte:head>
	<title>Conditions We Treat | Plan Your Recovery</title>
	<meta name="description" content="Mental health and addiction conditions treated at Plan Your Recovery in St. Louis. Evidence-based care for depression, anxiety, PTSD, ADHD, OCD, and substance use disorders." />
</svelte:head>

<div class="page">
	<section class="hero">
		<div class="container">
			<h1>Conditions We Treat</h1>
		</div>
	</section>

	<section class="conditions">
		<div class="container">
			<div class="conditions-grid">
				{#each conditions as condition}
					<a href="/{condition.slug}/" class="condition-card">
						<div class="card-accent" style="background-color: {condition.color}"></div>
						<div class="card-body">
							<h2>{condition.name}</h2>
							<p>{condition.description}</p>
							<span class="learn-more">Learn more →</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="cta">
		<div class="container">
			<h2>Not sure where to start?</h2>
			<p>Many of our patients come to us with more than one diagnosis — or without one at all. We'll figure it out together.</p>
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

	.hero {
		padding: var(--space-large) 0 var(--space-small);
		h1 { margin-bottom: var(--space-tiny); }
		.intro { font-size: 1.1rem; line-height: 1.7; max-width: 680px; }
	}

	.conditions {
		padding: var(--space-small) 0 var(--space-xlarge);
	}

	.conditions-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;

		@media (min-width: 600px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: 900px) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.condition-card {
		display: flex;
		flex-direction: column;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		overflow: hidden;
		text-decoration: none;
		transition: transform 0.2s, box-shadow 0.2s;

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 6px 20px rgba(0,0,0,0.1);
		}

		.card-accent {
			height: 6px;
		}

		.card-body {
			padding: var(--space-tiny);
			flex: 1;
			display: flex;
			flex-direction: column;

			h2 {
				font-size: 1.2rem;
				margin-bottom: 0.4rem;
				color: var(--c-dark);
			}

			p {
				font-size: 0.9rem;
				line-height: 1.5;
				color: #666;
				flex: 1;
				margin-bottom: 0.75rem;
			}

			.learn-more {
				font-size: 0.875rem;
				color: var(--c-green);
				font-weight: 500;
			}
		}
	}

	.cta {
		background: var(--c-green);
		color: white;
		text-align: center;
		padding: var(--space-large) 0;
		h2 { margin-bottom: var(--space-tiny); }
		p { max-width: 560px; margin: 0 auto var(--space-small); opacity: 0.95; }
	}
</style>
