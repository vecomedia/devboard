<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<h1>Task Overview</h1>

{#if data.tasks.length === 0}
  <p>No tasks yet.</p>
{:else}
  <ul>
    {#each data.tasks as task (task.id)}
      <li>
        <span class="category">{task.category}</span>
        <span class="priority">{task.priority}</span>
        <h3>{task.title}</h3>
        {#if task.description}
          <p>{task.description}</p>
        {/if}
        <span class="status">{task.status}</span>
        <time>{new Date(task.createdAt).toLocaleDateString()}</time>
      </li>
    {/each}
  </ul>
{/if}