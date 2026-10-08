<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import TaskForm from '$lib/components/TaskForm.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const STATUSES = ['Todo', 'In Progress', 'Done'] as const;
	const CATEGORIES = ['Refactoring', 'Organisation'] as const;
	let draggedTaskId = $state<string | null>(null);
	let dragOverStatus = $state<string | null>(null);
	const categoryStyle: Record<string, string> = {
		Refactoring: 'bg-amber-500/10 text-amber-400',
		Programming: 'bg-blue-500/10 text-blue-400',
		Organisation: 'bg-violet-500/10 text-violet-400'
	};

	const priorityStyle: Record<string, string> = {
		High: 'text-rose-400',
		Mid: 'text-slate-400',
		Low: 'text-slate-500'
	};

	const statusDot: Record<string, string> = {
		Todo: 'bg-slate-500',
		'In Progress': 'bg-indigo-400',
		Done: 'bg-emerald-400'
	};

	let activeCategory = $state<string>('All categories');

	let showModal = $state(false);
	let editingTask = $state<(typeof data.tasks)[number] | null>(null);

	function openEditModal(task: (typeof data.tasks)[number]) {
		editingTask = task;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingTask = null;
	}

	let filteredTasks = $derived(
		activeCategory === 'All categories'
			? data.tasks
			: data.tasks.filter((t) => t.category === activeCategory)
	);

	let tasksByStatus = $derived(
		Object.fromEntries(
			STATUSES.map((status) => [status, filteredTasks.filter((t) => t.status === status)])
		)
	);

	let counts = $derived(
		Object.fromEntries(
			STATUSES.map((status) => [status, data.tasks.filter((t) => t.status === status).length])
		)
	);

	function pct(count: number) {
		return data.tasks.length ? Math.round((count / data.tasks.length) * 100) : 0;
	}

	function handleDragStart(taskId: string) {
		draggedTaskId = taskId;
	}

	function handleDragEnd() {
		draggedTaskId = null;
		dragOverStatus = null;
	}

	function handleDragOver(status: string, event: DragEvent) {
		event.preventDefault();
		dragOverStatus = status;
	}

	async function handleDrop(status: string, event: DragEvent) {
		event.preventDefault();

		if (!draggedTaskId) return;

		const taskId = draggedTaskId;

		draggedTaskId = null;
		dragOverStatus = null;

		const formData = new FormData();
		formData.append('id', taskId);
		formData.append('status', status);

		await fetch('?/moveTask', {
			method: 'POST',
			body: formData
		});

		// Reload data from the server
		location.reload();
	}
</script>

