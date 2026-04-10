<script>
	let { color = 'green', position = 'center' } = $props();
</script>

<div class="color-bar {position}">
	<span style="background: var(--c-{color})">&nbsp;</span>
</div>

<style>
	.color-bar {
		position: relative;
		margin-bottom: 1rem;
		display: flex;
	}

	.color-bar span {
		height: 12px;
		width: 50%;
		border-radius: 6px;
		margin: 0;
		display: block;
	}

	.color-bar.center {
		justify-content: center;
	}

	.color-bar.right {
		justify-content: flex-end;
	}
</style>
