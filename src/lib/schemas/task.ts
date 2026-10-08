import { title } from 'process';
import {uuid, z} from 'zod';

export const TaskCategory = z.enum(['Refactoring','Organisation']);

export const TaskPriority = z.enum(['Low','Mid','High']);

export const TaskStatus = z.enum(['Todo', 'In Progress', 'Done']);

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  category: TaskCategory,
  priority: TaskPriority,
  status: TaskStatus,
  createdAt: z.coerce.date(), 
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskCategory = z.infer<typeof TaskCategory>;
export type TaskPriority = z.infer<typeof TaskPriority>;
export type TaskStatus = z.infer<typeof TaskStatus>;

export const NewTaskSchema = TaskSchema.omit({ id: true, createdAt: true });
export type NewTaskInput = z.infer<typeof NewTaskSchema>;

export const UpdateTaskSchema = NewTaskSchema.partial().extend({
	id: z.string().min(1)
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;