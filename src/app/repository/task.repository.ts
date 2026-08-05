import { inject, Service } from '@angular/core';
import { APP_DB } from '../db/db.provider';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

@Service()
export class TaskRepository {
  private db = inject(APP_DB);
  getTasks() {
    return from(liveQuery(async () => await this.db?.tasks.toArray()));
  }
}
