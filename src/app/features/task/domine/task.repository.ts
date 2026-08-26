import type { TaskRow } from '@app/core/database/schema/task.schema';
import type { Observable } from 'rxjs';

import type { CreateTaskEntity, UpdateTaskEntity } from './task.entity';

export interface ITaskRepository {
  getAll(): Observable<TaskRow[]>;
  $getById(id: number): Observable<TaskRow | undefined>;
  getById(id: number): Promise<TaskRow | undefined>;
  add(body: CreateTaskEntity): Promise<number>;
  update(id: number, body: UpdateTaskEntity): Promise<number>;
  delete(id: number): Promise<void>;
}
