export const TASKS_TABLE = 'tasks';

export interface TaskRow {
  id: number;
  title: string;
  description: string;
  categoria: number;
  tags: number[];
  status: string;
  dueDate: string;
  completedDate?: string;
  priority: string;
  finished?: boolean;
}

export const TASK_INDEXED = [
  '++id',
  'title',
  'description',
  'categoria',
  'tags',
  'status',
  'dueDate',
  'priority',
];
