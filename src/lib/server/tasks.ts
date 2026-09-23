import type { Task,TaskStatus } from '$lib/schemas/task';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';


const dataFile = path.resolve('static/tasks.json');

export async function getTasks(): Promise<Task[]> {
	const file = await readFile(dataFile,'utf-8');
	if (!file.trim()) {
		return [];
	}
	return JSON.parse(file)
}

export async function createTask(task: Task): Promise<Task>  {
  const tasks = await getTasks();

  tasks.push(task);
  await  writeFile( dataFile, JSON.stringify(tasks,null,2 ),'utf-8');
  return task;
}


export async function updateTaskStatus(id: string, status: TaskStatus) {
	const tasks = await getTasks();

	const task = tasks.find((task) => task.id === id);

	if (!task) {
		throw new Error(`Task ${id} not found`);
	}

	task.status = status;

	await writeFile(
		dataFile,
		JSON.stringify(tasks, null, 2),
		'utf-8'
	);

	return task;
}


export async function updateTask(id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) {
	const tasks = await getTasks();

	const task = tasks.find((task) => task.id === id);

	if (!task) {
		throw new Error(`Task ${id} not found`);
	}

	Object.assign(task, data);

	await writeFile(dataFile, JSON.stringify(tasks, null, 2), 'utf-8');

	return task;
}