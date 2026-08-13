import { inject, Service } from '@angular/core';
import { liveQuery } from 'dexie';
import { from, type Observable } from 'rxjs';

import { APP_DB } from '@/app/core/database/db.provider';

import type { CategoryEntity } from '../domine/category.entity';
import type { ICategoryRepository } from '../domine/category.repository';

@Service()
export class CategoryRepository implements ICategoryRepository {
  private db = inject(APP_DB);
  getAll(): Observable<CategoryEntity[]> {
    return from(liveQuery(async () => this.db?.categories.toArray() ?? []));
  }
}
