import type { PageServerLoad } from './$types';
import { getTasks } from '$lib/server/tasks';

export const load: PageServerLoad = async () => {
  const tasks = await getTasks();

  return { tasks };
};