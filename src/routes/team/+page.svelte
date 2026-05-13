<script>
	import team from '$lib/content/team.json';
	import ClinicianCard from '$lib/components/ClinicianCard.svelte';

	const providers = team.filter(p => p.isProvider).sort((a, b) => a.order - b.order);

	const BASE = 'https://planyourrecovery.com';
	const itemListSchema = {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: 'Our Therapists and Prescribers',
		itemListElement: providers.map((p, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: p.fullName,
			url: `${BASE}/team/${p.slug}`
		}))
	};
</script>

<svelte:head>
	<title>Our Team | Plan Your Recovery</title>
	<meta name="description" content="Meet the clinicians at Plan Your Recovery — specialists in addiction, mental health, and psychiatry serving St. Louis, MO." />
	{@html `<script type="application/ld+json">${JSON.stringify(itemListSchema)}<\/script>`}
</svelte:head>

<div class="page">
	<section class="team-hero">
		<div class="container">
			<h1>Our Therapists and Prescribers</h1>
			<p class="intro">Our team of therapists and prescribers brings expertise in addiction, mental health, psychiatry, and family therapy — and shares a commitment to evidence-based, compassionate care.</p>
		</div>
	</section>

	<section class="team-grid-section">
		<div class="container">
			<div class="team-grid">
				{#each providers as person}
					<div id={person.slug}>
						<ClinicianCard {person} showBio={true} />
					</div>
				{/each}
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

	.team-hero {
		padding: var(--space-xlarge) 0 var(--space-medium);

		h1 {
			margin-bottom: var(--space-small);
		}

		.intro {
			font-size: 1.125rem;
			line-height: 1.7;
			max-width: 680px;
			color: var(--c-dark);
		}
	}

	.team-grid-section {
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

</style>
