import { APP_DB } from '@/app/db/db.provider';
import { TaskRow } from '@/app/db/schema/task.schema';
import { inject, Service } from '@angular/core';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

@Service()
export class TaskRepository {
  private db = inject(APP_DB);
  getAll() {
    return from(liveQuery(async () => await this.db?.tasks.toArray()));
  }
  async update(id: number, body: Partial<Omit<TaskRow, 'id'>>) {
    await this.db?.tasks.update(id, body).then(res => {
      console.log(res)
    });
  }
}
