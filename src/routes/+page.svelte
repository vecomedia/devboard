<!-- <script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<div class="bg-[#1B1F24] rounded-2xl p-5 w-full max-w-sm shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
  <h2 class="text-sm font-semibold text-slate-100 mb-4">New task</h2>

  <form method="POST" action="?/createTask" use:enhance class="flex flex-col gap-4">
    <label class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-slate-400">Title</span>
      <input
        name="title"
        value={form?.data?.title ?? ''}
        class="bg-[#0F1114] text-sm text-slate-100 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600"
        placeholder="e.g. Fix login redirect"
      />
      {#if form?.errors?.title}
        <span class="text-[11px] text-rose-400">{form.errors.title[0]}</span>
      {/if}
    </label>

    <label class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-slate-400">Description</span>
      <textarea
        name="description"
        rows="3"
        class="bg-[#0F1114] text-sm text-slate-100 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600 resize-none"
        placeholder="Optional details"
      >{form?.data?.description ?? ''}</textarea>
    </label>

    <div class="grid grid-cols-2 gap-3">
      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-medium text-slate-400">Category</span>
        <select
          name="category"
          class="bg-[#0F1114] text-sm text-slate-100 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="Refactoring">Refactoring</option>
          <option value="Organisation">Organisation</option>
          <option value="Project">Project</option>
        </select>
      </label>

      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-medium text-slate-400">Priority</span>
        <select
          name="priority"
          class="bg-[#0F1114] text-sm text-slate-100 rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="Low">Low</option>
          <option value="Mid">Mid</option>
          <option value="High">High</option>
        </select>
      </label>
    </div>

    <input type="hidden" name="status" value="Todo" />

    <button
      type="submit"
      class="mt-1 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
    >
      Add task
    </button>
  </form>
</div> -->