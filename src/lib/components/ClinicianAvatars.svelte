<script>
	import team from '$lib/content/team.json';

	export let population;
	export let inline = false;
	export let title = '';

	const clinicians = team
		.filter(p => p.isProvider && p.treatsPopulations?.includes(population))
		.sort((a, b) => a.order - b.order);

	const label = population === 'students' ? 'College Students' : population.charAt(0).toUpperCase() + population.slice(1);
</script>

{#if clinicians.length > 0}
	{#if inline}
		<div class="inline-wrap">
			{#if title}<h3 class="inline-title">{title}</h3>{/if}
			<div class="avatars">
			{#each clinicians as person}
					<a href="/team/{person.slug}" class="avatar-link">
						<div class="avatar">
							<img src={person.portrait} alt={person.fullName} width="80" height="80" />
						</div>
						<span class="avatar-name">{person.firstName} {person.lastName}</span>
						<span class="avatar-credentials">{person.credentials}</span>
					</a>
				{/each}
			</div>
		</div>
	{:else}
		<section class="clinician-avatars">
			<div class="container">
				<h2>Clinicians Who Treat {label}</h2>
				<div class="avatars">
					{#each clinicians as person}
						<a href="/team/{person.slug}" class="avatar-link">
							<div class="avatar">
								<img src={person.portrait} alt={person.fullName} width="80" height="80" />
							</div>
							<span class="avatar-name">{person.firstName} {person.lastName}</span>
							<span class="avatar-credentials">{person.credentials}</span>
						</a>
					{/each}
				</div>
			</div>
		</section>
	{/if}
{/if}

<style lang="scss">
	.inline-wrap {
		margin-top: var(--space-medium);
	}

	.inline-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--c-dark);
		margin-bottom: var(--space-small);
	}

	.clinician-avatars {
		padding: var(--space-xlarge) 0;

		h2 {
			margin-bottom: var(--space-large);
		}
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.avatars {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.avatar-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		box-shadow: none;
		width: 90px;
		transition: transform 0.2s ease;

		&:hover {
			transform: translateY(-3px);
			box-shadow: none;
		}
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		overflow: hidden;
		border: 2px solid var(--c-gray);
		margin-bottom: 0.5rem;
		flex-shrink: 0;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: top;
		}
	}

	.avatar-name {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--c-dark);
		text-align: center;
		line-height: 1.3;
	}

	.avatar-credentials {
		font-size: 0.7rem;
		color: var(--c-green);
		text-align: center;
		margin-top: 0.1rem;
		line-height: 1.3;
	}
</style>
