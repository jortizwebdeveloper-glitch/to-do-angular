import type { Observable } from 'rxjs';
import type { TaskEntity } from './task.entity';

export interface ITaskRepository {
  getAll(): Observable<TaskEntity[]>;
  update(id: number, body: Partial<Omit<TaskEntity, 'id'>>): Promise<void>;
}
