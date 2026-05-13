<script>
	import conditions from '$lib/content/conditions.json';
	import FAQ from '$lib/components/FAQ.svelte';

	const faqs = [
		{
			question: 'Do you treat addiction and mental health together?',
			answer: 'Yes — co-occurring conditions are the norm rather than the exception in our practice. Depression, anxiety, PTSD, and ADHD frequently accompany substance use disorders, and treating only one while ignoring the other rarely works. We provide integrated care that addresses both simultaneously.'
		},
		{
			question: 'Do I need a diagnosis before I can make an appointment?',
			answer: 'No. You do not need a prior diagnosis or a referral. Our clinicians conduct their own assessments. If you have records from previous providers they can be useful, but they are not required to get started.'
		},
		{
			question: 'Do you treat OCD and PTSD, or just anxiety and depression?',
			answer: 'We treat the full range of conditions listed here — including OCD, PTSD, and trauma — not just the more common presentations. OCD in particular is often undertreated because many therapists are not trained in Exposure and Response Prevention (ERP), the gold-standard treatment. We can discuss the right approach for your specific situation.'
		},
		{
			question: 'What is the difference between therapy and medication for these conditions?',
			answer: 'Therapy and medication work through different mechanisms and are often most effective in combination. Therapy — particularly CBT — helps you change the patterns of thought and behavior that sustain the condition. Medication addresses the neurobiological component. Our practice provides both, and your care can be coordinated between your therapist and prescriber.'
		},
		{
			question: 'Do you treat gambling disorder?',
			answer: 'Yes. Gambling disorder is a behavioral addiction that responds to the same evidence-based approaches used for substance use disorders — particularly Cognitive Behavioral Therapy and Motivational Interviewing. It is often overlooked or undertreated because people do not recognize it as a clinical condition.'
		}
	];

	const BASE = 'https://planyourrecovery.com';
	const itemListSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Conditions We Treat',
		description: 'Depression, anxiety, PTSD, ADHD, OCD, and substance use disorders — evidence-based treatment in St. Louis.',
		itemListElement: conditions.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			url: `${BASE}/${c.slug}`
		}))
	};

</script>

<svelte:head>
	<title>Conditions We Treat | Plan Your Recovery</title>
	<meta name="description" content="Depression, anxiety, PTSD, ADHD, OCD, and substance use disorders — evidence-based treatment in St. Louis." />
	{@html `<script type="application/ld+json">${JSON.stringify(itemListSchema)}<\/script>`}
</svelte:head>

<div class="page">
	<section class="hero">
		<div class="container">
			<h1>Conditions We Treat</h1>
			<p class="intro">We provide evidence-based treatment for depression, anxiety, PTSD, ADHD, OCD, and substance use disorders. Each condition page describes how we approach that diagnosis, what treatments are available, and what to expect from care at Plan Your Recovery.</p>
		</div>
	</section>

	<section class="conditions">
		<div class="container">
			<div class="conditions-grid">
				{#each conditions as condition}
					<a href="/{condition.slug}" class="condition-card">
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

	<FAQ items={faqs} />
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
		.intro {
			font-size: 1.1rem;
			line-height: 1.7;
			max-width: 680px;
			margin-top: var(--space-tiny);
		}
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
