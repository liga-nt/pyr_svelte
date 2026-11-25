<script>
	import site from '$lib/content/site.json';

	const { streetAddress, addressLocality, addressRegion, postalCode } = site.address;
	const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		`Plan Your Recovery, ${streetAddress}, ${addressLocality}, ${addressRegion} ${postalCode}`
	)}`;
</script>

<svelte:head>
	<title>Directions | Plan Your Recovery</title>
	<meta name="description" content="Directions to Plan Your Recovery at 9904 Clayton Road, Suite 135, Saint Louis, MO 63124: where to park and how to find our entrance." /></svelte:head>

<div class="page">
	<div class="container">
		<header class="page-header">
			<h1>Directions</h1>
		</header>

		<img
			class="building"
			src="/img/directions-lesters-building.jpg"
			width="1632"
			height="648"
			alt="The Lester's Restaurant building at 9906 Clayton Road. Plan Your Recovery's entrance is to the right of the Lester's entrance."
		/>

		<address>
			<strong>Plan Your Recovery</strong><br />
			<a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="{streetAddress}, {addressLocality}, {addressRegion} {postalCode} (opens in Google Maps)">{streetAddress}<br />{addressLocality}, {addressRegion} {postalCode}</a>
		</address>

		<ol class="steps">
			<li>Turn into Lester's Restaurant parking lot.</li>
			<li>Park in the lot.</li>
			<li>
				The Plan Your Recovery entrance is to the right of the Lester's entrance.
				<img
					class="entrance"
					src="/img/directions-entrance.jpg"
					width="650"
					height="1280"
					alt="The entrance beneath the 9904 sign, to the right of Lester's."
				/>
			</li>
			<li>Once inside, follow the hallway and take the first left.</li>
			<li>The Plan Your Recovery doors are straight ahead.</li>
			<li>Wait in the waiting room. Your provider will come to you shortly.</li>
		</ol>
	</div>
</div>

<style lang="scss">
	.page {
		width: 100%;
		padding: var(--space-xlarge) 0;
	}

	.container {
		max-width: 720px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.page-header {
		margin-bottom: var(--space-large);
		padding-bottom: var(--space-medium);
		border-bottom: 2px solid var(--c-gray);

		h1 {
			margin: 0;
		}
	}

	.building {
		display: block;
		width: 100%;
		height: auto;
		margin-bottom: var(--space-medium);
		border-radius: 6px;
	}

	.entrance {
		display: block;
		width: 100%;
		max-width: 320px;
		height: auto;
		margin-top: var(--space-small);
		border-radius: 6px;
	}

	address {
		font-style: normal;
		line-height: 1.9;
		padding: var(--space-small);
		margin-bottom: var(--space-large);
		background: #f8f8f8;
		border-radius: 6px;
		border-left: 3px solid var(--c-green);
		color: var(--c-dark);

		a {
			color: var(--c-dark);
			box-shadow: 0 1px 0 0 var(--c-green);
			text-decoration: none;

			&:hover {
				box-shadow: 0 2px 0 0 var(--c-green);
			}
		}
	}

	.steps {
		padding-left: 1.5rem;

		li {
			line-height: 1.8;
			margin-bottom: 1rem;
			padding-left: 0.5rem;
			color: var(--c-dark);
			font-size: 1.1rem;
		}
	}
</style>
