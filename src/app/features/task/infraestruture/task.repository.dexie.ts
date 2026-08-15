import { inject, Service } from '@angular/core';
import type { TaskEntity } from '@app/features/task/domine/task.entity';
import type { ITaskRepository } from '@app/features/task/domine/task.repository';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

import { APP_DB } from '@/app/core/database/db.provider';

@Service()
export class TaskRepository implements ITaskRepository {
  private db = inject(APP_DB);
  getAll() {
    return from(liveQuery(async () => (await this.db?.tasks.toArray()) ?? []));
  }
  getById(id: number) {
    return from(liveQuery(async () => await this.db?.tasks.get(id)));
  }
  async update(id: number, body: Partial<Omit<TaskEntity, 'id'>>) {
    await this.db?.tasks.update(id, body).then((res) => {
      console.log(res);
    });
  }
}
