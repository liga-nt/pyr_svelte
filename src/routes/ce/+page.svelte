<script>
</script>

<svelte:head>
	<title>Continuing Education | Plan Your Recovery</title>
	<meta
		name="description"
		content="Free monthly continuing education for mental health professionals. CEU credits for addiction, mental health, and evidence-based practice."
	/>
</svelte:head>

<div class="page">


	<section class="coming-soon">
		<div class="container">
			<div class="notice">
				<h2>New CE Offerings Coming Soon</h2>
				<p>
					We are currently rebuilding our continuing education program with updated courses and
					formats. Check back soon, or contact us to be notified when new courses are available. 
				</p>
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	.page { width: 100%; }

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.hero {
		padding: var(--space-large) 0 var(--space-small);
		h1 { margin-bottom: var(--space-tiny); }
		.intro { font-size: 1.1rem; line-height: 1.7; max-width: 640px; }
	}

	.coming-soon {
		padding: var(--space-large) 0 var(--space-xlarge);
	}

	.notice {
		border-left: 4px solid var(--c-green);
		padding: var(--space-small) var(--space-small) var(--space-small) var(--space-medium);
		background: #f8f8f8;
		border-radius: 0 6px 6px 0;

		h2 { margin-bottom: var(--space-tiny); }
		p { line-height: 1.7; margin-bottom: var(--space-tiny); }

		.actions {
			display: flex;
			align-items: center;
			gap: var(--space-small);
			flex-wrap: wrap;
			margin-top: var(--space-small);
		}
	}
</style>
