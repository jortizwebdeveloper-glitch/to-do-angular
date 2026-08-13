import { APP_DB } from '@/app/core/database/db.provider';
import { inject, Service } from '@angular/core';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';
import type { ITaskRepository } from '../domine/task.repository';
import type { TaskEntity } from '../domine/task.entity';

@Service()
export class TaskRepository implements ITaskRepository {
  private db = inject(APP_DB);
  getAll() {
    return from(liveQuery(async () => (await this.db?.tasks.toArray()) ?? []));
  }
  async update(id: number, body: Partial<Omit<TaskEntity, 'id'>>) {
    await this.db?.tasks.update(id, body).then((res) => {
      console.log(res);
    });
  }
}
