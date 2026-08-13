import { inject, Service } from '@angular/core';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

import { APP_DB } from '@/app/core/database/db.provider';

import type { ITagRepository } from '../domine/tag.repository';

@Service()
export class TagRepository implements ITagRepository {
  private db = inject(APP_DB);
  getAll() {
    return from(liveQuery(async () => this.db?.tags.toArray() ?? []));
  }
}
