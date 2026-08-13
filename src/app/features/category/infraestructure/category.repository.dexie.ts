import { inject, Service } from '@angular/core';
import type { CategoryEntity } from '@app/features/category/domine/category.entity';
import type { ICategoryRepository } from '@app/features/category/domine/category.repository';
import { liveQuery } from 'dexie';
import { from, type Observable } from 'rxjs';

import { APP_DB } from '@/app/core/database/db.provider';

@Service()
export class CategoryRepository implements ICategoryRepository {
  private db = inject(APP_DB);
  getAll(): Observable<CategoryEntity[]> {
    return from(liveQuery(async () => this.db?.categories.toArray() ?? []));
  }
}
