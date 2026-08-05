import { inject, Service } from '@angular/core';
import { from } from 'rxjs';
import { liveQuery } from 'dexie';
import { APP_DB } from '@/app/db/db.provider';

@Service()
export class TagRepository {
  private db = inject(APP_DB);
  getTags() {
    return from(liveQuery(async () => await this.db?.tags.toArray()));
  }
}