<div class="min-h-screen bg-[#121417] font-sans">
	<div class="container mx-auto max-w-6xl px-6 py-10">
		<header class="mb-8">
			<h1 class="text-2xl font-semibold tracking-tight text-slate-100">Task overview</h1>
			<p class="mt-1 text-sm text-slate-500">Track progress across your board.</p>
			<button
				class="mt-4 rounded-full bg-indigo-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-400"
				onclick={() => (showModal = true)}
			>
				+ New task
			</button>
		</header>
		<!-- Summary strip -->
		<div class="mb-8 grid grid-cols-3 gap-3">
			{#each STATUSES as status}
				<div class="rounded-2xl bg-[#1B1F24] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
					<span class="mb-2 inline-flex items-center gap-1.5 text-xs text-slate-500">
						<span class="h-1.5 w-1.5 rounded-full {statusDot[status]}"></span>
						{status}
					</span>
					<div class="text-2xl font-semibold text-slate-100">{counts[status]}</div>
					<div class="mt-0.5 text-xs text-slate-600">{pct(counts[status])}% of total</div>
				</div>
			{/each}
		</div>

		<!-- Filter chips -->
		<div class="mb-8 flex flex-wrap items-center gap-2">
			<button
				class="rounded-full px-4 py-1.5 text-xs font-medium transition-colors {activeCategory ===
				'All categories'
					? 'bg-indigo-500 text-white'
					: 'bg-[#1B1F24] text-slate-400 hover:bg-[#242931] hover:text-slate-200'}"
				onclick={() => (activeCategory = 'All categories')}
			>
				All categories
			</button>
			{#each CATEGORIES as cat}
				<button
					class="rounded-full px-4 py-1.5 text-xs font-medium transition-colors {activeCategory ===
					cat
						? 'bg-indigo-500 text-white'
						: 'bg-[#1B1F24] text-slate-400 hover:bg-[#242931] hover:text-slate-200'}"
					onclick={() => (activeCategory = cat)}
				>
					{cat}
				</button>
			{/each}
		</div>

		<!-- Board -->
		<div class="grid grid-cols-3 gap-4">
			{#each STATUSES as status}
				<div
					role="article"
					class="rounded-2xl bg-[#181B20] p-3 transition-all
						{dragOverStatus === status ? 'bg-indigo-500/5 ring-2 ring-indigo-500/50' : ''}"
					ondragover={(event) => handleDragOver(status, event)}
					ondragleave={() => (dragOverStatus = null)}
					ondrop={(event) => handleDrop(status, event)}
				>
					<div class="mb-3 flex items-center justify-between px-1">
						<span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
							<span class="h-1.5 w-1.5 rounded-full {statusDot[status]}"></span>
							{status}
						</span>
						<span class="rounded-full bg-[#0F1114] px-2 py-0.5 text-[12px] text-slate-600">
							{tasksByStatus[status].length}
						</span>
					</div>

					<div class="flex flex-col gap-2">
						{#each tasksByStatus[status] as task (task.id)}
							<article
								draggable="true"
								ondragstart={() => handleDragStart(task.id)}
								ondragend={handleDragEnd}
								class="cursor-grab rounded-xl bg-[#1F232A] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-all hover:bg-[#242931] hover:shadow-[0_2px_8px_rgba(0,0,0,0.5)] active:cursor-grabbing"
							>

								<div class="mb-2.5 flex items-center justify-between">
									<span
										class="text-[ ] rounded-md px-2 py-0.5 font-medium {categoryStyle[
											task.category
										]}"
									>
										{task.category}
									</span>
									<span class="text-[12px] font-medium {priorityStyle[task.priority]}"
										>{task.priority}</span
									>
								</div>

								<h3 class="mb-1 text-sm leading-snug font-medium text-slate-100">
									{task.title}
								</h3>

								{#if task.description}
									<p class="mb-3 text-xs leading-relaxed text-slate-500">
										{task.description}
									</p>
								{/if}
																	<div class="mb-2.5 flex items-center justify-end">
									<button
										type="button"
										class="text-slate-600 transition-colors hover:text-slate-300"
										aria-label="Edit task"
										onclick={(e) => {
											e.stopPropagation();
											openEditModal(task);
										}}
									>
										<!-- simple pencil icon, swap for lucide-react/svelte icon if you have one -->
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg
										>
									</button>
								</div>
								<div
									class="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-slate-600"
								>
									<span>{task.status}</span>
									<time>{new Date(task.createdAt).toISOString().slice(0, 10)}</time>
								</div>
							</article>
						{/each}
					</div>
				</div>
			{/each}
		</div>
		{#if showModal}
			<div
				role="presentation"
				class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
				onclick={closeModal}
			>
				<div
					role="presentation"
					class="bg-board-card border-board-border w-full max-w-md rounded-xl border p-6 font-sans"
					onclick={(e) => e.stopPropagation()}
				>
					<div class="mb-5 flex items-center justify-between">
						<h2 class="font-medium text-white">{editingTask ? 'Edit task' : 'New task'}</h2>
						<button
							type="button"
							class="text-lg leading-none text-slate-500 hover:text-slate-300"
							onclick={closeModal}>×</button
						>
					</div>

					<TaskForm {form} task={editingTask} onSuccess={closeModal} onCancel={closeModal} />
				</div>
			</div>
		{/if}
	</div>
</div>
