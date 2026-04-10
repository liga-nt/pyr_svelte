<script>
	import data from '$lib/content/beyond-recovery.json';
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
</svelte:head>

<div class="page">

	<!-- Hero -->
	<section class="hero">
		<div class="container">
			<h1>{data.hero.headline}</h1>
			<p class="subheadline">{data.hero.subheadline}</p>
			<p class="intro">{data.hero.intro}</p>
		</div>
	</section>

	<!-- About the Program -->
	<section class="about">
		<div class="container">
			<h2>{data.about.heading}</h2>
			<div class="about-inner">
				<div class="leader">
					<h3>{data.about.leader.name}</h3>
					<p>{data.about.leader.bio}</p>
				</div>
				<ul class="program-details">
					{#each data.about.details as detail}
						<li>{detail}</li>
					{/each}
				</ul>
			</div>
		</div>
	</section>

	<!-- Who It's For -->
	<section class="who">
		<div class="container">
			<h2>{data.whoItsFor.heading}</h2>
			<div class="who-inner">
				<div class="who-is-for">
					<h3>This program is for you if:</h3>
					<ul>
						{#each data.whoItsFor.isFor as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
				<div class="who-not-for">
					<p>{data.whoItsFor.isNotFor}</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Core Themes -->
	<section class="themes">
		<div class="container">
			<h2>{data.themes.heading}</h2>
			<div class="themes-grid">
				{#each data.themes.items as theme}
					<div class="theme-card">
						<p>{theme}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA -->
	<section class="cta">
		<div class="container">
			<h2>{data.cta.heading}</h2>
			<p>{data.cta.body}</p>
			<a href={data.cta.linkUrl} class="button--link">
				<button class="primary">{data.cta.linkText}</button>
			</a>
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

	/* Hero */
	.hero {
		background-color: var(--c-purple);

		h1 {
			margin-bottom: var(--space-tiny);
		}

		.subheadline {
			font-family: orpheuspro, serif;
			font-size: 1.25rem;
			font-style: italic;
			margin-bottom: var(--space-small);
			opacity: 0.85;
		}

		.intro {
			max-width: 680px;
			font-size: 1.125rem;
			line-height: 1.7;
		}
	}

	/* About */
	.about {
		h2 {
			margin-bottom: var(--space-medium);
		}

		.about-inner {
			display: grid;
			gap: var(--space-medium);

			@media screen and (min-width: 768px) {
				grid-template-columns: 1fr 1fr;
				align-items: start;
			}
		}

		.leader {
			background: #fff;
			border: 1px solid var(--c-gray);
			border-radius: var(--border-radius);
			padding: var(--space-medium);

			h3 {
				font-size: 1.125rem;
				margin-bottom: var(--space-tiny);
				color: var(--c-dark);
			}

			p {
				font-size: 0.975rem;
				line-height: 1.65;
				margin: 0;
			}
		}

		.program-details {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-direction: column;
			gap: 0.75rem;

			li {
				padding: 0.9rem var(--space-tiny);
				background: var(--c-yellow);
				border-radius: var(--border-radius);
				font-size: 0.975rem;
				line-height: 1.5;
				font-weight: 500;

				&::before {
					content: '→ ';
					font-weight: 700;
				}
			}
		}
	}

	/* Who */
	.who {
		background-color: #f8f8f8;

		h2 {
			margin-bottom: var(--space-medium);
		}

		.who-inner {
			display: grid;
			gap: var(--space-medium);

			@media screen and (min-width: 768px) {
				grid-template-columns: 1fr 1fr;
				align-items: start;
			}
		}

		.who-is-for {
			h3 {
				font-size: 1rem;
				font-family: ibm-plex-sans-condensed, sans-serif;
				text-transform: uppercase;
				letter-spacing: 0.05em;
				margin-bottom: var(--space-small);
				color: var(--c-dark);
			}

			ul {
				padding-left: 1.25rem;
				margin: 0;
				display: flex;
				flex-direction: column;
				gap: 0.6rem;

				li {
					font-size: 0.975rem;
					line-height: 1.6;
				}
			}
		}

		.who-not-for {
			background: #fff;
			border-left: 4px solid var(--c-gray);
			padding: var(--space-small) var(--space-medium);
			border-radius: 0 var(--border-radius) var(--border-radius) 0;

			p {
				font-size: 0.975rem;
				line-height: 1.7;
				margin: 0;
			}
		}
	}

	/* Themes */
	.themes {
		h2 {
			margin-bottom: var(--space-medium);
		}

		.themes-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
			gap: var(--space-small);
		}

		.theme-card {
			background: var(--c-green);
			border-radius: var(--border-radius);
			padding: var(--space-medium);

			p {
				font-size: 1rem;
				font-weight: 500;
				line-height: 1.5;
				margin: 0;
				color: var(--c-dark);
			}
		}
	}

	/* CTA */
	.cta {
		background-color: var(--c-purple);
		text-align: center;

		h2 {
			margin-bottom: var(--space-small);
		}

		p {
			font-size: 1.0625rem;
			max-width: 560px;
			margin: 0 auto var(--space-medium);
			line-height: 1.7;
		}
	}
</style>
