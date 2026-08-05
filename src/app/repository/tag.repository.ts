import { inject, Service } from '@angular/core';
import { APP_DB } from '../db/db.provider';
import { from } from 'rxjs';
import { liveQuery } from 'dexie';

@Service()
export class TagRepository {
  private db = inject(APP_DB);
  getTags() {
    return from(liveQuery(async () => await this.db?.tags.toArray()));
  }
}
