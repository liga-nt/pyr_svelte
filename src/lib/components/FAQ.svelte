<script lang="ts">
	/**
	 * Reusable FAQ accordion with FAQPage JSON-LD schema.
	 * Props:
	 *   items: Array<{ question: string, answer: string }>
	 *   heading: string (optional section heading, default "Frequently Asked Questions")
	 *   schema: boolean (default true) — inject FAQPage JSON-LD
	 */
	let { items = [], heading = 'Frequently Asked Questions', schema = true } = $props();

	let openIndex = $state<number | null>(null);

	function toggle(i: number) {
		openIndex = openIndex === i ? null : i;
	}

	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		name: heading,
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer
			}
		}))
	};
</script>

<svelte:head>
	{#if schema && items.length > 0}
		{@html `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`}
	{/if}
</svelte:head>

<section class="faqs">
	<div class="container">
		{#if heading}
			<h2>{heading}</h2>
		{/if}
		<ul>
			{#each items as item, i}
				<li class:open={openIndex === i}>
					<button class="question" onclick={() => toggle(i)} aria-expanded={openIndex === i}>
						<h4>{item.question}</h4>
						<span class="expander" aria-hidden="true">
							{#if openIndex === i}&minus;{:else}&plus;{/if}
						</span>
					</button>
					{#if openIndex === i}
						<div class="answer">
							<p>{item.answer}</p>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</section>

<style lang="scss">
	.faqs {
		padding: var(--space-large) 0;

		h2 {
			margin-bottom: var(--space-large);
		}
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		border-top: 1px solid var(--accent, var(--c-green));
		padding-top: 1rem;
		cursor: pointer;

		&:last-child {
			border-bottom: 1px solid var(--accent, var(--c-green));
			padding-bottom: 1rem;
		}
	}

	.question {
		display: grid;
		grid-template-columns: 1fr 50px;
		align-items: baseline;
		gap: 0.5rem;
		width: 100%;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-align: left;

		&:hover .expander {
			color: var(--accent, var(--c-green));
		}

		h4 {
			font-size: 1rem;
			font-weight: 500;
			line-height: 1.5;
			margin: 0 0 0.75rem 0;
			color: var(--c-dark);
			font-family: ibm-plex-sans, sans-serif;
			font-style: normal;
			text-transform: none;
			letter-spacing: 0;
		}
	}

	.expander {
		font-family: Georgia, 'Times New Roman', Times, serif;
		font-size: 1.5rem;
		color: var(--accent, var(--c-green));
		line-height: 1;
		text-align: center;
	}

	.answer {
		padding-bottom: 1rem;

		p {
			margin: 0;
			line-height: 1.7;
			font-size: 0.975rem;
			color: var(--c-dark);
		}
	}
</style>
