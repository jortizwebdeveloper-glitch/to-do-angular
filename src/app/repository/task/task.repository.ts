import { APP_DB } from '@/app/db/db.provider';
import { inject, Service } from '@angular/core';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

@Service()
export class TaskRepository {
  private db = inject(APP_DB);
  getTasks() {
    return from(liveQuery(async () => await this.db?.tasks.toArray()));
  }
}
