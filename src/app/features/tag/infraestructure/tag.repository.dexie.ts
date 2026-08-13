import { APP_DB } from '@/app/core/database/db.provider';
import { ITagRepository } from '../domine/tag.repository';
import { inject, Service } from '@angular/core';
import { from } from 'rxjs';
import { liveQuery } from 'dexie';

@Service()
export class TagRepository implements ITagRepository {
  private db = inject(APP_DB);
  getAll() {
    return from(liveQuery(async () => this.db?.tags.toArray() ?? []));
  }
}
