export interface TaskEntity {
  id: number;
  title: string;
  description: string;
  categoria: number;
  tags: number[];
  status: 'en_curso' | 'pendiente' | 'completada';
  priority: 'baja' | 'media' | 'alta';
  dueDate: string;
}

export type CreateTaskEntity = Omit<TaskEntity, 'id'>;
export type UpdateTaskEntity = Partial<Omit<TaskEntity, 'id'>>;
