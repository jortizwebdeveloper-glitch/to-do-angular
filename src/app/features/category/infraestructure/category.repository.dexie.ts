import { inject, Service } from '@angular/core';
import { ICategoryRepository } from '../domine/category.repository';
import { APP_DB } from '@/app/core/database/db.provider';
import { from, type Observable } from 'rxjs';
import { liveQuery } from 'dexie';
import { CategoryEntity } from '../domine/category.entity';

@Service()
export class CategoryRepository implements ICategoryRepository {
  private db = inject(APP_DB);
  getAll(): Observable<CategoryEntity[]> {
    return from(liveQuery(async () => this.db?.categories.toArray() ?? []));
  }
}
