<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

   let { form }: { form: ActionData } = $props();
</script>

<form method="POST" action="?/createTask" use:enhance>
  <label>
    Title
    <input name="title" value={form?.data?.title ?? ''} />
    {#if form?.errors?.title}
      <span class="error">{form.errors.title[0]}</span>
    {/if}
  </label>

  <label>
    Description
    <textarea name="description">{form?.data?.description ?? ''}</textarea>
  </label>

  <label>
    Category
    <select name="category">
      <option value="Refactoring">Refactoring</option>
      <option value="Programming">Programming</option>
      <option value="Organizing">Organizing</option>
    </select>
  </label>

  <label>
    Priority
    <select name="priority">
      <option value="Low">Low</option>
      <option value="Mid">Mid</option>
      <option value="High">High</option>
    </select>
  </label>

  <input type="hidden" name="status" value="Todo" />

  <button type="submit">Add task</button>
</form>