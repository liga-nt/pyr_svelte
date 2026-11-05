<script>
	// A soft green blob with a line-art icon from the shared icon library sitting on it. Shared
	// by the "closing card" templates (takeaway, next-steps, and future ones like them).
	// Renders nothing if `icon` is empty or not in the library.
	//
	// The blob is the home page hero's own shape, copied in as a plain filled path at full
	// opacity (not a CSS mask of the static file, which bakes opacity="0.1" into its own path,
	// and a mask's alpha comes from the rendered source, so that faded out anything drawn on top
	// of it too, not just the background). It is an intentionally lopsided shape, wider and
	// "meatier" toward the lower-left than the notched, narrower upper-right, so the icon sits
	// offset onto that fuller lobe rather than the shape's geometric middle, which falls in the
	// narrower waist next to the notch.
	import { icons } from './icons.js';

	let { icon = '' } = $props();
	const def = $derived(icons[icon]);
	const gid = $props.id();
</script>

{#if def}
	<div class="icon-badge" aria-hidden="true">
		<svg class="blob" viewBox="0 0 527 377" preserveAspectRatio="xMidYMid meet">
			<path
				d="M1.329 259.827C12.8044 184.601 81.6573 146.989 89.9197 100.661C98.1821 54.3331 86.248 -3.92055 163.822 0.207668C241.396 4.33588 216.657 102.496 268.985 117.632C321.314 132.769 382.822 -30.0658 483.806 27.7292C584.791 85.5242 474.167 143.778 495.282 202.49C516.397 261.203 323.561 361.656 188.15 374.958C52.7393 388.26 -10.1464 335.052 1.329 259.827Z"
			/>
		</svg>
		<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="url(#icon-grad-{gid})" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<defs>
				<!-- A light-to-deep green sweep rather than one flat tone, for some shimmer.
				     gradientUnits="userSpaceOnUse", not the default objectBoundingBox: a
				     bounding-box gradient is recalculated per shape against *that shape's own*
				     bounding box, and a perfectly horizontal or vertical straight line has zero
				     width or height there, which most browsers simply refuse to paint at all.
				     That was the real bug behind every "broken" icon (lightbulb's stem and base,
				     every progress bar, calendar's header and tabs, half of spark's rays) - not
				     line vs path vs any particular element. userSpaceOnUse fixes the gradient in
				     the icon's own 24x24 coordinate space once, independent of each shape. -->
				<linearGradient id="icon-grad-{gid}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
					<stop offset="0" style="stop-color: color-mix(in srgb, var(--c-green) 70%, black)" />
					<stop offset="1" style="stop-color: var(--c-green-text, #1e7a3c)" />
				</linearGradient>
			</defs>
			{#each def.shapes as s, i (i)}
				<!-- Every shape is a real, static element, never a dynamically-created tag (that
				     was tried, and {@html} raw markup before that; see icons.js for why). No
				     `line`: see icons.js for why that specific tag is not supported here. -->
				{#if s.tag === 'circle'}
					<circle cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} stroke={s.stroke} stroke-width={s['stroke-width']} />
				{:else if s.tag === 'rect'}
					<rect x={s.x} y={s.y} width={s.width} height={s.height} rx={s.rx} />
				{:else if s.tag === 'polygon'}
					<polygon points={s.points} fill={s.fill} stroke={s.stroke} stroke-width={s['stroke-width']} />
				{:else if s.tag === 'path'}
					<path d={s.d} />
				{/if}
			{/each}
		</svg>
	</div>
{/if}

<style lang="scss">
	.icon-badge {
		--size: clamp(100px, 36cqi, 200px);
		width: var(--size);
		height: var(--size);
		flex-shrink: 0;
		align-self: center;
		display: grid;
		place-items: center;
		color: var(--c-green-text, #1e7a3c);
	}
	/* Both children stack on the same grid cell; the icon is then nudged off that shared
	   center with a translate (see below), rather than the two being centered together. */
	.blob,
	.icon {
		grid-area: 1 / 1;
	}
	.blob {
		width: 100%;
		height: 100%;
		fill: color-mix(in srgb, var(--c-green) 28%, white);
	}
	.icon {
		width: 38%;
		height: 38%;
		opacity: 0.85;
		/* Off the blob's geometric center (which sits in its narrow waist by the notch) and
		   onto its fullest lobe: the point of maximum distance from every edge of the shape
		   (computed from the actual path, not eyeballed), well below and left of center. */
		transform: translate(calc(var(--size) * -0.16), calc(var(--size) * 0.08));
	}
</style>
