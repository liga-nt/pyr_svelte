<script>
	export let icon;
	export let color;
</script>

<div class="icon-wrapper" style="--icon-color: {color}">
	{#if icon === 'koi'}
		<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
			<!-- Koi fish for Depression -->
			<path
				d="M85 60c0-5-3-8-8-10 3-8 2-16-2-22-5-7-14-10-23-8-12 3-20 14-20 27 0 8 3 15 8 20 2 2 5 3 8 3 2 0 4 0 6-1 8-3 14-10 16-18 4 2 7 5 7 9 0 6-6 10-12 13-10 4-22 5-32 0-2-1-3-2-4-4l-3 4c2 3 5 5 9 6 6 2 12 3 18 3 7 0 14-1 20-4 8-4 16-9 16-18z"
				fill="var(--icon-color)"
			/>
			<circle cx="52" cy="45" r="3" fill="#fff" />
			<path
				d="M45 65c3 2 7 3 11 3-4-2-7-5-9-8-1 2-2 4-2 5z"
				fill="var(--icon-color)"
				opacity="0.6"
			/>
		</svg>
	{:else if icon === 'vines'}
		<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
			<!-- Vines for Anxiety -->
			<path
				d="M30 100c0-15 5-30 15-40 8-8 18-12 28-12v-8c-12 0-23 5-32 14C30 65 25 82 25 100h5z"
				fill="var(--icon-color)"
				opacity="0.7"
			/>
			<path
				d="M50 100c0-10 3-20 10-27 5-5 12-8 19-8v-5c-9 0-17 3-24 10-8 8-12 19-12 30h7z"
				fill="var(--icon-color)"
			/>
			<circle cx="44" cy="70" r="6" fill="var(--icon-color)" opacity="0.5" />
			<circle cx="62" cy="80" r="5" fill="var(--icon-color)" opacity="0.6" />
			<circle cx="38" cy="88" r="4" fill="var(--icon-color)" opacity="0.4" />
			<path
				d="M70 100c0-7 2-13 6-18 3-4 8-6 13-6v-4c-7 0-13 3-17 8-5 6-8 13-8 20h6z"
				fill="var(--icon-color)"
				opacity="0.8"
			/>
		</svg>
	{:else if icon === 'succulent'}
		<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
			<!-- Succulent for Substance Use -->
			<ellipse cx="60" cy="85" rx="18" ry="8" fill="var(--icon-color)" opacity="0.3" />
			<path
				d="M60 30c-3 0-5 2-6 5l-8 35c-1 4 1 8 5 9l9 2 9-2c4-1 6-5 5-9l-8-35c-1-3-3-5-6-5z"
				fill="var(--icon-color)"
			/>
			<path
				d="M50 50c1-2 3-4 5-4s4 2 5 4l5 20-10 2-10-2 5-20z"
				fill="var(--icon-color)"
				opacity="0.7"
			/>
			<ellipse cx="52" cy="55" rx="3" ry="5" fill="#fff" opacity="0.3" />
			<ellipse cx="68" cy="55" rx="3" ry="5" fill="#fff" opacity="0.3" />
		</svg>
	{:else if icon === 'snail'}
		<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
			<!-- Snail for PTSD -->
			<path
				d="M75 55c0-11-9-20-20-20s-20 9-20 20c0 8 5 15 12 18v-3c-5-2-9-8-9-15 0-9 7-16 16-16s16 7 16 16c0 7-4 13-9 15v3c7-3 14-10 14-18z"
				fill="var(--icon-color)"
			/>
			<circle cx="55" cy="55" r="8" fill="var(--icon-color)" opacity="0.6" />
			<circle cx="55" cy="55" r="4" fill="var(--icon-color)" />
			<path
				d="M55 73c-3 0-5 1-7 3-4 4-6 9-6 14h3c0-4 2-8 5-11 2-2 4-3 7-3v-3z"
				fill="var(--icon-color)"
			/>
			<path d="M48 78l-4 6 6 2-2-8z" fill="var(--icon-color)" opacity="0.7" />
			<path d="M51 82l-3 5 5 1-2-6z" fill="var(--icon-color)" opacity="0.5" />
		</svg>
	{:else if icon === 'hummingbird'}
		<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
			<!-- Hummingbird for ADHD -->
			<ellipse
				cx="55"
				cy="60"
				rx="12"
				ry="10"
				fill="var(--icon-color)"
				transform="rotate(-10 55 60)"
			/>
			<path d="M65 58c0-3 2-5 5-6l15-5-12 10c-2 2-4 4-5 6l-3-5z" fill="var(--icon-color)" />
			<path
				d="M67 65c1 2 3 4 5 5l12 8-15-4c-3-1-5-3-6-5l4-4z"
				fill="var(--icon-color)"
				opacity="0.7"
			/>
			<circle cx="52" cy="58" r="2" fill="#333" />
			<path
				d="M42 60c-2-1-4-1-6 0-5 2-8 6-8 11h3c0-3 2-6 5-8 2-1 4-1 6 0v-3z"
				fill="var(--icon-color)"
			/>
		</svg>
	{:else if icon === 'monstera'}
		<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
			<!-- Monstera leaf for OCD -->
			<path
				d="M60 30c-8 0-15 3-20 8s-8 12-8 20c0 12 7 22 17 26v-8c-7-3-12-10-12-18 0-6 2-11 6-15s9-6 15-6v28h4V37c6 0 11 2 15 6s6 9 6 15c0 8-5 15-12 18v8c10-4 17-14 17-26 0-8-3-15-8-20s-12-8-20-8z"
				fill="var(--icon-color)"
			/>
			<rect x="58" y="45" width="4" height="8" rx="2" fill="#fff" opacity="0.4" />
			<rect x="48" y="52" width="4" height="6" rx="2" fill="#fff" opacity="0.3" />
			<rect x="68" y="52" width="4" height="6" rx="2" fill="#fff" opacity="0.3" />
		</svg>
	{/if}
</div>

<style lang="scss">
	.icon-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		svg {
			width: 100%;
			height: 100%;
			filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
		}
	}
</style>
