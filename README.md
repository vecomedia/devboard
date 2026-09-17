DevBoard

A simple task board built with SvelteKit and Zod, used to track development tasks (refactoring, programming, organizing) across the stages Todo → In Progress → Review → Done.

Stack
SvelteKit (Svelte 5, runes mode)
Zod for schema definition and runtime validation
TypeScript
Project structure
src/
├── lib/
│   ├── schemas/
│   │   └── task.ts        # Zod schemas & inferred types
│   └── server/
│       └── tasks.ts        # Task persistence (currently in-memory)
└── routes/
    ├── +page.svelte         # Task board / new task form
    ├── +page.server.ts      # Form action for creating tasks
    └── overview/
        ├── +page.svelte     # Read-only list of persisted tasks
        └── +page.server.ts  # Loads tasks for the overview page
Data model

Tasks are defined as a Zod schema, with the TypeScript type derived via z.infer so the shape only lives in one place:

ts
// src/lib/schemas/task.ts
export const TaskCategory = z.enum(['Refactoring', 'Programming', 'Organizing']);
export const TaskPriority = z.enum(['Low', 'Mid', 'High']);
export const TaskStatus = z.enum(['Todo', 'In Progress', 'Review', 'Done']);

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional().default(''),
  category: TaskCategory,
  priority: TaskPriority,
  status: TaskStatus,
  createdAt: z.coerce.date(),
});

export type Task = z.infer<typeof TaskSchema>;

id and createdAt are server-generated, not user-supplied. A separate schema handles form input:

ts
export const NewTaskSchema = TaskSchema.omit({ id: true, createdAt: true });
export type NewTaskInput = z.infer<typeof NewTaskSchema>;
Creating a task

The "New task" form submits to a SvelteKit form action, which validates the raw FormData against NewTaskSchema before persisting it:

src/routes/+page.server.ts — parses FormData, runs NewTaskSchema.safeParse, returns field errors via fail(400, ...) on failure, otherwise generates id/createdAt and calls createTask(...).
src/routes/+page.svelte — the form itself, progressively enhanced with use:enhance, displaying validation errors inline.
Viewing tasks

The /overview route loads all persisted tasks and renders them in a list:

src/routes/overview/+page.server.ts — calls getTasks() in its load function.
src/routes/overview/+page.svelte — renders each task's category, priority, title, description, status, and creation date.
Persistence

Tasks are currently stored in a module-level in-memory array (src/lib/server/tasks.ts):

ts
const tasks: Task[] = [];

export async function createTask(task: Task) { ... }
export async function getTasks() { ... }

⚠️ This is a placeholder. Data does not survive a dev server restart and won't work across multiple server instances. Planned next step: swap this out for real persistence (e.g. SQLite via better-sqlite3 or Drizzle, or a JSON file for something simpler).

Notes on Svelte 5 / runes mode

This project uses Svelte 5 runes mode, so:

Props are declared with $props(), not export let.
After adding or renaming +page.server.ts files, run npx svelte-kit sync (or restart the dev server) to regenerate ./$types if your editor reports missing exports like PageData or ActionData.
Roadmap / open items
 Replace in-memory store with persistent storage
 Group tasks by status on the board (Todo / In Progress / Review / Done columns)
 Task editing and deletion
 Drag-and-drop status updates
 Consider sveltekit-superforms to reduce form boilerplate as the form grows