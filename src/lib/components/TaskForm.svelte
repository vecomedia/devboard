<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Task } from '$lib/schemas/task';

	// TODO: Insert TaskFrom Data into schema //
	type TaskFormData = {
		success?: boolean;
		data?: {
			title: FormDataEntryValue | null;
			description: FormDataEntryValue | null;
			category: FormDataEntryValue | null;
			priority: FormDataEntryValue | null;
			status: FormDataEntryValue | null;
		};
		errors?: {
			title?: string[];
			description?: string[];
			category?: string[];
			priority?: string[];
			status?: string[];
		};
		error?: string;
	};

	let {
		form,
		task = null,
		onSuccess,
		onCancel
	}: {
		form: TaskFormData | null;
		task?: Task | null;
		onSuccess?: () => void;
		onCancel?: () => void;
	} = $props();

	const CATEGORIES = ['Refactoring', 'Organisation'] as const;
	const PRIORITIES = ['Low', 'Mid', 'High'] as const;

	let isEditing = $derived(!!task);
	let formAction = $derived(isEditing ? '?/editTask' : '?/createTask');

	let titleValue = $derived(form?.data?.title ?? task?.title ?? '');
	let descriptionValue = $derived(form?.data?.description ?? task?.description ?? '');
	let categoryValue = $derived((form?.data?.category as string) ?? task?.category ?? CATEGORIES[0]);
	let priorityValue = $derived((form?.data?.priority as string) ?? task?.priority ?? 'Mid');
	let statusValue = $derived((form?.data?.status as string) ?? task?.status ?? 'Todo');
</script>

<form
	method="POST"
	action={formAction}
	class="flex flex-col gap-4"
	use:enhance={() => {
		return async ({ update }) => {
			await update();
			onSuccess?.();
		};
	}}
>
	{#if isEditing}
		<input type="hidden" name="id" value={task!.id} />
	{/if}

	<label class="flex flex-col gap-1.5 text-xs text-slate-500">
		TITLE
		<input
			name="title"
			placeholder="What needs to be done?"
			value={titleValue}
			class="bg-[#0F1114] text-sm text-slate-100 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
		/>
		{#if form?.errors?.title}<span class="text-red-400">{form.errors.title[0]}</span>{/if}
	</label>

	<label class="flex flex-col gap-1.5 text-xs text-slate-500">
		DESCRIPTION
		<textarea
			name="description"
			placeholder="Add context, goals, or notes..."
			rows="3"
			class="bg-[#0F1114] text-sm text-slate-100 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600 resize-none"
			>{descriptionValue}</textarea
		>
	</label>

	<div class="grid grid-cols-2 gap-4">
		<label class="flex flex-col gap-1.5 text-xs text-slate-500">
			CATEGORY
			<select
				name="category"
				class="bg-[#0F1114] text-sm text-slate-100 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			>
				{#each CATEGORIES as cat}
					<option value={cat} selected={cat === categoryValue}>{cat}</option>
				{/each}
			</select>
		</label>
		<label class="flex flex-col gap-1.5 text-xs text-slate-500">
			PRIORITY
			<select
				name="priority"
				class="bg-[#0F1114] text-sm text-slate-100 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			>
				{#each PRIORITIES as p}
					<option value={p} selected={p === priorityValue}>{p}</option>
				{/each}
			</select>
		</label>
	</div>

	{#if isEditing}
		<label class="flex flex-col gap-1.5 text-xs text-slate-500">
			STATUS
			<select
				name="status"
				class="bg-[#0F1114] text-sm text-slate-100 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			>
				{#each ['Todo', 'In Progress', 'Done'] as s}
					<option value={s} selected={s === statusValue}>{s}</option>
				{/each}
			</select>
		</label>
	{:else}
		<input type="hidden" name="status" value="Todo" />
	{/if}

	<div class="flex items-center justify-end gap-4 mt-2">
		<button
			type="button"
			class="text-slate-400 hover:text-slate-200 text-sm"
			onclick={() => onCancel?.()}
		>
			Cancel
		</button>
		<button
			type="submit"
			class="bg-indigo-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
		>
			{isEditing ? 'Save changes' : 'Add task'}
		</button>
	</div>
</form>