<script>
	const articles = Object.entries(
		import.meta.glob('/src/lib/content/articles/*.json', { eager: true })
	)
		.map(([, mod]) => mod.default)
		.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

	const allTopics = [...new Set(articles.flatMap((a) => a.topics))].sort();
	let activeFilter = $state('All');

	const filtered = $derived(
		activeFilter === 'All' ? articles : articles.filter((a) => a.topics.includes(activeFilter))
	);
</script>

<svelte:head>
	<title>Articles on Addiction & Mental Health | Plan Your Recovery</title>
	<meta
		name="description"
		content="Evidence-based articles on addiction treatment, mental health, counseling approaches, and psychiatry from the clinicians at Plan Your Recovery, St. Louis."
	/>
</svelte:head>

<div class="page">
	<section class="hero">
		<div class="container">
			<h1>Articles</h1>
			<p class="intro">
				Evidence-based writing on addiction, mental health, and recovery — written by our clinicians
				for patients, families, and professionals.
			</p>
		</div>
	</section>

	<section class="articles-section">
		<div class="container">
			<div class="filters">
				<button
					class="filter-btn"
					class:active={activeFilter === 'All'}
					onclick={() => (activeFilter = 'All')}
				>
					All
				</button>
				{#each allTopics as topic}
					<button
						class="filter-btn"
						class:active={activeFilter === topic}
						onclick={() => (activeFilter = topic)}
					>
						{topic}
					</button>
				{/each}
			</div>

			<ul class="article-list">
				{#each filtered as article}
					<li class="article-item">
						<a href="/articles/{article.slug}/">
							<div class="article-meta">
								{#each article.topics as topic}
									<span class="topic-tag">{topic}</span>
								{/each}
								{#if article.date}
									<span class="date"
										>{new Date(article.date).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long'
										})}</span
									>
								{/if}
							</div>
							<h2>{article.title}</h2>
							{#if article.subtitle}
								<p class="subtitle">{article.subtitle}</p>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</section>
</div>

<style lang="scss">
	.page {
		width: 100%;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.hero {
		padding: var(--space-large) 0 var(--space-small);

		h1 {
			margin-bottom: var(--space-tiny);
		}

		.intro {
			font-size: 1.1rem;
			line-height: 1.7;
			max-width: 640px;
		}
	}

	.articles-section {
		padding: var(--space-small) 0 var(--space-xlarge);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: var(--space-medium);

		.filter-btn {
			font-family: ibm-plex-sans-condensed, sans-serif;
			font-size: 0.8rem;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			font-weight: 600;
			font-style: normal;
			padding: 0.35rem 0.9rem;
			border-radius: 24px;
			border: 1px solid var(--c-gray);
			background: white;
			cursor: pointer;
			color: var(--c-dark);
			transition: all 0.2s;

			&:hover,
			&.active {
				background: var(--c-green);
				border-color: var(--c-green);
				color: white;
			}
		}
	}

	.article-list {
		list-style: none;
		padding: 0;
	}

	.article-item {
		border-top: 1px solid var(--c-gray);

		&:last-child {
			border-bottom: 1px solid var(--c-gray);
		}

		a {
			display: block;
			padding: var(--space-small) 0;
			box-shadow: none;
			transition: color 0.2s;

			&:hover {
				box-shadow: none;

				h2 {
					color: var(--c-green);
				}
			}
		}

		h2 {
			font-size: 1.3rem;
			margin: 0.4rem 0 0.25rem;
			transition: color 0.2s;
			line-height: 1.3;
		}

		.subtitle {
			font-size: 0.95rem;
			color: #666;
			margin: 0;
		}
	}

	.article-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 0.25rem;
	}

	.topic-tag {
		background: var(--c-gray);
		padding: 0.15rem 0.6rem;
		border-radius: 24px;
		font-size: 0.75rem;
		font-family: ibm-plex-sans-condensed, sans-serif;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}

	.date {
		font-size: 0.8rem;
		color: #999;
		font-family: ibm-plex-sans-condensed, sans-serif;
	}
</style>
