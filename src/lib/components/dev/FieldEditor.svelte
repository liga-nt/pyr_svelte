<script>
	import FieldEditor from './FieldEditor.svelte';
	let { value = $bindable(), fieldKey = '', unusedKeys = [] } = $props();

	const type = $derived(
		value === null || value === undefined
			? 'null'
			: Array.isArray(value)
				? 'array'
				: typeof value
	);

	function autoresize(node) {
		function resize() {
			node.style.height = '0';
			node.style.height = node.scrollHeight + 'px';
		}
		node.addEventListener('input', resize);
		requestAnimationFrame(resize);
		return {
			update() { requestAnimationFrame(resize); },
			destroy() { node.removeEventListener('input', resize); }
		};
	}

	function makeEmpty(template) {
		if (typeof template === 'string') return '';
		if (typeof template === 'number') return 0;
		if (typeof template === 'boolean') return false;
		if (Array.isArray(template)) return [];
		if (typeof template === 'object' && template !== null) {
			return Object.fromEntries(Object.entries(template).map(([k, v]) => [k, makeEmpty(v)]));
		}
		return '';
	}

	function addItem() {
		const template = value.length > 0 ? value[0] : '';
		value = [...value, makeEmpty(template)];
	}

	function removeItem(i) {
		value = value.filter((_, idx) => idx !== i);
	}

	function moveUp(i) {
		if (i === 0) return;
		const arr = [...value];
		[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
		value = arr;
	}

	function moveDown(i) {
		if (i === value.length - 1) return;
		const arr = [...value];
		[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
		value = arr;
	}
</script>

{#if type === 'string'}
	<textarea use:autoresize={value} bind:value class="field-text"></textarea>
{:else if type === 'number'}
	<input type="number" bind:value class="field-text field-number" />
{:else if type === 'boolean'}
	<label class="bool-wrap">
		<input type="checkbox" bind:checked={value} />
		<span>{value ? 'true' : 'false'}</span>
	</label>
{:else if type === 'array'}
	<div class="array-wrap">
		{#each value as _, i (i)}
			<div class="arr-item">
				<div class="arr-controls">
					<button type="button" class="ctrl-btn" onclick={() => moveUp(i)} disabled={i === 0}>↑</button>
					<button type="button" class="ctrl-btn" onclick={() => moveDown(i)} disabled={i === value.length - 1}>↓</button>
					<button type="button" class="ctrl-btn danger" onclick={() => removeItem(i)}>✕</button>
				</div>
				<div class="arr-content">
					<FieldEditor bind:value={value[i]} {fieldKey} />
				</div>
			</div>
		{/each}
		<button type="button" class="add-btn" onclick={addItem}>+ Add item</button>
	</div>
{:else if type === 'object'}
	<div class="obj-wrap">
		{#each Object.keys(value) as k}
			<div class="obj-row" class:unused={unusedKeys.includes(k)}>
				<div class="obj-key">
					<label class="obj-label">{k}</label>
					{#if unusedKeys.length === 0 || unusedKeys.includes(k)}
						<button type="button" class="del-btn" onclick={() => delete value[k]}>✕</button>
					{/if}
				</div>
				<div class="obj-value">
					<FieldEditor bind:value={value[k]} fieldKey={k} />
				</div>
			</div>
		{/each}
	</div>
{:else if type === 'null'}
	<em class="null-val">null</em>
{/if}

<style lang="scss">
	.field-text {
		width: 100%;
		border: none;
		outline: none;
		background: transparent;
		resize: none;
		overflow: hidden;
		padding: 0;
		font-size: 0.9rem;
		font-family: inherit;
		color: #1a1a1a;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		field-sizing: content;
		appearance: none;
		-webkit-appearance: none;

		&::-webkit-inner-spin-button,
		&::-webkit-outer-spin-button {
			-webkit-appearance: none;
		}
	}

	.field-number {
		max-width: 100px;
	}

	.bool-wrap {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.array-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.arr-item {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		padding: 0.5rem 0 0.5rem 0.75rem;
		border-left: 2px solid #e8e8e8;
	}

	.arr-controls {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex-shrink: 0;
		opacity: 0;
		transition: opacity 0.1s;

		.arr-item:hover & {
			opacity: 1;
		}
	}

	.ctrl-btn {
		padding: 0.15rem 0.35rem;
		border: 1px solid #ddd;
		border-radius: 3px;
		background: white;
		cursor: pointer;
		font-size: 0.65rem;
		line-height: 1;
		color: #888;
		box-shadow: none;

		&:hover:not(:disabled) {
			background: #f5f5f5;
			color: #333;
			box-shadow: none;
		}

		&:disabled {
			opacity: 0.2;
			cursor: not-allowed;
		}

		&.danger:hover:not(:disabled) {
			border-color: #d93025;
			color: #d93025;
			background: #fce8e6;
		}
	}

	.arr-content {
		flex: 1;
		min-width: 0;
	}

	.add-btn {
		padding: 0.25rem 0;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.78rem;
		color: #bbb;
		text-align: left;
		box-shadow: none;
		margin-top: 0.25rem;
		margin-left: 0.75rem;

		&:hover {
			color: #4f6ef7;
			box-shadow: none;
		}
	}

	.obj-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.obj-row {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 1rem;
		align-items: start;
	}

	.obj-key {
		display: flex;
		align-items: flex-start;
		gap: 0.35rem;
		padding-top: 0.15rem;
	}

	.obj-label {
		font-size: 0.72rem;
		font-weight: 600;
		color: #aaa;
		font-family: monospace;
		word-break: break-all;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		flex: 1;
	}

	.obj-row.unused {
		.obj-label {
			color: #d97706;
		}

		.obj-label::after {
			content: ' ·  unused?';
			font-weight: 400;
			font-size: 0.65rem;
			letter-spacing: 0;
			text-transform: none;
			opacity: 0.7;
		}
	}

	.del-btn {
		opacity: 0;
		padding: 0.1rem 0.3rem;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.6rem;
		color: #ccc;
		line-height: 1;
		flex-shrink: 0;
		box-shadow: none;
		transition: opacity 0.1s, color 0.1s;

		.obj-row:hover & {
			opacity: 1;
		}

		&:hover {
			color: #d93025;
			box-shadow: none;
		}
	}

	.obj-value {
		min-width: 0;
	}

	.null-val {
		color: #ccc;
		font-size: 0.85rem;
	}
</style>
