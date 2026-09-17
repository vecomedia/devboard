import type { Task } from '$lib/schemas/task';

const tasks: Task[] = [];

export async function createTask(task: Task) {
  tasks.push(task);
  return task;
}

export async function getTasks() {
  return tasks;
}