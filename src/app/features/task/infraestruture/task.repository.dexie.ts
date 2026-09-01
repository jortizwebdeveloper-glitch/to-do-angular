import { inject, Service } from '@angular/core';
import type { CreateTaskEntity, UpdateTaskEntity } from '@app/features/task/domine/task.entity';
import type { ITaskRepository } from '@app/features/task/domine/task.repository';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

import { APP_DB } from '@/app/core/database/db.provider';

@Service()
export class TaskRepository implements ITaskRepository {
  private db = inject(APP_DB);
  getAll() {
    return from(liveQuery(() => this.db!.tasks.orderBy('dueDate').reverse().toArray() ?? []));
  }
  $getById(id: number) {
    return from(liveQuery(() => this.db!.tasks.get(id)));
  }
  async getById(id: number) {
    return this.db!.tasks.get(id);
  }
  async add(body: CreateTaskEntity) {
    return this.db!.tasks.add(body);
  }
  async update(id: number, body: UpdateTaskEntity) {
    return this.db!.tasks.where('id')
      .equals(id)
      .and((task) => !task.finished)
      .modify(body);
  }
  async delete(id: number) {
    return this.db!.tasks.delete(id);
  }
}
