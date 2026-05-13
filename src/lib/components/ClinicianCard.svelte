<script lang="ts">
	export let person;
	export let showBio = false;

	function truncateBio(bio: string, length = 120) {
		if (bio.length <= length) return bio;
		return bio.slice(0, length).trimEnd() + '…';
	}
</script>

<div class="card">
	<a href="/team/{person.slug}" class="card-portrait-link">
		<img
			src={person.portrait}
			alt="Portrait of {person.fullName}"
			class="portrait"
			width="200"
			height="200"
		/>
	</a>
	<div class="card-body">
		<h3><a href="/team/{person.slug}">{person.fullName}</a></h3>
		<p class="role">{person.role}</p>

		{#if person.acceptedInsurance}
			<p class="insurance-note">Accepts: {person.acceptedInsurance.join(', ')}</p>
		{:else if person.insuranceNote}
			<p class="insurance-note">{person.insuranceNote}</p>
		{/if}

		{#if showBio}
			<p class="bio-snippet">
				{truncateBio(person.bio)}
				<a href="/team/{person.slug}" class="read-more">Read more about {person.firstName}</a>
			</p>
		{/if}

		<div class="contact-links">
			<a href="tel:{person.telephone}" class="contact-link">
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
				</svg>
				{person.telephone}
			</a>
			{#if person.email}
				<a href="mailto:{person.email}" class="contact-link">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
						<polyline points="22,6 12,13 2,6"/>
					</svg>
					{person.email}
				</a>
			{/if}
		</div>

		<a href="/team/{person.slug}" class="profile-link">{person.firstName}'s full profile →</a>
	</div>
</div>

<style lang="scss">
	.card {
		background: #fafafa;
		border: 1px solid #e8e4ee;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transition: box-shadow 0.2s ease, transform 0.2s ease;

		@media screen and (min-width: 560px) {
			flex-direction: row;
			align-items: stretch;
		}

		&:hover {
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
			transform: translateY(-2px);
		}
	}

	.card-portrait-link {
		display: block;
		width: 100%;
		flex-shrink: 0;
		box-shadow: none;

		@media screen and (min-width: 560px) {
			width: 200px;
		}
	}

	.portrait {
		width: 100%;
		height: auto;
		display: block;

		@media screen and (min-width: 560px) {
			height: 100%;
			min-height: 300px;
			object-fit: cover;
			object-position: center top;
		}
	}

	.card-body {
		padding: var(--space-small);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex: 1;
		min-width: 0;

		h3 {
			margin: 0;
			font-size: 1.2rem;
			font-family: orpheuspro, serif;

			a {
				color: var(--c-dark);
				text-decoration: none;
				box-shadow: none;

				&:hover {
					color: var(--c-green);
					box-shadow: none;
				}
			}
		}

		.role {
			margin: 0;
			font-size: 0.875rem;
			color: #777;
			font-family: ibm-plex-sans, sans-serif;
			text-transform: uppercase;
			letter-spacing: 0.04em;
		}

		.insurance-note {
			margin: 0;
			font-size: 0.875rem;
			color: #555;
			font-family: ibm-plex-sans, sans-serif;
		}

		.bio-snippet {
			margin: 0;
			font-size: 0.9375rem;
			line-height: 1.6;
			color: var(--c-dark);

			.read-more {
				color: var(--c-green);
				font-weight: 500;
				text-decoration: none;
				box-shadow: none;
				white-space: nowrap;

				&:hover {
					text-decoration: underline;
					box-shadow: none;
				}
			}
		}

		.contact-links {
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
			margin-top: 0.25rem;
		}

		.contact-link {
			display: flex;
			align-items: center;
			gap: 0.4rem;
			font-size: 0.875rem;
			color: var(--c-dark);
			text-decoration: none;
			box-shadow: none;
			font-family: ibm-plex-sans, sans-serif;

			&:hover {
				color: var(--c-green);
				box-shadow: none;
			}

			svg {
				flex-shrink: 0;
				color: var(--c-green);
			}
		}

		.profile-link {
			display: inline-block;
			margin-top: auto;
			padding-top: var(--space-tiny);
			color: var(--c-green);
			font-weight: 600;
			text-decoration: none;
			box-shadow: none;
			font-size: 0.9375rem;

			&:hover {
				text-decoration: underline;
				box-shadow: none;
			}
		}
	}
</style>
