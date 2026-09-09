import type { Observable } from 'rxjs';

import type { CreateTaskEntity, TaskEntity, UpdateTaskEntity } from './task.entity';

export interface ITaskRepository {
  getAll(): Observable<TaskEntity[]>;
  $getById(id: number): Observable<TaskEntity | undefined>;
  getById(id: number): Promise<TaskEntity | undefined>;
  add(body: CreateTaskEntity): Promise<number>;
  update(id: number, body: UpdateTaskEntity): Promise<number>;
  delete(id: number): Promise<void>;
}
