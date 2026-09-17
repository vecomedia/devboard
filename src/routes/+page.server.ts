import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { randomUUID } from 'crypto';
import { NewTaskSchema } from '$lib/schemas/task';
import { createTask } from '$lib/server/tasks';

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
};