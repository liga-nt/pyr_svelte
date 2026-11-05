<script>
	// Renders the fields of a template from its definition. Adding a field type or a template
	// needs no change here unless the field type is new.
	import FieldForm from './FieldForm.svelte';

	let { fields, data, issues = [], readonly = false, onupload = null, uploading = '' } = $props();

	const errorsFor = (key) => issues.filter((i) => i.field === key);
	const lines = (v) => (Array.isArray(v) ? v.join('\n') : '');
</script>

<div class="form">
	{#each fields as f (f.key)}
		{@const errs = errorsFor(f.key)}
		<div class="field" class:has-error={errs.some((e) => e.level === 'error')}>
			{#if f.type === 'group'}
				<fieldset disabled={readonly}>
					<legend>{f.label}</legend>
					{#if data[f.key]}
						<FieldForm fields={f.fields} data={data[f.key]} issues={[]} {readonly} />
					{/if}
				</fieldset>
			{:else if f.type === 'list'}
				<fieldset disabled={readonly}>
					<legend>{f.label}</legend>
					{#each data[f.key] ?? [] as item, i}
						<div class="list-item">
							<div class="list-item-head">
								<span class="item-label">{f.itemLabel ?? 'Item'} {i + 1}</span>
								{#if !readonly && (data[f.key]?.length ?? 0) > (f.min ?? 0)}
									<button type="button" class="quiet" onclick={() => data[f.key].splice(i, 1)}>Remove</button>
								{/if}
							</div>
							<FieldForm fields={f.fields} data={item} issues={[]} {readonly} />
						</div>
					{/each}
					{#if !readonly && (data[f.key]?.length ?? 0) < (f.max ?? Infinity)}
						<button
							type="button"
							class="quiet"
							onclick={() =>
								(data[f.key] = [
									...(data[f.key] ?? []),
									Object.fromEntries(f.fields.map((sf) => [sf.key, sf.type === 'lines' ? [] : '']))
								])}
						>
							Add {f.itemLabel ?? 'item'}
						</button>
					{/if}
				</fieldset>
			{:else}
				<label for="f-{f.key}">
					{f.label}{#if f.required}<span class="req" title="Required"> *</span>{/if}
				</label>

				{#if f.type === 'text'}
					<input id="f-{f.key}" type="text" bind:value={data[f.key]} disabled={readonly} />
				{:else if f.type === 'textarea'}
					<textarea id="f-{f.key}" rows="3" bind:value={data[f.key]} disabled={readonly}></textarea>
				{:else if f.type === 'lines'}
					<textarea
						id="f-{f.key}"
						rows={Math.max(3, (data[f.key]?.length ?? 0) + 1)}
						value={lines(data[f.key])}
						oninput={(e) => (data[f.key] = e.currentTarget.value.split('\n'))}
						disabled={readonly}
					></textarea>
				{:else if f.type === 'select'}
					<select id="f-{f.key}" bind:value={data[f.key]} disabled={readonly}>
						<option value="">Default</option>
						{#each f.options as o}
							{@const opt = typeof o === 'string' ? { value: o, label: o } : o}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				{:else if f.type === 'image'}
					<div class="image">
						{#if data[f.key]}
							<img src={data[f.key]} alt="" />
							<button type="button" class="quiet" disabled={readonly} onclick={() => (data[f.key] = '')}>Remove image</button>
						{/if}
						{#if onupload}
							<input
								id="f-{f.key}"
								type="file"
								accept="image/*"
								disabled={readonly || Boolean(uploading)}
								onchange={async (e) => {
									const file = e.currentTarget.files?.[0];
									if (file) data[f.key] = await onupload(file);
									e.currentTarget.value = '';
								}}
							/>
							{#if uploading}<span class="hint">{uploading}</span>{/if}
						{/if}
					</div>
				{/if}

				{#if f.hint}<span class="hint">{f.hint}</span>{/if}
				{#each errs as e}
					<span class="msg" class:warn={e.level === 'warning'} role={e.level === 'error' ? 'alert' : undefined}>{e.message}</span>
				{/each}
			{/if}
		</div>
	{/each}
</div>

<style>
	.form { display: flex; flex-direction: column; gap: 1rem; }
	.field { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
	label, legend { font-size: 0.9rem; font-weight: 500; padding: 0; }
	fieldset { border: 1px solid #e8e4ee; border-radius: 8px; padding: 0.75rem 1rem 1rem; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; min-width: 0; }
	legend { padding: 0 0.4rem; }
	.list-item { border-top: 1px solid #e8e4ee; padding-top: 0.75rem; display: flex; flex-direction: column; gap: 0.75rem; }
	.list-item:first-child { border-top: none; padding-top: 0; }
	.list-item-head { display: flex; align-items: center; justify-content: space-between; }
	.item-label { font-size: 0.8125rem; font-weight: 600; color: var(--c-text-muted, #666); }
	.req { color: #8a1f1f; }
	input[type='text'], textarea, select {
		width: 100%;
		font: inherit;
		font-size: 0.95rem;
		padding: 0.55rem 0.7rem;
		border: 1.5px solid #ddd;
		border-radius: 6px;
		background: #fff;
		color: var(--c-dark);
	}
	textarea { resize: vertical; line-height: 1.5; }
	input:focus-visible, textarea:focus-visible, select:focus-visible { outline: none; border-color: var(--c-green); }
	.has-error input[type='text'], .has-error textarea { border-color: #b25050; }
	.hint { font-size: 0.8125rem; color: var(--c-text-muted, #666); }
	.msg { font-size: 0.8125rem; color: #8a1f1f; }
	.msg.warn { color: #7a5b00; }
	.image { display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start; }
	.image img { max-width: 100%; max-height: 180px; border-radius: 6px; border: 1px solid #eee; }
	.quiet { min-height: 36px; font-size: 0.8rem; }
</style>
