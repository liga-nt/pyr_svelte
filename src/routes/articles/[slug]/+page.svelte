<script>
	let { data } = $props();
	const article = data.article;

	const schema = article ? {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: article.title,
		author: {
			'@type': 'Person',
			name: article.author === 'Ned' ? 'Ned Presnall, LCSW' : article.author,
			url: 'https://www.planyourrecovery.com/team/ned-presnall/'
		},
		publisher: { '@id': 'https://www.planyourrecovery.com/#counseling' },
		datePublished: article.date,
		description: article.seo.description
	} : null;
</script>

<svelte:head>
	<title>{article ? article.seo.title : 'Article | Plan Your Recovery'}</title>
	{#if article}
		<meta name="description" content={article.seo.description} />
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/if}
</svelte:head>

{#if article}
	<div class="page">
		<article>
			<header class="article-header">
				<div class="container">
					<div class="breadcrumb"><a href="/articles/">← Articles</a></div>
					{#if article.topics.length > 0}
						<div class="topics">
							{#each article.topics as topic}
								<span class="topic-tag">{topic}</span>
							{/each}
						</div>
					{/if}
					<h1>{article.title}</h1>
					{#if article.subtitle}<p class="subtitle">{article.subtitle}</p>{/if}
					<div class="meta">
						<span class="author">By {article.author === 'Ned' ? 'Ned Presnall, LCSW' : article.author}</span>
						{#if article.date}
							<span class="date">{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
						{/if}
					</div>
				</div>
			</header>

			<div class="article-body">
				<div class="container">
					{@html article.body}
				</div>
			</div>

			<footer class="article-footer">
				<div class="container">
					<div class="cta-box">
						<h2>Questions? We're Here to Help.</h2>
						<p>Our clinicians are available for consultations and appointments in St. Louis and via telehealth throughout Missouri.</p>
						<a href="/booking/" class="button--link">
							<button class="primary">Make an Appointment</button>
						</a>
					</div>
					<a href="/articles/" class="back-link">← Back to all articles</a>
				</div>
			</footer>
		</article>
	</div>
{:else}
	<div class="page">
		<div class="container">
			<h1>Article not found</h1>
			<a href="/articles/">← Back to articles</a>
		</div>
	</div>
{/if}

<style lang="scss">
	.page { width: 100%; }

	.container {
		max-width: 720px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.article-header {
		padding: var(--space-large) 0 var(--space-small);
		border-bottom: 1px solid var(--c-gray);
		margin-bottom: var(--space-small);
	}

	.breadcrumb { margin-bottom: var(--space-tiny); font-size: 0.9rem; }

	.topics {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: var(--space-tiny);
	}

	.topic-tag {
		background: var(--c-gray);
		padding: 0.2rem 0.75rem;
		border-radius: 24px;
		font-size: 0.8rem;
		font-family: ibm-plex-sans-condensed, sans-serif;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 600;
	}

	h1 { margin-bottom: var(--space-tiny); }
	.subtitle { font-size: 1.2rem; color: #666; margin-bottom: var(--space-tiny); }

	.meta {
		display: flex;
		gap: 1.5rem;
		font-size: 0.9rem;
		color: #888;
		font-family: ibm-plex-sans-condensed, sans-serif;
	}

	.article-body {
		padding: var(--space-small) 0 var(--space-large);

		:global(h2) { margin-top: var(--space-small); margin-bottom: var(--space-tiny); }
		:global(h3) { margin-top: var(--space-tiny); margin-bottom: 0.75rem; }
		:global(p) { line-height: 1.8; margin-bottom: var(--space-tiny); }
		:global(ul), :global(ol) { padding-left: 1.5rem; margin-bottom: var(--space-tiny); }
		:global(li) { line-height: 1.7; margin-bottom: 0.4rem; }
		:global(img) { max-width: 100%; border-radius: 6px; margin: var(--space-tiny) 0; }
		:global(blockquote) { border-left: 4px solid var(--c-green); padding-left: 1rem; margin-left: 0; font-style: italic; }
		:global(a) { color: var(--c-dark); box-shadow: 0 1px 0 0 var(--c-green); }
	}

	.article-footer {
		padding: var(--space-large) 0;
		border-top: 1px solid var(--c-gray);
	}

	.cta-box {
		background: #f8f8f8;
		border-left: 4px solid var(--c-green);
		padding: var(--space-small);
		border-radius: 0 6px 6px 0;
		margin-bottom: var(--space-small);
		h2 { font-size: 1.3rem; margin-bottom: 0.5rem; }
		p { margin-bottom: var(--space-tiny); font-size: 0.975rem; }
	}

	.back-link { font-size: 0.9rem; }
</style>
