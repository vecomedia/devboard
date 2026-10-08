import type { PageServerLoad } from './$types';
import { getTasks, updateTask, updateTaskStatus } from '$lib/server/tasks';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from 'crypto';
import { createTask } from '$lib/server/tasks';


import {NewTaskSchema,
	TaskStatus,
	UpdateTaskSchema
} from '$lib/schemas/task';

export const load: PageServerLoad = async () => {
  const tasks = await getTasks();

  return { tasks };
};

export const actions: Actions = {
  createTask: async ({ request }) => {
	const formData = await request.formData();

	const raw = {
	  title: formData.get('title'),
	  description: formData.get('description'),
	  category: formData.get('category'),
	  priority: formData.get('priority'),
	  status: formData.get('status'),
	};

	const result = NewTaskSchema.safeParse(raw);

	if (!result.success) {
	  return fail(400, {
		data: raw,
		errors: result.error.flatten().fieldErrors,
	  });
	}

	const task = {
	  id: randomUUID(),
	  createdAt: new Date(),
	  ...result.data, 
	};

	await createTask(task);

	return { success: true, task };
  },
  editTask: async ({ request }) => {
	const formData = await request.formData();

	const raw = {
		id: formData.get('id'),
		title: formData.get('title'),
		description: formData.get('description'),
		category: formData.get('category'),
		priority: formData.get('priority'),
		status: formData.get('status')
	};

	const result = UpdateTaskSchema.safeParse(raw);

	if (!result.success) {
		return fail(400, {
			data: raw,
			errors: result.error.flatten().fieldErrors
		});
	}

	const { id, ...changes } = result.data;

	try {
		await updateTask(id, changes);
	} catch {
		return fail(404, { error: 'Task not found' });
	}

	return { success: true };
},
moveTask: async ({ request }) => {
	const formData = await request.formData();

	const id = formData.get('id');
	const status = formData.get('status');

	if (typeof id !== 'string' || typeof status !== 'string') {
		return fail(400, {
			error: 'Invalid task data'
		});
	}

	const result = TaskStatus.safeParse(status);

	if (!result.success) {
		return fail(400, {
			error: 'Invalid status'
		});
	}

	await updateTaskStatus(id, result.data);

	return { success: true };
}
};