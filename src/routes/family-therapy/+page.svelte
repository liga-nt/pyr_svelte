<script>
	import FAQ from '$lib/components/FAQ.svelte';
	import ColorBar from '$lib/components/ColorBar.svelte';
	import pageData from '$lib/content/approaches/family-therapy.json';
</script>

<svelte:head>
	<title>{pageData.seo.title}</title>
	<meta name="description" content={pageData.seo.description} />
</svelte:head>

<div class="page">
	<section class="hero">
		<div class="container">
			<h1>{pageData.hero.headline}</h1>
			<p class="intro">{pageData.hero.intro}</p>
		</div>
	</section>

	<ColorBar />

	<section class="why-family">
		<div class="container">
			<h2>{pageData.whyFamily.heading}</h2>
			{#each pageData.whyFamily.paragraphs as p}
				<p>{p}</p>
			{/each}
		</div>
	</section>

	<section class="approaches">
		<div class="container">
			<h2>{pageData.approaches.heading}</h2>
			<div class="approach-grid">
				{#each pageData.approaches.items as item}
					<div class="approach-card">
						<h3>{item.label}</h3>
						<p>{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<ColorBar />

	<section class="who">
		<div class="container">
			<h2>{pageData.whoItsFor.heading}</h2>
			<ul>
				{#each pageData.whoItsFor.items as item}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	</section>

	<FAQ items={pageData.faqs} heading="Questions About Family Therapy" />

	<section class="cta">
		<div class="container">
			<h2>Ready to Talk?</h2>
			<p>Family involvement can make a meaningful difference. Getting started takes one call.</p>
			<div class="cta-actions">
				<a href="/booking/" class="button--link">
					<button class="primary">Make an Appointment</button>
				</a>
				<a href="tel:314-222-5896">314-222-5896</a>
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

	section { padding: var(--space-large) 0; }

	.hero {
		padding: var(--space-xlarge) 0 var(--space-large);
		h1 { margin-bottom: var(--space-tiny); }
		.intro { font-size: 1.15rem; max-width: 720px; line-height: 1.7; }
	}

	.why-family {
		.container { max-width: 760px; }
		p { line-height: 1.8; margin-bottom: var(--space-tiny); }
	}

	.approaches {
		background: #f8f8f8;

		.approach-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
			gap: var(--space-small);
			margin-top: var(--space-small);
		}

		.approach-card {
			background: white;
			padding: var(--space-tiny);
			border-radius: 6px;
			border: 1px solid #e0e0e0;
			h3 { font-size: 1.05rem; margin-bottom: 0.5rem; }
			p { font-size: 0.95rem; line-height: 1.6; margin: 0; }
		}
	}

	.who {
		ul {
			padding-left: 1.5rem;
			margin-top: var(--space-tiny);
			li { margin-bottom: 0.6rem; line-height: 1.6; }
		}
	}

	.cta {
		background-color: var(--c-purple);
		color: white;
		text-align: center;
		h2 { margin-bottom: var(--space-tiny); }
		p { margin-bottom: var(--space-small); opacity: 0.9; }
		.cta-actions {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			a:last-child { color: white; font-size: 1.1rem; box-shadow: 0 1px 0 0 white; }
		}
		@media (min-width: 600px) {
			.cta-actions { flex-direction: row; justify-content: center; }
		}
	}
</style>
