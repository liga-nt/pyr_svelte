<script>
	import ClinicianCard from '$lib/components/ClinicianCard.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import team from '$lib/content/team.json';
	import approachesData from '$lib/content/approaches/approaches.json';
	import conditions from '$lib/content/conditions.json';

	const therapists = team.filter(p => p.isProvider && !p.isPsychiatry).sort((a, b) => a.order - b.order);

	// Therapy-relevant approaches: everything except MAT
	const therapyApproaches = approachesData.approaches.filter(a => a.slug !== 'mat');

	const BASE = 'https://planyourrecovery.com';
	const webPageSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		url: `${BASE}/therapy`,
		name: 'Therapy for Mental Health & Addiction | Plan Your Recovery',
		description: 'Meet our therapists and learn about the evidence-based approaches we use for mental health and addiction in St. Louis.',
		isPartOf: { '@id': `${BASE}/#website` },
		about: { '@id': `${BASE}/#organization` }
	};

	const therapistListSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Our Therapists',
		itemListElement: therapists.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: p.fullName,
			url: `${BASE}/team/${p.slug}`
		}))
	};

	const faqs = [
		{
			question: 'What types of therapy do you offer?',
			answer: 'Our therapists use evidence-based approaches including Cognitive Behavioral Therapy (CBT), Motivational Interviewing, Family Therapy, and Contingency Management. The approach is tailored to each client\'s needs — most therapy involves some combination of these methods rather than a single technique applied uniformly.'
		},
		{
			question: 'Do you accept insurance for therapy?',
			answer: 'Our therapists are out-of-network providers. Many insurance plans provide out-of-network mental health benefits that cover a significant portion of the fee. We recommend calling your insurance company to ask about your out-of-network benefits before your first appointment. We can provide a superbill to support reimbursement.'
		},
		{
			question: 'What is the difference between therapy and psychiatry at Plan Your Recovery?',
			answer: 'Therapists provide talk-based treatment — CBT, motivational interviewing, family therapy, and other evidence-based approaches. Psychiatric providers specialize in diagnosis and medication management. Many clients benefit from both, and our practice provides them under one roof so your care can be coordinated from the start.'
		},
		{
			question: 'Do you treat addiction as well as mental health conditions?',
			answer: 'Yes — addiction is a core part of our practice, not an afterthought. Our therapists treat alcohol and drug use disorders using the same evidence-based approaches recommended for other mental health conditions. We also integrate treatment for co-occurring conditions like depression, anxiety, PTSD, and ADHD, which frequently accompany addiction.'
		},
		{
			question: 'How do I get started?',
			answer: 'Call or text our counseling line to schedule an initial appointment. There is no referral required. The first session is typically a 50-minute intake focused on understanding your situation, your goals, and which therapist and approach is the best fit.'
		}
	];
</script>

<svelte:head>
	<title>Therapy for Mental Health & Addiction | Plan Your Recovery</title>
	<meta name="description" content="Meet our therapists and learn about the evidence-based approaches we use for mental health and addiction in St. Louis." />
	{@html `<script type="application/ld+json">${JSON.stringify(webPageSchema)}<\/script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(therapistListSchema)}<\/script>`}
</svelte:head>

<div class="page">
	<section class="page-hero">
		<div class="container">
			<h1>Therapy & Counseling in St. Louis</h1>
		</div>
	</section>

	<!-- Therapists -->
	<section class="therapists">
		<div class="container">
			<div class="team-grid">
				{#each therapists as person}
					<ClinicianCard {person} />
				{/each}
			</div>
		</div>
	</section>


	<!-- Approaches -->
	<section class="approaches">
		<div class="container">
			<h2>Our Approaches</h2>
			<div class="approaches-grid">
				{#each therapyApproaches as approach}
					<div class="approach-card">
						<h3>{approach.title}</h3>
						<p class="approach-intro">{approach.intro.split(/(?<=[.?!])\s/)[0]}</p>
						<a href={approach.link} class="read-more">Continue reading →</a>
					</div>
				{/each}
			</div>
		</div>
	</section>


	<!-- FAQs -->
	<FAQ items={faqs} />

	<!-- Conditions -->
	<section class="conditions">
		<div class="container">
			<h2>Conditions We Treat</h2>
			<div class="conditions-grid">
				{#each conditions as condition}
					<a href="/{condition.slug}" class="condition-card">
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


</div>

<style lang="scss">
	.page { width: 100%; }

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.page-hero {
		padding: var(--space-large) 0 var(--space-small);
		h1 { margin: 0; }
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


</style>
