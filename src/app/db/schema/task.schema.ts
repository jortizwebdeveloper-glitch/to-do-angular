export const TASKS_TABLE = 'tasks';

export type TaskRow = {
  id: number;
  title: string;
  description: string;
  categoria: number;
  tags: Array<number>;
  status: string;
  dueDate: string;
  priority: string;
};

export const TASK_INDEXED = '++id, title, description, categoria, tags, status, dueDate, priority';
