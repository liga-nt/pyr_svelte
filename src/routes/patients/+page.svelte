<script>
	import patients from '$lib/content/patients.json';
	import FAQ from '$lib/components/FAQ.svelte';

	const faqs = [
		{
			question: 'What is the youngest age you treat?',
			answer: 'We offer therapy for children ages 8 and older. For younger children, we can often provide guidance and support to parents rather than direct treatment of the child.'
		},
		{
			question: 'Do you work with the whole family, or just the identified patient?',
			answer: 'Both, depending on what the situation calls for. Family therapy is one of our core approaches, and even when we are seeing an individual child or teen, we typically involve parents in the treatment to some degree. For adults, we can include partners or family members when that is clinically appropriate and the client agrees.'
		},
		{
			question: 'Do you treat teens who are using drugs or alcohol?',
			answer: 'Yes. Adolescence is the peak period for the onset of substance use disorders, and early intervention matters. We use evidence-based approaches — including Motivational Interviewing and Contingency Management — that are specifically designed for adolescents and work better than confrontational approaches.'
		},
		{
			question: 'Can college students be seen remotely if they are away at school?',
			answer: 'Yes, we provide telehealth services for college students who are Missouri residents. If you are attending school outside Missouri and need ongoing care, we can help with a referral and transition planning.'
		},
		{
			question: 'Do you treat adults with complex or co-occurring conditions?',
			answer: 'Yes — adults with multiple diagnoses or previous treatment that did not hold are a significant part of our caseload. We offer both therapy and integrated psychiatric care under one roof, which allows for coordination that is not possible when providers do not communicate.'
		}
	];
</script>

<svelte:head>
	<title>Who We Treat | Plan Your Recovery</title>
	<meta name="description" content="Mental health and addiction treatment for children, teens, college students, and adults in St. Louis. We work across the lifespan and across families." />
</svelte:head>

<div class="page">
	<section class="hero">
		<div class="container">
			<h1>Who We Treat</h1>
			<p class="intro">Mental health doesn't look the same at eight as it does at eighteen or forty-five. The problems shift, the stakes change, and what works changes too. A child who can't name what's wrong needs something different from a teen whose world has narrowed around anxiety, a college student whose drinking has become a coping strategy, or an adult who has tried therapy before and found it didn't hold. We work across the full lifespan — and across families when the situation calls for it — because the people who need us don't fit neatly into a single category.</p>
		</div>
	</section>

	<section class="patients">
		<div class="container">
			<div class="patients-grid">
				{#each patients as group}
					<div class="patient-card">
						<div class="card-accent" style="background-color: {group.color}"></div>
						<div class="card-body">
							<h2><a href={group.link} class="card-link">{group.name}</a></h2>
							<p>{group.description}</p>
							<span class="learn-more" aria-hidden="true">Learn more →</span>
						</div>
					</div>
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
		}
	}

	.patients {
		padding: var(--space-small) 0 var(--space-xlarge);
	}

	.patients-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;

		@media (min-width: 600px) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.patient-card {
		position: relative;
		display: flex;
		flex-direction: column;
		border: 1px solid #e0e0e0;
		border-radius: 6px;
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 6px 20px rgba(0,0,0,0.1);
		}

		.card-link {
			color: inherit;
			text-decoration: none;
			box-shadow: none;

			&::after {
				content: '';
				position: absolute;
				inset: 0;
			}
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
</style>
