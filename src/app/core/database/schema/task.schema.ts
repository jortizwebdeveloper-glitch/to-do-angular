export const TASKS_TABLE = 'tasks';

export interface TaskRow {
  id: number;
  title: string;
  description: string;
  categoriaId: number;
  tagIds: number[];
  status: 'en_curso' | 'pendiente' | 'completada';
  dueDate: string;
  completeDate?: string;
  priority: 'baja' | 'media' | 'alta';
  finished: boolean;
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

/** Índice corregido: sin campos de texto libre, con *tagIds multi-entry. */
export const TASK_INDEXED_V6 = [
  '++id',
  'status',
  'dueDate',
  'priority',
  'categoriaId',
  '*tagIds',
  'finished',
  'completeDate',
].join(', ');
